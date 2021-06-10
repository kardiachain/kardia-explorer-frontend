import React, { useState } from 'react'
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal } from 'rsuite'
import { ErrorMessage, ErrMessage, Button } from '../../common';
import { getAccount, getPkByPassword, logoutWallet } from '../../service';
import { useRecoilState } from 'recoil';
import walletState from '../../atom/wallet.atom';
import './wallet.css'
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ConfirmPassword = ({ showModal, setShowModal }: {
    showModal: boolean;
    setShowModal: (isShow: boolean) => void;
}) => {
    const { t } = useTranslation()

    const history = useHistory()
    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const myAccount: Account = getAccount();

    const [walletLocalState, setWalletState] = useRecoilState(walletState)

    const validatePass = (pass: string) => {
        if (!pass) {
            setPasswordErr(ErrorMessage.Require)
            return false;
        }
        setPasswordErr('')
        return true
    }

    const confirmPassword = () => {
        if (!validatePass(password)) {
            return
        }
        // Verify confirm password
        const pk = getPkByPassword(password)
        if (!pk) {
            setPasswordErr(ErrorMessage.PasswordIncorrect)
            return
        }
        let newWalletState: WalletState = { ...walletLocalState };
        newWalletState.account = {
            privatekey: pk,
            publickey: myAccount.publickey
        } as Account;

        setWalletState(newWalletState)
        setShowModal(false)
    }

    const resetPassword = () => {
        logoutWallet()
        setWalletState({} as WalletState)
        history.push('/wallet-login')
    }

    return (
        <Modal backdropClassName="password-modal" backdrop="static" size="xs" enforceFocus={true} show={showModal}>
            <Modal.Header closeButton={false}>
                <Modal.Title>{t('verifyPassword.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form fluid>
                        <FormGroup>
                            <FlexboxGrid>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} style={{ marginBottom: 10 }}>
                                            <ControlLabel className="color-white">{t('verifyPassword.passcode')}</ControlLabel>
                                            <FormControl
                                                name="password"
                                                type="password"
                                                className="input"
                                                value={password}
                                                onChange={(value) => {
                                                    validatePass(value)
                                                    setPassword(value)
                                                }}
                                                onKeyPress={(event: any) => {
                                                    if (event && event.charCode === 13) {
                                                        confirmPassword()
                                                    }
                                                }}
                                            />
                                            <ErrMessage message={passwordErr} />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                            <div className="color-white">
                                            {t('verifyPassword.forgot')}
                                                <span style={{
                                                    color: '#00C4F5',
                                                    cursor: 'pointer',
                                                }} onClick={resetPassword}> {t('verifyPassword.click')} </span>
                                                {t('verifyPassword.reset')}
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </FormGroup>
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ textAlign: 'center' }}>
                <Button className="kai-button-gray" onClick={() => {history.push('/')}}>
                {t('verifyPassword.backToHome')}
                </Button>
                <Button className="kai-button-violet-gradient" onClick={confirmPassword}>
                    {t('accessWallet.title')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmPassword;