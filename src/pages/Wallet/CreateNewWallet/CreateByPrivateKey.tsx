import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, FlexboxGrid, Icon, IconButton } from 'rsuite';
import EtherWallet from 'ethereumjs-wallet'
import './createWallet.css'
import { copyToClipboard } from '../../../common/utils/string';

const CreateByPrivateKey = () => {

    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }

    const [privateKey, setPrivateKey] = useState('');
    const [showPrivKey, setShowPrivKey] = useState(false)

    const handleGenerate = () => {
        let wallet = EtherWallet.generate();
        let privateKeyStr = wallet.getPrivateKeyString();
        setPrivateKey(privateKeyStr);
    }

    const renderCredential = () => {
        if (showPrivKey) {
            return privateKey;
        } else {
            return privateKey.split('').map(item => '*').join('');
        }
    }

    return !privateKey ? (
        <div className="show-grid creact-by-privatekey">
            <FlexboxGrid justify="start">
                <div className="note-warning">
                    <div> A unique private key will be generate for you </div>
                    <div><b>Remember to save your private key! If you lose your private key, you will not able to recover your wallet.</b></div>
                </div>
            </FlexboxGrid>
            <FlexboxGrid justify="start">
                <div className="button-container">
                    <Link to="/wallet">
                        <Button appearance="ghost">Back</Button>
                    </Link>
                    <Button appearance="primary" onClick={handleGenerate}>Create wallet</Button>
                </div>
            </FlexboxGrid>
        </div>
    ) : (
        <div className="show-grid creact-by-privatekey">
            <FlexboxGrid justify="start">
                <div className="note-warning">
                    <div><b>Please copy and save the following Private key:</b></div>
                </div>
               
            </FlexboxGrid>
            <FlexboxGrid justify="start">
                <div className="privatekey-text">
                    {renderCredential()}
                    <IconButton 
                        onClick={() => copyToClipboard(privateKey, onSuccess)} 
                        size="xs" 
                        icon={<Icon icon="copy" />}
                    />
                    <IconButton
                        onClick={() => setShowPrivKey(!showPrivKey)} 
                        size="xs" 
                        icon={<Icon icon={showPrivKey ? 'eye-slash' : 'eye'} />}
                    />
                </div>
            </FlexboxGrid>
            <FlexboxGrid justify="start">
                <div className="button-container">
                    <Link to="/wallet">
                        <Button appearance="ghost">Back</Button>
                    </Link>
                    <Button appearance="primary">Access wallet</Button>
                </div>
            </FlexboxGrid>
        </div>
    );
}

export default CreateByPrivateKey;