import React, { useState } from 'react';
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal } from 'rsuite';
import Button from '../../common/components/Button';
import ErrMessage from '../../common/components/InputErrMessage/InputErrMessage';
import { useSetRecoilState } from 'recoil';
import { ErrorMessage } from '../../common/constant/Message';
import walletState from '../../atom/wallet.atom';
import './wallet.css'

const CreateNewPassword = ({ showModal, setShowModal }: {
    showModal: boolean;
    setShowModal: (isShow: boolean) => void;
}) => {

    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordErr, setConfirmPasswordErr] = useState('')

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

    const createNewPassword = () => {
        if (!validatePass(password) || !validatePassConfirm(confirmPassword)) {
            return false
        }
        setWalletState({
            password: password,
            stateExist: true,
            account: {} as Account
        } as WalletState)
        setShowModal(false)
    }

    return (
        <Modal backdrop="static" size="xs" enforceFocus={true} show={showModal}>
            <Modal.Header closeButton={false}>
                <Modal.Title>Create New Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                <FlexboxGrid>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} style={{marginBottom: 10}}>
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
                                </FlexboxGrid>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FormGroup>
                </Form>
                </div>
            </Modal.Body>
            <Modal.Footer style={{textAlign: 'center'}}>
                <Button onClick={createNewPassword}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateNewPassword;