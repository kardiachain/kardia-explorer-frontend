import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Panel, Icon, ControlLabel, Form, FormGroup, FormControl } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import './wallet.css';
import walletState from '../../atom/wallet.atom';
import { useRecoilState } from 'recoil';
import ErrMessage from '../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../common/constant/Message';
import Button from '../../common/components/Button';

const Wallet = () => {
    let history = useHistory();

    const { isMobile } = useViewport()
    const [showCreateNewPin, setShowCreateNewPin] = useState(true);

    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordErr, setConfirmPasswordErr] = useState('')

    const [walletLocalState, setWalletState] = useRecoilState(walletState)

    const validatePass = (pass: string) => {
        if (!pass) {
            setPasswordErr(ErrorMessage.Require)
            return false
        }

        if (pass.length < 8) {
            setPasswordErr(ErrorMessage.PassWordNotLongEnough)
            return false
        }

        if (confirmPassword && confirmPassword !== pass) {
            setConfirmPasswordErr(ErrorMessage.ConfirmPasswordNotMatch)
            return false
        }

        setConfirmPasswordErr('')
        setPasswordErr('')
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

    useEffect(() => {
        if (walletLocalState && walletLocalState.stateExist) {
            setShowCreateNewPin(false);
        } else {
            setShowCreateNewPin(true);
        }
    }, [walletLocalState])

    const createNewPassword = () => {
        if (!validatePass(password) || !validatePassConfirm(confirmPassword)) {
            return false
        }
        setWalletState({
            password: password,
            stateExist: true,
            account: {} as Account
        } as WalletState)
    }

    return (
        <>
            {
                !showCreateNewPin ? (
                    <div className="wallet-container" style={{ marginTop: isMobile ? 40 : 80 }}>
                        <div className="show-grid">
                            <FlexboxGrid justify="center">
                                <FlexboxGrid.Item componentClass={Col} colspan={22} md={9} sm={24}>
                                    <div className="panel-container create">
                                        <Panel shaded onClick={() => { history.push('/create-wallet') }}>
                                            <FlexboxGrid justify="center">
                                                <FlexboxGrid.Item componentClass={Col} colspan={22} md={24} className="text-container">
                                                    <div className="icon-container">
                                                        <Icon icon="cogs" size="lg" />
                                                    </div>
                                                    {
                                                        isMobile ? <h3>Create a new wallet</h3> : <h2>Create a new wallet</h2>
                                                    }
                                                    <p>Our user-friendly application will enable wallet creation and user's interaction with Kardiachain</p>
                                                    <div className="move">Get Started &nbsp;&nbsp;&nbsp; <Icon icon="long-arrow-right" /></div>
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </Panel>
                                    </div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={22} md={9} sm={24}>
                                    <div className="panel-container access">
                                        <Panel shaded onClick={() => { history.push('/access-wallet') }}>
                                            <FlexboxGrid justify="center">
                                                <FlexboxGrid.Item componentClass={Col} colspan={22} md={24} className="text-container">
                                                    <div className="icon-container">
                                                        <Icon icon="character-area" size="lg" />
                                                    </div>
                                                    {
                                                        isMobile ? <h3>Access my wallet</h3> : <h2>Access my wallet</h2>
                                                    }
                                                    <p>Send your KAI and interact with Kardiachain blockchain platform</p>
                                                    <div className="move">Access Now &nbsp;&nbsp;&nbsp; <Icon icon="long-arrow-right" /></div>
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </Panel>
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </div>
                    </div>
                ) : (
                        <div className="create-password-container">
                            <Form fluid>
                                <FormGroup>
                                    <FlexboxGrid justify="center" className="wrap">
                                        <FlexboxGrid.Item componentClass={Col} colspan={22} >
                                            <Panel shaded className="panel-bg-gray">
                                                <FlexboxGrid justify="center" style={{ marginBottom: 20 }}>
                                                    <h2 className="color-white" style={{ fontSize: 20 }}>Create New Password</h2>
                                                </FlexboxGrid>
                                                <FlexboxGrid>
                                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} style={{ marginBottom: 10 }}>
                                                        <ControlLabel className="color-white">New Password (min 8 chars) (required)</ControlLabel>
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
                                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                                        <ControlLabel className="color-white">Confirm Password (required)</ControlLabel>
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
                                                        <Button className="btn-access" size="big" onClick={createNewPassword} >Create</Button>
                                                    </FlexboxGrid>
                                                </FlexboxGrid>
                                            </Panel>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </FormGroup>
                            </Form>
                        </div>
                    )}
        </>
    )
}

export default Wallet;