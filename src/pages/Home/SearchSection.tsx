import React from 'react';
import { Button, Icon, Input } from 'rsuite';

const SearchSection = () => {
    return (
        <div className="search-section">
            <div className="search-input-wrapper">
                <Input size="lg" placeholder="Search by Address / TxHash / BlockHash ..." />
                <Button appearance="primary">
                    <Icon icon="search"  /> Search
                </Button>
            </div>
        </div>
    )
};

export default SearchSection;