import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, List, Nav, Panel, Tag } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { renderHashString } from '../../../common/utils/string';
import { isLoggedIn } from '../../../service/wallet'
import './validator.css'
import { numberFormat } from '../../../common/utils/number';
import Button from '../../../common/components/Button';
import Helper from '../../../common/components/Helper';
import { HelperMessage } from '../../../common/constant/HelperMessage';
import { addressValid } from '../../../common/utils/validate';
import { TABLE_CONFIG } from '../../../config';
import { getValidator } from '../../../service/kai-explorer';
import DelegatorList from './DelegatorList';
import { getBlocksByProposer } from '../../../service/kai-explorer/block';
import BlockByProposerList from './BlockByProposerList';
import { StakingIcon } from '../../../common/components/IconCustom';

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


    const [activeKey, setActiveKey] = useState("delegators");

    useEffect(() => {
        setLoadingDelegators(true)
        if (addressValid(valAddr)) {
            (async () => {
                const val = await getValidator(valAddr, pageDelegators, limitDelegators);
                setValidator(val);
                setDelegators(val.delegators);
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

                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">Status</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                {
                                                    validator?.jailed ? <Tag color="red">Jailed</Tag> : <Tag color="green">Active</Tag>
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
                        <Panel shaded>
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
                                        {`Block Validated (${totalBlockRewards || 0})`}
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