import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, ButtonToolbar, FlexboxGrid, Form, FormControl, FormGroup } from 'rsuite';
import { useWalletStorage } from '../../../store/wallet';

const AccessByPrivateKey = () => {
    const [privateKey, setPrivateKey] = useState('');
    const [walletStored, setWalletStored] = useWalletStorage()
    let history = useHistory();

    const accessWallet = () => {
        if(!privateKey) return;
        setWalletStored({privatekey: privateKey, isAccess: true})
        history.push("/dashboard");
    }
    return (
        <FlexboxGrid justify="start">
            <div className="note-warning">
                <Form fluid>
                    <FormGroup>
                        <FormControl placeholder="Private key*" name="password" type="text" value={privateKey} onChange={setPrivateKey} />
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar>
                            <Button appearance="primary" onClick={accessWallet}>Access</Button>
                        </ButtonToolbar>
                    </FormGroup>
                </Form>
            </div>
        </FlexboxGrid>
    )
}

export default AccessByPrivateKey;