import React, { useState, useEffect } from 'react';
import { Col, FlexboxGrid, Form, FormControl, FormGroup, Panel, Icon, ControlLabel } from 'rsuite';
import Wallet from 'ethereumjs-wallet'
import { Link, useHistory } from 'react-router-dom';
import { ErrorMessage, ErrMessage, Button } from '../../../common';
import { isLoggedIn } from '../../../service';
import { useTranslation } from 'react-i18next';

const CreateByKeystore = () => {
    const [password, setPassword] = useState('');
    const [blobUrl, setBlobUrl] = useState('')
    const [keystoreFilename, setKeystoreFilename] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    let history = useHistory();
    const { t } = useTranslation()

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
                                            <ControlLabel className="color-white">{t('createWalletByKeystoreFile.create')}</ControlLabel>
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
                                                <div className="color-white">{t('createWalletByKeystoreFile.youWillNeed')} <span className="note">{t('createWalletByKeystoreFile.both')}</span>  {t('createWalletByKeystoreFile.your')} <span className="note">{t('createWalletByKeystoreFile.passwordKeystoreFile')}</span>  {t('createWalletByKeystoreFile.toAccess')}</div>
                                            </Form>
                                        </div>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button size="big" className="kai-button-gray">{t('back')}</Button>
                                            </Link>
                                            <Button className="btn-access" size="big" loading={isLoading} onClick={createWallet}>{t('createWallet')}</Button>
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            ) : (
                                    <FlexboxGrid justify="center">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ padding: 0 }}>
                                            <div className="color-white">{t('createWalletByKeystoreFile.please')} <span className="note">{t('createWalletByKeystoreFile.download')}</span> {t('and')} <span className="note">{t('save')}</span> {t('createWalletByKeystoreFile.theFollowing')}</div>
                                            <div className="color-white"> {t('createWalletByKeystoreFile.youWill')} <span className="note">{t('createWalletByKeystoreFile.password')}</span> {t('createWalletByKeystoreFile.toAccess')}</div>
                                            <div className="download-keystore-file">
                                                <a href={blobUrl} download={keystoreFilename}>
                                                    <Icon icon="download" size={"lg"} /> {t('createWalletByKeystoreFile.downloadKeystore')}
                                            </a>
                                            </div>
                                            <div className="button-container">
                                                <Link to="/create-wallet">
                                                    <Button size="big" className="kai-button-gray">{t('back')}</Button>
                                                </Link>
                                                <Button className="btn-access" size="big" onClick={accessWallet}>{t('accessNow')}</Button>
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
