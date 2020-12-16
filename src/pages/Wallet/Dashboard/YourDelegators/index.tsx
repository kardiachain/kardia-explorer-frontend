import React, { useEffect, useState } from 'react'
import { Col, FlexboxGrid, Icon, List, Modal, Panel, Table, Tag } from 'rsuite';
import { weiToKAI } from '../../../../common/utils/amount';
import { numberFormat } from '../../../../common/utils/number';
import { renderHashToRedirect } from '../../../../common/utils/string';
import { getAccount } from '../../../../service/wallet';
import './validators.css'
import ValidatorCreate from './ValidatorCreate';
import Button from '../../../../common/components/Button';
import { useViewport } from '../../../../context/ViewportContext';
import Helper from '../../../../common/components/Helper';
import { HelperMessage } from '../../../../common/constant/HelperMessage';
import { checkIsValidator, getValidator } from '../../../../service/kai-explorer';
import { TABLE_CONFIG } from '../../../../config';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { startValidator } from '../../../../service/smc/staking';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage, NotifiMessage } from '../../../../common/constant/Message';
import { MIN_STAKED_AMOUNT_START_VALIDATOR } from '../../../../common/constant';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import UpdateValidator from './UpdateValidator';

const { Column, HeaderCell, Cell } = Table;

const YourDelegators = () => {

    const { isMobile } = useViewport();
    const [isVal, setIsVal] = useState(false);
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<Validator>();
    const myAccount = getAccount() as Account;

    const [statePending, setStatePending] = useState(true)
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [limit, setLimit] = useState(TABLE_CONFIG.limitDefault)
    const [tableLoading, setTableLoading] = useState(true);
    const [startValErr, setStartValErr] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [showConfirmModel, setShowConfirmModal] = useState(false);

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

    const startBecomeValidator = async () => {
        if (Number(weiToKAI(validator?.stakedAmount)) < MIN_STAKED_AMOUNT_START_VALIDATOR) {
            setStartValErr(ErrorMessage.StakedAmountNotEnough);
            return false;
        }
        setShowConfirmModal(true)
        setStartValErr('');
    }

    // @Function using for starting become validator
    const confirmStart = async () => {
        try {
            setBtnLoading(true);
            const valSmcAddr = validator?.smcAddress || "";
            if (!valSmcAddr) {
                setBtnLoading(false);
                return false;
            }

            const result = await startValidator(valSmcAddr, myAccount);
            if (result && result.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess
                });
                setTxHash(result.transactionHash);

            } else {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                });
            } catch (error) {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        }
        setBtnLoading(false);
        setShowConfirmModal(false);
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
                                    <UpdateValidator validator={validator || {} as Validator}/>
                                    <List>
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
                                                        <span className="property-title">Title </span>
                                                    </div>
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                                    <div className="property-content">
                                                        <Tag className={validator?.status.color}>
                                                            {validator?.status.content}
                                                        </Tag>
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
                                    {/* <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                                        <Button size="big"
                                            onClick={() => { setShowUpdateForm(!showUpdateForm) }}
                                            className="kai-button-gray"
                                        >
                                            Update Validator  <Icon icon={showUpdateForm ? "angle-up" : "angle-down"} />
                                        </Button>
                                    </div>
                                    {
                                        showUpdateForm ? <UpdateValidator /> : <></>
                                    } */}
                                    {
                                        validator?.isRegister ? (
                                            <>
                                                <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                                                    <Button size="big"
                                                        onClick={startBecomeValidator}
                                                    >
                                                        Start To Become Validator
                                                    </Button>
                                                    <ErrMessage message={startValErr} />
                                                </div>
                                                {
                                                    txHash ? <div style={{ marginTop: '20px', wordBreak: 'break-all' }}>Tx start validator: {renderHashToRedirect({ hash: txHash, headCount: 100, tailCount: 4, showTooltip: false, callback: () => { window.open(`/tx/${txHash}`) } })}</div> : <></>
                                                }
                                            </>
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
                                                                    hash: rowData?.address,
                                                                    headCount: isMobile ? 15 : 30,
                                                                    tailCount: 4,
                                                                    showTooltip: true,
                                                                    callback: () => { window.open(`/address/${rowData?.address}`) }
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
                                                        <div> {numberFormat(weiToKAI(rowData.stakeAmount), 4)} KAI</div>
                                                    );
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column flexGrow={2} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                            <HeaderCell>Claimable Rewards</HeaderCell>
                                            <Cell>
                                                {(rowData: Delegator) => {
                                                    return (
                                                        <div> {numberFormat(weiToKAI(rowData.rewardsAmount), 4)} KAI</div>
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

                    {/* Modal confirm when withdraw staked token */}
                    <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModel} onHide={() => { setShowConfirmModal(false) }}>
                        <Modal.Header>
                            <Modal.Title>Confirm starting to become validator</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>
                                Are you sure you want to starting to become validator.
                    </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button loading={btnLoading} onClick={confirmStart}>
                                Confirm
                    </Button>
                            <Button className="kai-button-gray" onClick={() => { setShowConfirmModal(false) }}>
                                Cancel
                    </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )
    ) : (<></>)
}

export default YourDelegators;