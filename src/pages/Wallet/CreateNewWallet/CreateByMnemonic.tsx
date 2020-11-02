import React, { useState } from 'react'
import { Button, Col, FlexboxGrid, Input, InputGroup, Message, Panel, Tag } from 'rsuite'
import * as Bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet'
import { Link } from 'react-router-dom';
import './createWallet.css'

const CreateByMnemonic = () => {
    const strength = 256;
    const mn = Bip39.generateMnemonic(strength);
    const [mnemonic] = useState(mn);
    const mnemonicArr = mnemonic.split(' ');
    console.log(mnemonicArr);


    const createWallet = async () => {
        const seed = await Bip39.mnemonicToSeed(mnemonic)
        const root = hdkey.fromMasterSeed(seed)
        const masterWallet = root.getWallet()
        const masterPrivateKey = masterWallet.getPrivateKeyString()
        console.log("Private key: ", masterPrivateKey);
    }

    return (
        <div className="show-grid creact-container mnemonic">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={16} xs={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="center">
                            <div className="title">CREATE WITH MNEMONIC PHRASE</div>
                        </FlexboxGrid>
                        <div className="show-grid creact-by-privatekey">
                            <FlexboxGrid justify="center">
                                {
                                    mnemonicArr.map((value: string, index: number) => {
                                        return (
                                            <FlexboxGrid.Item componentClass={Col} colspan={22} sm={6} key={index}>
                                                <div style={{textAlign: 'center'}}>
                                                    <Tag className="tag-container">
                                                        <span>{index + 1}. </span>
                                                        <span>{value}</span>
                                                    </Tag>
                                                </div>
                                            </FlexboxGrid.Item>
                                        )
                                    })
                                }
                            </FlexboxGrid>
                            <div className="button-container">
                                <Link to="/create-wallet">
                                    <Button appearance="ghost">Back</Button>
                                </Link>
                                <Button appearance="primary" className="submit-buttom" onClick={createWallet}>Create wallet</Button>
                            </div>
                        </div>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default CreateByMnemonic;