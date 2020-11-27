import React, { useEffect, useState } from 'react'
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, List, Modal, Panel, SelectPicker, Table } from 'rsuite';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { weiToKAI } from '../../../../common/utils/amount';
import { onlyNumber, numberFormat, onlyInteger } from '../../../../common/utils/number';
import { renderHashToRedirect } from '../../../../common/utils/string';
import { isValidator, updateValidator } from '../../../../service/smc/staking';
import { getAccount } from '../../../../service/wallet';
import './validators.css'
import ValidatorCreate from './ValidatorCreate';
import Button from '../../../../common/components/Button';
import { useViewport } from '../../../../context/ViewportContext';
import { gasLimitDefault, gasPriceOption } from '../../../../common/constant';
import Helper from '../../../../common/components/Helper';
import { HelperMessage } from '../../../../common/constant/HelperMessage';
import { getValidator } from '../../../../service/kai-explorer';
import { TABLE_CONFIG } from '../../../../config';
import TablePagination from 'rsuite/lib/Table/TablePagination';

const { Column, HeaderCell, Cell } = Table;

const YourDelegators = () => {

    const { isMobile } = useViewport()
    const [isLoading, setIsLoading] = useState(false)
    const [isVal, setIsVal] = useState(false);
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<Validator>()
    const myAccount = getAccount() as Account

    const [commissionRate, setCommissionRate] = useState('')
    const [minSelfDelegation, setMinSelfDelegation] = useState('')
    const [commissionRateErr, setCommissionRateErr] = useState('')
    const [minSelfDelegationErr, setMinSelfDelegationErr] = useState('')

    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [hashTransaction, setHashTransaction] = useState('')
    const [statePending, setStatePending] = useState(true)
    const [updateValErrMsg, setUpdateValErrMsg] = useState('')


    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitDefault)
    const [gasLimitErr, setGasLimitErr] = useState('')
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [limit, setLimit] = useState(TABLE_CONFIG.limitDefault)

    const validateCommissionRate = (value: any) => {
        if (!value) {
            setCommissionRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(value) === 0) {
            setCommissionRateErr(ErrorMessage.ValueInvalid)
            return false
        }

        // The commission value cannot be more than 100%
        if (Number(value) > 100) {
            setCommissionRateErr(ErrorMessage.CommissionRateMoreThanHundred)
            return false
        }
        setCommissionRateErr('')
        return true
    }

    const validateMinSelfDelegation = (value: any) => {
        if (!value) {
            setMinSelfDelegationErr(ErrorMessage.Require)
            return false
        }
        if (Number(value) === 0) {
            setMinSelfDelegationErr(ErrorMessage.ValueInvalid)
            return false
        }
        
        if (Number(value) < 10000000) {
            setMinSelfDelegationErr(ErrorMessage.MinSelfDelegationBelowMinimum)
            return false
        }

        setMinSelfDelegationErr('')
        return true
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

    const submitUpdateValidator = () => {
        if (!validateGasLimit(gasLimit) || !validateGasPrice(gasPrice) || !validateCommissionRate(commissionRate) || !validateMinSelfDelegation(minSelfDelegation)) {
            return
        }
        setShowConfirmModal(true)
    }

    const update = async () => {
        setHashTransaction('')
        try {
            setIsLoading(true)
            let validator = await updateValidator(Number(commissionRate), Number(minSelfDelegation), myAccount);
            if (validator && validator.status === 1) {
                Alert.success('Update validator success.')
                setHashTransaction(validator.transactionHash)
                reFetchData();
            } else {
                setUpdateValErrMsg('Update validator failed.');
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                setUpdateValErrMsg(`Update validator failed: ${errJson?.error?.message}`)
            } catch (error) {
                setUpdateValErrMsg('Update validator failed.');
            }
        }
        resetForm();
        setIsLoading(false)
        setShowConfirmModal(false)
    }

    const resetForm = () => {
        setCommissionRate('')
        setMinSelfDelegation('')
    }

    useEffect(() => {
        (async () => {
            const isVal = await isValidator(myAccount.publickey);
            setIsVal(isVal)
            setStatePending(false)
            if (isVal) {
                const val = await getValidator(myAccount.publickey, page, limit);
                setValidator(val)
                setDelegators(val.delegators)
            }
        })();
    }, [myAccount.publickey, page, limit]);

    const reFetchData = async () => {
        const val = await getValidator(myAccount.publickey, page, limit);
        setValidator(val)
        setDelegators(val.delegators)
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
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                            <div className="val-info-container">
                                <div className="block-title" style={{ padding: '0px 5px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon className="highlight" icon="user-info" size={"2x"} />
                                        <p style={{ marginLeft: '12px' }} className="title">Validator information</p>
                                    </div>
                                </div>
                                <Panel shaded>
                                    <List>
                                        <List.Item>
                                            <span className="property-title">Validator address: </span>
                                            <span className="property-content">
                                                {
                                                    renderHashToRedirect({
                                                        hash: validator?.address,
                                                        headCount: isMobile ? 20 : 30,
                                                        tailCount: 4,
                                                        showTooltip: true,
                                                        callback: () => { window.open(`/address/${validator?.address}`) }
                                                    })
                                                }
                                            </span>
                                        </List.Item>
                                        <List.Item>
                                            <Helper style={{ marginRight: 5 }} info={HelperMessage.CommissionRate} />
                                            <span className="property-title">Commission: </span>
                                            <span className="property-content">
                                                {numberFormat(validator?.commissionRate || 0, 2)} %
                                            </span>
                                        </List.Item>
                                        <List.Item bordered={false}>
                                            <Helper style={{ marginRight: 5 }} info={HelperMessage.MaxRate} />
                                            <span className="property-title">Max Commission Rate: </span>
                                            <span className="property-content">
                                                {numberFormat(validator?.maxRate || 0, 2)} %
                                            </span>
                                        </List.Item>
                                        <List.Item bordered={false}>
                                            <Helper style={{ marginRight: 5 }} info={HelperMessage.MaxChangeRate} />
                                            <span className="property-title">Max Change Commission Rate: </span>
                                            <span className="property-content">
                                                {numberFormat(validator?.maxChangeRate || 0, 2)} %
                                            </span>
                                        </List.Item>
                                        <List.Item>
                                            <span className="property-title">Total delegator: </span>
                                            <span className="property-content">
                                                {numberFormat(validator?.totalDelegators || 0)}
                                            </span>
                                        </List.Item>
                                        <List.Item>
                                            <span className="property-title">Total staked amount: </span>
                                            <span className="property-content">
                                                {numberFormat(weiToKAI(validator?.stakedAmount || 0))} KAI
                                            </span>
                                        </List.Item>
                                    </List>
                                    <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                                        <Button size="big"
                                            onClick={() => { setShowUpdateForm(!showUpdateForm) }}
                                            className="kai-button-gray"
                                        >
                                            Update Validator  <Icon icon={showUpdateForm ? "angle-up" : "angle-down"} />
                                        </Button>
                                    </div>
                                    {
                                        showUpdateForm ? (
                                            <Form fluid>
                                                <FormGroup>
                                                    <FlexboxGrid>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} style={{ marginBottom: 15 }}>
                                                            <ControlLabel>Gas Limit <span className="required-mask">(*)</span></ControlLabel>
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
                                                            <ControlLabel>Gas Price <span className="required-mask">(*)</span></ControlLabel>
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
                                                            <ControlLabel>New Commission Rate (%)  <span className="required-mask">(*)</span></ControlLabel>
                                                            <FormControl placeholder="Commission Rate"
                                                                name="commissionRate"
                                                                value={commissionRate}
                                                                onChange={(value) => {
                                                                    if (onlyNumber(value)) {
                                                                        setCommissionRate(value)
                                                                        validateCommissionRate(value)
                                                                    }
                                                                }} />
                                                            <ErrMessage message={commissionRateErr} />
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                                                            <ControlLabel>New Minimum Delegate Amount (KAI) <span className="required-mask">(*)</span></ControlLabel>
                                                            <FormControl placeholder="New Minimum Expected Delegate Amount"
                                                                name="minSelfDelegation"
                                                                value={minSelfDelegation}
                                                                onChange={(value) => {
                                                                    if (onlyNumber(value)) {
                                                                        setMinSelfDelegation(value)
                                                                        validateMinSelfDelegation(value)
                                                                    }
                                                                }} />
                                                            <ErrMessage message={minSelfDelegationErr} />
                                                        </FlexboxGrid.Item>
                                                    </FlexboxGrid>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Button size="big" onClick={submitUpdateValidator}>Update</Button>
                                                </FormGroup>
                                                <ErrMessage message={updateValErrMsg} />
                                                {
                                                    hashTransaction ? <div style={{ marginTop: '20px', wordBreak: 'break-all' }}> Transaction update validator: {renderHashToRedirect({ hash: hashTransaction, headCount: 100, tailCount: 4, showTooltip: false, callback: () => { window.open(`/tx/${hashTransaction}`) } })}</div> : <></>
                                                }
                                            </Form>
                                        ) : <></>
                                    }
                                </Panel>
                            </div>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                            <div className="del-list-container">
                                <div className="block-title" style={{ padding: '0px 5px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon className="highlight" icon="people-group" size={"2x"} />
                                        <p style={{ marginLeft: '12px' }} className="title">Your Delegators</p>
                                    </div>
                                </div>
                                <Panel shaded>
                                    <Table
                                        hover={false}
                                        autoHeight
                                        rowHeight={60}
                                        data={delegators}
                                    >
                                        <Column flexGrow={2} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                            <HeaderCell>Delegator address</HeaderCell>
                                            <Cell>
                                                {(rowData: Delegator) => {
                                                    return (
                                                        <div>
                                                            {
                                                                renderHashToRedirect({
                                                                    hash: validator?.address,
                                                                    headCount: isMobile ? 15 : 30,
                                                                    tailCount: 4,
                                                                    showTooltip: true,
                                                                    callback: () => { window.open(`/address/${validator?.address}`) }
                                                                })
                                                            }
                                                        </div>
                                                    );
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column flexGrow={2} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                            <HeaderCell>Staked Amount</HeaderCell>
                                            <Cell>
                                                {(rowData: Delegator) => {
                                                    return (
                                                        <div> {numberFormat(weiToKAI(rowData.stakeAmount))} KAI</div>
                                                    );
                                                }}
                                            </Cell>
                                        </Column>
                                    </Table>
                                    <TablePagination
                                        lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                                        activePage={page}
                                        displayLength={limit}
                                        total={delegators?.length}
                                        onChangePage={setPage}
                                        onChangeLength={setLimit}
                                    />
                                </Panel>
                            </div>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                    {/* Modal confirm when create validator */}
                    <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
                        <Modal.Header>
                            <Modal.Title>Confirm update validator</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>Are you sure you want to update validator with: </div>
                            <div>Your Address: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {myAccount.publickey} </span></div>
                            <div>New Commission Rate: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {numberFormat(commissionRate)} %</span></div>
                            <div>New Minimum Delegate Amount: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {numberFormat(minSelfDelegation)} KAI</span></div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => { setShowConfirmModal(false) }} className="kai-button-gray">
                                Cancel
                            </Button>
                            <Button loading={isLoading} onClick={update}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )
    ) : (<></>)
}

export default YourDelegators;