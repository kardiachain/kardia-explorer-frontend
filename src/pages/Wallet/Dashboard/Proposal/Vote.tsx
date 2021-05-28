import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ButtonToolbar, Col, FlexboxGrid, Icon, List, Modal, Panel, Placeholder, Progress } from 'rsuite';
import { RenderStatus } from '../../../Proposal';
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom';
import {
    Button as ButtomCustom,
    dateToUTCString,
    renderHashString,
    ShowNotifyErr,
    ShowNotify
} from '../../../../common';
import { isExtensionWallet, getProposalDetails, voting, proposalVotingByEW } from '../../../../service';

const { Paragraph } = Placeholder;
const { Line } = Progress;

const Vote = () => {

    const [loading, setLoading] = useState(true)
    const { proposalId }: any = useParams();
    const [proposal, setProposal] = useState<Proposal>({} as Proposal);
    const [showModelConfirm, setShowModelConfirm] = useState(false)
    const [voteOption, setVoteOption] = useState(1)
    const [submitLoading, setSubmitLoading] = useState(false)

    const walletLocalState = useRecoilValue(walletState)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const rs = await Promise.all([
                getProposalDetails(proposalId)
            ])
            setProposal(rs[0])
            setLoading(false)
        })()
    }, [proposalId])

    const fetchData = async () => {
        setLoading(true)
        const _proposal = await getProposalDetails(proposalId);
        if (_proposal) {
            setProposal(_proposal)
            setLoading(false)
        }
    }

    const vote = async (option: number) => {
        setVoteOption(option)
        setShowModelConfirm(true)
    }

    const confirmVote = async () => {
        setSubmitLoading(true)
        try {
            if (isExtensionWallet()) {
                await proposalVotingByEW(Number(proposalId), voteOption)
                fetchData();
            } else {
                const rs = await voting(walletLocalState.account, Number(proposalId), voteOption)
                ShowNotify(rs)
            }
        } catch (error) {
            ShowNotifyErr(error)
        }
        setSubmitLoading(false)
        setShowModelConfirm(false)
    }

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    Proposal Voting
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
                                            <div className="property-title">Community Votes</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            <ButtonToolbar>
                                                <Button color="blue" style={{ marginRight: 10 }}>
                                                    <Icon icon="thumbs-up" /> Yes {proposal?.numberOfVoteYes}
                                                </Button>
                                                <Button color="red" >
                                                    <Icon icon="thumbs-down" /> No {proposal?.numberOfVoteNo}
                                                </Button>
                                            </ButtonToolbar>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                            <div className="property-title">Validator Votes</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            <div className="property-content" style={{ width: 200 }}>
                                                <Line percent={Number(parseFloat(String(proposal.voteYes)).toFixed(0))} status='active' strokeWidth={5} strokeColor={'#ffc107'} />
                                            </div>
                                            <div className="property-content" style={{ width: 200 }}>
                                                <Line percent={Number(parseFloat(String(proposal.validatorVotes)).toFixed(0))} status='active' strokeWidth={5} strokeColor={'#ffc107'} />
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
                                                        proposal.params.map((item: ProposalParams, index: number) => {
                                                            return (
                                                                <div key={index} style={{
                                                                    marginBottom: 10
                                                                }}>
                                                                    <span style={{
                                                                        marginRight: 10,
                                                                        display: 'inline-block',
                                                                        width: 100
                                                                    }}>{item.labelName}</span>
                                                                    <span style={{
                                                                        marginRight: 10,
                                                                        minWidth: 50,
                                                                        textAlign: 'center'
                                                                    }}>{item.fromValue}</span>
                                                                    <Icon className="cyan-highlight" style={{
                                                                        marginRight: 10
                                                                    }} icon="long-arrow-right" />
                                                                    <span
                                                                        style={{
                                                                            minWidth: 50,
                                                                            textAlign: 'center',
                                                                            fontWeight: 600,
                                                                            color: 'aqua'
                                                                        }}
                                                                    >{item.toValue}</span>
                                                                </div>
                                                            )
                                                        }) : <></>
                                                }
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                            </List>
                            <FlexboxGrid style={{ marginTop: 30 }}>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} xs={24}>
                                    <ButtomCustom size="big" style={{ minWidth: 200, marginLeft: 0 }} onClick={() => { vote(1) }}>
                                        <Icon icon="thumbs-up" /> Vote Yes
                                    </ButtomCustom>
                                    <ButtomCustom size="big" style={{ minWidth: 200 }} onClick={() => { vote(2) }} className="kai-button-gray">
                                        <Icon icon="thumbs-down" /> Vote No
                                    </ButtomCustom>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </>
                }
            </Panel>
            {/* Modal confirm when create proposal */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showModelConfirm} onHide={() => { setShowModelConfirm(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm vote</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter" style={{ textAlign: 'center' }}>
                        Are you sure you want to vote for this proposal
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <ButtomCustom className="kai-button-gray" onClick={() => { setShowModelConfirm(false) }}>
                        Cancel
                    </ButtomCustom>
                    <ButtomCustom loading={submitLoading} onClick={confirmVote}>
                        Confirm
                    </ButtomCustom>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Vote;