import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, List, Panel, Placeholder, Progress } from 'rsuite';
import { RenderStatus } from '.';
import { dateToUTCString, renderHashString } from '../../common/utils/string';
import { getCurrentNetworkParams, getProposalDetails, parseLabelNameByKey } from '../../service/kai-explorer';
import ButtomCustom from '../../common/components/Button';
import { isLoggedIn } from '../../service/wallet';
import { convertProposalValue } from '../../service/kai-explorer/proposal';

const { Paragraph } = Placeholder;
const { Line } = Progress;

const ProposalDetails = () => {

    const [loading, setLoading] = useState(true);
    const { proposalId }: any = useParams();
    const [proposal, setProposal] = useState<Proposal>({} as Proposal);
    const [currentNetworkParams, setCurrentNetworkParams] = useState<NetworkParams>({} as NetworkParams);
    const history = useHistory();

    useEffect(() => {
        (async () => {
            setLoading(true)
            const rs = await Promise.all([
                getProposalDetails(proposalId),
                getCurrentNetworkParams()
            ]);
            setProposal(rs[0])
            setCurrentNetworkParams(rs[1])
            setLoading(false)
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
                                {/* <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                            <div className="property-title">Current Vote</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            <ButtonToolbar>
                                                <Button color="blue" style={{ marginRight: 10 }}>
                                                    <Icon icon="thumbs-up" /> Yes {numberFormat(proposal?.voteYes, 2)} %
                                            </Button>
                                                <Button color="red" >
                                                    <Icon icon="thumbs-down" /> No {numberFormat(proposal?.voteNo, 2)} %
                                            </Button>
                                            </ButtonToolbar>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item> */}
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                            <div className="property-title">Vote Power</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            <div className="property-content" style={{ width: 200 }}>
                                                <Line percent={Number(parseFloat(String(proposal.voteYes)).toFixed(0))} status='active' strokeWidth={5} strokeColor={'#ffc107'} />
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                            <div className="property-title">Proposal</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            <div className="property-content">
                                                {
                                                    proposal.params ?
                                                        Object.keys(proposal.params).map(function (key: string, index: number) {
                                                            return (
                                                                <div key={index} style={{
                                                                    marginBottom: 10
                                                                }}>
                                                                    <span style={{
                                                                        marginRight: 10,
                                                                        display: 'inline-block',
                                                                        width: 200
                                                                    }}>{parseLabelNameByKey(key)}</span>
                                                                    <span style={{
                                                                        marginRight: 10,
                                                                        minWidth: 100,
                                                                        textAlign: 'center'
                                                                    }}>
                                                                        {
                                                                            key in currentNetworkParams ? (currentNetworkParams as any)[key] : ''
                                                                        }
                                                                    </span>
                                                                    <Icon className="cyan-highlight" style={{
                                                                        marginRight: 10
                                                                    }} icon="long-arrow-right" />
                                                                    <span
                                                                        style={{
                                                                            minWidth: 100,
                                                                            textAlign: 'center',
                                                                            fontWeight: 600,
                                                                            color: 'aqua'
                                                                        }}
                                                                    >
                                                                        {
                                                                            key in proposal.params ? convertProposalValue(key, (proposal.params as any)[key]) : ''
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )
                                                        }) : <></>
                                                }
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                            </List>
                            {
                                proposal.status === 0 ? (
                                    <ButtomCustom
                                        size="big"
                                        style={{ marginTop: '30px' }}
                                        onClick={() => { isLoggedIn() ? history.push(`/wallet/proposal-vote/${proposal?.id}`) : history.push('/wallet') }}>
                                        Go to vote
                                    </ButtomCustom>
                                ) : <></>
                            }
                        </>
                }
            </Panel>
        </div>
    )
}

export default ProposalDetails;