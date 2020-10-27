import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Alert, Button, Col, FlexboxGrid, Icon, IconButton, Panel } from 'rsuite';
import EtherWallet from 'ethereumjs-wallet'
import './createWallet.css'
import { copyToClipboard } from '../../../common/utils/string';
import { useWalletStorage } from '../../../service/wallet';

const CreateByPrivateKey = () => {

    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }

    const [showPrivKey, setShowPrivKey] = useState(false)
    const setWalletStored = useWalletStorage(() => history.push('/dashboard/send-transaction'))[1]
    const [wallet, setWallet] = useState({} as WalletStore)
    let history = useHistory();

    const handleGenerate = () => {
        let wallet = EtherWallet.generate();
        setWallet({
            privatekey: wallet.getPrivateKeyString(),
            address: wallet.getAddressString(),
            isAccess: false
        })
    }

    const renderCredential = () => {
        if (showPrivKey) {
            return wallet.privatekey;
        } else {
            return wallet.privatekey.split('').map(() => '*').join('');
        }
    }

    const accessWalletNow = () => {
        if (!wallet.privatekey) return;
        const newWallet = JSON.parse(JSON.stringify(wallet))
        newWallet.isAccess = true;
        setWalletStored(newWallet)
    }

    return (
        <div className="show-grid creact-container private-key">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={12} sm={20} xs={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="center">
                            <div className="title">CREATE WITH PRIVATE KEY</div>
                        </FlexboxGrid>
                        {
                            !wallet.privatekey ? (
                                <FlexboxGrid justify="center">
                                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                        <div> A unique private key will be generate for you </div>
                                        <div> <span className="note">REMEMBER</span> to save your <span className="note">PRIVATE KEY</span> ! If you <span className="note">lose</span>  your private key, you will <span className="note">not</span>  able to <span className="note">recover</span>  your wallet</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button appearance="ghost">Back</Button>
                                            </Link>
                                            <Button
                                                className="submit-buttom"
                                                onClick={handleGenerate}>
                                                Create wallet
                                            </Button>
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            ) : (
                                    <FlexboxGrid justify="center">
                                        <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                            <div><b>Please <span className="note">COPY</span>  and <span className="note">SAVE</span>  the following Private key:</b></div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                            <div style={{wordBreak: 'break-all'}}>
                                                {renderCredential()}
                                                <IconButton
                                                    onClick={() => copyToClipboard(wallet.privatekey, onSuccess)}
                                                    size="xs"
                                                    icon={<Icon icon="copy" />}
                                                />
                                                <IconButton
                                                    onClick={() => setShowPrivKey(!showPrivKey)}
                                                    size="xs"
                                                    icon={<Icon icon={showPrivKey ? 'eye-slash' : 'eye'} />}
                                                />
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                            <div className="button-container">
                                                <Link to="/create-wallet">
                                                    <Button appearance="ghost">Back</Button>
                                                </Link>
                                                <Button className="submit-buttom" onClick={accessWalletNow}>Access Now</Button>
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

export default CreateByPrivateKey;