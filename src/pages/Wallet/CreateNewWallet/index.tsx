import  React from 'react';
import { Button, FlexboxGrid, Icon, Nav, Panel } from 'rsuite';
import './createWallet.css'

const CreateNewWallet = () => {

    return (
        <div className="show-grid">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={8}>
                    <div className="create-wallet-container">
                        <Panel header="Create new wallet" shaded>
                        <Nav appearance="tabs" justified>
                            <Nav.Item active>By Private Key</Nav.Item>
                            <Nav.Item>By Keystore File</Nav.Item>
                            <Nav.Item>BY Mnemonic Phrase</Nav.Item>
                        </Nav>
                            <br/>
                            <Button color="violet">Create wallet</Button>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default CreateNewWallet;