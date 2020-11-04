import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Alert, Button, ButtonToolbar, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, List, Modal, Panel, Table } from 'rsuite';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { weiToKAI } from '../../../../common/utils/amount';
import { onlyNumber, verifyAmount } from '../../../../common/utils/number';
import { renderHashString, renderHashToRedirect } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { delegateAction, getDelegationsByValidator, getValidator } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
const { Column, HeaderCell, Cell } = Table;

const DelegatorCreate = () => {
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<ValidatorFromSMC>()
    const { isMobile } = useViewport();
    const [isLoading, setIsLoading] = useState(false)
    const [delAmount, setDelAmount] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [hashTransaction, setHashTransaction] = useState('')
    const { valAddr }: any = useParams();
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    useEffect(() => {
        getDelegationsByValidator(valAddr).then(setDelegators);
        getValidator(valAddr).then(setValidator)

    }, [valAddr]);

    const validateDelAmount = (value: any): boolean => {
        if (!verifyAmount(value)) {
            setErrorMessage(ErrorMessage.NumberInvalid)
            return false
        }
        if (!value) {
            setErrorMessage(ErrorMessage.Require)
            return false
        }
        if (Number(value) === 0) {
            setErrorMessage(ErrorMessage.ValueInvalid)
            return false
        }
        setErrorMessage('')
        return true
    }

    const submitDelegate = async () => {
        if (!validateDelAmount(delAmount)) {
            return;
        }
        setShowConfirmModal(true)
    }

    const confirmDelegate = async () => {
        try {
            setIsLoading(true)
            let account = getAccount() as Account
            const delegate = await delegateAction(valAddr, account, Number(delAmount))
            console.log("Delegate", delegate);

            if (delegate && delegate.status === 1) {
                Alert.success('Delegate success.')
                setHashTransaction(delegate.transactionHash)
            } else {
                Alert.error('Delegate failed.')
            }
            setIsLoading(false)
            setShowConfirmModal(false)
        } catch (error) {
            const errJson = JSON.parse(error?.message)
            Alert.error(`Delegate failed: ${errJson?.error?.message || ''}`)
            setIsLoading(false)
            setShowConfirmModal(false)
        }
    }

    return (
        <>
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="val-info-container">
                        <Panel header={<div style={{wordBreak: 'break-all'}}>{`Validator: ${valAddr}`}</div>} shaded>
                            <List bordered={false}>
                                <List.Item bordered={false}>
                                    <span className="property-title">Commission: </span> {validator?.commission || 0} %
                                </List.Item>
                                <List.Item bordered={false}>
                                    <span className="property-title">Total delegator: </span> {validator?.totalDels}
                                </List.Item>
                                <List.Item bordered={false}>
                                    <span className="property-title">Voting power: </span> {validator?.votingPower}
                                </List.Item>
                            </List>
                            <div className="del-staking-container">
                                <Form fluid>
                                    <FormGroup>
                                        <ControlLabel>Delegation amount <span className="required-mask">*</span></ControlLabel>
                                        <FormControl
                                            placeholder="Delegation amount*"
                                            value={delAmount} name="delAmount"
                                            onChange={(value) => {
                                                if (onlyNumber(value)) {
                                                    setDelAmount(value)
                                                    validateDelAmount(value)
                                                }
                                            }} />
                                        <ErrMessage message={errorMessage} />
                                    </FormGroup>
                                    <FormGroup>
                                        <ButtonToolbar>
                                            <Button appearance="primary" onClick={submitDelegate}>Delegate</Button>
                                        </ButtonToolbar>
                                    </FormGroup>
                                </Form>
                                {
                                    hashTransaction ? <div style={{ marginTop: '20px', wordBreak: 'break-all' }}> Transaction created: {renderHashToRedirect({
                                        hash: hashTransaction,
                                        headCount: 30,
                                        tailCount: 4,
                                        showTooltip: false,
                                        callback: () => { window.open(`/tx/${hashTransaction}`) }
                                    })}</div> : <></>
                                }
                            </div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div className="del-list-container">
                        <Panel header={<h4>Delegators</h4>} shaded>
                            <Table
                                autoHeight
                                rowHeight={60}
                                data={delegators}
                            >
                                <Column width={isMobile ? 120 : 500} verticalAlign="middle">
                                    <HeaderCell>Delegator Address</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {renderHashString(rowData.address, isMobile ? 10 : 50)} </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column width={isMobile ? 120 : 300} verticalAlign="middle">
                                    <HeaderCell>Staked Amount</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {weiToKAI(rowData.stakeAmount)} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column width={isMobile ? 120 : 300} verticalAlign="middle">
                                    <HeaderCell>Rewards Amount</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {weiToKAI(rowData.rewardsAmount)} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            {/* Modal confirm when delegate */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm your delegate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center' }}>Are you sure you want to delegate <span style={{ fontWeight: 'bold', color: '#36638A' }}>{delAmount} KAI</span></div>
                    <div style={{ textAlign: 'center' }}>TO</div>
                    <div style={{ textAlign: 'center' }}>Validator: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {valAddr} </span></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setShowConfirmModal(false) }} appearance="subtle">
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={confirmDelegate} appearance="primary">
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DelegatorCreate;