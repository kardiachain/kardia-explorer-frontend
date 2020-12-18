import React, { useEffect, useState } from 'react'
import { Col, FlexboxGrid, Icon, List, Modal, Nav, Panel } from 'rsuite';
import { weiToKAI } from '../../../../common/utils/amount';
import { numberFormat } from '../../../../common/utils/number';
import { renderHashString } from '../../../../common/utils/string';
import { getAccount } from '../../../../service/wallet';
import './validators.css'
import ValidatorCreate from './ValidatorCreate';
import Button from '../../../../common/components/Button';
import Helper from '../../../../common/components/Helper';
import { HelperMessage } from '../../../../common/constant/HelperMessage';
import { checkIsValidator, getValidator } from '../../../../service/kai-explorer';
import { TABLE_CONFIG } from '../../../../config';
import { startValidator, withdrawCommission } from '../../../../service/smc/staking';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage, NotifiMessage } from '../../../../common/constant/Message';
import { MIN_STAKED_AMOUNT_START_VALIDATOR } from '../../../../common/constant';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import UpdateValidator from './UpdateValidator';
import { StakingIcon } from '../../../../common/components/IconCustom';
import DelegatorList from '../../../Staking/ValidatorDetail/DelegatorList';
import { addressValid } from '../../../../common/utils/validate';
import { getBlocksByProposer } from '../../../../service/kai-explorer/block';
import BlockByProposerList from '../../../Staking/ValidatorDetail/BlockByProposerList';
import MissingBlock from '../../../Staking/ValidatorDetail/MissingBlock';
import { useHistory } from 'react-router-dom';

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
    const [btnLoading, setBtnLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showWithdrawCommissionModal, setShowWithdrawCommissionModal] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    const [activeKey, setActiveKey] = useState("delegators");

    const [blockRewards, setBlockRewards] = useState([] as KAIBlock[]);
    const [pageBlockRewards, setPageBlockRewards] = useState(TABLE_CONFIG.page);
    const [limitBlockRewards, setLimitBlockRewards] = useState(TABLE_CONFIG.limitDefault);
    const [loadingBlockRewards, setLoadingBlockRewards] = useState(true);
    const [totalBlockRewards, setTotalBlockRewards] = useState(0);
    
    const [readyStarting, setReadyStarting] = useState(false);

    useEffect(() => {
        (async () => {
            setTableLoading(true);
            const isVal = await checkIsValidator(myAccount.publickey);
            setIsVal(isVal)
            setStatePending(false)
            if (isVal) {
                const val = await getValidator(myAccount.publickey, page, limit);
                setValidator(val)
                setDelegators(val.delegators)
                setTableLoading(false);
                if (Number(weiToKAI(val?.stakedAmount)) >= MIN_STAKED_AMOUNT_START_VALIDATOR) {
                    setReadyStarting(true)
                }
            }
        })();
    }, [myAccount.publickey, page, limit]);

    // Fetch block rewards
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
            const val = await getValidator(myAccount.publickey, page, limit);
            setValidator(val)
            setDelegators(val.delegators)
            setTableLoading(false);
        }
    }


    const startBecomeValidator = async () => {
        if (Number(weiToKAI(validator?.stakedAmount)) < MIN_STAKED_AMOUNT_START_VALIDATOR) {
            setStartValErr(ErrorMessage.StakedAmountNotEnough);
            return false;
        }
        setShowConfirmModal(true)
        setStartValErr('');
    }

    // @Function using for starting become validator
    const confirmStart = async () => {
        try {
            setBtnLoading(true);
            const valSmcAddr = validator?.smcAddress || "";
            if (!valSmcAddr) {
                setBtnLoading(false);
                return false;
            }

            const result = await startValidator(valSmcAddr, myAccount);
            if (result && result.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess
                });
                fetchData();

            } else {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                });
            } catch (error) {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        }
        setBtnLoading(false);
        setShowConfirmModal(false);
    }

    const widthdrawCommission = async () => {
        try {
            setWithdrawLoading(true);

            const valSmcAddr = validator?.smcAddress || "";
            if (!valSmcAddr) {
                setBtnLoading(false);
                return false;
            }
            const result = await withdrawCommission(valSmcAddr, myAccount);
            if (result && result.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess
                });
                fetchData();
            } else {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                });
            } catch (error) {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        }
        setBtnLoading(false);
        setShowWithdrawCommissionModal(false);
    }

    return !statePending ? (
        !isVal ? (
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div className="block-title" style={{ padding: '0px 5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon className="highlight" icon="user-plus" />
                            <p style={{ marginLeft: '12px' }} className="title">Register to become a validator</p>
                        </div>
                    </div>
                    <div className="register-container">
                        <div className="register-form">
                            <Panel shaded>
                                <FlexboxGrid>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                                        <ValidatorCreate />
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
                            <div className="val-info-container">
                                <div className="block-title" style={{ padding: '0px 5px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon className="highlight" icon="user-info" size={"2x"} />
                                        <p style={{ marginLeft: '12px' }} className="title">Validator information</p>
                                    </div>
                                </div>
                                <Panel shaded>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button onClick={() => { history.push(`/wallet/staking/${validator?.address}`)  }}>
                                            Delegate
                                        </Button>
                                        <UpdateValidator validator={validator || {} as Validator} />
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
                                                    <div className="property-title">Staking Contract</div>
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
                                        <List.Item bordered={false}>
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
                                        <List.Item bordered={false}>
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
                                        {
                                            validator?.isProposer ? (
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
                                            ) : <></>
                                        }
                                    </List>
                                    {
                                        validator?.isRegister ? (
                                            <>
                                                <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                                                    {
                                                        !readyStarting ? <div className="warning-note" style={{marginBottom: 5, fontSize: 14}}>* Your stake amount needs to bigger 12.5M KAI to starting become a validator.</div> : <></>
                                                    }
                                                    <Button size="big"
                                                        onClick={startBecomeValidator}
                                                        disable={!readyStarting}
                                                    >
                                                        Start To Become Validator
                                                    </Button>
                                                    <ErrMessage message={startValErr} />
                                                </div>
                                            </>
                                        ) : <></>
                                    }
                                </Panel>
                            </div>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                            <div className="del-list-container">
                                <div className="block-title" style={{ padding: '0px 5px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon className="highlight" icon="people-group" size={"2x"} />
                                        <p style={{ marginLeft: '12px' }} className="title">Your Delegators</p>
                                    </div>
                                </div>
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
                                                {`Block Rewards (${totalBlockRewards || 0})`}
                                            </Nav.Item>

                                            <Nav.Item eventKey="missingblocks">
                                                {`Missing Blocks (${validator?.missedBlocks})`}
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
                                            case 'missingblocks':
                                                return (
                                                    <MissingBlock validator={validator || {} as Validator} />
                                                )
                                        }
                                    })()}
                                </Panel>
                            </div>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>

                    {/* Modal confirm when withdraw staked token */}
                    <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
                        <Modal.Header>
                            <Modal.Title>Confirm starting to become validator</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>
                                Are you sure you want to starting to become validator.
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button loading={btnLoading} onClick={confirmStart}>
                                Confirm
                            </Button>
                            <Button className="kai-button-gray" onClick={() => { setShowConfirmModal(false) }}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal confirm when withdraw commission amount */}
                    <Modal backdrop="static" size="sm" enforceFocus={true} show={showWithdrawCommissionModal} onHide={() => { setShowWithdrawCommissionModal(false) }}>
                        <Modal.Header>
                            <Modal.Title>Confirm withdraw your staked token</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>
                                Are you sure you want to withdraw all your commission reward tokens.
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button loading={withdrawLoading} onClick={widthdrawCommission}>
                                Confirm
                            </Button>
                            <Button className="kai-button-gray" onClick={() => { setShowWithdrawCommissionModal(false) }}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )
    ) : (<></>)
}

export default YourDelegators;