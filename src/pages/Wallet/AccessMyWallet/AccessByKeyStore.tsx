import React, { useEffect, useState } from 'react'
import { FlexboxGrid, Panel, Col, Form, FormGroup, FormControl, Uploader, Alert, ControlLabel, Icon } from 'rsuite';
import { Link, useHistory } from 'react-router-dom';
import { isLoggedIn, useWalletStorage } from '../../../service';
import Wallet from 'ethereumjs-wallet'
import './accessWallet.css'
import { FileType } from 'rsuite/lib/Uploader';
import { Button, ErrMessage, ErrorMessage } from '../../../common';
import { useRecoilValue } from 'recoil';
import walletState from '../../../atom/wallet.atom';
import CreateNewPassword from '../CreateNewPassword';

const AccessByKeyStore = () => {

    let history = useHistory();
    const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false)
    const [password, setPassword] = useState('');
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1];
    const [fileList, setListFile] = useState([] as FileType[]);
    const [passwordErr, setPasswordErr] = useState('');
    const [keystoreFileErr, setKeystoreFileErr] = useState('')

    const [createNewPassCode, setCreateNewPassCode] = useState(true)

    const walletLocalState: WalletState = useRecoilValue(walletState);

    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])

    const accessWallet = async () => {
        if (!validatePassword(password) || !validateKeystoreFile() || !walletLocalState.password) {
            return
        }
        setLoadingBtnSubmit(true)
        try {
            const blobFileString = await fileList[0].blobFile?.text() || '';
            const wallet = await Wallet.fromV3(blobFileString, password, true);
            setLoadingBtnSubmit(false)
            setWalletStored({
                privatekey: wallet.getPrivateKeyString(),
                address: wallet.getChecksumAddressString(),
                isAccess: true
            }, walletLocalState.password)

        } catch (error) {
            setLoadingBtnSubmit(false)
            Alert.error(`Access wallet failed. Something wrong! Please try again.`);
        }
    }

    const validatePassword = (pass: string) => {
        if (!pass) {
            setPasswordErr(ErrorMessage.Require)
            return false
        }
        setPasswordErr('')
        return true
    }

    const validateKeystoreFile = () => {
        if (fileList.length === 0) {
            setKeystoreFileErr(ErrorMessage.Require)
            return false
        }
        setKeystoreFileErr('')
        return true
    }

    const handleUpload = (fileList: any) => {
        try {
            if (fileList.length > 0) {
                setListFile([fileList[fileList.length - 1]]);
                Alert.success('Uploaded successfully.');
            }
        } catch (error) {
            Alert.error('Uploaded failed.');
        }
    }

    const handleRemoveFile = (file: FileType) => {
        setListFile([]);
    }

    return (
        <div className="show-grid access-keystore-container">
            {
                createNewPassCode ? <CreateNewPassword show={createNewPassCode} setShow={setCreateNewPassCode} /> :
                    (
                        <FlexboxGrid justify="center" className="wrap">
                            <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                                <Panel shaded className="panel-bg-gray">
                                    <FlexboxGrid justify="start">
                                        <h3 className="color-white">ACCESS WALLET</h3>
                                    </FlexboxGrid>
                                    <FlexboxGrid justify="center">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ padding: 0 }}>
                                            <Form fluid>
                                                <FormGroup style={{ marginBottom: '12px' }}>
                                                    <ControlLabel className="color-white">Key store password (required)</ControlLabel>
                                                    <FormControl
                                                        name="password"
                                                        type="password"
                                                        className="input"
                                                        value={password}
                                                        onChange={(value) => {
                                                            validatePassword(value)
                                                            setPassword(value)
                                                        }} />
                                                    <ErrMessage message={passwordErr} />
                                                </FormGroup>
                                                <Uploader
                                                    autoUpload={false}
                                                    onChange={handleUpload}
                                                    multiple={false}
                                                    fileList={fileList}
                                                    onRemove={handleRemoveFile}
                                                >

                                                    <div><Icon icon="upload" size={"lg"} /><span style={{ marginLeft: 12 }}>Upload Keystore</span></div>
                                                </Uploader>
                                                <ErrMessage message={keystoreFileErr} />
                                            </Form>
                                            <div className="button-container">
                                                <Link to="/access-wallet">
                                                    <Button size="big" className="kai-button-gray">Back</Button>
                                                </Link>
                                                <Button className="btn-access" loading={loadingBtnSubmit} size="big" onClick={accessWallet}>Access Now</Button>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </Panel>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    )
            }
        </div>
    )
}

export default AccessByKeyStore;