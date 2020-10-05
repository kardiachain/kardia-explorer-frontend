import React from 'react';
import { Button, Panel } from 'rsuite';

const AccessMyWallet = () => {
    return (
        <div>
            <Panel header="Access my wallet" shaded>
            <p>Send your KAI and interact with Kardiachain blockchain platform</p>
                <br/>
                <Button color="violet">Access now</Button>
            </Panel>
        </div>
    )
}

export default AccessMyWallet;