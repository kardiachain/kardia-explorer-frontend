import React, { useEffect, useState } from 'react'
import { Col, FlexboxGrid, Icon, IconButton, List, Nav, Panel, Progress, Tag } from 'rsuite';
import { getAccount, checkIsValidator, getValidator, getBlocksByProposer } from '../../../../service';
import './validators.css'
import ValidatorCreate from './ValidatorCreate';
import { TABLE_CONFIG } from '../../../../config';
import DelegatorList from '../../../Staking/ValidatorDetail/DelegatorList';
import {
    addressValid,
    ErrMessage,
    ErrorMessage,
    InforMessage,
    MIN_STAKED_AMOUNT_START_VALIDATOR,
    Button,
    Helper,
    weiToKAI,
    numberFormat,
    dateToUTCString,
    renderHashString,
    StakingIcon,
    HelperMessage
} from '../../../../common';
import BlockByProposerList from '../../../Staking/ValidatorDetail/BlockByProposerList';
import { useHistory } from 'react-router-dom';
import UpdateValidatorName from './UpdateValidatorName';
import UpdateCommissionRate from './UpdateCommissionRate';
import UnJailValidator from './UnJailValidator';
import VaidatorStart from './VaidatorStart';
import WithdrawCommission from './WithdrawCommission';
import { deleteCache } from '../../../../plugin/localCache';

const { Circle } = Progress;

