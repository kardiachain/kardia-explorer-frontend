import React, { useEffect, useState } from 'react'
import { Icon, Nav, Panel } from 'rsuite';
import { getValidatorByDelegator } from '../../../../service/kai-explorer';
import { getAccount } from '../../../../service/wallet';
import ClaimRewards from './ClaimRewards';
import WithdrawAmount from './WithdrawAmount';
import './stype.css';

const Delegator = () => {
    const [yourValidators, setYourValidators] = useState([] as YourValidator[]);
    const myAccount = getAccount() as Account
    const [activeKey, setActiveKey] = useState("rewards");

    useEffect(() => {
        (async () => {
            const yourVals = await getValidatorByDelegator(myAccount.publickey)
            setYourValidators(yourVals)
        })()
    }, [myAccount.publickey]);

    const reFetchData = async () => {
        const yourVals = await getValidatorByDelegator(myAccount.publickey)
        setYourValidators(yourVals)
    }

    return (
        <div>
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="group" />
                    <p style={{ marginLeft: '12px' }} className="title">Your validators</p>
                </div>
            </div>
            <Panel shaded>
                <div className="custom-nav">
                    <Nav
                        appearance="subtle"
                        activeKey={activeKey}
                        onSelect={setActiveKey}
                        style={{ marginBottom: 20 }}>
                        <Nav.Item eventKey="rewards">
                            {`Claim Rewards`}
                        </Nav.Item>
                        <Nav.Item eventKey="withdraw">
                            {`Withdraw`}
                        </Nav.Item>
                    </Nav>
                </div>

                {(() => {
                    switch (activeKey) {
                        case 'rewards':
                            return (
                                <ClaimRewards yourValidators={yourValidators} reFetchData={reFetchData} />
                            );
                        case 'withdraw':
                            return (
                                <WithdrawAmount yourValidators={yourValidators} reFetchData={reFetchData} />
                            );
                    }
                })()}
            </Panel>
        </div>
    )
}

export default Delegator;