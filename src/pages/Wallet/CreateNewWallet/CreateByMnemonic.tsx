import React, { useEffect, useState } from 'react'
import { Button, ButtonToolbar, FlexboxGrid, Form, FormGroup, Message } from 'rsuite'
import * as Bip39 from 'bip39';
import Wallet from 'ethereumjs-wallet'
import { hdkey } from 'ethereumjs-wallet'

const CreateByMnemonic = () => {

    const mn = Bip39.generateMnemonic();
    const [mnemonic, setMnemonic] = useState(mn);

    const createWallet = async() => {
        const seed = await Bip39.mnemonicToSeed(mnemonic)
        console.log("Seed: ", seed);

        const root = hdkey.fromMasterSeed(seed)
        const masterWallet = root.getWallet()
        const masterPrivateKey = masterWallet.getPrivateKeyString()
        console.log("Private key: ", masterPrivateKey);
        
    }

    return (
        <div className="show-grid creact-by-privatekey">
                <div>Mnemonic Phrase: </div>
                <div className="note-warning">
                    {
                        mnemonic !== '' ? <Message className="faucet-warning" type="warning" description={mnemonic} /> : ''
                    }
                </div>
                <div className="button-container">
                    <Button appearance="primary" onClick={createWallet}>Create wallet</Button>
                </div>
        </div>
    )
}

export default CreateByMnemonic;