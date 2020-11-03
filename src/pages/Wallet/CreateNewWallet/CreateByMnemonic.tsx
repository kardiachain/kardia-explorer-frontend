import React, { useEffect, useState } from 'react'
import { Button, Col, FlexboxGrid, Icon, Input, InputGroup, Modal, Panel, Tag } from 'rsuite'
import * as Bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet'
import { Link, useHistory } from 'react-router-dom';
import './createWallet.css'
import { ErrorMessage } from '../../../common/constant/Message';
import ErrMessage from '../../../common/components/InputErrMessage/InputErrMessage';
import { useWalletStorage } from '../../../service/wallet';

const CreateByMnemonic = () => {
    const strength = 256;
    const emptyBoxesNumber = 6;
    const [mnemonic, setMnemonic] = useState('');
    const [mnemonicArr, setMnemonicArr] = useState([] as string[])
    const [modalVerify, setModalVerify] = useState(false)
    const [mnemonicArrVerify, setMnemonicArrVerify] = useState([] as any[])
    const [verifyInput0, setVerifyInput0] = useState('');
    const [verifyInput1, setVerifyInput1] = useState('');
    const [verifyInput2, setVerifyInput2] = useState('');
    const [verifyInput3, setVerifyInput3] = useState('');
    const [verifyInput4, setVerifyInput4] = useState('');
    const [verifyInput5, setVerifyInput5] = useState('');
    const [mnVerifyErr, setMnVerifyErr] = useState('');
    const [readyAccessNow, setReadyAccessNow] = useState(false)
    const setWalletStored = useWalletStorage(() => history.push('/wallet/send-transaction'))[1]
    let history = useHistory();

    useEffect(() => {
        randomPhrase();
    }, []);

    const randomIndexEmptyBox = (): number[] => {
        let indexRandomArr = [] as number[];
        while (indexRandomArr.length < emptyBoxesNumber) {
            const indexRandom = Math.floor((Math.random() * 24) + 1);
            if (!indexRandomArr.includes(indexRandom)) {
                indexRandomArr.push(indexRandom)
            }
        }
        return indexRandomArr.sort((a, b) => { return a - b });
    }

    const createWallet = () => {
        const indexRandomArr = randomIndexEmptyBox() as number[]
        console.log(indexRandomArr);
        let mnemonicArrVerify = [] as any[];
        indexRandomArr.forEach((val: number) => {
            mnemonicArrVerify.push({
                index: val,
                value: mnemonicArr[val - 1]
            })
        })
        setMnemonicArrVerify(mnemonicArrVerify)
        setModalVerify(true)
    }

    const verifyMn = () => {
        if (!mnemonicArrVerify
            || mnemonicArrVerify[0]?.value !== verifyInput0
            || mnemonicArrVerify[1]?.value !== verifyInput1
            || mnemonicArrVerify[2]?.value !== verifyInput2
            || mnemonicArrVerify[3]?.value !== verifyInput3
            || mnemonicArrVerify[4]?.value !== verifyInput4
            || mnemonicArrVerify[5]?.value !== verifyInput5
        ) {
            setMnVerifyErr(ErrorMessage.MnemonicVerifyIncorrect)
            return false
        }
        setReadyAccessNow(true)
        setMnVerifyErr('')
        setModalVerify(false)
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
        const nmArr = mn.split(' ')
        setMnemonic(mn)
        setMnemonicArr(nmArr)
    }

    return (
        <div className="show-grid creact-container mnemonic">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={16} xs={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                <div className="title" style={{textAlign: 'center'}}>CREATE WITH MNEMONIC PHRASE</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        {
                            readyAccessNow ? (
                                <>
                                <FlexboxGrid justify="center">
                                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                        <div style={{textAlign: 'center'}}>
                                            <Icon style={{fontSize: '60px', verticalAlign: 'middle', color:'#46f0f1'}} icon='check-circle' /> Create wallet success, you can access wallet now.
                                        </div>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button appearance="ghost">Back</Button>
                                            </Link>
                                            <Button appearance="primary" className="submit-buttom" onClick={accessWallet}>Access Now</Button>
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                                </>
                            ) : (
                                    <>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Your Mnemonic Phrase:</div><div className="mnemonic-container">
                                            {mnemonicArr.map((value: string, index: number) => {
                                                return (
                                                    <div style={{ textAlign: 'center' }} key={index}>
                                                        <Tag className="tag-container">
                                                            <span>{index + 1}.</span>
                                                            <span>{value}</span>
                                                        </Tag>
                                                    </div>
                                                );
                                            })}
                                        </div><div style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '10px' }}>
                                            <span onClick={randomPhrase} style={{ cursor: 'pointer' }}><Icon icon="refresh2" />  Change phrase</span>
                                        </div><div>Please make sure you <span className="note">WROTE DOWN </span> and <span className="note">SAVE</span> your mnemonic phrase. You will need it to access your wallet.</div>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button appearance="ghost">Back</Button>
                                            </Link>
                                            <Button appearance="primary" className="submit-buttom" onClick={createWallet}>Create wallet</Button>
                                        </div>
                                    </>
                                )
                        }

                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>

            <Modal overflow={false} backdrop='static' show={modalVerify} onHide={() => setModalVerify(false)}>
                <Modal.Header>
                    <Modal.Title>Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>Please enter and fill out the boxes below to verify your mnemonic phrase key:</div>
                    <FlexboxGrid justify="center" className="mn-phrase-verification">
                        <FlexboxGrid.Item componentClass={Col} colspan={22} sm={8}>
                            <InputGroup className="input-mn-phrase">
                                <InputGroup.Addon>{mnemonicArrVerify[0] ? mnemonicArrVerify[0].index : ''}</InputGroup.Addon>
                                <Input
                                    value={verifyInput0}
                                    onChange={setVerifyInput0}
                                />
                            </InputGroup>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={22} sm={8}>
                            <InputGroup className="input-mn-phrase">
                                <InputGroup.Addon>{mnemonicArrVerify[1] ? mnemonicArrVerify[1].index : ''}</InputGroup.Addon>
                                <Input
                                    value={verifyInput1}
                                    onChange={setVerifyInput1}
                                />
                            </InputGroup>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={22} sm={8}>
                            <InputGroup className="input-mn-phrase">
                                <InputGroup.Addon>{mnemonicArrVerify[2] ? mnemonicArrVerify[2].index : ''}</InputGroup.Addon>
                                <Input value={verifyInput2}
                                    onChange={setVerifyInput2} />
                            </InputGroup>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={22} sm={8}>
                            <InputGroup className="input-mn-phrase">
                                <InputGroup.Addon>{mnemonicArrVerify[3] ? mnemonicArrVerify[3].index : ''}</InputGroup.Addon>
                                <Input value={verifyInput3}
                                    onChange={setVerifyInput3} />
                            </InputGroup>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={22} sm={8}>
                            <InputGroup className="input-mn-phrase">
                                <InputGroup.Addon>{mnemonicArrVerify[4] ? mnemonicArrVerify[4].index : ''}</InputGroup.Addon>
                                <Input value={verifyInput4}
                                    onChange={setVerifyInput4} />
                            </InputGroup>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={22} sm={8}>
                            <InputGroup className="input-mn-phrase">
                                <InputGroup.Addon>{mnemonicArrVerify[5] ? mnemonicArrVerify[5].index : ''}</InputGroup.Addon>
                                <Input value={verifyInput5}
                                    onChange={setVerifyInput5} />
                            </InputGroup>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                    <ErrMessage message={mnVerifyErr} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={verifyMn} appearance="primary">
                        Verify
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateByMnemonic;