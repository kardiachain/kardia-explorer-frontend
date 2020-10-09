import React, { useState } from 'react';
import { Button, ButtonToolbar, FlexboxGrid, Form, FormControl, FormGroup } from 'rsuite';
import Wallet from 'ethereumjs-wallet'

const CreateByKeystore = () => {
    const [password, setPassword] = useState('');
    const [blobUrl, setBlobUrl] = useState('')
    const [keystoreFilename, setKeystoreFilename] = useState('')

    const createWallet = async () => {
        if(!password) return;
        // Generate wallet
        const wallet = Wallet.generate();
        console.log("Private key string: ", wallet.getPrivateKeyString());

        const publicKey = wallet.getPublicKeyString();
        console.log("Public key: ", publicKey);

        const walletAddr = wallet.getAddressString()
        console.log("Wallet address: ", walletAddr);

        const keystoreFilename = wallet.getV3Filename();
        console.log("Keystore Filename: ", keystoreFilename);

        const keystoreJson = await wallet.toV3(password);
        console.log(keystoreJson);

        const keystoreJsonString = JSON.stringify(keystoreJson);
        const keystoreBlob = new Blob([keystoreJsonString], {
          type: 'mime',
        });
        setBlobUrl(window.URL.createObjectURL(keystoreBlob));
        setKeystoreFilename(keystoreFilename);
    }

    return (
        <div className="show-grid creact-by-privatekey">
            <FlexboxGrid justify="start">
                <div className="note-warning">
                    <Form fluid>
                        <FormGroup>
                            <FormControl placeholder="Password*" name="password" type="password" value={password} onChange={setPassword} />
                        </FormGroup>
                        <div>You will need <b>BOTH</b> your <b>Password + Keystore File</b> to access your wallet.</div>
                        <FormGroup>
                            <ButtonToolbar>
                                <Button appearance="primary" onClick={createWallet}>Create wallet</Button>
                            </ButtonToolbar>
                        </FormGroup>
                    </Form>
                </div>
            </FlexboxGrid>
            <a href={blobUrl} download={keystoreFilename}>
                Download Keystore File
            </a>
        </div>
    );
}

export default CreateByKeystore;
