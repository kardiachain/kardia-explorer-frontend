import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, List, Panel, Table, Tag } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { renderHashToRedirect } from '../../../common/utils/string';
import { useViewport } from '../../../context/ViewportContext';
import { isLoggedIn } from '../../../service/wallet'
import './validator.css'
import { numberFormat } from '../../../common/utils/number';
import Button from '../../../common/components/Button';
import Helper from '../../../common/components/Helper';
import { HelperMessage } from '../../../common/constant/HelperMessage';
import { addressValid } from '../../../common/utils/validate';
import { TABLE_CONFIG } from '../../../config';
import { getValidator } from '../../../service/kai-explorer';
import TablePagination from 'rsuite/lib/Table/TablePagination';

const { Column, HeaderCell, Cell } = Table;

const ValidatorDetail = () => {
    const { isMobile } = useViewport()
    const history = useHistory()
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<Validator>()
    const { valAddr }: any = useParams();
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [limit, setLimit] = useState(TABLE_CONFIG.limitDefault)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        if (addressValid(valAddr)) {
            (async () => {
                const val = await getValidator(valAddr, page, limit);
                setValidator(val)
                setDelegators(val.delegators)
                setLoading(false)
            })()
        }
    }, [valAddr, page, limit])

    return (
        <div className="container val-detail-container">
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: '30px' }}>
                    <div>
                        <div className="block-title" style={{ padding: '0px 5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon className="highlight" icon="user-info" size={"2x"} />
                                <p style={{ marginLeft: '12px' }} className="title">Validator information</p>
                            </div>
                        </div>
                        <Panel shaded>
                            <List>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Validator</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content validator-name">
                                                {validator?.name}
                                            </div>
                                            <div className="property-content">
                                                {
                                                    renderHashToRedirect({
                                                        hash: validator?.address || '',
                                                        headCount: 45,
                                                        tailCount: 4,
                                                        showTooltip: true,
                                                        showCopy: true,
                                                        callback: () => { window.open(`/address/${validator?.address}`) }
                                                    })
                                                }
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Staking Contract</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                {
                                                    renderHashToRedirect({
                                                        hash: validator?.smcAddress || '',
                                                        headCount: 45,
                                                        tailCount: 4,
                                                        showTooltip: true,
                                                        showCopy: true,
                                                        callback: () => { window.open(`/address/${validator?.smcAddress}`) }
                                                    })
                                                }
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                <span className="property-title">Title </span>
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                <Tag className={validator?.status.color}>
                                                    {validator?.status.content}
                                                </Tag>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                <Helper style={{ marginRight: 5 }} info={HelperMessage.CommissionRate} />
                                                <span className="property-title">Commission Rate </span>
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                {numberFormat(validator?.commissionRate || 0, 2)} %
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                <Helper style={{ marginRight: 5 }} info={HelperMessage.MaxRate} />
                                                <span className="property-title">Max Commission Rate</span>
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">{numberFormat(validator?.maxRate || 0, 2)} %</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                <Helper style={{ marginRight: 5 }} info={HelperMessage.MaxChangeRate} />
                                                <span className="property-title">Max Change Commission Rate</span>
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">{numberFormat(validator?.maxChangeRate || 0, 2)} %</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Voting Power</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">{numberFormat(validator?.votingPower || 0)} %</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Total Delegator</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">{numberFormat(validator?.totalDelegators || 0)}</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Total staked amount</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">{numberFormat(weiToKAI(validator?.stakedAmount), 4)} KAI</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                            </List>
                            <Button size="big" style={{ marginTop: '30px' }}
                                onClick={() => { isLoggedIn() ? history.push(`/wallet/staking/${valAddr}`) : history.push('/wallet') }}
                            >
                                Delegate for this validator
                            </Button>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div>
                        <div className="block-title" style={{ padding: '0px 5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon className="highlight" icon="people-group" size={"2x"} />
                                <p style={{ marginLeft: '12px' }} className="title">Delegators</p>
                            </div>
                        </div>
                        <Panel shaded>
                            <Table
                                hover={false}
                                wordWrap
                                autoHeight
                                rowHeight={60}
                                data={delegators}
                                loading={loading}
                            >
                                <Column flexGrow={3} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell>Delegator Address</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div>
                                                    {
                                                        renderHashToRedirect({
                                                            hash: rowData.address,
                                                            headCount: isMobile ? 5 : 20,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { window.open(`/address/${rowData.address}`) }
                                                        })
                                                    }
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell>Staked Amount</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {numberFormat(weiToKAI(rowData.stakeAmount), 4)} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell >Claimable Rewards</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {numberFormat(weiToKAI(rowData.rewardsAmount), 4)} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                            <TablePagination
                                lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                                activePage={page}
                                displayLength={limit}
                                total={validator?.totalDelegators}
                                onChangePage={setPage}
                                onChangeLength={setLimit}
                            />
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default ValidatorDetail;