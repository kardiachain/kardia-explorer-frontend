import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, ControlLabel, FlexboxGrid, Form, Modal, Radio, RadioGroup, Table } from 'rsuite';
import Button from '../../../../common/components/Button';
import NumberInputFormat from '../../../../common/components/FormInput';
import Helper from '../../../../common/components/Helper';
import { StakingIcon } from '../../../../common/components/IconCustom';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import { HelperMessage } from '../../../../common/constant/HelperMessage';
import { ErrorMessage, NotifiMessage } from '../../../../common/constant/Message';
import { weiToKAI } from '../../../../common/utils/amount';
import { numberFormat } from '../../../../common/utils/number';
import { renderHashStringAndTooltip } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { undelegateAll, undelegateWithAmount, withdrawDelegatedAmount } from '../../../../service/smc/staking';
import { getAccount } from '../../../../service/wallet';

const { Column, HeaderCell, Cell } = Table;

const WithdrawAmount = ({ yourValidators, reFetchData }: {
    yourValidators: YourValidator[];
    reFetchData: () => void;
}) => {
    const { isMobile } = useViewport();
    const myAccount = getAccount() as Account
    const [showUndelegateModel, setShowUndelegateModel] = useState(false);
    const [unStakeAmount, setUnstakeAmount] = useState('');
    const [unStakeAmountErr, setUnstakeAmountErr] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validatorActive, setValidatorActive] = useState<YourValidator>();
    const [showConfirmWithdrawModal, setShowConfirmWithdrawModal] = useState(false);
    const [delegateOption, setDelegateOption] = useState('part');

    // @Function undelegate with amount
    const undelegate = async () => {
        const valSmcAddr = validatorActive?.validatorSmcAddr || '';
        if (!valSmcAddr) return;
        setIsLoading(true);
        if (delegateOption === 'part') {
            if (!validateUnStakeAmount(unStakeAmount)) return
            try {
                const result = await undelegateWithAmount(valSmcAddr, Number(unStakeAmount), myAccount)
                if (result && result.status === 1) {
                    NotificationSuccess({
                        description: NotifiMessage.TransactionSuccess,
                        callback: () => { window.open(`/tx/${result.transactionHash}`) },
                        seeTxdetail: true
                    });
                } else {
                    NotificationError({
                        description: NotifiMessage.TransactionError,
                        callback: () => { window.open(`/tx/${result.transactionHash}`) },
                        seeTxdetail: true
                    });
                }
            } catch (error) {
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${error.message}`
                });
            }
        } else {
            try {
                const result = await undelegateAll(valSmcAddr, myAccount);
                if (result && result.status === 1) {
                    NotificationSuccess({
                        description: NotifiMessage.TransactionSuccess,
                        callback: () => { window.open(`/tx/${result.transactionHash}`) },
                        seeTxdetail: true
                    });
                } else {
                    NotificationError({
                        description: NotifiMessage.TransactionError,
                        callback: () => { window.open(`/tx/${result.transactionHash}`) },
                        seeTxdetail: true
                    });
                }
            } catch (error) {
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${error.message}`
                });
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

    // @Function for withdraw your withdrawable staked amount
    const widthdraw = async () => {
        setIsLoading(true)
        try {
            const valAddr = validatorActive?.validatorSmcAddr || '';
            if (!valAddr) return;

            const result = await withdrawDelegatedAmount(valAddr, myAccount);
            if (result && result.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess,
                    callback: () => { window.open(`/tx/${result.transactionHash}`) },
                    seeTxdetail: true
                });
            } else {
                NotificationError({
                    description: NotifiMessage.TransactionError,
                    callback: () => { window.open(`/tx/${result.transactionHash}`) },
                    seeTxdetail: true
                });
            }
        } catch (error) {
            NotificationError({
                description: `${NotifiMessage.TransactionError} Error: ${error.message}`
            });
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
                rowHeight={() => 60}
            >
                <Column flexGrow={2} minWidth={isMobile ? 110 : 150} verticalAlign="middle">
                    <HeaderCell>Validator</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <Link to={`/validator/${rowData?.validatorAddr}`}>
                                    <div>
                                        <StakingIcon
                                            color={rowData?.role?.classname}
                                            character={rowData?.role?.character}
                                            size='small' style={{ marginRight: 5 }} />
                                        <span className="validator-name">{rowData.validatorName}</span>
                                        <div className="validator-address">
                                            {renderHashStringAndTooltip(
                                                rowData.validatorAddr,
                                                isMobile ? 10 : 30,
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
                <Column flexGrow={1} minWidth={150} verticalAlign="middle" align="center">
                    <HeaderCell>Staked</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>{numberFormat(weiToKAI(rowData.yourStakeAmount), 2)} KAI</div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={1} minWidth={110} verticalAlign="middle" align="center">
                    <HeaderCell>Unbonded</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>{numberFormat(weiToKAI(rowData.unbondedAmount), 2)} KAI</div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={1} minWidth={110} verticalAlign="middle" align="center">
                    <HeaderCell>Withdrawable</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>{numberFormat(weiToKAI(rowData.withdrawableAmount), 2)} KAI</div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={300} verticalAlign="middle">
                    <HeaderCell>Action</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div style={{ marginBottom: 10, display: "flex" }}>
                                    <Button className="kai-button-gray" onClick={() => {
                                        resetUndelegateForm()
                                        setShowUndelegateModel(true)
                                        setValidatorActive(rowData)
                                    }}>Undelegate
                                        </Button>
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
                    <div className="undelegate-note" style={{ marginTop: 20 }}>* After undelegated, the number of your current rewards will be an automatic withdrawal.</div>
                    <div className="undelegate-note">* The number of undelegated amount will be added to withdrawable amount in the next 24 hours.</div>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <FlexboxGrid>
                            <RadioGroup
                                name="delegateOption"
                                value={delegateOption}
                                onChange={(value) => {
                                    setDelegateOption(value);
                                    setUnstakeAmountErr('');
                                    setUnstakeAmount('');
                                }}>
                                <Radio value="part">Enter Amount</Radio>
                                <Radio value="all">
                                    <span>Maximun Amount</span>
                                    <Helper style={{ marginLeft: 5 }} info={HelperMessage.UndelegateAll} />
                                </Radio>
                            </RadioGroup>
                            {
                                delegateOption === 'part' ? (
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                                        <FlexboxGrid justify="space-between" align="middle">
                                            <ControlLabel>Amount (KAI) <span className="required-mask">(*)</span></ControlLabel>
                                        </FlexboxGrid>
                                        <NumberInputFormat
                                            value={unStakeAmount}
                                            placeholder="Enter Your Amount"
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
                    <Button loading={isLoading} onClick={undelegate}>
                        Undelegate
                    </Button>
                    <Button className="kai-button-gray"
                        onClick={() => {
                            setShowUndelegateModel(false)
                        }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal confirm when withdraw staked token */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmWithdrawModal} onHide={() => { setShowConfirmWithdrawModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter" style={{ textAlign: 'center' }}>Are you sure you want to withdraw your staked token.</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={isLoading} onClick={widthdraw}>
                        Confirm
                    </Button>
                    <Button className="kai-button-gray" onClick={() => { setShowConfirmWithdrawModal(false) }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default WithdrawAmount;