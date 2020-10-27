import React, { useState } from 'react'
import { Button, Message } from 'rsuite'
import * as Bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet'

const CreateByMnemonic = () => {

    const mn = Bip39.generateMnemonic();
    const [mnemonic] = useState(mn);

    const createWallet = async() => {
        const seed = await Bip39.mnemonicToSeed(mnemonic)
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