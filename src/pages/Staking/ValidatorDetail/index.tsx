import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, List, Nav, Panel, Progress, Tag } from 'rsuite';
import { isLoggedIn, getBlocksByProposer } from '../../../service'
import './validator.css'
import { TABLE_CONFIG } from '../../../config';
import { getValidator } from '../../../service';
import DelegatorList from './DelegatorList';
import BlockByProposerList from './BlockByProposerList';
import {
    StakingIcon,
    Button,
    Helper,
    HelperMessage,
    addressValid,
    weiToKAI,
    renderHashString,
    numberFormat
} from '../../../common';

const { Circle } = Progress;

const ValidatorDetail = () => {
    const history = useHistory()
    const { valAddr }: any = useParams();

    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<Validator>();
    const [pageDelegators, setPageDelegators] = useState(TABLE_CONFIG.page);
    const [limitDelegators, setLimitDelegators] = useState(TABLE_CONFIG.limitDefault);
    const [loadingDelegators, setLoadingDelegators] = useState(true);

    const [blockRewards, setBlockRewards] = useState([] as KAIBlock[]);
    const [pageBlockRewards, setPageBlockRewards] = useState(TABLE_CONFIG.page);
    const [limitBlockRewards, setLimitBlockRewards] = useState(TABLE_CONFIG.limitDefault);
    const [loadingBlockRewards, setLoadingBlockRewards] = useState(true);
    const [totalBlockRewards, setTotalBlockRewards] = useState(0);
    const [indicator, setIndicator] = useState({
        percentage: 0,
        color: '#f04f43'
    })

    const [activeKey, setActiveKey] = useState("delegators");

    useEffect(() => {
        setLoadingDelegators(true)
        if (addressValid(valAddr)) {
            (async () => {
                const val = await getValidator(valAddr, pageDelegators, limitDelegators);
                setValidator(val);
                setDelegators(val.delegators);
                setIndicator({
                    percentage: !val.jailed && val?.signingInfo?.indicatorRate ? val?.signingInfo?.indicatorRate : 0,
                    color: !val.jailed && val?.signingInfo?.indicatorRate >= 50 ? '#58b15b' : '#f04f43'
                })
                setLoadingDelegators(false);
            })()
        }
    }, [valAddr, pageDelegators, limitDelegators]);

    // Fetch block rewards
    useEffect(() => {
        setLoadingBlockRewards(true)
        if (addressValid(valAddr)) {
            (async () => {
                const rs = await getBlocksByProposer(valAddr, pageBlockRewards, limitBlockRewards);
                setBlockRewards(rs.blocks);
                setTotalBlockRewards(rs.totalBlocks);
                setLoadingBlockRewards(false);
            })()
        }
    }, [valAddr, pageBlockRewards, limitBlockRewards]);

    return (
        <div className="container val-detail-container">
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: '30px' }}>
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <div className="title header-title">
                                Validator information
                            </div>
                        </div>
                        <Panel shaded className="panel-bg-gray">
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
                                                    renderHashString(
                                                        validator?.address || '',
                                                        45,
                                                        4
                                                    )
                                                }
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Validator Contract</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                {
                                                    renderHashString(
                                                        validator?.smcAddress || '',
                                                        45,
                                                        4
                                                    )
                                                }
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                <span className="property-title">Role </span>
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                <StakingIcon
                                                    size="small"
                                                    color={validator?.role?.classname}
                                                    character={validator?.role?.character || ''}
                                                    style={{ marginRight: 5 }} />
                                                <span>{validator?.role?.name}</span>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                <span className="property-title">Commission Rate </span>
                                                <Helper style={{ marginLeft: 5 }} info={HelperMessage.CommissionRate} />
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
                                                <span className="property-title">Max Commission Rate</span>
                                                <Helper style={{ marginLeft: 5 }} info={HelperMessage.MaxRate} />
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
                                                <span className="property-title">Max Change Commission Rate</span>
                                                <Helper style={{ marginLeft: 5 }} info={HelperMessage.MaxChangeRate} />
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

                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Status</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                {
                                                    validator?.jailed ? <Tag className="tab tab-failed" color="red">Jailed</Tag> : <Tag className="tab tab-success" color="green">Active</Tag>
                                                }
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>

                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Missing block</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">{validator?.missedBlocks} Blocks</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>

                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Uptime</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content" style={{
                                                width: 60,
                                            }}>
                                                <Circle percent={indicator.percentage}
                                                    strokeColor={indicator.color} />
                                            </div>
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
                        <Panel shaded className="panel-bg-gray">
                            <div className="custom-nav">
                                <Nav
                                    appearance="subtle"
                                    activeKey={activeKey}
                                    onSelect={setActiveKey}
                                    style={{ marginBottom: 20 }}>
                                    <Nav.Item eventKey="delegators">
                                        {`Delegators (${validator?.totalDelegators || 0})`}
                                    </Nav.Item>
                                    <Nav.Item eventKey="blocksreward">
                                        {`Block Proposed (${totalBlockRewards || 0})`}
                                    </Nav.Item>
                                </Nav>
                            </div>

                            {(() => {
                                switch (activeKey) {
                                    case 'delegators':
                                        return (
                                            <DelegatorList
                                                delegators={delegators}
                                                page={pageDelegators}
                                                limit={limitDelegators}
                                                loading={loadingDelegators}
                                                totalDelegators={validator?.totalDelegators}
                                                setpage={setPageDelegators}
                                                setLimit={setLimitDelegators} />
                                        );
                                    case 'blocksreward':
                                        return (
                                            <BlockByProposerList
                                                blockRewards={blockRewards}
                                                totalBlockRewards={totalBlockRewards}
                                                page={pageBlockRewards}
                                                limit={limitBlockRewards}
                                                setPage={setPageBlockRewards}
                                                setLimit={setLimitBlockRewards}
                                                loading={loadingBlockRewards}
                                            />
                                        );
                                }
                            })()}
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default ValidatorDetail;