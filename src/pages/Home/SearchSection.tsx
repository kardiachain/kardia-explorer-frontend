import React from 'react';
import { Button, Col, FlexboxGrid, Icon, Input} from 'rsuite';
import { useViewport } from '../../context/ViewportContext';

const SearchSection = () => {
    const { isMobile } = useViewport();
    
    return (
        <div className="search-section">
            <FlexboxGrid justify="end">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="search-input-wrapper">
                        <Input size="lg" placeholder="Search by Address / TxHash / BlockHash ..." />
                        {
                            isMobile ?
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px' }}>
                                    <div>
                                        <Button appearance="primary" block>
                                            <Icon icon="search" /> Search
                                        </Button>
                                    </div>
                                </div>
                                :
                                <Button block appearance="primary">
                                    <Icon icon="search" /> Search
                                </Button>
                        }
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
};

export default SearchSection;