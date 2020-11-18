import React, { useEffect, useState } from 'react'
import { Alert, Col, FlexboxGrid, Form, FormControl, FormGroup, Icon, Panel } from 'rsuite'
import * as Bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet'
import { Link, useHistory } from 'react-router-dom';
import './createWallet.css'
import { useWalletStorage } from '../../../service/wallet';
import Button from '../../../common/components/Button';
import { copyToClipboard } from '../../../common/utils/string';

const CreateByMnemonic = () => {
    const strength = 256;
    const [mnemonic, setMnemonic] = useState('');
    const [readyAccessNow, setReadyAccessNow] = useState(false)
    const setWalletStored = useWalletStorage(() => history.push('/wallet/send-transaction'))[1]
    let history = useHistory();

    useEffect(() => {
        randomPhrase();
    }, []);


    const createWallet = () => {
        setReadyAccessNow(true)
    }

    const accessWallet = async () => {
        try {
            const seed = await Bip39.mnemonicToSeed(mnemonic)
            const root = hdkey.fromMasterSeed(seed)
            const masterWallet = root.getWallet()
            const privateKey = masterWallet.getPrivateKeyString();
            const addressStr = masterWallet.getAddressString();
            const storedWallet = {
                privatekey: privateKey,
                address: addressStr,
                isAccess: true
            }
            setWalletStored(storedWallet);
        } catch (error) {
            return false
        }
    }

    const randomPhrase = () => {
        const mn = Bip39.generateMnemonic(strength);
        setMnemonic(mn)
    }

    return (
        <div className="show-grid create-container mnemonic">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={16} xs={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                <div className="title" style={{ textAlign: 'center' }}>CREATE WITH MNEMONIC PHRASE</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        {
                            readyAccessNow ? (
                                <>
                                    <FlexboxGrid justify="center">
                                        <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                            <div style={{ textAlign: 'center' }}>
                                                <Icon size="lg" className="icon-check" style={{ verticalAlign: 'middle'}} icon='check-circle' /> Create wallet success, you can access wallet now.
                                        </div>
                                            <div className="button-container">
                                                <Link to="/create-wallet">
                                                    <Button size="big" className="kai-button-gray">Back</Button>
                                                </Link>
                                                <Button size="big" className="submit-buttom" onClick={accessWallet}>Access Now</Button>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Your Mnemonic Phrase:</div>
                                    <div className="mnemonic-container">
                                        <Form fluid style={{ width: '100%' }}>
                                            <FormGroup>
                                                <FormControl rows={4}
                                                    name="mnemonic"
                                                    componentClass="textarea"
                                                    value={mnemonic}
                                                    readOnly
                                                    style={{
                                                        fontWeight: 600,
                                                        color: '#9e3144'
                                                    }}
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
                                                    <Button className="kai-button-gray" onClick={randomPhrase}>
                                                        Change phrase <Icon icon="refresh" />
                                                    </Button>
                                                </div>
                                            </FormGroup>
                                        </Form>
                                    </div>
                                    <div>Please make sure you <span className="note">WROTE DOWN </span> and <span className="note">SAVE</span> your mnemonic phrase. You will need it to access your wallet.</div>
                                    <div className="button-container">
                                        <Link to="/create-wallet">
                                            <Button size="big" className="kai-button-gray">Back</Button>
                                        </Link>
                                        <Button size="big" className="submit-buttom" onClick={createWallet}>Create wallet</Button>
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