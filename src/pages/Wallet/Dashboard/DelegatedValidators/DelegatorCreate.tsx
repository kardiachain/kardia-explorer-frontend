import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, List, Modal, Panel, SelectPicker, Table } from 'rsuite';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { gasLimitDefault, gasPriceOption } from '../../../../common/constant';
import { ErrorMessage } from '../../../../common/constant/Message';
import { weiToKAI } from '../../../../common/utils/amount';
import { numberFormat, onlyInteger, onlyNumber } from '../../../../common/utils/number';
import { renderHashString, renderHashToRedirect } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { getBalance } from '../../../../service/kai-explorer';
import { delegateAction, getDelegationsByValidator, getValidator } from '../../../../service/smc/staking';
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
    const history = useHistory()
    const [delegateErrMsg, setDelegateErrMsg] = useState('')
    const [balance, setBalance] = useState(0)
    const myAccount = getAccount() as Account

    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitDefault)
    const [gasLimitErr, setGasLimitErr] = useState('')


    useEffect(() => {
        (async () => {
            const data = await Promise.all([
                getDelegationsByValidator(valAddr),
                getValidator(valAddr),
                getBalance(myAccount.publickey)
            ]);
            setDelegators(data[0])
            setValidator(data[1])
            setBalance(Number(weiToKAI(data[2])))
        })()
    }, [valAddr, myAccount.publickey]);

    const validateDelAmount = (value: any): boolean => {
        if (!value) {
            setErrorMessage(ErrorMessage.Require)
            return false
        }
        if (Number(value) === 0) {
            setErrorMessage(ErrorMessage.ValueInvalid)
            return false
        }
        if (Number(balance) === 0 || Number(balance) < value) {
            setErrorMessage(ErrorMessage.BalanceNotEnough)
            return false
        }
        setErrorMessage('')
        return true
    }

    const submitDelegate = async () => {
        if (!validateGasLimit(gasLimit) || !validateGasPrice(gasPrice) || !validateDelAmount(delAmount)) {
            return;
        }
        setShowConfirmModal(true)
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
        try {
            setIsLoading(true)
            let account = getAccount() as Account
            const delegate = await delegateAction(valAddr, account, Number(delAmount), gasLimit, gasPrice)
            if (delegate && delegate.status === 1) {
                Alert.success('Delegate success.')
                setHashTransaction(delegate.transactionHash)
            } else {
                Alert.error('Delegate failed.')
                setDelegateErrMsg('Delegate failed.');
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                setDelegateErrMsg(`Delegate failed: ${errJson?.error?.message}`)
            } catch (error) {
                setDelegateErrMsg('Delegate failed.');
            }
        }
        setIsLoading(false)
        setShowConfirmModal(false)
    }

    return (
        <>
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="val-info-container">
                        <div className="block-title" style={{ padding: '0px 5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon className="highlight" icon="gear-circle" />
                                <p style={{ marginLeft: '12px' }} className="title">Delegate</p>
                            </div>
                        </div>
                        <Panel shaded>
                            <List bordered={false}>
                                <List.Item bordered={false}>
                                    <span className="property-title">Validator: </span>
                                    <span className="property-content"> 
                                        {renderHashString(valAddr, 45)}
                                    </span>
                                </List.Item>
                                <List.Item bordered={false}>
                                    <span className="property-title">Commission: </span>
                                    <span className="property-content">  
                                        {validator?.commission || 0} %
                                    </span>
                                </List.Item>
                                <List.Item bordered={false}>
                                    <span className="property-title">Total delegator: </span>
                                    <span className="property-content">
                                        {validator?.totalDels}
                                    </span>
                                </List.Item>
                                <List.Item bordered={false}>
                                    <span className="property-title">Total staked amount: </span>
                                    <span className="property-content">
                                        {numberFormat(weiToKAI(validator?.totalStakedAmount))} KAI
                                    </span>
                                </List.Item>
                            </List>
                            <div className="del-staking-container">
                                <Form fluid>
                                    <FormGroup>
                                        <FlexboxGrid>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} style={{ marginBottom: 15 }}>
                                                <ControlLabel>Gas Limit:<span className="required-mask">*</span></ControlLabel>
                                                <FormControl name="gaslimit"
                                                    placeholder="Gas Limit"
                                                    value={gasLimit}
                                                    onChange={(value) => {
                                                        if (onlyInteger(value)) {
                                                            setGasLimit(value);
                                                            validateGasLimit(value)
                                                        }
                                                    }}
                                                    style={{ width: '100%' }}
                                                />
                                                <ErrMessage message={gasLimitErr} />
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} style={{ marginBottom: 15 }}>
                                                <ControlLabel>Gas Price:<span className="required-mask">*</span></ControlLabel>
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
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
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
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button size="big" onClick={submitDelegate}>Delegate</Button>
                                    </FormGroup>
                                </Form>
                                <ErrMessage message={delegateErrMsg} />
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
                        <div className="block-title" style={{ padding: '0px 5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon className="highlight" icon="group" />
                                <p style={{ marginLeft: '12px' }} className="title">Other Delegators</p>
                            </div>
                        </div>
                        <Panel shaded>
                            <Table
                                autoHeight
                                rowHeight={60}
                                data={delegators}
                                wordWrap
                                hover={false}
                            >
                                <Column flexGrow={3} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell>Delegator Address</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div>
                                                    {renderHashToRedirect({
                                                        hash: rowData.address,
                                                        headCount: isMobile ? 10 : 20,
                                                        showTooltip: true,
                                                        callback: () => { history.push(`/address/${rowData.address}`) }
                                                    })}
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell>Staked Amount</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {numberFormat(weiToKAI(rowData.stakeAmount))} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell>Claimable Rewards</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {numberFormat(weiToKAI(rowData.rewardsAmount))} KAI</div>
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
                    <Button loading={isLoading} onClick={confirmDelegate}>
                        Confirm
                    </Button>
                    <Button className="primary-button" onClick={() => { setShowConfirmModal(false) }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DelegatorCreate;