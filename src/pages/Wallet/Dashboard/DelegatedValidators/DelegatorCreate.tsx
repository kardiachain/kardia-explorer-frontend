import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Alert, Button, ButtonToolbar, Col, FlexboxGrid, Form, FormControl, FormGroup, List, Panel, Table } from 'rsuite';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { weiToKAI } from '../../../../common/utils/amount';
import { onlyNumber } from '../../../../common/utils/number';
import { renderHashString, renderHashToRedirect } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { delegateAction, getDelegationsByValidator, getValidator } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
// import './validators.css';
const { Column, HeaderCell, Cell } = Table;

const DelegatorCreate = () => {
    const history = useHistory()
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<ValidatorFromSMC>()
    const { isMobile } = useViewport();
    const [isLoading, setIsLoading] = useState(false)
    const [delAmount, setDelAmount] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [hashTransaction, setHashTransaction] = useState('')
    const { valAddr }: any = useParams();

    useEffect(() => {
        getDelegationsByValidator(valAddr).then(setDelegators);
        getValidator(valAddr).then(setValidator)
        
    }, [valAddr]);

    useEffect(() => {
        if (delAmount) {
            setErrorMessage('')
        }
    }, [delAmount]);

    const submitDelegate = async () => {
        if (!delAmount) {
            setErrorMessage(ErrorMessage.Require)
            return;
        }
        if (Number(delAmount) === 0) {
            setErrorMessage(ErrorMessage.ValueInvalid)
            return;
        }
        setIsLoading(true)
        let account = getAccount() as Account
        const delegate = await delegateAction(valAddr, account, Number(delAmount))

        if (delegate && delegate.transactionHash) {
            Alert.success('Delegate success.')
            setHashTransaction(delegate.transactionHash)
        }
        setIsLoading(false)
    }

    return (
        <>
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="val-info-container">
                        <Panel header={<h4>{`Validator: ${valAddr}`}</h4>} shaded>
                            <List bordered={false}>
                                <List.Item bordered={false}>
                                    <span className="property-title">Commission: </span> {validator?.commission || 0}
                                </List.Item>
                                <List.Item bordered={false}>
                                    <span className="property-title">Total delegator: </span> {validator?.totalDels}
                                </List.Item>
                                <List.Item bordered={false}>
                                    <span className="property-title">Voting power: </span> {validator?.votingPower}
                                </List.Item>
                            </List>
                            <div className="del-staking-container">
                                <Form fluid>
                                    <FormGroup>
                                        <div className="label">Delegation amount*:</div>
                                        <FormControl
                                            placeholder="Delegation amount*"
                                            value={delAmount} name="delAmount"
                                            onChange={(value) => {
                                                if (!value) {
                                                    setErrorMessage(ErrorMessage.Require)
                                                }
                                                if (onlyNumber(value)) {
                                                    setDelAmount(value)
                                                }
                                            }} />
                                        <ErrMessage message={errorMessage} />
                                    </FormGroup>
                                    <FormGroup>
                                        <ButtonToolbar>
                                            <Button  appearance="primary" loading={isLoading} onClick={submitDelegate}>Delegate</Button>
                                        </ButtonToolbar>
                                    </FormGroup>
                                </Form>
                                {
                                    hashTransaction ? <div style={{ marginTop: '20px' }}> Txs create validator: {renderHashToRedirect({
                                        hash: hashTransaction,
                                        headCount: 50,
                                        tailCount: 4,
                                        callback: () => { history.push(`/tx/${hashTransaction}`) }
                                    })}</div> : <></>
                                }
                            </div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div className="del-list-container">
                        <Panel header={<h4>Delegators</h4>} shaded>
                            <Table
                                autoHeight
                                rowHeight={60}
                                data={delegators}
                            >
                                <Column width={isMobile ? 120 : 500} verticalAlign="middle">
                                    <HeaderCell>Delegator Address</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {renderHashString(rowData.address, isMobile ? 10 : 50)} </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column width={isMobile ? 120 : 300} verticalAlign="middle">
                                    <HeaderCell>Staked Amount</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {weiToKAI(rowData.stakeAmount)} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column width={isMobile ? 120 : 300} verticalAlign="middle">
                                    <HeaderCell>Rewards Amount</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {weiToKAI(rowData.rewardsAmount)} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </>
    )
}

export default DelegatorCreate;