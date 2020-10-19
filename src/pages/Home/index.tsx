import React from 'react';
import SearchSection from './SearchSection';
import './home.css'
import { Divider, FlexboxGrid, Col } from 'rsuite';
import TransactionSection from './TransactionSection';
import BlockSection from './BlockSection';

const Home = () => {
    return (
        <React.Fragment>
            <SearchSection />
            <div className="home-container">
                <Divider />
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                        <BlockSection />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                        <TransactionSection />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <Divider />
            </div>
        </React.Fragment>
    )
}

export default Home;