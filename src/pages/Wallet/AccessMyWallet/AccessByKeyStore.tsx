import React, { useState } from 'react'
import { FlexboxGrid, Panel, Col, Form, FormGroup, FormControl, Uploader, Alert, ControlLabel } from 'rsuite';
import { Link, useHistory } from 'react-router-dom';
import { useWalletStorage } from '../../../service/wallet';
import Wallet from 'ethereumjs-wallet'
import './accessWallet.css'
import { FileType } from 'rsuite/lib/Uploader';
import ErrMessage from '../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../common/constant/Message';
import Button from '../../../common/components/Button';

const AccessByKeyStore = () => {

    let history = useHistory();
    const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false)
    const [password, setPassword] = useState('');
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1];
    const [fileList, setListFile] = useState([] as FileType[]);
    const [passwordErr, setPasswordErr] = useState('');
    const [keystoreFileErr, setKeystoreFileErr] = useState('')

    //access wallet
    const accessWallet = async () => {
        if(!validatePassword(password) || !validateKeystoreFile()) {
            return
        }
        setLoadingBtnSubmit(true)
        try {
            const blobFileString = await fileList[0].blobFile?.text() || '';
            const wallet = await Wallet.fromV3(blobFileString, password, true);  
            setLoadingBtnSubmit(false)
            setWalletStored({
                privatekey: (await wallet).getPrivateKeyString(),
                address: (await wallet).getAddressString(),
                isAccess: true
            } as WalletStore)

        } catch (error) {
            setLoadingBtnSubmit(false)
            Alert.error(`Access wallet Error: ${error.message}`);
        }
    }

    const validatePassword = (pass: string) => {
        if(!pass) {
            setPasswordErr(ErrorMessage.Require)
            return false
        }
        setPasswordErr('')
        return true
    }

    const validateKeystoreFile = () => {
        if(fileList.length === 0) {
            setKeystoreFileErr(ErrorMessage.Require)
            return false
        }
        setKeystoreFileErr('')
        return true
    }

    const handleUpload = (fileList: any) => {
        if (fileList.length > 0) {
            setListFile([fileList[fileList.length - 1]]);
        }
    }

    const uploadFileSuccess = (response: Object, file: FileType) => {
        Alert.success('Uploaded successfully.');
    }

    const uploadFileFailed = (response: Object, file: FileType) => {
        setListFile([]);
        Alert.error('Uploaded failed.');
    }

    const handleRemoveFile = (file: FileType) => {
        setListFile([]);
    }

    return (
        <div className="show-grid access-keystore-container">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="center">
                            <div className="title">ACCESS WALLET BY KEYSTORE FILE</div>
                        </FlexboxGrid>
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                <Form fluid>
                                    <FormGroup>
                                        <ControlLabel>Enter your Password <span className="required-mask">(*)</span></ControlLabel>
                                        <FormControl placeholder="Password*"
                                            name="password"
                                            type="password"
                                            value={password}
                                            onChange={(value) => {
                                                validatePassword(value)
                                                setPassword(value)
                                            }} />
                                        <ErrMessage message={passwordErr} />
                                    </FormGroup>
                                    <Uploader action="//jsonplaceholder.typicode.com/posts/"
                                        onChange={handleUpload}
                                        multiple={false}
                                        fileList={fileList}
                                        onSuccess={uploadFileSuccess}
                                        onError={uploadFileFailed}
                                        onRemove={handleRemoveFile}
                                    >
                                        <div>Upload Keystore File</div>
                                    </Uploader>
                                    <ErrMessage message={keystoreFileErr} />
                                </Form>
                                <div className="button-container">
                                    <Link to="/access-wallet">
                                        <Button size="big" className="kai-button-gray">Back</Button>
                                    </Link>
                                    <Button loading={loadingBtnSubmit} size="big" onClick={accessWallet}>Access Now</Button>
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default AccessByKeyStore;