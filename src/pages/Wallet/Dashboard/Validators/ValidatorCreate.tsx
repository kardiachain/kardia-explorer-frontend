import React, { useState } from 'react'
import { Button, ButtonToolbar, Form, FormControl, FormGroup } from 'rsuite';

const ValidatorCreate = () => {

    
    const [isLoading, setIsLoading] = useState(false)    
    const [commssionRate, setCommssionRate] = useState()
    const [maxRate, setMaxRate] = useState()
    const [maxChangeRate, setMaxChangeRate] = useState()
    const [minSeftDelegation, setMinSeftDelegation] = useState()

    const registerValidator = () => {

    }
    return (
        <>
            <Form fluid>
                <FormGroup>
                    <FormControl placeholder="Commission Rate*" name="commssionRate" type="number" value={commssionRate} />
                    <FormControl placeholder="Max Rate*" name="maxRate" type="number" value={maxRate} />
                    <FormControl placeholder="Max Change Rate*" name="maxChangeRate" type="number" value={maxChangeRate} />
                    <FormControl placeholder="Min Seft Delegation*" name="minSeftDelegation" type="number" value={minSeftDelegation} />
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Button appearance="primary" loading={isLoading} onClick={registerValidator}>Register</Button>
                    </ButtonToolbar>
                </FormGroup>
            </Form>
        </>
    );
}

export default ValidatorCreate;