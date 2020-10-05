import React from 'react';
import { Link } from 'react-router-dom';
import { Button, FlexboxGrid, Panel } from 'rsuite';
import './wallet.css';

const Wallet = () => {
    return (
        <React.Fragment>
            <div className="wallet-container">
                <div className="show-grid">
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item colspan={8}>
                            <div className="create">
                                <Panel header="Create a new wallet" shaded>
                                    <p>Our user-friendly application will enable wallet creation and user's interaction with Kardiachain</p>
                                    <br/>
                                    <Link to="/create-wallet">
                                        <Button appearance="primary">Create wallet</Button>
                                    </Link>
                                </Panel>
                            </div>   
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={8}>
                            <div className="access">
                                <Panel header="Access my wallet" shaded>
                                <p>Send your KAI and interact with Kardiachain blockchain platform</p>
                                    <br/>
                                    <Link to="/access-wallet">
                                        <Button appearance="primary">Access now</Button>
                                    </Link>
                                </Panel>
                            </div>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Wallet;