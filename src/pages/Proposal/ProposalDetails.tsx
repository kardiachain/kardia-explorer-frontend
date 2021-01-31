import React, { useEffect, useState } from 'react'
import ReactJson from 'react-json-view';
import { useParams, useHistory } from 'react-router-dom';
import { Button, ButtonToolbar, Col, FlexboxGrid, Icon, List, Panel, Placeholder } from 'rsuite';
import { RenderStatus } from '.';
import { numberFormat } from '../../common/utils/number';
import { dateToUTCString, renderHashString } from '../../common/utils/string';
import { getProposalDetails } from '../../service/kai-explorer';
import ButtomCustom from '../../common/components/Button';
import { isLoggedIn } from '../../service/wallet';

const { Paragraph } = Placeholder;

const ProposalDetails = () => {

    const [loading, setLoading] = useState(true);
    const { proposalId }: any = useParams();
    const [proposal, setProposal] = useState<Proposal>();
    const history = useHistory();

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
                    <>
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
                                        <div className="property-title">Current Vote</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <ButtonToolbar>
                                            <Button color="blue" style={{marginRight: 10}}>
                                                <Icon icon="thumbs-up" /> Yes {numberFormat(proposal?.voteYes, 2)} %
                                            </Button>
                                            <Button color="red" >
                                                <Icon icon="thumbs-down" /> No {numberFormat(proposal?.voteNo, 2)} %
                                            </Button>
                                        </ButtonToolbar>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Proposal</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <ReactJson
                                            style={{
                                                fontSize: 12,
                                                color: 'white'
                                            }}
                                            name={false} src={ proposal?.params || {} } theme="ocean" />
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                        </List>
                        <ButtomCustom size="big" style={{ marginTop: '30px' }}
                            onClick={() => { isLoggedIn() ? history.push(`/wallet/proposal-vote/${proposal?.id}`) : history.push('/wallet') }}
                        >
                            Go to vote
                        </ButtomCustom>
                    </>
                }
            </Panel>
        </div>
    )
}

export default ProposalDetails;