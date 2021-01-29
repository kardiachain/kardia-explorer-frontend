import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Button, ButtonToolbar, Col, FlexboxGrid, Icon, List, Panel, Placeholder } from 'rsuite';
import { RenderStatus } from '.';
import { dateToUTCString, renderHashString } from '../../common/utils/string';
import { getProposalDetails } from '../../service/kai-explorer';

const { Paragraph } = Placeholder;

const ProposalDetails = () => {

    const [loading, setLoading] = useState(true)
    const { proposalId }: any = useParams();
    const [proposal, setProposal] = useState<Proposal>();

    useEffect(() => {
        (async () => {
            setLoading(true)
            const _proposal = await getProposalDetails(proposalId);
            if (_proposal) {
                setProposal(_proposal)
                setLoading(false)
            }

        })()
    }, [proposalId])

    return (
        <div className="container proposal-detail-container">
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    Proposal Details
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">
                {
                    loading ? <Paragraph style={{ marginTop: 30 }} rows={20} active={true} /> :
                        <List bordered={false}>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">ID</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{proposal?.id}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Nominator</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{renderHashString(proposal?.nominator || '', 42)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Start Time</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content"><Icon className="cyan-highlight" icon="clock-o" style={{ marginRight: 5 }} />{dateToUTCString(proposal?.startTime) || ''}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">End Time</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content"><Icon className="orange-highlight" icon="clock-o" style={{ marginRight: 5 }} />{dateToUTCString(proposal?.endTime) || ''}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Status</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">
                                            <RenderStatus status={proposal?.status || 0} />
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Vote</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <ButtonToolbar>
                                            <Button color="blue" style={{marginRight: 10}}>
                                                <Icon icon="thumbs-up" /> Yes {proposal?.voteYes}
                                            </Button>
                                            <Button color="red" >
                                                <Icon icon="thumbs-down" /> No {proposal?.voteNo}
                                            </Button>
                                        </ButtonToolbar>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                        </List>
                }
            </Panel>
        </div>
    )
}

export default ProposalDetails;