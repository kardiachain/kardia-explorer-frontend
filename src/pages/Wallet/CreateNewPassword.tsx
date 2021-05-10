import React, { useState } from 'react';
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Panel } from 'rsuite';
import { useSetRecoilState } from 'recoil';
import { ErrorMessage, Button, ErrMessage } from '../../common';
import walletState from '../../atom/wallet.atom';
import './wallet.css'
import { useHistory } from 'react-router-dom';

const CreateNewPassword = ({ show, setShow }: {
    show: boolean;
    setShow: (isShow: boolean) => void;
}) => {

    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordErr, setConfirmPasswordErr] = useState('')
    const history = useHistory()

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
                                    <h2 className="color-white" style={{ fontSize: 20 }}>Create A New Pass Code</h2>
                                </FlexboxGrid>
                                <FlexboxGrid style={{ marginBottom: 20 }}>
                                    <div style={{ padding: '0 5px' }}>
                                        <div className="createpass-note">
                                            <b>What is a pass code?</b> <br />
                                            <span>Pass Code is a protection layer that prevents others from accessing your wallet.</span> <br />
                                            <b>What if I lose my Pass Code?</b> <br />
                                            <span>Remove the old pass code and create a new one, you will then have access to your wallet again</span>
                                        </div>
                                    </div>
                                </FlexboxGrid>
                                <FlexboxGrid>
                                    <FlexboxGrid.Item componentclass={Col} colspan={24} sm={24} style={{ marginBottom: 10 }}>
                                        <ControlLabel className="color-white">New Pass Code (minimum 8 characters) (required)</ControlLabel>
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
                                        <ControlLabel className="color-white">Confirm Pass Code (required)</ControlLabel>
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
                                            Back
                                        </Button>
                                        <Button className="btn-access" size="big" onClick={createNewPassword} >Create</Button>
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