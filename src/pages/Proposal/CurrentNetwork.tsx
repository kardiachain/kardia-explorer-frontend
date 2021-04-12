import React from 'react'
import { Col, FlexboxGrid, List, Modal } from 'rsuite';
import { numberFormat } from '../../common';
import { useViewport } from '../../context/ViewportContext';

const CurrentNetwork = ({ showModal, setShowModal, currentNetworkParams }: {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    currentNetworkParams: NetworkParams;
}) => {

    const { isMobile } = useViewport()

    return (
        <Modal size={isMobile ? 'sm' : 'lg'} enforceFocus={true} show={showModal}
            onHide={() => {
                setShowModal(false)
            }}>
            <Modal.Header>
                <Modal.Title>Current Network Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <List bordered={false}>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Base Proposal Rewards</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.baseProposerReward} (%)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Bonus Proposal Rewards</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.bonusProposerReward} (%)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Max Proposers</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.maxProposers}
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Downtime Jail Duration</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {numberFormat(currentNetworkParams.downtimeJailDuration)} (s)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Slash Fraction Downtime</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.slashFractionDowntime} (%)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Slash Fraction Double Sign</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.slashFractionDoubleSign} (%)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Signed Block Window </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.signedBlockWindow}
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Min Signed Per Window </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.minSignedPerWindow}
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Min Stake </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {numberFormat(currentNetworkParams.minStake)} (KAI)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Min Validator Stake </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {numberFormat(currentNetworkParams.minValidatorStake)} (KAI)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Min Amount Change Name </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {numberFormat(currentNetworkParams.minAmountChangeName)} (KAI)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Inflation Rate Change </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.inflationRateChange} (%)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Goal Bonded </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.goalBonded} (%)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Blocks Per Year </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {numberFormat(currentNetworkParams.blocksPerYear)} (Blocks)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Inflation Max </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.inflationMax} (%)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Inflation Min </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {currentNetworkParams.inflationMin} (%)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Deposit </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {numberFormat(currentNetworkParams.deposit)} (KAI)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="property-title">Voting Period </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="property-content">
                                    {numberFormat(currentNetworkParams.votingPeriod)} (s)
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                </List>
            </Modal.Body>
        </Modal>
    )
}

export default CurrentNetwork;