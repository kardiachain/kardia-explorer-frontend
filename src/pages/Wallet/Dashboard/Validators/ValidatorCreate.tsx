import React, { useEffect, useState } from 'react'
import { Button, ButtonToolbar, Form, FormControl, FormGroup } from 'rsuite';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { onlyNumber } from '../../../../common/utils/number';
import { createValidator } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
const ValidatorCreate = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [commissionRate, setCommissionRate] = useState('')
    const [maxRate, setMaxRate] = useState('')
    const [maxChangeRate, setMaxChangeRate] = useState('')
    const [minSelfDelegation, setMinSelfDelegation] = useState('')
    const [amountDel, setAmountDel] = useState('')

    const [commissionRateErr, setCommissionRateErr] = useState('')
    const [maxRateErr, setMaxRateErr] = useState('')
    const [maxChangeRateErr, setMaxChangeRateErr] = useState('')
    const [maxMinSelfDelegationErr, setMaxMinSelfDelegationErr] = useState('')
    const [amountDelErr, setAmountDelErr] = useState('')

    useEffect(() => {
        if (commissionRate) setCommissionRateErr('');
    }, [commissionRate])

    useEffect(() => {
        if (maxRate) setMaxRateErr('');
    }, [maxRate])

    useEffect(() => {
        if (maxChangeRate) setMaxChangeRateErr('');
    }, [maxChangeRate])

    useEffect(() => {
        if (minSelfDelegation) setMaxMinSelfDelegationErr('');
    }, [minSelfDelegation])

    useEffect(() => {
        if (amountDel) setAmountDelErr('');
    }, [amountDel])

    const validateCommissionRate = () => {
        if (!commissionRate) {
            setCommissionRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(commissionRate) === 0) {
            setCommissionRateErr(ErrorMessage.ValueInvalid)
            return false
        }
        setCommissionRateErr('')
        return true
    }

    const validateMaxRate = () => {
        if (!maxRate) {
            setMaxRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(maxRate) === 0) {
            setMaxRateErr(ErrorMessage.ValueInvalid)
            return false
        }
        if (Number(maxRate) > 100) {
            setMaxRateErr(ErrorMessage.MaxRateMoreThanHundred)
            return false
        }
        setMaxRateErr('')
        return true
    }

    const validateMaxChangeRate = () => {
        if (!maxChangeRate) {
            setMaxChangeRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(maxChangeRate) === 0) {
            setMaxChangeRateErr(ErrorMessage.ValueInvalid)
            return false
        }
        setMaxChangeRateErr('')
        return true
    }

    const validateMinSelfDelegation = () => {
        if (!minSelfDelegation) {
            setMaxMinSelfDelegationErr(ErrorMessage.Require)
            return false
        }
        if (Number(minSelfDelegation) === 0) {
            setMaxMinSelfDelegationErr(ErrorMessage.ValueInvalid)
            return false
        }
        setMaxMinSelfDelegationErr('')
        return true
    }

    const validateAmountDel = () => {
        if (!amountDel) {
            setAmountDelErr(ErrorMessage.Require)
            return false
        }
        if (Number(amountDel) === 0) {
            setAmountDelErr(ErrorMessage.ValueInvalid)
            return false
        }

        if (Number(amountDel) < Number(minSelfDelegation)) {
            setAmountDelErr(ErrorMessage.DelBelowMinimum)
            return false
        }
        setAmountDelErr('')
        return true
    }

    const registerValidator = async () => {
        if (!validateCommissionRate() || !validateMaxRate() || !validateMaxChangeRate() || !validateMinSelfDelegation() || !validateAmountDel()) {
            return
        }
        setIsLoading(true)
        let account = getAccount() as Account;
        await createValidator(Number(commissionRate), Number(maxRate), Number(maxChangeRate), Number(minSelfDelegation), account, Number(amountDel));
        setIsLoading(false)
    }

    return (
        <Form fluid>
            <FormGroup>
                <FormControl placeholder="Commission Rate*"
                    name="commissionRate"
                    value={commissionRate}
                    onChange={(value) => {
                        if (!value) {
                            setCommissionRateErr(ErrorMessage.Require)
                        }
                        if (onlyNumber(value)) {
                            setCommissionRate(value)
                        }
                    }} />
                <ErrMessage message={commissionRateErr} />
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
                <FormControl placeholder="Min Self Delegation*"
                    name="minSelfDelegation"
                    value={minSelfDelegation}
                    onChange={(value) => {
                        if (!value) {
                            setMaxMinSelfDelegationErr(ErrorMessage.Require)
                        }
                        if (onlyNumber(value)) {
                            setMinSelfDelegation(value)
                        }
                    }} />
                <ErrMessage message={maxMinSelfDelegationErr} />
                <FormControl placeholder="Amount Self Delegation*"
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
    );
}

export default ValidatorCreate;