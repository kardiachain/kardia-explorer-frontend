import React, { useState } from 'react';
import { Dropdown } from 'rsuite';

const networkList = [
    {
        label: 'Archi Testnet 2.0',
        value: 'testnet-2.0',
        disabled: false
    },
    {
        label: 'Mainnet',
        value: 'mainnet',
        disabled: true
    }
]

const getNetworkLabel = (value: string) => {
    const networkItem = networkList.find((item) => item.value === value)
    return networkItem?.label
}

const NetworkSelect = () => {
    const [network, setNetwork] = useState('testnet-2.0')
    return (
        <div className="network-select-wrapper">
            <Dropdown activeKey={network} title={getNetworkLabel(network)}>
                {
                    networkList.map((networkItem) => {
                        return <Dropdown.Item key={networkItem.value} eventKey={networkItem.value} onSelect={(key) => setNetwork(key)} disabled={networkItem.disabled}>{networkItem.label}</Dropdown.Item>
                    })
                }
            </Dropdown>
        </div>
    )
};

export default NetworkSelect;