import React, { useEffect, useState } from 'react';
import { Col, ControlLabel, FlexboxGrid, Form, FormGroup, List, Modal, SelectPicker } from 'rsuite';
import { numberFormat, Button, NumberInputFormat, ErrMessage, ErrorMessage, formatAmount, weiToKAI } from '../../common';
import { useViewport } from '../../context/ViewportContext';
import { getLatestBlock } from '../../service';

interface ValidatorSelectList {
    label: string;
    value: Validator;
}

interface CalcResult {
    _30days: number;
    _90days: number;
    _180days: number;
    _365days: number;
    _apr: number;
}

const StakingCalculator = ({ showModal, setShowModal, validators, totalStakedAmount }: {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    validators: Validator[];
    totalStakedAmount: any;
}) => {

    const blockTime = 5
    const [isLoading, setIsLoading] = useState(false)
    const [validatorSelectList, setValidatorSelectList] = useState([] as ValidatorSelectList[])
    const [validator, setValidator] = useState<Validator>()
    const [validatorErr, setValidatorErr] = useState('')
    const [amount, setAmount] = useState('')
    const [amountErr, setAmountErr] = useState('')
    const [calcResult, setCalcResult] = useState<CalcResult>()
    const [blockReward, setBlockReward] = useState(0);
    const { isMobile } = useViewport()

    useEffect(() => {
        // Get blocks
        (async () => {
            const block = await getLatestBlock();
            setBlockReward(Number(weiToKAI(block.rewards)));
        })()

        const vals = validators && validators.length > 0 ? validators.map((item: Validator) => {
            return {
                label: `${item.name}`,
                value: item
            }
        }) : [] as ValidatorSelectList[]
        setValidatorSelectList(vals)
    }, [validators]);

    const validateAmount = (amount: any) => {
        if (!amount) {
            setAmountErr(ErrorMessage.Require)
            return false
        }

        if (Number(amount) < 1000) {
            setAmountErr("The minimum amount is 1,000")
            return false
        }

        if (Number(amount) > 1000000000) {
            setAmountErr("The maximum amount is 1,000,000,000")
            return false
        }

        setAmountErr('')
        return true
    }

    const validateValidator = (val: Validator) => {
        if (!val || !val.address) {
            setValidatorErr(ErrorMessage.Require)
            return false
        }

        setValidatorErr('')
        return true
    }

    const calculate = () => {
        if (!validateAmount(amount) || !validateValidator(validator || {} as Validator)) {
            return
        }
        setIsLoading(true)
        try {
            const commission = validator?.commissionRate ? Number(validator.commissionRate) / 100 : 0;
            const validatorStakedAmount = validator?.stakedAmount ? Number(weiToKAI(validator.stakedAmount)) + Number(amount) : 0;
            // Total staked amount of all network
            const netWorkStakedAmount = totalStakedAmount ? Number(weiToKAI(totalStakedAmount)) + Number(amount) : Number(weiToKAI(totalStakedAmount));

            const votingPower = validatorStakedAmount / netWorkStakedAmount;

            // Calculate reward for all delegator of validator for each block
            const delegatorsReward = blockReward * (1 - commission) * votingPower;

            // Calculate your reward on each block
            const yourReward = Number(amount) / validatorStakedAmount * delegatorsReward

            // Calculate staker earning 
            const _30days = yourReward * (30 * 24 * 3600) / blockTime;
            const _90days = yourReward * (90 * 24 * 3600) / blockTime;
            const _180days = yourReward * (180 * 24 * 3600) / blockTime;
            const _365days = yourReward * (365 * 24 * 3600) / blockTime;

            // Calculate APR (%)
            const _apr = yourReward * (365 * 24 * 3600) / blockTime / Number(amount) * 100;
            setCalcResult({
                _30days: _30days,
                _90days: _90days,
                _180days: _180days,
                _365days: _365days,
                _apr: _apr
            })
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)
    }

    const reset = () => {
        setValidator({} as Validator)
        setAmount('')
        setCalcResult(undefined)
        setAmountErr('')
        setValidatorErr('')
    }

    return (
        <Modal backdrop="static" size={isMobile ? 'sm' : 'md'} enforceFocus={true} show={showModal}
            onHide={() => {
                setShowModal(false)
                reset()
            }}>
            <Modal.Header>
                <Modal.Title>Staking Calculator</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24} style={{ marginBottom: 10 }}>
                                <ControlLabel className="color-white">Validator (required)</ControlLabel>
                                <SelectPicker
                                    placeholder="Choose validator"
                                    className="dropdown-custom"
                                    data={validatorSelectList}
                                    searchable={true}
                                    value={validator}
                                    onChange={(value) => {
                                        setValidator(value)
                                        setCalcResult(undefined)
                                        validateValidator(value)
                                    }}
                                    style={{ width: '100%' }}
                                />
                                <ErrMessage message={validatorErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24} style={{ marginBottom: 20 }}>
                                <ControlLabel className="color-white">Enter your KAI amount (required)</ControlLabel>
                                <NumberInputFormat
                                    decimalScale={18}
                                    value={amount}
                                    placeholder="Minimum amount is 1,000"
                                    className="input"
                                    onChange={(event) => {
                                        setAmount(event.value);
                                        validateAmount(event.value)
                                    }} />
                                <ErrMessage message={amountErr} />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FormGroup>
                </Form>
                {/* <Divider /> */}
                <FlexboxGrid justify="space-between">
                    {/* Validator's stats */}
                    {
                        validator && validator?.address ? (
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{ marginBottom: 20 }}>
                                <List>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} xs={24}>
                                                <div className="property-title fs-24" >Validator's Stats</div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-title">Validator Name</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-content">
                                                    {validator.name ? validator.name : ''}
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-title">Commission (%)</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-content">
                                                    {numberFormat(validator?.commissionRate || 0, 2)}
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-title">Staked Amount (KAI)</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-content">
                                                    {formatAmount(Number(weiToKAI(validator?.stakedAmount)))}
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-title">Voting Power (%)</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-content">
                                                    {validator?.votingPower || 0}
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                </List>
                            </FlexboxGrid.Item>
                        ) : <></>
                    }
                    {/* Calculate staker earning */}
                    {
                        calcResult ? (
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{ marginBottom: 20 }}>
                                <List>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} xs={24}>
                                                <div className="property-title fs-24">Estimated Earnings</div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-title">30 days</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-content">
                                                    {numberFormat(calcResult._30days, 0)} KAI
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-title">90 days</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-content">
                                                    {numberFormat(calcResult._90days, 0)} KAI
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-title">180 days</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-content">
                                                    {numberFormat(calcResult._180days, 0)} KAI
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-title">365 days</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-content">
                                                    {numberFormat(calcResult._365days, 0)} KAI
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-title">
                                                    <span>APR (%)</span>
                                                </div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                                <div className="property-content">
                                                    {numberFormat(calcResult._apr, 2)}
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} xs={24}>
                                                <div className="property-title">
                                                    <p style={{ fontStyle: 'italic', fontSize: '10px', color: '#ccc', wordBreak: 'initial' }}>*The current estimated rewards are based on current real-time network profile and staking dynamics. The actual results may be different and subjected to change.</p>
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                </List>
                            </FlexboxGrid.Item>
                        ) : <> </>
                    }
                </FlexboxGrid>
            </Modal.Body>
            <Modal.Footer>
                <Button className="kai-button-gray" onClick={reset}>
                    Reset
                </Button>
                <Button loading={isLoading} disable={validator && validator.address ? false : true} onClick={calculate}>
                    Calculate
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default StakingCalculator