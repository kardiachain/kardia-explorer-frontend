import React from 'react';
import SearchSection from './SearchSection';
import './home.css'
import { Divider } from 'rsuite';
import TransactionSection from './TransactionSection';
import BlockSection from './BlockSection';

const Home = () => {
    return (
        <React.Fragment>
            <SearchSection />
            <div className="home-container">
                <h3>Transactions</h3>
                <Divider />
                <TransactionSection />
                <h3>Blocks</h3>
                <Divider />
                <BlockSection />
            </div>
        </React.Fragment>
    )
}

export default Home;