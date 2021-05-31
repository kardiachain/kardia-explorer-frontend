import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Col, ControlLabel, FlexboxGrid, Form, FormGroup, List, Modal, Nav, Panel, Progress, SelectPicker, Tag } from 'rsuite';
import walletState from '../../../../atom/wallet.atom';
import {
    numberFormat,
    weiToKAI,
    ErrMessage,
    Button,
    NumberInputFormat,
    Helper,
    gasLimitDefault,
    gasPriceOption,
    MIN_DELEGATION_AMOUNT,
    HelperMessage,
    ErrorMessage,
    InforMessage,
    StakingIcon,
    ShowNotifyErr,
    ShowNotify
} from '../../../../common';
import {
    renderHashString,
} from '../../../../common';
import { TABLE_CONFIG } from '../../../../config';
import { GasMode } from '../../../../enum';
import { clearCache } from '../../../../plugin/localCache';
import { delegateByEW, getValidator, getBlocksByProposer, delegateAction, getStoredBalance, isExtensionWallet } from '../../../../service';
import BlockByProposerList from '../../../Staking/ValidatorDetail/BlockByProposerList';
import DelegatorList from '../../../Staking/ValidatorDetail/DelegatorList';

const { Circle } = Progress;

const DelegatorCreate = () => {
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<Validator>()
    const [isLoading, setIsLoading] = useState(false)
    const [delAmount, setDelAmount] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const { valAddr }: any = useParams();
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [gasPrice, setGasPrice] = useState<GasMode>(GasMode.NORMAL)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitDefault)
    const [gasLimitErr, setGasLimitErr] = useState('')
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [limit, setLimit] = useState(TABLE_CONFIG.limitDefault)
    const [tableLoading, setTableLoading] = useState(true);

    const [activeKey, setActiveKey] = useState("delegators");

    const [blockRewards, setBlockRewards] = useState([] as KAIBlock[]);
    const [pageBlockRewards, setPageBlockRewards] = useState(TABLE_CONFIG.page);
    const [limitBlockRewards, setLimitBlockRewards] = useState(TABLE_CONFIG.limitDefault);
    const [loadingBlockRewards, setLoadingBlockRewards] = useState(true);
    const [totalBlockRewards, setTotalBlockRewards] = useState(0);
    const walletLocalState = useRecoilValue(walletState)


    const [indicator, setIndicator] = useState({
        percentage: 0,
        color: '#f04f43'
    })

    useEffect(() => {
        (async () => {
            setTableLoading(true)
            const val = await getValidator(valAddr, page, limit);
            setValidator(val)
            setDelegators(val.delegators)
            setIndicator({
                percentage: !val.jailed && val?.signingInfo?.indicatorRate ? val?.signingInfo?.indicatorRate : 0,
                color: !val.jailed && val?.signingInfo?.indicatorRate >= 50 ? '#58b15b' : '#f04f43'
            })
            setTableLoading(false)
        })();
    }, [valAddr, page, limit]);

    useEffect(() => {
        (async () => {
            setLoadingBlockRewards(true)
            const rs = await getBlocksByProposer(valAddr, pageBlockRewards, limitBlockRewards);
            setBlockRewards(rs.blocks);
            setTotalBlockRewards(rs.totalBlocks);
            setLoadingBlockRewards(false);
        })()
    }, [valAddr, pageBlockRewards, limitBlockRewards]);

    const fetchData = async () => {
        setTableLoading(true)
        const val = await getValidator(valAddr, page, limit);
        setValidator(val)
        setDelegators(val.delegators)
        setIndicator({
            percentage: !val.jailed && val?.signingInfo?.indicatorRate ? val?.signingInfo?.indicatorRate : 0,
            color: !val.jailed && val?.signingInfo?.indicatorRate >= 50 ? '#58b15b' : '#f04f43'
        })
        setTableLoading(false)
    }

    const validateDelAmount = (value: any): boolean => {
        if (!value) {
            setErrorMessage(ErrorMessage.Require)
            return false
        }
        if (Number(value) === 0) {
            setErrorMessage(ErrorMessage.ValueInvalid)
            return false
        }
        const balance = getStoredBalance();
        if (balance === 0 || balance < Number(value)) {
            setErrorMessage(ErrorMessage.BalanceNotEnough)
            return false
        }
        if (Number(value) < MIN_DELEGATION_AMOUNT) {
            setErrorMessage(ErrorMessage.BelowMinimumDelegationAmount)
            return false;
        }
        setErrorMessage('')
        return true
    }

    const submitDelegate = async () => {
        if (!validateGasLimit(gasLimit) || !validateGasPrice(gasPrice) || !validateDelAmount(delAmount)) {
            return;
        }

        // Case: submit delegate with kai wallet extension
        if (isExtensionWallet()) {
            const valSmcAddr = validator?.smcAddress || '';
            if (!valSmcAddr) {
                return
            }

            try {
                await delegateByEW(valSmcAddr, Number(delAmount), gasPrice, gasLimit)
                clearCache();
                fetchData();
            } catch (error) {
                ShowNotifyErr(error)
            }
            resetFrom()
        } else {
            setShowConfirmModal(true)
        }
    }

    const validateGasPrice = (gasPrice: any): boolean => {
        if (!Number(gasPrice)) {
            setGasPriceErr(ErrorMessage.Require)
            return false
        }
        setGasPriceErr('')
        return true
    }

    const validateGasLimit = (gas: any): boolean => {
        if (!Number(gas)) {
            setGasLimitErr(ErrorMessage.Require);
            return false;
        }
        setGasLimitErr('')
        return true
    }

    const confirmDelegate = async () => {
        if (!validateGasLimit(gasLimit) || !validateGasPrice(gasPrice) || !validateDelAmount(delAmount)) {
            return;
        }
        try {
            setIsLoading(true)
            const valSmcAddr = validator?.smcAddress || '';
            if (!valSmcAddr) {
                return
            }
            const response = await delegateAction(valSmcAddr, walletLocalState.account, Number(delAmount), gasLimit, gasPrice);
            ShowNotify(response)
        } catch (error) {
            ShowNotifyErr(error)
        }
        resetFrom();
        setIsLoading(false);
        setShowConfirmModal(false);
    }

    const resetFrom = () => {
        setDelAmount('');
        setGasLimit(gasLimitDefault);
        setGasPrice(GasMode.NORMAL);
        setErrorMessage('');
    }

    const setMaximumAmount = () => {
        try {
            const balance = getStoredBalance();
            const maxFee = weiToKAI(gasLimit * gasPrice * 10 ** 9);
            const validableBalance = balance > Number(maxFee) ? balance - Number(maxFee) : 0;
            setDelAmount(String(validableBalance))
            validateDelAmount(validableBalance)
        } catch (error) {
            console.error(error)
        }
    }



    return (
        <>
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                    <div className="val-info-container">
                        <div style={{ marginBottom: 16 }}>
                            <div className="title header-title">
                                Delegate
                            </div>
                        </div>
                        <Panel shaded className="panel-bg-gray">
                            <List bordered={false}>
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
                                                <span>Commission</span>
                                                <Helper style={{ marginLeft: 5 }} info={HelperMessage.CommissionRate} />
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">{numberFormat(validator?.commissionRate || 0, 3)} %</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                <span>Max Commission Rate</span>
                                                <Helper style={{ marginLeft: 5 }} info={HelperMessage.MaxRate} />
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">{numberFormat(validator?.maxRate || 0, 3)} %</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                <span>Max Change Commission Rate</span>
                                                <Helper style={{ marginLeft: 5 }} info={HelperMessage.MaxChangeRate} />
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                {numberFormat(validator?.maxChangeRate || 0, 3)} %
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                Voting Power
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                {numberFormat(validator?.votingPower || 0, 3)} %
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                Total delegator
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                {validator?.totalDelegators}
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                            <div className="property-title">
                                                Total staked amount
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                            <div className="property-content">
                                                {numberFormat(weiToKAI(validator?.stakedAmount), 4)} KAI
                                            </div>
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
                                                    validator?.jailed ? <Tag color="red" className="tab tab-failed">Jailed</Tag> : <Tag className="tab tab-success" color="green">Active</Tag>
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
                            </List>
                            <div className="del-staking-container">
                                <Form fluid>
                                    <FormGroup>
                                        <FlexboxGrid>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <FlexboxGrid>
                                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24} style={{ marginBottom: 15 }}>
                                                        <ControlLabel className="color-white">Gas Limit (required)</ControlLabel>
                                                        <NumberInputFormat
                                                            decimalScale={0}
                                                            value={gasLimit}
                                                            placeholder="Gas Limit"
                                                            className="input"
                                                            onChange={(event) => {
                                                                setGasLimit(event.value);
                                                                validateGasLimit(event.value)
                                                            }} />
                                                        <ErrMessage message={gasLimitErr} />
                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24} style={{ marginBottom: 15 }}>
                                                        <ControlLabel className="color-white">Gas Price (required)</ControlLabel>
                                                        <SelectPicker
                                                            className="dropdown-custom"
                                                            data={gasPriceOption}
                                                            searchable={false}
                                                            value={gasPrice}
                                                            onChange={(value) => {
                                                                setGasPrice(value)
                                                                validateGasPrice(value)
                                                            }}
                                                            style={{ width: '100%' }}
                                                        />
                                                        <ErrMessage message={gasPriceErr} />
                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} xs={24} style={{ marginBottom: 15 }}>
                                                        <FlexboxGrid justify="space-between" align="middle">
                                                            <ControlLabel className="color-white">Delegation amount (KAI - required)</ControlLabel>
                                                            <span
                                                                className="maximum-amount"
                                                                onClick={() => {
                                                                    setMaximumAmount()
                                                                }}>Maximum</span>
                                                        </FlexboxGrid>
                                                        <NumberInputFormat
                                                            decimalScale={18}
                                                            value={delAmount}
                                                            placeholder="Must be at least 1,000 KAI"
                                                            className="input"
                                                            onChange={(event) => {
                                                                setDelAmount(event.value);
                                                                validateDelAmount(event.value)
                                                            }} />
                                                        <ErrMessage message={errorMessage} />
                                                    </FlexboxGrid.Item>
                                                </FlexboxGrid>
                                            </FlexboxGrid.Item>

                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} xs={24}>
                                                <Button size="big" style={{ minWidth: 200 }} onClick={submitDelegate}>Delegate</Button>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </FormGroup>
                                </Form>
                            </div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
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
            {/* Modal confirm when delegate */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter">{InforMessage.DelegationConfirm}</div>
                    <List>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24}>
                                    <div className="property-title">Validator</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={16} xs={24}>
                                    <div className="property-content">
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
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24}>
                                    <div className="property-title">Smart Contract</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={16} xs={24}>
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
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24}>
                                    <div className="property-title">Value</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={16} xs={24}>
                                    <div className="property-content">
                                        {numberFormat(delAmount)} KAI
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                    </List>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="kai-button-gray" onClick={() => { setShowConfirmModal(false) }}>
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={confirmDelegate}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DelegatorCreate;