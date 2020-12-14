import React, { useEffect, useState } from 'react'
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, Icon, Modal, Panel, Table } from 'rsuite';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { weiToKAI } from '../../../../common/utils/amount';
import { numberFormat, onlyNumber } from '../../../../common/utils/number';
import { renderHashToRedirect } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { getValidatorByDelegator } from '../../../../service/kai-explorer';
import { undelegateWithAmount, withdraw, withdrawReward } from '../../../../service/smc/staking';
import { getAccount } from '../../../../service/wallet';
import './stype.css';

const { Column, HeaderCell, Cell } = Table;
const Delegator = () => {


    const { isMobile } = useViewport()
    const [yourValidators, setYourValidators] = useState([] as YourValidator[])
    const myAccount = getAccount() as Account
    const [showConfirmWithdrawRewardsModal, setShowConfirmWithdrawRewardsModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [validatorActive, setValidatorActive] = useState<YourValidator>()
    const [showConfirmWithdrawModal, setShowConfirmWithdrawModal] = useState(false)
    const [showUndelegateModel, setShowUndelegateModel] = useState(false)
    const [unStakeAmount, setUnstakeAmount] = useState('')
    const [unStakeAmountErr, setUnstakeAmountErr] = useState('')

    useEffect(() => {
        (async () => {
            const yourVals = await getValidatorByDelegator(myAccount.publickey)
            setYourValidators(yourVals)
        })()
    }, [myAccount.publickey]);


    const reFetchData = async () => {
        const yourVals = await getValidatorByDelegator(myAccount.publickey)
        setYourValidators(yourVals)
    }

    const withdrawRewards = async () => {
        setIsLoading(true)
        try {
            const valSmcAddr = validatorActive?.validatorSmcAddr || '';
            if(!valSmcAddr) return;

            const withdrawTx = await withdrawReward(valSmcAddr, myAccount);
            if (withdrawTx && withdrawTx.status) {
                Alert.success('Withdraw rewards success.', 5000);
            } else {
                Alert.error('Withdraw rewards failed.', 5000);
            }
        } catch (error) {
            Alert.error(`Withdraw failed: ${error.message}`, 5000);
        }
        await reFetchData()
        setIsLoading(false)
        setShowConfirmWithdrawRewardsModal(false)
        setValidatorActive({} as YourValidator)
    }

    const widthdraw = async () => {
        setIsLoading(true)
        try {
            const valAddr = validatorActive?.validatorAddr || '';
            if(!valAddr) return;

            const withdrawTx = await withdraw(valAddr, myAccount);
            if (withdrawTx && withdrawTx.status === 1) {
                Alert.success('Withdraw success.', 5000)
            } else {
                Alert.error('Withdraw failed.', 5000)
            }
        } catch (error) {
            Alert.error(`Withdraw failed: ${error.message}`, 5000)
        }
        reFetchData()
        setIsLoading(false)
        setShowConfirmWithdrawModal(false)
        setValidatorActive({} as YourValidator)
    }

    const selectAllAmount = () => {
        const stakedAmount = weiToKAI(validatorActive?.yourStakeAmount);
        setUnstakeAmount(stakedAmount);
    }

    const undelegate = async () => {
        const valSmcAddr = validatorActive?.validatorSmcAddr || '';
        if(!valSmcAddr) return;
        if (!validateUnStakeAmount(unStakeAmount) || !valSmcAddr) return
        setIsLoading(true);

        try {
            const undelegateTx = await undelegateWithAmount(valSmcAddr, Number(unStakeAmount), myAccount)
            if (undelegateTx && undelegateTx.status === 1) {
                Alert.success('Undelegate success.', 5000)
            } else {
                Alert.error('Undelegate failed.', 5000)
            }
        } catch (error) {
            Alert.error('Undelegate failed.', 5000)
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
    }

    return (
        <div>
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="group" />
                    <p style={{ marginLeft: '12px' }} className="title">Your validators</p>
                </div>
            </div>
            <Panel shaded>
                <Table
                    autoHeight
                    data={yourValidators}
                    hover={false}
                    wordWrap
                    rowHeight={60}
                >
                    <Column flexGrow={1} minWidth={isMobile ? 110 : 150} verticalAlign="middle">
                        <HeaderCell>Validator</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>
                                        {
                                            renderHashToRedirect({
                                                hash: rowData.validatorAddr,
                                                headCount: isMobile ? 5 : 15,
                                                tailCount: 4,
                                                showTooltip: true,
                                                callback: () => { window.open(`/address/${rowData.validatorAddr}`) }
                                            })
                                        }
                                    </div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={1} minWidth={150} verticalAlign="middle">
                        <HeaderCell>Staked Amount</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{numberFormat(weiToKAI(rowData.yourStakeAmount), 2)} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={1} minWidth={150} verticalAlign="middle">
                        <HeaderCell>Claimable Rewards</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{numberFormat(weiToKAI(rowData.claimableAmount), 2)} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={1} minWidth={150} verticalAlign="middle">
                        <HeaderCell>Unbonded Amount</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{numberFormat(weiToKAI(rowData.unbondedAmount), 2)} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={1} minWidth={180} verticalAlign="middle">
                        <HeaderCell>Withdrawable Amount</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{numberFormat(weiToKAI(rowData.withdrawableAmount), 2)} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={3} minWidth={450} verticalAlign="middle">
                        <HeaderCell>Action</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div style={{ marginBottom: 10, display: "flex" }}>
                                        <Button onClick={() => {
                                            setShowConfirmWithdrawRewardsModal(true)
                                            setValidatorActive(rowData)
                                        }}>Claims Rewards
                                        </Button>
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
            </Panel>
            {/* Modal confirm when withdraw rewards */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmWithdrawRewardsModal} onHide={() => { setShowConfirmWithdrawRewardsModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm Withdraw Rewards</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>Are you sure you want to withdraw all your rewarded token.</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={isLoading} onClick={withdrawRewards} >
                        Confirm
                    </Button>
                    <Button onClick={() => { setShowConfirmWithdrawRewardsModal(false) }} className="kai-button-gray">
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
                                <ControlLabel>Undelegate staked Amount  <span className="required-mask">(*)</span></ControlLabel>
                                    <div>
                                        <Button className="kai-button-gray pd0"
                                            onClick={() => { 
                                                selectAllAmount()
                                            }}>All</Button>
                                    </div>
                                </FlexboxGrid>
                                <FormControl
                                    placeholder="Undelegate staked Amount"
                                    value={unStakeAmount} name="unStakeAmount"
                                    onChange={(value) => {
                                        if (onlyNumber(value)) {
                                            setUnstakeAmount(value)
                                            validateUnStakeAmount(value)
                                        }
                                    }} />
                                <ErrMessage message={unStakeAmountErr} />
                                <div className="undelegate-note">*Note: The number of undelegated amount will be added to withdrawable amount in the next 24 hours.</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={isLoading} onClick={undelegate}>
                        Confirm
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

        </div>
    )
}

export default Delegator;