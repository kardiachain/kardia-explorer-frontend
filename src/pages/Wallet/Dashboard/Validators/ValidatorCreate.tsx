import React, { useEffect, useState } from 'react'
import { Button, ButtonToolbar, Form, FormControl, FormGroup } from 'rsuite';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { onlyNumber } from '../../../../common/utils/number';
import { createValidator } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
const ValidatorCreate = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [commssionRate, setCommssionRate] = useState('')
    const [maxRate, setMaxRate] = useState('')
    const [maxChangeRate, setMaxChangeRate] = useState('')
    const [minSeftDelegation, setMinSeftDelegation] = useState('')
    const [amountDel, setAmountDel] = useState('')

    const [commssionRateErr, setCommssionRateErr] = useState('')
    const [maxRateErr, setMaxRateErr] = useState('')
    const [maxChangeRateErr, setMaxChangeRateErr] = useState('')
    const [maxMinSeftDelegationErr, setMaxMinSeftDelegationErr] = useState('')
    const [amountDelErr, setAmountDelErr] = useState('')

    useEffect(() => {
        if(commssionRate) setCommssionRateErr('');
        if(maxRate) setMaxRateErr('');
        if(maxChangeRate) setMaxChangeRateErr('');
        if(minSeftDelegation) setMaxMinSeftDelegationErr('');
        if(amountDel) setAmountDelErr('');
    }, [commssionRate, maxRate, maxChangeRate, minSeftDelegation, amountDel])

    const valCommssionRate = () => {
        if(!commssionRate) {
            setCommssionRateErr(ErrorMessage.Require)
            return false
        }
        if(Number(commssionRate) === 0) {
            setCommssionRateErr(ErrorMessage.ValueInvalid)
            return false
        }
        setCommssionRateErr('')
        return true
    }

    const valMaxRate = () => {
        if(!maxRate) {
            setMaxRateErr(ErrorMessage.Require)
            return false
        }
        if(Number(maxRate) === 0) {
            setMaxRateErr(ErrorMessage.ValueInvalid)
            return false
        }
        if(Number(maxRate) > 100) {
            setMaxRateErr(ErrorMessage.MaxRateMoreThanHundred)
            return false
        }
        setMaxRateErr('')
        return true
    }

    const valMaxChangeRate = () => {
        if(!maxChangeRate) {
            setMaxChangeRateErr(ErrorMessage.Require)
            return false
        }
        if(Number(maxChangeRate) === 0) {
            setMaxChangeRateErr(ErrorMessage.ValueInvalid)
            return false
        }
        setMaxChangeRateErr('')
        return true
    }

    const valMinSeftDelegation = () => {
        if(!minSeftDelegation) {
            setMaxMinSeftDelegationErr(ErrorMessage.Require)
            return false
        }
        if(Number(minSeftDelegation) === 0) {
            setMaxMinSeftDelegationErr(ErrorMessage.ValueInvalid)
            return false
        }
        setMaxMinSeftDelegationErr('')
        return true
    }

    const valAmountDel = () => {
        if(!amountDel) {
            setAmountDelErr(ErrorMessage.Require)
            return false
        }
        if(Number(amountDel) === 0) {
            setAmountDelErr(ErrorMessage.ValueInvalid)
            return false
        }
        
        if(Number(amountDel) < Number(minSeftDelegation)) {
            setAmountDelErr(ErrorMessage.DelBelowMinimum)
            return false
        }
        setAmountDelErr('')
        return true
    }

    const registerValidator = async () => {
        if(!valCommssionRate() || !valMaxRate() || !valMaxChangeRate() || !valMinSeftDelegation() || !valAmountDel()) {
            return
        }
        setIsLoading(true)
        let account = getAccount() as Account;
        const validator = await createValidator(Number(commssionRate), Number(maxRate), Number(maxChangeRate), Number(minSeftDelegation), account, Number(amountDel));
        console.log("Validator: ", validator);
        setIsLoading(false)
    }

    return (
        <>
            <Form fluid>
                <FormGroup>
                    <FormControl placeholder="Commission Rate*"
                        name="commssionRate"
                        value={commssionRate}
                        onChange={(value) => {
                            if (!value) {
                                setCommssionRateErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setCommssionRate(value)
                            }
                        }}/>
                    <ErrMessage message={commssionRateErr} />
                    <FormControl placeholder="Max Rate*"
                        name="maxRate"
                        value={maxRate}
                        onChange={(value) => {
                            if (!value) {
                                setMaxRateErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setMaxRate(value)
                            }
                        }} />
                    <ErrMessage message={maxRateErr} />
                    <FormControl placeholder="Max Change Rate*"
                        name="maxChangeRate"
                        value={maxChangeRate}
                        onChange={(value) => {
                            if (!value) {
                                setMaxChangeRateErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setMaxChangeRate(value)
                            }
                        }} />
                    <ErrMessage message={maxChangeRateErr} />
                    <FormControl placeholder="Min Seft Delegation*"
                        name="minSeftDelegation"
                        value={minSeftDelegation} 
                        onChange={(value) => {
                            if (!value) {
                                setMaxMinSeftDelegationErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setMinSeftDelegation(value)
                            }
                        }} />
                    <ErrMessage message={maxMinSeftDelegationErr} />
                    <FormControl placeholder="Amount Seft Delegation*"
                        name="amountDel" 
                        value={amountDel} 
                        onChange={(value) => {
                            if (!value) {
                                setAmountDelErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setAmountDel(value)
                            }
                        }} />
                    <ErrMessage message={amountDelErr} />
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