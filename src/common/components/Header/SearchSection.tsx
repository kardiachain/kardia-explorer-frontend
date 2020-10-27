import React from 'react';
import { Icon, Input, InputGroup} from 'rsuite';

const SearchSection = () => {
    
    return (
        <div className="search-wrapper">
            <InputGroup inside>
                <Input placeholder="Search by Address / TxHash / BlockHash ..." />
                <InputGroup.Button>
                    <Icon icon="search" />
                </InputGroup.Button>
            </InputGroup>
        </div>
    )
};

export default SearchSection;