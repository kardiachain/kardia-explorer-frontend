import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, ControlLabel, FlexboxGrid, Form, Modal, Table } from 'rsuite';
import Button from '../../../../common/components/Button';
import NumberInputFormat from '../../../../common/components/FormInput';
import { StakingIcon } from '../../../../common/components/IconCustom';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
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
    const [undelAllLoading, setUndelAllLoading] = useState(false);
    const [validatorActive, setValidatorActive] = useState<YourValidator>();
    const [showConfirmWithdrawModal, setShowConfirmWithdrawModal] = useState(false);

    // @Function undelegate with amount
    const undelegate = async () => {
        const valSmcAddr = validatorActive?.validatorSmcAddr || '';
        if (!validateUnStakeAmount(unStakeAmount) || !valSmcAddr) return
        setIsLoading(true);
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
        reFetchData();
        setShowUndelegateModel(false)
        setIsLoading(false)
        setValidatorActive({} as YourValidator)
        resetUndelegateForm()
    }

    // Undelegate with all your staked amount
    const undelegateAllAmount = async () => {
        const valSmcAddr = validatorActive?.validatorSmcAddr || '';
        if (!valSmcAddr) return;
        setUndelAllLoading(true);
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
        reFetchData();
        setShowUndelegateModel(false)
        setUndelAllLoading(false)
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
                <Column flexGrow={2} minWidth={200} verticalAlign="middle">
                    <HeaderCell>Action</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div style={{ marginBottom: 10, display: "flex" }}>
                                    <Button className="kai-button-gray" onClick={() => {
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
            <Modal backdrop={false} size="sm" enforceFocus={true} show={showUndelegateModel}
                onHide={() => {
                    setShowUndelegateModel(false)
                    resetUndelegateForm()
                }}>
                <Modal.Header>
                    <Modal.Title>Undelegate Your Staked</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                                <FlexboxGrid justify="space-between" align="middle" className="mb10">
                                    <ControlLabel>Amount <span className="required-mask">(*)</span></ControlLabel>
                                </FlexboxGrid>
                                <NumberInputFormat
                                    value={unStakeAmount}
                                    placeholder="Amount"
                                    onChange={(event) => {
                                        setUnstakeAmount(event.value);
                                        validateUnStakeAmount(event.value)
                                    }} />
                                <ErrMessage message={unStakeAmountErr} />
                                <div className="undelegate-note">*Note:</div>
                                <div className="undelegate-note">- After undelegated, the number of your current rewards will be an automatic withdrawal.</div>
                                <div className="undelegate-note">- The number of undelegated amount will be added to withdrawable amount in the next 24 hours.</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={undelAllLoading} onClick={undelegateAllAmount}>
                        Undelegate All
                    </Button>
                    <Button loading={isLoading} onClick={undelegate}>
                        Undelegate
                    </Button>
                    <Button className="kai-button-gray"
                        onClick={() => {
                            setShowUndelegateModel(false)
                            resetUndelegateForm()
                        }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal confirm when withdraw staked token */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmWithdrawModal} onHide={() => { setShowConfirmWithdrawModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm withdraw your staked token</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>Are you sure you want to withdraw your staked token.</div>
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