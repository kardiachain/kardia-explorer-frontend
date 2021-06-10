import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Modal, Table } from 'rsuite';
import walletState from '../../../../atom/wallet.atom';
import {
    renderHashStringAndTooltip,
    renderStringAndTooltip,
    StakingIcon,
    InforMessage,
    weiToKAI,
    numberFormat,
    Button,
    ShowNotify,
    ShowNotifyErr
} from '../../../../common';
import { useViewport } from '../../../../context/ViewportContext';
import { withdrawRewardByEW, isExtensionWallet } from '../../../../service';
import { withdrawReward } from '../../../../service';
import { useTranslation } from 'react-i18next';

const { Column, HeaderCell, Cell } = Table;

const ClaimRewards = ({ yourValidators, reFetchData }: {
    yourValidators: YourValidator[];
    reFetchData: () => void;
}) => {
    const { isMobile } = useViewport();
    const [showConfirmWithdrawRewardsModal, setShowConfirmWithdrawRewardsModal] = useState(false);
    const [validatorActive, setValidatorActive] = useState<YourValidator>();
    const [isLoading, setIsLoading] = useState(false);
    const walletLocalState = useRecoilValue(walletState)
    const { t } = useTranslation()

    const withdrawRewards = async () => {
        setIsLoading(true)
        try {
            const valSmcAddr = validatorActive?.validatorSmcAddr || '';
            if (!valSmcAddr) return;

            if (isExtensionWallet()) {
                // Case: claim reward interact with Kai Extension Wallet
                setIsLoading(true)
                await withdrawRewardByEW(valSmcAddr)
                await reFetchData()
                setShowConfirmWithdrawRewardsModal(false)
                setIsLoading(false)
                return
            }
            const result = await withdrawReward(valSmcAddr, walletLocalState.account);
            ShowNotify(result)
        } catch (error) {
            ShowNotifyErr(error)
        }
        setIsLoading(false)
        setShowConfirmWithdrawRewardsModal(false)
        setValidatorActive({} as YourValidator)
        await reFetchData()
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
                <Column flexGrow={2} minWidth={250} verticalAlign="middle">
                    <HeaderCell><span style={{ marginLeft: 50 }}>{t('validator')}</span></HeaderCell>
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
                                            <div className="validator-name">
                                                {
                                                    renderStringAndTooltip({
                                                        str: rowData.validatorName,
                                                        headCount: isMobile ? 12 : 20,
                                                        showTooltip: true
                                                    })
                                                }
                                            </div>
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
                    <HeaderCell>{t('stakedAmount')} (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: YourValidator) => {
                            return (
                                <div>{numberFormat(weiToKAI(rowData.yourStakeAmount), 2)}</div>
                            )
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={1} minWidth={150} verticalAlign="middle">
                    <HeaderCell>{t('claimableRewards')} (KAI)</HeaderCell>
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
                                }}>{t('claimRewards')}
                                </Button>
                            )
                        }}
                    </Cell>
                </Column>
            </Table>
            {/* Modal confirm when withdraw rewards */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmWithdrawRewardsModal} onHide={() => { setShowConfirmWithdrawRewardsModal(false) }}>
                <Modal.Header>
                    <Modal.Title>{t('confirmation')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter" style={{ textAlign: 'center' }}>
                        {t('InforMessage.ClaimRewardConfirm')}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setShowConfirmWithdrawRewardsModal(false) }} className="kai-button-gray">
                        {t('cancel')}
                    </Button>
                    <Button loading={isLoading} onClick={withdrawRewards} >
                        {t('confirm')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ClaimRewards;