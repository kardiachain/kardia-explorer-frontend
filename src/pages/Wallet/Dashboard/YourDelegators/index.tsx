import React, { useEffect, useState } from 'react'
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, List, Modal, Panel, SelectPicker, Table, Tag } from 'rsuite';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { weiToKAI } from '../../../../common/utils/amount';
import { onlyNumber, numberFormat, onlyInteger } from '../../../../common/utils/number';
import { renderHashToRedirect } from '../../../../common/utils/string';
import { getAccount } from '../../../../service/wallet';
import './validators.css'
import ValidatorCreate from './ValidatorCreate';
import Button from '../../../../common/components/Button';
import { useViewport } from '../../../../context/ViewportContext';
import { gasLimitDefault, gasPriceOption } from '../../../../common/constant';
import Helper from '../../../../common/components/Helper';
import { HelperMessage } from '../../../../common/constant/HelperMessage';
import { checkIsValidator, getValidator } from '../../../../service/kai-explorer';
import { TABLE_CONFIG } from '../../../../config';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { updateValidator } from '../../../../service/smc/staking';

const { Column, HeaderCell, Cell } = Table;

const YourDelegators = () => {

    const { isMobile } = useViewport();
    const [isLoading, setIsLoading] = useState(false);
    const [isVal, setIsVal] = useState(false);
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<Validator>();
    const myAccount = getAccount() as Account;

    const [commissionRate, setCommissionRate] = useState('')
    const [minSelfDelegation, setMinSelfDelegation] = useState('')
    const [valName, setValName] = useState('')
    const [commissionRateErr, setCommissionRateErr] = useState('')
    const [minSelfDelegationErr, setMinSelfDelegationErr] = useState('')
    const [valNameErr, setValNameErr] = useState('')

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
    const [tableLoading, setTableLoading] = useState(true);

    const validateValName = (value: any) => {
        if (!value) {
            setValNameErr(ErrorMessage.Require);
            return false;
        }
        setValNameErr('');
        return true;
    }

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
            setIsLoading(true);

            const params: UpdateValParams = {
                valSmcAddr: validator?.smcAddress || '',
                newValName: valName,
                newCommissionRate: Number(commissionRate),
                newMinSelfDelegation: Number(minSelfDelegation)
            }

            let result = await updateValidator(params, myAccount, gasLimit, gasPrice);
            if (result && result.status === 1) {
                Alert.success('Update validator success.');
                setHashTransaction(result.transactionHash);
                reFetchData();
            } else {
                setUpdateValErrMsg('Update validator failed.');
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                setUpdateValErrMsg(`Update validator failed: ${errJson?.error?.message}`);
            } catch (error) {
                setUpdateValErrMsg('Update validator failed.');
            }
        }
        resetForm();
        setIsLoading(false);
        setShowConfirmModal(false);
    }

    const resetForm = () => {
        setCommissionRate('');
        setMinSelfDelegation('');
    }

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
            }
        })();
    }, [myAccount.publickey, page, limit]);

    const reFetchData = async () => {
        setTableLoading(true);
        const val = await getValidator(myAccount.publickey, page, limit);
        setValidator(val)
        setDelegators(val.delegators)
        setTableLoading(false);
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
                                    <List>
                                        <List.Item>
                                            <FlexboxGrid justify="start" align="middle">
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                                    <div className="property-title">Validator</div>
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                                    <div className="property-content validator-name">
                                                        {validator?.name} <Icon className="verify-proposer-icon" icon="check-circle" size={"lg"} />
                                                    </div>
                                                    <div className="property-content">
                                                        {
                                                            renderHashToRedirect({
                                                                hash: validator?.address,
                                                                headCount: 45,
                                                                tailCount: 4,
                                                                showTooltip: false,
                                                                showCopy: true,
                                                                callback: () => { window.open(`/validator/${validator?.address}`) }
                                                            })
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
                                                            renderHashToRedirect({
                                                                hash: validator?.smcAddress || '',
                                                                headCount: 45,
                                                                tailCount: 4,
                                                                showTooltip: false,
                                                                showCopy: true,
                                                                callback: () => { window.open(`/address/${validator?.smcAddress}`) }
                                                            })
                                                        }
                                                    </div>
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </List.Item>
                                        <List.Item>
                                            <FlexboxGrid justify="start" align="middle">
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                                    <div className="property-title">
                                                        <span className="property-title">Status </span>
                                                    </div>
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                                    <div className="property-content">
                                                        <Tag color="blue">Validated</Tag>
                                                        <Tag color="green">Registered</Tag>
                                                        <Tag color="violet">Proposer</Tag>
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
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
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
                                                                    <ControlLabel>New Validator Name <span className="required-mask">(*)</span></ControlLabel>
                                                                    <FormControl placeholder="Validator Name"
                                                                        name="valName"
                                                                        value={valName}
                                                                        onChange={(value) => {
                                                                            setValName(value)
                                                                            validateValName(value)
                                                                        }} />
                                                                    <ErrMessage message={valNameErr} />
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
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
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
                                        wordWrap
                                        loading={tableLoading}
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
                                        <Column flexGrow={2} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
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
                                    <TablePagination
                                        lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                                        activePage={page}
                                        displayLength={limit}
                                        total={validator?.totalDelegators}
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