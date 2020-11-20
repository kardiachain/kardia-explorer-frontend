import React, { useEffect, useState } from 'react'
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, Icon, IconButton, Modal, Panel, Table } from 'rsuite';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { weiToKAI } from '../../../../common/utils/amount';
import { numberFormat, onlyNumber } from '../../../../common/utils/number';
import { renderHashToRedirect } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { getValidatorsByDelegator, undelegateStake, withdraw, withdrawReward } from '../../../../service/smc/staking';
import { getAccount } from '../../../../service/wallet';

const { Column, HeaderCell, Cell } = Table;
const Delegator = () => {


    const { isMobile } = useViewport()
    const [yourValidators, setYourValidators] = useState([] as YourValidator[])
    const myAccount = getAccount() as Account
    const [showConfirmWithdrawRewardsModal, setShowConfirmWithdrawRewardsModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [validatorActive, setValidatorActive] = useState('')
    const [showConfirmWithdrawModal, setShowConfirmWithdrawModal] = useState(false)
    // const [showConfirmUndelegateModal, setShowConfirmUndelegateModal] = useState(false)
    const [showUndelegateModel, setShowUndelegateModel] = useState(false)
    const [unStakeAmount, setUnstakeAmount] = useState(0)

    const [expandedRowKeys, setExpandedRowKeys] = useState([] as any);

    useEffect(() => {
        (async () => {
            const yourVals = await getValidatorsByDelegator(myAccount.publickey)
            setYourValidators(yourVals)
            setExpandedRowKeys(yourVals)
        })()

        // const fetchYourVals = setInterval(async () => {
        //     const yourVals = await getValidatorsByDelegator(myAccount.publickey)
        //     setYourValidators(yourVals)
        // }, 5000)

        // return () => clearInterval(fetchYourVals);

    }, [myAccount.publickey]);

    const reFetchData = async () => {
        const yourVals = await getValidatorsByDelegator(myAccount.publickey)
        setYourValidators(yourVals)
    }

    const withdrawRewards = async () => {
        setIsLoading(true)
        try {
            const withdrawTx = await withdrawReward(validatorActive, myAccount);
            if (withdrawTx && withdrawTx.status) {
                Alert.success('Withdraw rewards success.')
                await reFetchData()
            } else {
                Alert.error('Withdraw rewards failed.')
            }
        } catch (error) {
            Alert.error(`Withdraw failed: ${error.message}`)
        }
        setIsLoading(false)
        setShowConfirmWithdrawRewardsModal(false)
        setValidatorActive('')
    }

    const widthdraw = async () => {
        setIsLoading(true)
        try {
            const withdrawTx = await withdraw(validatorActive, myAccount);
            if (withdrawTx && withdrawTx.status) {
                Alert.success('Withdraw success.')
            } else {
                Alert.error('Withdraw failed.')
            }
        } catch (error) {
            Alert.error(`Withdraw failed: ${error.message}`)
        }
        setIsLoading(false)
        setShowConfirmWithdrawModal(false)
        setValidatorActive('')
    }

    const undelegate = async () => {
        try {
            const undelegateTx = await undelegateStake(validatorActive, unStakeAmount, myAccount)
            console.log(undelegateTx);
        } catch (error) {
            console.log(error);
        }
        setValidatorActive('')
    }
    const handleExpanded = (rowData: any, dataKey: any) => {
        console.log("expandedRowKeys", expandedRowKeys);
        
        let open = false;
        const nextExpandedRowKeys = [] as any;

        expandedRowKeys.forEach((key: any) => {
            if (key === rowData[rowKey]) {
                open = true;
            } else {
                nextExpandedRowKeys.push(key);
            }
        });

        if (!open) {
            nextExpandedRowKeys.push(rowData[rowKey]);
        }
        setExpandedRowKeys(nextExpandedRowKeys)
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
                    rowHeight={60}
                    // rowExpandedHeight={100}
                    data={yourValidators}
                    hover={false}
                    wordWrap
                    rowKey={rowKey}
                    defaultExpandAllRows={true}
                    defaultExpandedRowKeys={expandedRowKeys}
                    expandedRowKeys={expandedRowKeys}
                    renderRowExpanded={(rowData: YourValidator) => {
                        return (
                            <div>
                                fhbsahfb sbfhbsjkbfsbf bsabfsdbfj bfbaskbfkhabfjkbsafb
                            </div>
                        );
                    }}
                >
                    <Column width={50}>
                        <HeaderCell>#</HeaderCell>
                        <ExpandCell
                            dataKey="validatorAddr"
                            expandedRowKeys={expandedRowKeys}
                            onChange={handleExpanded}
                        />
                    </Column>
                    <Column width={isMobile ? 110 : 300}>
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
                    <Column flexGrow={2} minWidth={isMobile ? 150 : 0}>
                        <HeaderCell>Staked Amount</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{numberFormat(weiToKAI(rowData.yourStakeAmount))} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={2} minWidth={isMobile ? 150 : 0}>
                        <HeaderCell>Claimable Rewards</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{numberFormat(weiToKAI(rowData.claimableAmount))} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    {/* <Column flexGrow={2} minWidth={isMobile ? 150 : 0}>
                                            <HeaderCell>Withdrawable Amount</HeaderCell>
                                            <Cell>
                                                {(rowData: YourValidator) => {
                                                    return (
                                                        <div>{numberFormat(weiToKAI(rowData.withdrawableAmount))} KAI</div>
                                                    )
                                                }}
                                            </Cell>
                                        </Column> */}
                    <Column flexGrow={3} minWidth={300}>
                        <HeaderCell>Action</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div style={{ display: "flex" }}>
                                        <Button onClick={() => {
                                            setShowConfirmWithdrawRewardsModal(true)
                                            setValidatorActive(rowData.validatorAddr)
                                        }}>Claims Rewards
                                                        </Button>
                                        <Button onClick={() => {
                                            setShowUndelegateModel(true)
                                            setValidatorActive(rowData.validatorAddr)
                                        }}>Undelegate
                                                        </Button>
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
                    <Modal.Title>Confirm withdraw all your staked token</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>Are you sure you want to withdraw all your staked token.</div>
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
            <Modal backdrop={false} size="sm" enforceFocus={true} show={showUndelegateModel} onHide={() => { setShowUndelegateModel(false) }}>
                <Modal.Header>
                    <Modal.Title>Undelegate Your Staked</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                                <ControlLabel>Undelegate staked Amount  <span className="required-mask">(*)</span></ControlLabel>
                                <FormControl
                                    placeholder="Delegation amount*"
                                    value={unStakeAmount} name="delAmount"
                                    onChange={(value) => {
                                        if (onlyNumber(value)) {
                                            setUnstakeAmount(value)
                                            // validateDelAmount(value)
                                        }
                                    }} />
                                {/* <ErrMessage message={errorMessage} /> */}
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={isLoading} onClick={undelegate}>
                        Confirm
                    </Button>
                    <Button className="kai-button-gray" onClick={() => { setShowUndelegateModel(false) }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}


const rowKey = 'validatorAddr';
const ExpandCell = ({ rowData, dataKey, expandedRowKeys = [], onChange, ...props }: {
    rowData?: any;
    dataKey?: any;
    expandedRowKeys?: any[];
    onChange?: any;
}) => (
        <Cell {...props}>
            <IconButton
                size="xs"
                appearance="subtle"
                onClick={() => {
                    console.log("rowData........", rowData);
                    onChange(rowData)
                }}
                icon={
                    <Icon
                        icon={
                            expandedRowKeys.some((key: any) => key === rowData[rowKey])
                                ? 'minus-square-o'
                                :
                                'plus-square-o'
                        }
                    />
                }
            />
        </Cell>
    );

export default Delegator;