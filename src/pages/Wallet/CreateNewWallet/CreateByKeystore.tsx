import React, { useState, useEffect } from 'react';
import { Col, FlexboxGrid, Form, FormControl, FormGroup, Panel, Icon, ControlLabel } from 'rsuite';
import Wallet from 'ethereumjs-wallet'
import { Link, useHistory } from 'react-router-dom';
import { ErrorMessage, ErrMessage, Button } from '../../../common';
import { isLoggedIn } from '../../../service';

const CreateByKeystore = () => {
    const [password, setPassword] = useState('');
    const [blobUrl, setBlobUrl] = useState('')
    const [keystoreFilename, setKeystoreFilename] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    let history = useHistory();

    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])

    const validatePassword = (pass: string) => {

        if (!pass) {
            setErrorMessage(ErrorMessage.Require)
            return false;
        }

        if (pass.length < 8) {
            setErrorMessage(ErrorMessage.PassWordNotLongEnough)
            return false;
        }

        setErrorMessage('')
        return true
    }

    const createWallet = async () => {
        if (!validatePassword(password)) {
            return;
        }

        setLoading(true)
        const wallet = Wallet.generate();
        const keystoreFilename = wallet.getV3Filename();
        const keystoreJson = await wallet.toV3(password);
        const keystoreJsonString = JSON.stringify(keystoreJson);
        const keystoreBlob = new Blob([keystoreJsonString], {
            type: 'mime',
        });
        setBlobUrl(window.URL.createObjectURL(keystoreBlob));
        setKeystoreFilename(keystoreFilename);
        setLoading(false)
    }

    const accessWallet = async () => {
        history.push('/access-wallet')
    }

    return (
        <div className="show-grid create-container">
            <FlexboxGrid justify="center" className="wrap">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel shaded className="panel-bg-gray">
                        <FlexboxGrid justify="start">
                            <h3 className="color-white">KEYSTORED FILE</h3>
                        </FlexboxGrid>
                        {
                            !blobUrl ? (
                                <FlexboxGrid justify="center">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ padding: 0 }}>
                                        <div className="text-container">
                                            <ControlLabel className="color-white">Key store password (minimum 8 characters) (required)</ControlLabel>
                                            <Form fluid>
                                                <FormGroup style={{ marginBottom: '12px' }}>
                                                    <FormControl
                                                        className="input"
                                                        name="password"
                                                        type="password"
                                                        value={password}
                                                        onChange={(value) => {
                                                            validatePassword(value)
                                                            setPassword(value)
                                                        }} />
                                                    <ErrMessage message={errorMessage} />
                                                </FormGroup>
                                                <div className="color-white">You will need <span className="note">BOTH</span>  your <span className="note">Password + Keystore File</span>  to access your wallet.</div>
                                            </Form>
                                        </div>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button size="big" className="kai-button-gray">Back</Button>
                                            </Link>
                                            <Button className="btn-access" size="big" loading={isLoading} onClick={createWallet}>Create wallet</Button>
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            ) : (
                                    <FlexboxGrid justify="center">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ padding: 0 }}>
                                            <div className="color-white">Please <span className="note">DOWNLOAD</span> and <span className="note">SAVE</span> the following Keystore File.</div>
                                            <div className="color-white"> You will need it and <span className="note">your password</span> to access your wallet.</div>
                                            <div className="download-keystore-file">
                                                <a href={blobUrl} download={keystoreFilename}>
                                                    <Icon icon="download" size={"lg"} /> Download Keystore
                                            </a>
                                            </div>
                                            <div className="button-container">
                                                <Link to="/create-wallet">
                                                    <Button size="big" className="kai-button-gray">Back</Button>
                                                </Link>
                                                <Button className="btn-access" size="big" onClick={accessWallet}>Access now</Button>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                )
                        }
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default CreateByKeystore;
