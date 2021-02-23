import React, { useState } from 'react';
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Panel } from 'rsuite';
import Button from '../../common/components/Button';
import ErrMessage from '../../common/components/InputErrMessage/InputErrMessage';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ErrorMessage } from '../../common/constant/Message';
import walletState from '../../atom/wallet.atom';
import './wallet.css'
import { useHistory } from 'react-router-dom';
import languageAtom from '../../atom/language.atom';
import { getLanguageString } from '../../common/utils/lang';

const CreateNewPassword = ({ show, setShow }: {
    show: boolean;
    setShow: (isShow: boolean) => void;
}) => {

    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordErr, setConfirmPasswordErr] = useState('')
    const history = useHistory()
    const language = useRecoilValue(languageAtom)

    const setWalletState = useSetRecoilState(walletState)

    const validatePass = (pass: string) => {
        if (!pass) {
            setPasswordErr(ErrorMessage.Require)
            return false
        }

        if (pass.length < 8) {
            setPasswordErr(ErrorMessage.PassWordNotLongEnough)
            return false
        }

        setPasswordErr('')

        if (confirmPassword && confirmPassword !== pass) {
            setConfirmPasswordErr(ErrorMessage.ConfirmPasswordNotMatch)
            return false
        }

        setConfirmPasswordErr('')
        return true;
    }

    const validatePassConfirm = (passConfirm: string) => {
        if (!passConfirm) {
            setConfirmPasswordErr(ErrorMessage.Require)
            return false
        }

        if (passConfirm !== password) {
            setConfirmPasswordErr(ErrorMessage.ConfirmPasswordNotMatch)
            return false
        }

        setConfirmPasswordErr('')
        return true
    }

    const createNewPassword = () => {
        if (!validatePass(password) || !validatePassConfirm(confirmPassword)) {
            return false
        }
        setWalletState({
            password: password,
            account: {} as Account
        } as WalletState)
        setShow(false)
    }

    return (
        <div className="create-password-container">
            <Form fluid>
                <FormGroup>
                    <FlexboxGrid justify="center" className="wrap">
                        <FlexboxGrid.Item componentclass={Col} colspan={22} sm={24} >
                            <Panel shaded className="panel-bg-gray">
                                <FlexboxGrid justify="center" style={{ marginBottom: 20 }}>
                                    <h2 className="color-white" style={{ fontSize: 20 }}>{getLanguageString(language, 'CREATE_A_NEW_PASSCODE', 'TEXT')}</h2>
                                </FlexboxGrid>
                                <FlexboxGrid style={{ marginBottom: 20 }}>
                                    <div style={{ padding: '0 5px' }}>
                                        <div className="createpass-note">
                                            <b>{getLanguageString(language, 'WHAT_IS_A_PASSCODE', 'MESSAGE')}</b> <br />
                                            <span>{getLanguageString(language, 'WHAT_IS_A_PASSCODE_ANSWER', 'MESSAGE')}</span> <br />
                                            <b>{getLanguageString(language, 'WHAT_IF_I_LOSE_MY_PASSCODE', 'MESSAGE')}</b> <br />
                                            <span>{getLanguageString(language, 'WHAT_IF_I_LOSE_MY_PASSCODE_ANSWER', 'MESSAGE')}</span>
                                        </div>
                                    </div>
                                </FlexboxGrid>
                                <FlexboxGrid>
                                    <FlexboxGrid.Item componentclass={Col} colspan={24} sm={24} style={{ marginBottom: 10 }}>
                                        <ControlLabel className="color-white">{getLanguageString(language, 'NEW_PASSCODE_REQUIRED', 'LABEL')}</ControlLabel>
                                        <FormControl
                                            name="password"
                                            type="password"
                                            className="input"
                                            value={password}
                                            onChange={(value) => {
                                                validatePass(value)
                                                setPassword(value)
                                            }}
                                        />
                                        <ErrMessage message={passwordErr} />
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentclass={Col} colspan={24} sm={24}>
                                        <ControlLabel className="color-white">{getLanguageString(language, 'CONFIRM_PASSCODE_REQUIRED', 'LABEL')}</ControlLabel>
                                        <FormControl
                                            name="confirmPassword"
                                            type="password"
                                            className="input"
                                            value={confirmPassword}
                                            onChange={(value) => {
                                                validatePassConfirm(value)
                                                setConfirmPassword(value)
                                            }}
                                        />
                                        <ErrMessage message={confirmPasswordErr} />
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid justify="center" style={{ margin: '30px auto 20px auto' }}>
                                        <Button className="kai-button-gray" size="big" onClick={() => { history.push('/access-wallet') }}>
                                            {getLanguageString(language, 'BACK', 'BUTTON')}
                                        </Button>
                                        <Button className="btn-access" size="big" onClick={createNewPassword} >
                                            {getLanguageString(language, 'CREATE', 'BUTTON')}
                                        </Button>
                                    </FlexboxGrid>
                                </FlexboxGrid>
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </FormGroup>
            </Form>
        </div>
    )
}

export default CreateNewPassword;