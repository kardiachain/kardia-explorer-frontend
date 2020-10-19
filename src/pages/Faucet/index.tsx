import React, { useState } from 'react'
import { Alert, Button, ButtonToolbar, Col, FlexboxGrid, Form, FormControl, FormGroup, Message, Panel } from 'rsuite';
import ErrMessage from '../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../common/constant/Message';
import { renderHashString, validAddress } from '../../common/utils/string';
import { Config } from '../../config';
import { sendTransaction } from '../../service/wallet';
import './faucet.css';

const Faucet = () => {
    const faucetAccount = {
        publickey: Config.faucet_account.public_key,
        privatekey: Config.faucet_account.private_key
    } as Account
    console.log(process.env.PRIVATE_KEY_FAUCET_ACCOUNT);
    
    const [walletAddress, setWalletAddress] = useState('')
    const [walletAddrErr, setWalletAddrErr] = useState('')

    const validateWalletAddr = () => {
        if (!walletAddress) {
            setWalletAddrErr(ErrorMessage.Require)
            return false
        }
        if (!validAddress(walletAddress)) {
            setWalletAddrErr(ErrorMessage.InvalidAddress)
            return false
        }
        setWalletAddrErr('')
        return true
    }

    const sendKai = async () => {
        if (!validateWalletAddr()) return;

        const txHash = await sendTransaction(faucetAccount, walletAddress, 1000);
        if (txHash) {
            Alert.success(renderHashString(`Tx hash: ${txHash}`, 30)!, 3000)
        }
    }

    return (
        <FlexboxGrid justify="center" className="faucet-container">
            <FlexboxGrid.Item componentClass={Col} colspan={22} md={14}>
                <Panel header={<h3>Received free KAIs with KardiaChain Faucet</h3>} shaded>
                    <Form fluid>
                        <FormGroup>
                            <FormControl
                                placeholder="Wallet address"
                                name="walletAddress"
                                value={walletAddress}
                                onChange={(value) => {
                                    if(!value) setWalletAddrErr(ErrorMessage.Require);
                                    setWalletAddress(value)
                                }}
                                type="text" />
                            <ErrMessage message={walletAddrErr} />
                        </FormGroup>
                        <FormGroup>
                            <ButtonToolbar>
                                <Button appearance="primary" onClick={sendKai}>Send me some KAI</Button>
                            </ButtonToolbar>
                        </FormGroup>
                    </Form>
                    <Message className="faucet-warning" type="warning" description="These tokens are for testing purpose only. They can't be used to trade or pay for any services." />
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default Faucet;