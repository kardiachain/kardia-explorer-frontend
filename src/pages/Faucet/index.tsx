import React from 'react'
import { Button, ButtonToolbar, Col, FlexboxGrid, Form, FormControl, FormGroup, Message, Panel } from 'rsuite';

const Faucet = () => {
    return (
        <FlexboxGrid justify="center" style={{marginTop: 50}}>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                <Panel header={<h3>KardiaChain Faucet</h3>} shaded>
                    <Form fluid>
                        <FormGroup>
                            <FormControl placeholder="Wallet address" name="walletAddress" type="text" />
                        </FormGroup>
                        <FormGroup>
                            <ButtonToolbar>
                                <Button appearance="primary">Send me some KAI</Button>
                            </ButtonToolbar>
                        </FormGroup>
                    </Form>
                    <Message className="faucet-warning" type="warning" description="These tokens are for testing purpose only. They can't be used to trade to pay for any services." />
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default Faucet;