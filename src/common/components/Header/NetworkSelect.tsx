import React, { useState } from 'react';
import { Dropdown } from 'rsuite';

const networkList = [
    {
        label: 'Fengari Testnet 3.0',
        value: 'testnet-3.0',
        disabled: false
    }
]

const getNetworkLabel = (value: string) => {
    const networkItem = networkList.find((item) => item.value === value)
    return networkItem?.label
}

const NetworkSelect = () => {
    const [network, setNetwork] = useState('testnet-3.0')
    return (
        <div className="network-select-wrapper">
            <Dropdown activeKey={network} title={getNetworkLabel(network)}>
                {
                    networkList.map((networkItem) => {
                        return <Dropdown.Item key={networkItem.value} eventKey={networkItem.value} onSelect={(key) => setNetwork(key)} disabled={networkItem.disabled}>{networkItem.label}</Dropdown.Item>
                    })
                }
                <Dropdown.Item eventKey="faucet" href="/faucet">Fengari Faucet</Dropdown.Item>
            </Dropdown>
        </div>
    )
};

export default NetworkSelect;