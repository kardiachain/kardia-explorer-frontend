import React from 'react'
import { Col, FlexboxGrid, List, Panel } from 'rsuite';

const CurrentNetwork = () => {

    return (
        <div className="current-network-container">
            <Panel className="overview panel-bg-gray" shaded>
                <List bordered={false}>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                <h3 className="property-title">Current network</h3>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Base Proposal Rewards</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Bonus Proposal Rewards</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Max Proposers</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Downtime Jail Duration</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Slash Fraction Downtime</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Slash Fraction Double Sign</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Signed Block Window </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Min Signed Per Window </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Min Stake </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Min Validator Stake </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Min Amount Change Name </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Min Self Delegation </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Inflation Rate Change </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Goal Bonded </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Blocks Per Year </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Inflation Max </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Inflation Min </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Deposit </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="property-title">Voting Period </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={18}>
                                <div className="property-content">
                                    
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                </List>
            </Panel>
        </div>
    )
}

export default CurrentNetwork;