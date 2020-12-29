import React, { useState, useEffect } from 'react';
import { Col, FlexboxGrid, Form, FormControl, FormGroup, Panel, Icon } from 'rsuite';
import Wallet from 'ethereumjs-wallet'
import { useWalletStorage } from '../../../service/wallet';
import { Link, useHistory } from 'react-router-dom';
import ErrMessage from '../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../common/constant/Message';
import Button from '../../../common/components/Button';

const CreateByKeystore = () => {
    const [password, setPassword] = useState('');
    const [blobUrl, setBlobUrl] = useState('')
    const [keystoreFilename, setKeystoreFilename] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1]
    const [wallet, setWallet] = useState({} as WalletStore)
    let history = useHistory();


    // create wallet
    const createWallet = async () => {
        if (!password) {
            setErrorMessage(ErrorMessage.Require)
            return;
        }
        setLoading(true)
        // Generate wallet
        const wallet = Wallet.generate();
        const keystoreFilename = wallet.getV3Filename();
        const keystoreJson = await wallet.toV3(password);
        const keystoreJsonString = JSON.stringify(keystoreJson);
        const keystoreBlob = new Blob([keystoreJsonString], {
            type: 'mime',
        });
        setWallet({
            privatekey: wallet.getPrivateKeyString(),
            address: wallet.getAddressString(),
            isAccess: false
        })
        setBlobUrl(window.URL.createObjectURL(keystoreBlob));
        setKeystoreFilename(keystoreFilename);
        setLoading(false)
    }

    // access wallet now
    const accessWallet = async () => {
        if (!wallet.privatekey) return;
        const newWallet = JSON.parse(JSON.stringify(wallet))
        newWallet.isAccess = true;
        setWalletStored(newWallet)
    }

    useEffect(() => {
        if (password) {
            setErrorMessage('')
        }
    }, [password]);

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
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{padding:0}}>
                                        <div className="text-container">
                                            <Form fluid>
                                                <FormGroup style={{ marginBottom: '12px' }}>
                                                    <FormControl
                                                        className="input"
                                                        placeholder="Password*"
                                                        name="password"
                                                        type="password"
                                                        value={password}
                                                        onChange={setPassword} />
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
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{padding:0}}>
                                            <div className="color-white">Please <span className="note">DOWNLOAD</span> and <span className="note">SAVE</span> the following Keystore File.</div>
                                            <div className="color-white"> You will need it and your password to access your wallet.</div>
                                            <div className="download-keystore-file">
                                                <a href={blobUrl} download={keystoreFilename}>
                                                <Icon icon="download" size={"lg"}/> Download Keystore
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
