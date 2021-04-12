import React, { useEffect, useState } from 'react'
import { Nav, Panel } from 'rsuite';
import { getAccount, getValidatorByDelegator } from '../../../../service';
import ClaimRewards from './ClaimRewards';
import WithdrawAmount from './WithdrawAmount';
import './style.css';

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
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    Delegated Validators
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">
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