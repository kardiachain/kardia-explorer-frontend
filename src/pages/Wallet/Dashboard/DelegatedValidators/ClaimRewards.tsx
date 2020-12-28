import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Table } from 'rsuite';
import Button from '../../../../common/components/Button';
import { StakingIcon } from '../../../../common/components/IconCustom';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import { NotifiMessage } from '../../../../common/constant/Message';
import { weiToKAI } from '../../../../common/utils/amount';
import { numberFormat } from '../../../../common/utils/number';
import { renderHashStringAndTooltip } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { withdrawReward } from '../../../../service/smc/staking';
import { getAccount } from '../../../../service/wallet';

const { Column, HeaderCell, Cell } = Table;

const ClaimRewards = ({ yourValidators, reFetchData }: {
    yourValidators: YourValidator[];
    reFetchData: () => void;
}) => {
    const { isMobile } = useViewport();
    const [showConfirmWithdrawRewardsModal, setShowConfirmWithdrawRewardsModal] = useState(false);
    const [validatorActive, setValidatorActive] = useState<YourValidator>();
    const [isLoading, setIsLoading] = useState(false);
    const myAccount = getAccount() as Account

    const withdrawRewards = async () => {
        setIsLoading(true)
        try {
            const valSmcAddr = validatorActive?.validatorSmcAddr || '';
            if (!valSmcAddr) return;

            const result = await withdrawReward(valSmcAddr, myAccount);
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
        await reFetchData()
        setIsLoading(false)
        setShowConfirmWithdrawRewardsModal(false)
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
                <Column flexGrow={2} minWidth={200} verticalAlign="middle">
                    <HeaderCell><span style={{marginLeft: 50}}>Validator</span></HeaderCell>
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
                                            <div className="validator-name color-white">{rowData.validatorName}</div>
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
                    <HeaderCell>Staked Amount (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>{numberFormat(weiToKAI(rowData.yourStakeAmount), 2)}</div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={1} minWidth={150} verticalAlign="middle">
                    <HeaderCell>Claimable Rewards (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>{numberFormat(weiToKAI(rowData.claimableAmount), 2)}</div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={200} verticalAlign="middle">
                    <HeaderCell></HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <Button className="kai-button-gray" onClick={() => {
                                    setShowConfirmWithdrawRewardsModal(true)
                                    setValidatorActive(rowData)
                                }}>Claim Rewards
                                </Button>
                            )
                        }}
                    </Cell>
                </Column>
            </Table>
            {/* Modal confirm when withdraw rewards */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmWithdrawRewardsModal} onHide={() => { setShowConfirmWithdrawRewardsModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter" style={{ textAlign: 'center' }}>
                        Are you sure you want to withdraw all your rewarded token.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setShowConfirmWithdrawRewardsModal(false) }} className="kai-button-gray">
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={withdrawRewards} >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ClaimRewards;