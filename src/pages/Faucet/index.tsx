import React, { useState } from 'react'
import { Col, FlexboxGrid, Form, FormControl, FormGroup, Icon, Message, Panel } from 'rsuite';
import {
    ErrorMessage,
    Button,
    ErrMessage,
    NotificationError,
    NotificationSuccess,
    NotificationWarning,
    addressValid
} from '../../common';
import { FAUCET_ENDPOINT } from '../../config';
import './faucet.css';

const Faucet = () => {

    const [walletAddress, setWalletAddress] = useState('')
    const [walletAddrErr, setWalletAddrErr] = useState('')

    const validateWalletAddr = () => {
        if (!walletAddress) {
            setWalletAddrErr(ErrorMessage.Require)
            return false
        }
        if (!addressValid(walletAddress)) {
            setWalletAddrErr(ErrorMessage.AddressInvalid)
            return false
        }
        setWalletAddrErr('')
        return true
    }

    const sendKai = async () => {
        try {
            if (!validateWalletAddr()) return;
            const requestOptions = {
                method: 'GET'
            };
            const response = await fetch(`${FAUCET_ENDPOINT}/giveFaucet?address=${walletAddress}`, requestOptions)
            const responseJSON = response && await response.json();

            if (responseJSON && responseJSON.error) {
                NotificationError({
                    description: responseJSON.error,
                });
                return
            }

            if (responseJSON && responseJSON.warning) {
                NotificationWarning({
                    description: responseJSON.warning,
                });
                return
            }
            NotificationSuccess({
                description: `Congratulations! You had received ${process.env.REACT_APP_FAUCET_AMOUNT} KAI free.`,
                callback: () => { window.open(`/tx/${responseJSON.txHash}`) },
                seeTxdetail: true
            });
        } catch (error) {
            NotificationError({
                description: "Faucet free KAI testnet failed",
            });
        }
    }

    return (
        <div className="container">
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="eyedropper" size={"2x"} />
                    <p style={{ marginLeft: '12px' }} className="title">Received free KAIs with KardiaChain Faucet</p>
                </div>
            </div>
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                    <Panel shaded>
                        <Form fluid>
                            <FormGroup>
                                <FormControl
                                    placeholder="Wallet address"
                                    name="walletAddress"
                                    value={walletAddress}
                                    onChange={(value) => {
                                        if (!value) setWalletAddrErr(ErrorMessage.Require);
                                        setWalletAddress(value)
                                    }}
                                    type="text" />
                                <ErrMessage message={walletAddrErr} />
                            </FormGroup>
                            <FormGroup>
                                <Button size="big" onClick={sendKai}>Send me some KAI</Button>
                            </FormGroup>
                        </Form>
                        <Message className="faucet-warning" type="warning" description="These tokens are for testing purpose only. They can't be used to trade or pay for any services." />
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default Faucet;