const YourDelegators = () => {

    const history = useHistory();
    const [isVal, setIsVal] = useState(false);
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<Validator>();
    const myAccount = getAccount() as Account;
    const [statePending, setStatePending] = useState(true)
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [limit, setLimit] = useState(TABLE_CONFIG.limitDefault)
    const [tableLoading, setTableLoading] = useState(true);
    const [startValErr, setStartValErr] = useState('');
    const [activeKey, setActiveKey] = useState("delegators");

    const [blockRewards, setBlockRewards] = useState([] as KAIBlock[]);
    const [pageBlockRewards, setPageBlockRewards] = useState(TABLE_CONFIG.page);
    const [limitBlockRewards, setLimitBlockRewards] = useState(TABLE_CONFIG.limitDefault);
    const [loadingBlockRewards, setLoadingBlockRewards] = useState(true);
    const [totalBlockRewards, setTotalBlockRewards] = useState(0);

    const [readyStarting, setReadyStarting] = useState(false);

    const [showUpdateValidatorName, setShowUpdateValidatorName] = useState(false);
    const [showUpdateCommission, setShowUpdateCommission] = useState(false);
    const [showConfirmUnjailModal, setShowConfirmUnjailModal] = useState(false);
    const [showConfirmStartValidatorModal, setShowConfirmStartValidatorModal] = useState(false);
    const [showWithdrawCommissionModal, setShowWithdrawCommissionModal] = useState(false);

    const [indicator, setIndicator] = useState({
        percentage: 0,
        color: '#f04f43'
    })

    const [canUnjail, setCanUnjail] = useState(false);

    useEffect(() => {
        (async () => {
            setTableLoading(true);
            const isVal = await checkIsValidator(myAccount.publickey);
            setIsVal(isVal)
            setStatePending(false)
            if (isVal) {
                const val = await getValidator(myAccount.publickey, page, limit);
                setValidator(val)
                setIndicator({
                    percentage: !val.jailed && val?.signingInfo?.indicatorRate ? val?.signingInfo?.indicatorRate : 0,
                    color: !val.jailed && val?.signingInfo?.indicatorRate >= 50 ? '#58b15b' : '#f04f43'
                })
                setDelegators(val.delegators)
                setTableLoading(false);
                if (Number(weiToKAI(val?.stakedAmount)) >= MIN_STAKED_AMOUNT_START_VALIDATOR) {
                    setReadyStarting(true)
                }
                const nowTime = (new Date()).getTime();
                if (nowTime > val.signingInfo.jailedUntil) {
                    setCanUnjail(true);
                }
            }
        })();
    }, [myAccount.publickey, page, limit]);

    useEffect(() => {
        setLoadingBlockRewards(true)
        if (addressValid(myAccount.publickey)) {
            (async () => {
                const rs = await getBlocksByProposer(myAccount.publickey, pageBlockRewards, limitBlockRewards);
                setBlockRewards(rs.blocks);
                setTotalBlockRewards(rs.totalBlocks);
                setLoadingBlockRewards(false);
            })()
        }
    }, [myAccount.publickey, pageBlockRewards, limitBlockRewards]);

    const fetchData = async () => {
        setTableLoading(true);
        const isVal = await checkIsValidator(myAccount.publickey);
        setIsVal(isVal)
        setStatePending(false)
        if (isVal) {
            const cacheKey = `VALIDATOR_DATA_${myAccount.publickey}_${page}_${limit}`;
            deleteCache(cacheKey);

            const val = await getValidator(myAccount.publickey, page, limit);
            setValidator(val)
            setIndicator({
                percentage: !val.jailed && val?.signingInfo?.indicatorRate ? val?.signingInfo?.indicatorRate : 0,
                color: !val.jailed && val?.signingInfo?.indicatorRate >= 50 ? '#58b15b' : '#f04f43'
            })
            setDelegators(val.delegators)
            setTableLoading(false);
            if (Number(weiToKAI(val?.stakedAmount)) >= MIN_STAKED_AMOUNT_START_VALIDATOR) {
                setReadyStarting(true)
            }
            const nowTime = (new Date()).getTime();
            if (nowTime > val.signingInfo.jailedUntil) {
                setCanUnjail(true);
            }
        }
    }

    const startBecomeValidator = async () => {
        if (Number(weiToKAI(validator?.stakedAmount)) < MIN_STAKED_AMOUNT_START_VALIDATOR) {
            setStartValErr(ErrorMessage.StakedAmountNotEnough);
            return false;
        }
        setShowConfirmStartValidatorModal(true)
        setStartValErr('');
    }

    return !statePending ? (
        !isVal ? (
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Register to become a validator
                        </div>
                    </div>
                    <div className="register-container">
                        <div className="register-form">
                            <Panel shaded className="panel-bg-gray">
                                <FlexboxGrid>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                                        <ValidatorCreate reFetchData={fetchData} />
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </Panel>
                        </div>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        ) : (
                <>
                    <FlexboxGrid>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                            <div style={{ marginBottom: 16 }}>
                                <div className="title header-title">
                                    Your Validator
                                </div>
                            </div>
                            <Panel shaded className="panel-bg-gray">
                                <div style={{ textAlign: 'right' }}>
                                    <Button onClick={() => { history.push(`/wallet/staking/${validator?.address}`) }}>
                                        Delegate
                                    </Button>
                                </div>
                                <List>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                                <div className="property-title">Validator</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                                <div className="property-content validator-name">
                                                    {validator?.name}
                                                    <IconButton
                                                        className="edit-val-button"
                                                        size="xs"
                                                        onClick={() => { setShowUpdateValidatorName(true) }}
                                                        icon={<Icon icon="edit" />}
                                                    />
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
                                                    <span>{numberFormat(validator?.commissionRate || 0, 2)} %</span>
                                                    <IconButton
                                                        className="edit-val-button"
                                                        size="xs"
                                                        onClick={() => { setShowUpdateCommission(true) }}
                                                        icon={<Icon icon="edit" />}
                                                    />
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item bordered={false}>
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
                                    <List.Item bordered={false}>
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
                                                        validator?.jailed ? (
                                                            <>
                                                                <Tag color="red" className="tab tab-failed">Jailed</Tag>
                                                                <Button
                                                                    disable={!canUnjail}
                                                                    style={{ marginLeft: 20 }}
                                                                    className="kai-button-gray"
                                                                    onClick={() => {
                                                                        if (canUnjail) {
                                                                            setShowConfirmUnjailModal(true);
                                                                        }
                                                                    }}>UnJail
                                                                    </Button>
                                                                {
                                                                    !canUnjail ? (
                                                                        <span className="unjail-note">
                                                                            ( Only can be unjailed after {dateToUTCString(validator?.signingInfo?.jailedUntil || '')})
                                                                        </span>
                                                                    ) : <></>
                                                                }
                                                            </>
                                                        ) : <Tag className="tab tab-success" color="green">Active</Tag>
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
                                                    color: 'white'
                                                }}>
                                                    <Circle percent={indicator.percentage}
                                                        strokeColor={indicator.color} />
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                                <div className="property-title">Claimable Commission Rewards</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                                <div className="property-content">
                                                    <span style={{ marginRight: 10 }}>{numberFormat(weiToKAI(validator?.accumulatedCommission), 4)} KAI </span>
                                                    <Button className="kai-button-gray" onClick={() => setShowWithdrawCommissionModal(true)}>
                                                        Withdraw
                                                            </Button>
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                </List>
                                {
                                    validator?.isRegister && !validator.jailed ? (
                                        <>
                                            <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                                                {
                                                    !readyStarting ? <div className="warning-note" style={{ marginBottom: 5, fontSize: 14 }}>
                                                        {InforMessage.StartValidatorCondition}</div> : <></>
                                                }
                                                <Button size="big"
                                                    onClick={startBecomeValidator}
                                                    disable={!readyStarting}
                                                >
                                                    Become a Validator
                                                    </Button>
                                                <ErrMessage message={startValErr} />
                                            </div>
                                        </>
                                    ) : <></>
                                }
                            </Panel>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                            <div className="del-list-container">
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
                                                        page={page}
                                                        limit={limit}
                                                        loading={tableLoading}
                                                        totalDelegators={validator?.totalDelegators}
                                                        setpage={setPage}
                                                        setLimit={setLimit} />
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
                    <UpdateValidatorName
                        validator={validator || {} as Validator}
                        showModel={showUpdateValidatorName}
                        setShowModel={setShowUpdateValidatorName}
                        reFetchData={fetchData} />

                    <UpdateCommissionRate
                        validator={validator || {} as Validator}
                        showModel={showUpdateCommission}
                        setShowModel={setShowUpdateCommission}
                        reFetchData={fetchData} />
                    <UnJailValidator
                        validator={validator || {} as Validator}
                        showModel={showConfirmUnjailModal}
                        setShowModel={setShowConfirmUnjailModal}
                        reFetchData={fetchData}
                    />
                    <VaidatorStart
                        validator={validator || {} as Validator}
                        showModel={showConfirmStartValidatorModal}
                        setShowModel={setShowConfirmStartValidatorModal}
                        reFetchData={fetchData}
                    />
                    <WithdrawCommission
                        validator={validator || {} as Validator}
                        showModel={showWithdrawCommissionModal}
                        setShowModel={setShowWithdrawCommissionModal}
                        reFetchData={fetchData}
                    />

                </>
            )
    ) : (<></>)
}

export default YourDelegators;