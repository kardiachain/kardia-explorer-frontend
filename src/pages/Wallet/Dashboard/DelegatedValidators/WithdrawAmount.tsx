import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, ControlLabel, FlexboxGrid, Form, Icon, Modal, Radio, RadioGroup, Table, Tooltip, Whisper } from 'rsuite';
import {
    millisecondToDay,
    renderHashStringAndTooltip,
    Button,
    weiToKAI,
    numberFormat,
    NumberInputFormat,
    StakingIcon,
    ErrMessage,
    Helper,
    HelperMessage,
    ErrorMessage,
    InforMessage,
    renderStringAndTooltip,
    ShowNotifyErr,
    ShowNotify
} from '../../../../common';
import { useViewport } from '../../../../context/ViewportContext';
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom';
import {
    isExtensionWallet,
    undelegateAll,
    undelegateWithAmount,
    withdrawDelegatedAmount,
    undelegateAllByEW,
    undelegateWithAmountByEW,
    withdrawDelegatedAmountByEW
} from '../../../../service';
import './style.css'

const { Column, HeaderCell, Cell } = Table;

const WithdrawAmount = ({ yourValidators, reFetchData }: {
    yourValidators: YourValidator[];
    reFetchData: () => void;
}) => {
    const { isMobile } = useViewport();
    const [showUndelegateModel, setShowUndelegateModel] = useState(false);
    const [unStakeAmount, setUnstakeAmount] = useState('');
    const [unStakeAmountErr, setUnstakeAmountErr] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validatorActive, setValidatorActive] = useState<YourValidator>();
    const [showConfirmWithdrawModal, setShowConfirmWithdrawModal] = useState(false);
    const [delegateOption, setDelegateOption] = useState('part');

    const walletLocalState = useRecoilValue(walletState)

    const undelegate = async () => {
        const valSmcAddr = validatorActive?.validatorSmcAddr || '';
        if (!valSmcAddr) return;
        if (delegateOption === 'part') {
            if (!validateUnStakeAmount(unStakeAmount)) return
            setIsLoading(true);
            try {
                // Case: undelegate with amount interact with Kai Extension Wallet
                if (isExtensionWallet()) {
                    undelegateWithAmountByEW(valSmcAddr, Number(unStakeAmount))
                    reFetchData()
                    setShowUndelegateModel(false)
                    setIsLoading(false)
                    return
                }

                const result = await undelegateWithAmount(valSmcAddr, Number(unStakeAmount), walletLocalState.account)
                ShowNotify(result)
            } catch (error) {
                ShowNotifyErr(error)
            }
        } else {
            try {
                setIsLoading(true);
                // Case: undelegate all interact with Kai Extension Wallet
                if (isExtensionWallet()) {
                    undelegateAllByEW(valSmcAddr)
                    reFetchData();
                    setShowUndelegateModel(false)
                    setIsLoading(false)
                    return
                }
                const result = await undelegateAll(valSmcAddr, walletLocalState.account);
                ShowNotify(result)
            } catch (error) {
                ShowNotifyErr(error)
            }
        }
        reFetchData();
        setShowUndelegateModel(false)
        setIsLoading(false)
        setValidatorActive({} as YourValidator)
        resetUndelegateForm()
    }

    const validateUnStakeAmount = (value: any): boolean => {
        if (!value || value === '0') {
            setUnstakeAmountErr(ErrorMessage.Require)
            return false
        }
        const stakedAmount = weiToKAI(validatorActive?.yourStakeAmount);
        if (!Number(stakedAmount) || Number(stakedAmount) < Number(value)) {
            setUnstakeAmountErr(ErrorMessage.ValueNotMoreThanStakedAmount)
            return false
        }
        setUnstakeAmountErr('')
        return true
    }

    const resetUndelegateForm = () => {
        setUnstakeAmountErr('');
        setUnstakeAmount('');
        setDelegateOption('part');
    }

    const widthdraw = async () => {
        setIsLoading(true)
        try {
            const valAddr = validatorActive?.validatorSmcAddr || '';
            if (!valAddr) return;

            // Case: withdraw staked amount interact with Kai Extension Wallet
            if (isExtensionWallet()) {
                withdrawDelegatedAmountByEW(valAddr)
                reFetchData()
                setIsLoading(false)
                setShowConfirmWithdrawModal(false)
                return
            }

            const result = await withdrawDelegatedAmount(valAddr, walletLocalState.account);
            ShowNotify(result)
        } catch (error) {
            ShowNotifyErr(error)
        }
        reFetchData()
        setIsLoading(false)
        setShowConfirmWithdrawModal(false)
        setValidatorActive({} as YourValidator)
    }

    return (
        <>
            <Table
                autoHeight
                data={yourValidators}
                hover={false}
                wordWrap
                rowHeight={() => 80}
            >
                <Column flexGrow={2} minWidth={250} verticalAlign="middle">
                    <HeaderCell><span style={{ marginLeft: 50 }}>Validator</span></HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <Link to={`/validator/${rowData?.validatorAddr}`}>
                                    <div>
                                        <div style={{ display: 'inline-block', width: 50 }}>
                                            <StakingIcon
                                                color={rowData?.role?.classname}
                                                character={rowData?.role?.character}
                                                size='normal' style={{ marginRight: 5 }} />
                                        </div>
                                        <div className="validator-info color-white">
                                            <div className="validator-name">
                                                {
                                                    renderStringAndTooltip({
                                                        str: rowData.validatorName,
                                                        headCount: isMobile ? 12 : 20,
                                                        showTooltip: true
                                                    })
                                                }
                                            </div>
                                            {renderHashStringAndTooltip(
                                                rowData.validatorAddr,
                                                isMobile ? 10 : 15,
                                                4,
                                                true
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={1} minWidth={150} verticalAlign="middle">
                    <HeaderCell>Staked (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>{numberFormat(weiToKAI(rowData.yourStakeAmount), 2)}</div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={1} minWidth={150} verticalAlign="middle">
                    <HeaderCell>Rewards (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>{numberFormat(weiToKAI(rowData.claimableAmount), 2)}</div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={1} minWidth={110} verticalAlign="middle">
                    <HeaderCell>Unbonded (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>
                                    <span style={{ marginRight: 5 }}>{numberFormat(weiToKAI(rowData.unbondedAmount), 2)}</span>
                                    {
                                        rowData.unbondedRecords && rowData.unbondedRecords.length > 0 ?
                                            <Whisper placement="autoVertical" trigger="hover"
                                                speaker={
                                                    <Tooltip className="custom-tooltip unbondedtime">
                                                        {
                                                            rowData.unbondedRecords.map((item: UnbondedRecord, index: number) => {
                                                                return (
                                                                    <div style={{ marginBottom: 5 }}>
                                                                        <span>#{index + 1}: {numberFormat(weiToKAI(item.balance), 0)} KAI</span>
                                                                        <span className="unbonded-note">
                                                                            (Release time: in {millisecondToDay(Number(item.completionTime || 0))})
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </Tooltip>
                                                }><Icon icon="info" /></Whisper> : <></>
                                    }
                                </div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={1} minWidth={150} verticalAlign="middle">
                    <HeaderCell>Withdrawable (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>{numberFormat(weiToKAI(rowData.withdrawableAmount), 2)}</div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column width={250} verticalAlign="middle">
                    <HeaderCell></HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div style={{ marginBottom: 10, display: "flex" }}>
                                    <Button className="kai-button-gray"
                                        disable={Number(rowData.yourStakeAmount) === 0}
                                        onClick={() => {
                                            resetUndelegateForm()
                                            setShowUndelegateModel(true)
                                            setValidatorActive(rowData)
                                        }}>Undelegate</Button>
                                    {
                                        rowData.withdrawableAmount > 0 ?
                                            <Button className="withdraw-button"
                                                onClick={() => {
                                                    setShowConfirmWithdrawModal(true)
                                                    setValidatorActive(rowData)
                                                }}>Withdraw
                                        </Button> : <></>
                                    }
                                </div>
                            )
                        }}
                    </Cell>
                </Column>
            </Table>

            {/* Undelegate staking*/}
            <Modal backdrop={false} size="sm" className="undelegate-model-container" enforceFocus={true} show={showUndelegateModel}
                onHide={() => {
                    setShowUndelegateModel(false)
                }}>
                <Modal.Header>
                    <Modal.Title>Undelegate Your Staked</Modal.Title>
                    <div className="undelegate-note" style={{ marginTop: 20 }}>
                        * Your undelegated amount will be marked as "Unbonded". Your current "Rewards" will be withdrawn to your wallet immediately.
                    </div>
                    <div className="undelegate-note">
                        * After 168 hours (7 days), your "Unbonded" KAI will be marked as "Withdrawable" and can be claimed to your wallet.
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid className="panel-bg-gray">
                        <FlexboxGrid>
                            <RadioGroup
                                name="delegateOption"
                                value={delegateOption}
                                onChange={(value) => {
                                    setDelegateOption(value);
                                    setUnstakeAmountErr('');
                                    setUnstakeAmount('');
                                }}>
                                <Radio value="part" className="color-white">Enter Amount</Radio>
                                <Radio value="all" className="color-white">
                                    <span>Maximum Amount</span>
                                    <Helper style={{ marginLeft: 5 }} info={HelperMessage.UndelegateAll} />
                                </Radio>
                            </RadioGroup>
                            {
                                delegateOption === 'part' ? (
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                                        <FlexboxGrid justify="space-between" align="middle">
                                            <ControlLabel className="color-white">Amount (KAI) (required)</ControlLabel>
                                        </FlexboxGrid>
                                        <NumberInputFormat
                                            decimalScale={18}
                                            value={unStakeAmount}
                                            placeholder="Enter Your Amount"
                                            className="input"
                                            onChange={(event) => {
                                                setUnstakeAmount(event.value);
                                                validateUnStakeAmount(event.value)
                                            }} />
                                        <ErrMessage message={unStakeAmountErr} />
                                    </FlexboxGrid.Item>
                                ) : <></>
                            }
                        </FlexboxGrid>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="kai-button-gray"
                        onClick={() => {
                            setShowUndelegateModel(false)
                        }}>
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={undelegate}>
                        Undelegate
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal confirm when withdraw staked token */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmWithdrawModal} onHide={() => { setShowConfirmWithdrawModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter" style={{ textAlign: 'center' }}>{InforMessage.WithdrawStakedAmountConfirm}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="kai-button-gray" onClick={() => { setShowConfirmWithdrawModal(false) }}>
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={widthdraw}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default WithdrawAmount;