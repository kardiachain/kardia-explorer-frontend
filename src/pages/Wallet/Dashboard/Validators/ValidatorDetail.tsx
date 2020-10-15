import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, Button, ButtonToolbar, Col, FlexboxGrid, Form, FormControl, FormGroup, List, Panel, Table } from 'rsuite';
import { renderHashString } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { delegateAction, getDelegationsByValidator } from '../../../../service/smc';
import { useWalletStorage } from '../../../../service/wallet';
import './validators.css';
const { Column, HeaderCell, Cell } = Table;

const ValidatorDetail = () => {
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const { isMobile } = useViewport();
    const [isLoading, setIsLoading] = useState(false)
    const [delAmount, setDelAmount] = useState(0)
    const query = new URLSearchParams(useLocation().search);
    const [errorMessage, setErrorMessage] = useState('')
    const [walletStored, setWalletStored] = useWalletStorage()

    useEffect(() => {
        const valAddr = query.get("id") || '';
        getDelegationsByValidator(valAddr).then(rs => {
            setDelegators(rs)
        });
    }, []);

    useEffect(() => {
        if(delAmount) {
            setErrorMessage('')
        }
    }, [delAmount]); 

    const submitDelegate = async () => {
        if(!delAmount) {
            setErrorMessage('This field is required')
            return;
        }
        setIsLoading(true)
        const valAddr = query.get("id") || '';
        let account = {
            publickey: walletStored.address,
            privatekey: walletStored.privatekey
        } as Account
        const delegate = await delegateAction(valAddr, account, Number(delAmount))
        console.log("Delegate: ", delegate);
        setIsLoading(false)
    }

    return (
        <>
            <Breadcrumb separator=">">
                <Breadcrumb.Item componentClass={Link} to="/dashboard/validators">
                    Staking
                </Breadcrumb.Item>
                <Breadcrumb.Item active componentClass={Link} to="/dashboard/validator">
                    Validator detail
                </Breadcrumb.Item>
            </Breadcrumb>
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                    <div className="val-info-container">
                        <Panel header={<h4>Validator information</h4>} bordered>
                            <List>
                                <List.Item>
                                    <span className="property-title">Validator address: </span> 0xff3dac4f04ddbd24de5d6039f90596f0a8bb08fd
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Commission: </span> 5%
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Total delegator: </span> 100
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Voting power: </span> 5%
                                </List.Item> 
                            </List>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                    <div className="del-staking-container">
                        <Panel header={<h4>Delegate for validator</h4>} shaded>
                            <Form fluid>
                                <FormGroup>
                                    <FormControl errorMessage={errorMessage} placeholder="Delegation amount*" value={delAmount} name="delAmount" type="number" onChange={setDelAmount}/>
                                </FormGroup>
                                <FormGroup>
                                    <ButtonToolbar>
                                        <Button appearance="primary" loading={isLoading} onClick={submitDelegate}>Delegator</Button>
                                    </ButtonToolbar>
                                </FormGroup>
                            </Form>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div className="del-list-container">
                        <h4>Delegator list</h4>
                        <Table
                            bordered
                            autoHeight
                            rowHeight={70}
                            data={delegators}
                            onRowClick={delegator => {
                                // console.log(delegator);
                                // history.push(`/dashboard/validator?id=${validator.address}`)
                            }}
                        >
                            <Column width={isMobile ? 120 : 500}>
                                <HeaderCell>Delegator address</HeaderCell>
                                <Cell>
                                    {(rowData: Delegator) => {
                                        return (
                                            <div>
                                                <div> {renderHashString(rowData.address, isMobile ? 10 : 50)} </div>
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column width={isMobile ? 120 : 300}>
                                <HeaderCell>Share</HeaderCell>
                                <Cell>
                                    {(rowData: Delegator) => {
                                        return (
                                            <div>
                                                <div> {rowData.delegationsShares} </div>
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                        </Table>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </>
    )
}

export default ValidatorDetail;