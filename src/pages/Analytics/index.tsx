import React from 'react'
import DailyNewAddress from './charts/DailyNewAddress';
import DailyNewContract from './charts/DailyNewContract';
import DailyStakingChart from './charts/DailyStakingChart';
import DailyTransactions from './charts/DailyTransactions';

const Analytics = () => {

    return (
        <div className="container">
            <div style={{ marginBottom: 20 }}>
                <DailyTransactions />
            </div>
            <div style={{ marginBottom: 20 }}>
                <DailyNewAddress />
            </div>
            <div style={{ marginBottom: 20 }}>
                <DailyNewContract />
            </div>
            <div>
                <DailyStakingChart />
            </div>
        </div>
    )
}

export default Analytics;