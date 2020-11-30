import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, List, Panel, Table, Tooltip, Whisper, Tag } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { millisecondToHMS, renderHashString, renderHashToRedirect, renderHashStringAndTooltip } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getBalance } from '../../service/kai-explorer';
import { getTxsByAddress } from '../../service/kai-explorer/transaction';
import './addressDetail.css'


const { Column, HeaderCell, Cell } = Table;

const AddressDetail = () => {
    const { isMobile } = useViewport()
    const history = useHistory();
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [totalTxs, setTotalTxs] = useState(0)
    const [loading, setLoading] = useState(false)
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { address }: any = useParams()
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const rs = await getTxsByAddress(address, page, size);
            const balance = await getBalance(address)
            setLoading(false)
            setTransactionList(rs.transactions)
            setTotalTxs(rs.totalTxs)
            setBalance(balance)
        })()
    }, [page, size, address])
    return (
        <div className="container address-detail-container">
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="user" size={"2x"} />
                    <p style={{ marginLeft: '12px' }} className="title">Address Detail</p>
                </div>
            </div>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={14} sm={24} style={{ marginBottom: '25px' }}>
                    <Panel className="overview" shaded>
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
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="property-title">Balance: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <div className="property-content">{numberFormat(weiToKAI(balance))} KAI</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            {/* <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="title">Token: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <div className="content"></div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item> */}
                        </List>
                    </Panel>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div className="block-title" style={{ padding: '0px 5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon className="highlight" icon="exchange" size={"2x"} />
                            <p style={{ marginLeft: '12px' }} className="title">Transaction History</p>
                        </div>
                    </div>
                    <Panel shaded>
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
                                    <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                        <HeaderCell>Tx Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon className="highlight" icon="exchange" style={{ marginRight: '5px' }} />}
                                                        {renderHashToRedirect({
                                                            hash: rowData.txHash,
                                                            headCount: isMobile ? 5 : 12,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/tx/${rowData.txHash}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} align="center" verticalAlign="middle">
                                        <HeaderCell>Block Height</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        { isMobile ? <></> : <Icon className="highlight" icon="cubes" style={{ marginRight: '5px' }} />}
                                                        <Link to={`/block/${rowData.blockNumber}`}>{numberFormat(rowData.blockNumber)}</Link>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} align="center" minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                        <HeaderCell>Age</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon className="highlight" icon="clock-o" style={{ marginRight: '5px' }} />}
                                                        {millisecondToHMS(rowData.age || 0)}
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
                                                                callback: () => { history.push(`/address/${rowData.from}`) }
                                                            })
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1}>
                                    <HeaderCell></HeaderCell>
                                    <Cell style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        {(rowData: KAITransaction) => {
                                            return (
                                                <div>
                                                    {
                                                        address === rowData.from ?  <Tag color="yellow" className="tab-in-out">OUT</Tag> :  <Tag color="green" className="tab-in-out">IN</Tag>
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
                                                            !rowData.toSmcAddr ? (
                                                                <>
                                                                    {isMobile ? <></> : <Icon className="highlight" icon="arrow-circle-right" style={{ marginRight: '5px' }} />}
                                                                    {
                                                                    address === rowData.to ? renderHashStringAndTooltip(rowData.to, isMobile ? 5 : 12, 4, true) : renderHashToRedirect({
                                                                        hash: rowData.to,
                                                                        headCount: isMobile ? 5 : 12,
                                                                        tailCount: 4,
                                                                        showTooltip: true,
                                                                        callback: () => { history.push(`/address/${rowData.to}`) }
                                                                    })}
                                                                </>
                                                            ) : (
                                                                    <>
                                                                        {isMobile ? <></> : <Icon className="highlight" icon="file-text-o" style={{ marginRight: '5px' }} />}
                                                                        <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.toSmcAddr || '0x'}</Tooltip>}>
                                                                            <Link style={{ fontSize: 12, fontWeight: 'bold' }} to={`/address/${rowData.toSmcAddr}`}>{rowData.toSmcName}</Link>
                                                                        </Whisper>
                                                                    </>

                                                                )
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} align="center" minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Value</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.value))} KAI
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} align="center" minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Tx Fee</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.txFee))} KAI
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