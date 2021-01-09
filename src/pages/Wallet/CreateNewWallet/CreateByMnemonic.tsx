import React, { useEffect, useState } from 'react'
import { Alert, Col, FlexboxGrid, Form, FormControl, FormGroup, Icon, Panel } from 'rsuite'
import { ethers } from "ethers";
import { Link, useHistory } from 'react-router-dom';
import './createWallet.css'
import { useWalletStorage } from '../../../service/wallet';
import Button from '../../../common/components/Button';
import { copyToClipboard } from '../../../common/utils/string';
import { useRecoilValue } from 'recoil';
import walletState from '../../../atom/wallet.atom';

const CreateByMnemonic = () => {
    const [mnemonic, setMnemonic] = useState('');
    const [readyAccessNow, setReadyAccessNow] = useState(false)
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1]
    let history = useHistory();

    const walletLocalState: WalletState = useRecoilValue(walletState);
    
    useEffect(() => {
        if (!walletLocalState || !walletLocalState.stateExist) {
            history.push("/wallet-login")
        }
    }, [walletLocalState, history])

    useEffect(() => {
        randomPhrase();
    }, [])

    const createWallet = () => {
        setReadyAccessNow(true)
    }

    const accessWallet = async () => {
        try {
            const wallet = ethers.Wallet.fromMnemonic(mnemonic.trim());
            const privateKey = wallet.privateKey;
            const addressStr = wallet.address;
            const storedWallet = {
                privatekey: privateKey,
                address: addressStr,
                isAccess: true
            }
            setWalletStored(storedWallet, walletLocalState.password);
        } catch (error) {
            return false
        }
    }

    const randomPhrase = () => {
        const wallet = ethers.Wallet.createRandom();
        setMnemonic(wallet.mnemonic.phrase)
    }

    return (
        <div className="show-grid create-container mnemonic">
            <FlexboxGrid justify="center" className="wrap">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel shaded className="panel-bg-gray">
                        <FlexboxGrid justify="start">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <h3 className="title color-white">MNEMONIC PHRASE</h3>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        {
                            readyAccessNow ? (
                                <>
                                    <FlexboxGrid justify="center">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                            <div style={{ textAlign: 'center', marginTop: 32 }} className="color-white">
                                                <Icon size="lg" className="icon-check" style={{ verticalAlign: 'middle' }} icon='check-circle' /> Create wallet success, you can access wallet now.
                                            </div>
                                            <div className="button-container">
                                                <Link to="/create-wallet">
                                                    <Button size="big" className="kai-button-gray">Back</Button>
                                                </Link>
                                                <Button className="btn-access" size="big" onClick={accessWallet}>Access Now</Button>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </>
                            ) : (
                                    <>
                                        <FlexboxGrid justify="center">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} xs={24}>
                                                <div className="color-white" style={{ fontSize: '16px', fontWeight: 'bold' }}>Your 12 Mnemonic Phrase</div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                        <div className="mnemonic-container">
                                            <Form fluid style={{ width: '100%' }}>
                                                <FormGroup>
                                                    <FormControl rows={4}
                                                        name="mnemonic"
                                                        componentClass="textarea"
                                                        value={mnemonic}
                                                        readOnly
                                                        className="input"
                                                    />
                                                    <div style={{ textAlign: 'right', marginTop: 10 }}>
                                                        <Button className="kai-button-gray"
                                                            onClick={() => {
                                                                const onSuccess = () => {
                                                                    Alert.success('Copied to clipboard.')
                                                                }
                                                                copyToClipboard(mnemonic, onSuccess)
                                                            }}>Copy <Icon icon="copy-o" />
                                                        </Button>
                                                        <Button className="kai-button-gray" onClick={() => randomPhrase()}>
                                                            Change phrase <Icon icon="refresh" />
                                                        </Button>
                                                    </div>
                                                </FormGroup>
                                            </Form>
                                        </div>
                                        <div className="color-white">Please make sure you <span className="note">WROTE DOWN </span> and <span className="note">SAVE</span> your mnemonic phrase. You will need it to access your wallet.</div>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button size="big" className="kai-button-gray">Back</Button>
                                            </Link>
                                            <Button className="btn-access" size="big" onClick={createWallet}>Create wallet</Button>
                                        </div>
                                    </>
                                )
                        }

                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default CreateByMnemonic;