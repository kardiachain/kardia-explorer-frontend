import React from 'react';
import { Dropdown, Icon } from 'rsuite';
import { useViewport } from '../../../context/ViewportContext';


const mainnetMode = process.env.REACT_APP_MAINNET_MODE === 'true' ? true : false;
const mainnetDisable = process.env.REACT_APP_MAINNET_DISABLE === 'true' ? true : false;
const mainnetLink = process.env.REACT_APP_MAINNET_LINK || ''
// const testnetDisable = process.env.REACT_APP_TESTNET_DISABLE === 'true' ? true : false;
// const testnetLink = process.env.REACT_APP_TESTNET_LINK || ''

const networkList = [
    // {
    //     label: 'Fengari Testnet 3.0',
    //     value: 'testnet-3.0',
    //     disabled: testnetDisable,
    //     link: testnetLink
    // },
    {
        label: 'Aris Mainnet 1.0',
        value: 'mainnet',
        disabled: mainnetDisable,
        link: mainnetLink
    }
]

const getNetworkLabel = () => {
    return mainnetMode ? 'Aris Mainnet 1.0' : 'Fengari Testnet 3.0'
}

export const NetworkSelect = () => {
    const { isMobile } = useViewport()
    const network = mainnetMode ? 'mainnet' : 'testnet-3.0';

    const selectNetworkHandle = (link: string) => {
        window.open(link);
    }

    return (
        <div className="network-select-wrapper">
            <Dropdown  icon={<Icon className={isMobile ? "gray-highlight" : ""} icon="cubes" />} activeKey={network} title={getNetworkLabel()}>
                {
                    networkList.map((networkItem) => {
                        return <Dropdown.Item
                            key={networkItem.value}
                            onSelect={() => selectNetworkHandle(networkItem.link) }
                            disabled={networkItem.disabled}>
                            {networkItem.label}
                        </Dropdown.Item>
                    })
                }
                {
                    !mainnetMode ? <Dropdown.Item eventKey="faucet" onSelect={() => window.open('/faucet')}>Faucet</Dropdown.Item> : <></>
                }   
            </Dropdown>
        </div>
    )
};
