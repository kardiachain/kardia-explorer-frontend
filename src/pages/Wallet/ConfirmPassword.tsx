import React, { useState } from 'react'
import { Col, FlexboxGrid, Form, FormControl, FormGroup, Modal } from 'rsuite'
import Button from '../../common/components/Button';
import ErrMessage from '../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../common/constant/Message';

const ConfirmPassword = ({ showModal, setShowModal }: {
    showModal: boolean;
    setShowModal: (isShow: boolean) => void;
}) => {

    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState('')

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
        setShowModal(false)
    }

    return (
        <Modal backdrop="static" size="xs" enforceFocus={true} show={showModal} onHide={() => { setShowModal(false) }}>
            <Modal.Header>
                <Modal.Title>Confirm Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form fluid>
                        <FormGroup>
                            <FlexboxGrid>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} style={{ marginBottom: 30 }}>
                                            <FormControl
                                                placeholder="Enter Password"
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
                                    </FlexboxGrid>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </FormGroup>
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="kai-button-gray" onClick={() => { setShowModal(false) }}>
                    Cancel
                </Button>
                <Button onClick={confirmPassword}>
                    Confirm
            </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmPassword;