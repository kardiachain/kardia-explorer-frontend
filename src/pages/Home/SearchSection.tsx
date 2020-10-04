import React from 'react';
import { Button, Icon, Input } from 'rsuite';
import { useViewport } from '../../context/ViewportContexrt';

const SearchSection = () => {
    const {isMobile} = useViewport();
    return (
        <div className="search-section">
            <div className="search-input-wrapper">
                <Input block size="lg" placeholder="Search by Address / TxHash / BlockHash ..." />
                {
                    isMobile ? 
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px'}}>
                        <div style={{width: '47%'}}>
                            <Button appearance="primary" block>
                                <Icon icon="search"  /> Search
                            </Button>
                        </div>
                        <div style={{width: '47%'}}>
                            <Button appearance="ghost" block>
                                <Icon icon="qrcode"  /> Scan QR code
                            </Button>
                        </div>
                    </div>
                    :
                    <Button block appearance="primary">
                        <Icon icon="search"  /> Search
                    </Button>
                }
            </div>
        </div>
    )
};

export default SearchSection;