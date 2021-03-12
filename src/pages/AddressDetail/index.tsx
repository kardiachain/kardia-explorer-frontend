import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, List, Panel, Table, Tooltip, Whisper, Tag, SelectPicker } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { StakingIcon } from '../../common/components/IconCustom';
import { convertValueFollowDecimal, weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { millisecondToHMS, renderHashString, renderHashToRedirect, renderHashStringAndTooltip } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getHolderAccount } from '../../service/kai-explorer';
import { getTokens, getTxsByAddress } from '../../service/kai-explorer/transaction';
import './addressDetail.css'


const { Column, HeaderCell, Cell } = Table;

const AddressDetail = () => {
    const { isMobile } = useViewport()
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [totalTxs, setTotalTxs] = useState(0)
    const [loading, setLoading] = useState(false)
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { address }: any = useParams()
    const [holderAccount, setHolderAccount] = useState<HolderAccount>();
    const [tokens, setTokens] = useState([]);
    let history = useHistory();


    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await Promise.all([
                getTxsByAddress(address, page, size),
                getHolderAccount(address),
                getTokens(address, page, size)
            ]);
            setLoading(false);
            setTransactionList(rs[0].transactions);
            setTotalTxs(rs[0].totalTxs);
            setHolderAccount(rs[1]);
            setTokens(rs[2].tokens);
        })()
    }, [page, size, address])
    return (
        <div className="container address-detail-container">
            {
                holderAccount?.isContract ? (
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Contract Detail
                        </div>
                    </div>
                ) : (
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Address Detail
                        </div>
                    </div>
                )
            }
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{ marginBottom: '25px' }}>
                    <Panel className="overview panel-bg-gray" shaded>
                        <List bordered={false}>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="property-title">Address: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <div className="property-content">
                                            {renderHashString(address, 45)}
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            {
                                holderAccount?.name ? (
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                                <div className="property-title">Name: </div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                                <div className="property-content">
                                                    {holderAccount?.name}
                                                    {
                                                        holderAccount?.isInValidatorsList ? <StakingIcon
                                                            color={holderAccount?.role?.classname}
                                                            character={holderAccount?.role?.character || ''}
                                                            size='small' style={{ marginLeft: 5 }} /> : <></>
                                                    }
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                ) : <></>
                            }
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="property-title">Balance: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <div className="property-content">{numberFormat(weiToKAI(holderAccount?.balance))} KAI</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>

                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="property-title">Token: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <SelectPicker
                                            placeholder="Search for Token name"
                                            className="dropdown-custom"
                                            data={tokens}
                                            style={{ width: '100%' }}
                                            renderMenuItem={(label, item: any) => {
                                                return (
                                                    <div className="rowToken" onClick={() => {
                                                        history.push(`/token/${item.contractAddress}`)
                                                    } }>
                                                        <div className="flex">
                                                            <img src={`data:image/jpeg;base64,${item.logo}`} alt="logo" width="12px" height="12px" style={{marginRight:'4px'}}/>
                                                            <p>{item.tokenSymbol}</p>
                                                        </div>
                                                        <span>{numberFormat(convertValueFollowDecimal(item.balance, item.tokenDecimals))}</span>
                                                    </div>
                                                );
                                            }}

                                        />
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                        </List>
                    </Panel>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <FlexboxGrid justify="space-between">
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                            <div style={{ marginBottom: 16 }}>
                                <div className="title header-title">
                                    Transaction History
                                </div>
                                <div className="sub-title">
                                    {numberFormat(totalTxs)} transactions found
                                </div>
                            </div>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                    <Panel shaded className="panel-bg-gray">
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Table
                                    rowHeight={60}
                                    height={200}
                                    data={transactionList}
                                    autoHeight
                                    hover={false}
                                    loading={loading}
                                    wordWrap
                                >
                                    <Column flexGrow={3} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                        <HeaderCell><span style={{ marginLeft: 40 }}>Tx Hash</span></HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        <span className={`container-icon-left ${!rowData.status ? 'icon-tx-error' : ''}`}>
                                                            <Icon icon={!rowData.isSmcInteraction ? "exchange" : "file-text-o"} className="gray-highlight" />
                                                        </span>
                                                        <span className="container-content-right">
                                                            {
                                                                renderHashToRedirect({
                                                                    hash: rowData.txHash,
                                                                    headCount: isMobile ? 5 : 10,
                                                                    tailCount: 4,
                                                                    showTooltip: false,
                                                                    redirectTo: `/tx/${rowData.txHash}`
                                                                })
                                                            }
                                                            <div className="sub-text">{millisecondToHMS(rowData.age || 0)}</div>
                                                        </span>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Block Height</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        <Link className="color-white" to={`/block/${rowData.blockNumber}`}>{numberFormat(rowData.blockNumber)}</Link>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                        <HeaderCell>From</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            address === rowData.from ? renderHashStringAndTooltip(rowData.from, isMobile ? 5 : 12, 4, true) : renderHashToRedirect({
                                                                hash: rowData.from,
                                                                headCount: isMobile ? 5 : 12,
                                                                tailCount: 4,
                                                                showTooltip: true,
                                                                redirectTo: `/address/${rowData.from}`
                                                            })
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1} verticalAlign="middle">
                                        <HeaderCell></HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            address === rowData.from ? <Tag color="yellow" className="tab-in-out tab-out">OUT</Tag> : <Tag color="green" className="tab-in-out tab-in">IN</Tag>
                                                        }
                                                    </div>
                                                )
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3} minWidth={isMobile ? 120 : 0} verticalAlign="middle">
                                        <HeaderCell>To</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            !rowData.isSmcInteraction || !rowData.toName ? (
                                                                <>
                                                                    {
                                                                        address === rowData.to ? renderHashStringAndTooltip(rowData.to, isMobile ? 5 : 12, 4, true) : renderHashToRedirect({
                                                                            hash: rowData.to,
                                                                            headCount: isMobile ? 5 : 12,
                                                                            tailCount: 4,
                                                                            showTooltip: true,
                                                                            redirectTo: `/address/${rowData.to}`
                                                                        })}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.to || '0x'}</Tooltip>}>
                                                                        <Link className="color-white" style={{ fontSize: 12, fontWeight: 'bold' }} to={`/address/${rowData.to}`}>
                                                                            {rowData.toName}
                                                                        </Link>
                                                                    </Whisper>
                                                                    {
                                                                        rowData.isInValidatorsList ? (
                                                                            <StakingIcon
                                                                                color={rowData?.role?.classname}
                                                                                character={rowData?.role?.character}
                                                                                size='small' style={{ marginLeft: 5 }} />
                                                                        ) : <></>
                                                                    }
                                                                </>

                                                            )
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Value (KAI)</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.value))}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Tx Fee (KAI)</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.txFee))}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                </Table>
                                <TablePagination
                                    lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                                    activePage={page}
                                    displayLength={size}
                                    total={totalTxs}
                                    onChangePage={setPage}
                                    onChangeLength={setSize}
                                />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default AddressDetail;