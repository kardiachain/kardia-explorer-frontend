import React, { useState } from 'react'
import { Col, FlexboxGrid, Form, FormControl, FormGroup, Message, Panel } from 'rsuite';
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
    const [loading, setLoading] = useState(false)

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
            if (!validateWalletAddr() || loading) return;
            setLoading(true)
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
                description: `Congratulations! You had received KAI free.`,
                callback: () => { window.open(`/tx/${responseJSON.txHash}`) },
                seeTxdetail: true
            });
        } catch (error) {
            NotificationError({
                description: "Faucet free KAIs testnet failed",
            });
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} sm={24} md={12}>
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    Received free KAIs
                </div>
            </div>
                    <Panel shaded>
                        <div style={{ paddingTop: 20, paddingBottom: 50 }}>
                            <FlexboxGrid>
                                <FlexboxGrid.Item componentClass={Col} sm={24}>
                                    <Message 
                                    className="faucet-warning" 
                                    type="warning" 
                                    description="These tokens are for testing purpose only. They can't be used to trade or pay for any services." />
                                    <Form fluid>
                                        <FormGroup>
                                            <FormControl
                                                placeholder="Enter your wallet address"
                                                name="walletAddress"
                                                value={walletAddress}
                                                onChange={(value) => {
                                                    if (!value) setWalletAddrErr(ErrorMessage.Require);
                                                    setWalletAddress(value)
                                                }}
                                                type="text" />
                                            <ErrMessage message={walletAddrErr} />
                                            <Button
                                                loading={loading}
                                                size="big"
                                                style={{margin: '20px 0'}}
                                                onClick={sendKai}>Send me some KAI</Button>
                                        </FormGroup>
                                    </Form>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </div>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default Faucet;