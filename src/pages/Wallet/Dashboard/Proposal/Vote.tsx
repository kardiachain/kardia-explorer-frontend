import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, List, Modal, Panel, Placeholder, Progress } from 'rsuite';
import { dateToUTCString, renderHashString } from '../../../../common/utils/string';
import { getCurrentNetworkParams, getProposalDetails, parseLabelNameByKey } from '../../../../service/kai-explorer';
import { RenderStatus } from '../../../Proposal';
import ButtomCustom from '../../../../common/components/Button';
import { voting } from '../../../../service/smc/proposal';
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import { NotifiMessage } from '../../../../common/constant/Message';
import { convertProposalValue } from '../../../../service/kai-explorer/proposal';
import Button from '../../../../common/components/Button';
import { proposalVotingByEW } from '../../../../service/extensionWallet';
import { isExtensionWallet } from '../../../../service/wallet';

const { Paragraph } = Placeholder;
const { Line } = Progress;

const Vote = () => {

    const [loading, setLoading] = useState(true)
    const { proposalId }: any = useParams();
    const [proposal, setProposal] = useState<Proposal>({} as Proposal);
    const [voteYesLoading, setVoteYesLoading] = useState(false);
    // const [voteNoLoading, setVoteNoLoading] = useState(false);
    const [currentNetworkParams, setCurrentNetworkParams] = useState<NetworkParams>({} as NetworkParams)
    const [showModelConfirm, setShowModelConfirm] = useState(false)
    
    const walletLocalState = useRecoilValue(walletState)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const rs = await Promise.all([
                getProposalDetails(proposalId),
                getCurrentNetworkParams()
            ])
            setProposal(rs[0])
            setCurrentNetworkParams(rs[1])
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
        setShowModelConfirm(true)
    }

    const confirmVote = async () => {
        setVoteYesLoading(true)
        try {
            if (isExtensionWallet()) {
                await proposalVotingByEW(Number(proposalId), 1)
            } else {
                const rs = await voting(walletLocalState.account, Number(proposalId), 1)
                if (rs && rs.status === 1) {
                    NotificationSuccess({
                        description: NotifiMessage.TransactionSuccess,
                        callback: () => { window.open(`/tx/${rs.transactionHash}`) },
                        seeTxdetail: true
                    });
                    fetchData();
                } else {
                    NotificationError({
                        description: NotifiMessage.TransactionError,
                        callback: () => { window.open(`/tx/${rs.transactionHash}`) },
                        seeTxdetail: true
                    });
                }
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                });
            } catch (error) {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        }
        setVoteYesLoading(false)
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
                                            <div className="property-title">Current Vote</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            {/* <ButtonToolbar>
                                                <Button color="blue" style={{ marginRight: 10 }}>
                                                    <Icon icon="thumbs-up" /> Yes {numberFormat(proposal?.voteYes, 2)} %
                                                </Button>
                                                <Button color="red" >
                                                    <Icon icon="thumbs-down" /> No {numberFormat(proposal?.voteNo, 2)} %
                                                </Button>
                                            </ButtonToolbar> */}
                                            <div className="property-content" style={{width: 200}}>
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
                            <FlexboxGrid style={{marginTop: 30}}>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} xs={24}>
                                    <ButtomCustom size="big" loading={voteYesLoading} style={{ minWidth: 200, marginLeft: 0}} onClick={() => {vote(1)}}>
                                        <Icon icon="thumbs-up" /> Vote Yes
                                    </ButtomCustom>
                                    {/* <ButtomCustom size="big" loading={voteNoLoading} style={{ minWidth: 200 }} onClick={() => {vote(2)}} className="kai-button-gray">
                                        <Icon icon="thumbs-down" /> Vote No
                                    </ButtomCustom> */}
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
                    {/* <div className="confirm-letter" style={{ textAlign: 'center', color: '#FF8585' }}>
                        You must pay 500,000 KAI to create proposal.
                    </div> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="kai-button-gray" onClick={() => { setShowModelConfirm(false) }}>
                        Cancel
                    </Button>
                    <Button loading={voteYesLoading} onClick={confirmVote}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Vote;