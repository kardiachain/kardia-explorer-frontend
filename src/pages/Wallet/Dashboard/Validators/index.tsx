import React, { useEffect, useState } from 'react'
import { Col, FlexboxGrid, List, Panel, Table } from 'rsuite';
import { weiToKAI } from '../../../../common/utils/amount';
import { renderHashString } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { getDelegationsByValidator, getValidator, isValidator } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
import '../dashboard.css'
import ValidatorCreate from './ValidatorCreate';

const { Column, HeaderCell, Cell } = Table;

const Validators = () => {

    const { isMobile } = useViewport()
    const [ isVal, setIsVal ] = useState(false);
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<ValidatorFromSMC>()
    const myAccount = getAccount() as Account
    
    useEffect(() => {
        (async () => {
            const isVal = await isValidator(myAccount.publickey);
            setIsVal(isVal)
            if (isVal) {
                const delegators = await getDelegationsByValidator(myAccount.publickey);
                const validator = await getValidator(myAccount.publickey)
                setDelegators(delegators)
                setValidator(validator)
            }
        })();
    }, [myAccount.publickey]);

    return (
        !isVal ? (
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div className="register-container">
                        <div className="register-form">
                            <Panel header={<h3>Register to become validator</h3>} shaded>
                                <FlexboxGrid>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                                        <ValidatorCreate />
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </Panel>
                        </div>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        ) : (
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                    <div className="del-list-container">
                        <Panel header={<h4>Your Delegators</h4>} shaded>
                            <Table
                                autoHeight
                                rowHeight={60}
                                data={delegators}
                            >
                                <Column width={isMobile ? 120 : 500} verticalAlign="middle">
                                    <HeaderCell>Delegator address</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {renderHashString(rowData.address, isMobile ? 10 : 50)} </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column width={isMobile ? 120 : 300} verticalAlign="middle">
                                    <HeaderCell>Share</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {weiToKAI(rowData.delegationsShares)} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                    <div className="val-info-container">
                        <Panel header={<h4>Validator information</h4>} shaded>
                            <List>
                                <List.Item>
                                    <span className="property-title">Validator address: </span> {validator?.address}
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Total delegator: </span> {validator?.totalDels}
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Voting power: </span> {validator?.votingPower}
                            </List.Item>
                            </List>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        )
    )
}

export default Validators;