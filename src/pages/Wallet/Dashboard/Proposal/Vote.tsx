import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ButtonToolbar, Col, FlexboxGrid, Icon, List, Panel, Placeholder } from 'rsuite';
import { dateToUTCString, renderHashString } from '../../../../common/utils/string';
import { getProposalDetails } from '../../../../service/kai-explorer';
import { RenderStatus } from '../../../Proposal';
import ButtomCustom from '../../../../common/components/Button';
import { voting } from '../../../../service/smc/proposal';
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import { NotifiMessage } from '../../../../common/constant/Message';
import { numberFormat } from '../../../../common/utils/number';
import ReactJson from 'react-json-view';

const { Paragraph } = Placeholder;

const Vote = () => {

    const [loading, setLoading] = useState(true)
    const { proposalId }: any = useParams();
    const [proposal, setProposal] = useState<Proposal>();
    const [voteYesLoading, setVoteYesLoading] = useState(false);
    const [voteNoLoading, setVoteNoLoading] = useState(false);
    
    const walletLocalState = useRecoilValue(walletState)

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

    const fetchData = async () => {
        setLoading(true)
        const _proposal = await getProposalDetails(proposalId);
        if (_proposal) {
            setProposal(_proposal)
            setLoading(false)
        }
    }

    const vote = async (option: number) => {
        if (option === 1) {
            setVoteYesLoading(true)
        } else {
            setVoteNoLoading(true)
        }
        try {
            const rs = await voting(walletLocalState.account, Number(proposalId), option)
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
        if (option === 1) {
            setVoteYesLoading(false)
        } else {
            setVoteNoLoading(false)
        }

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
                            <FlexboxGrid style={{marginTop: 30}}>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} xs={24}>
                                    <ButtomCustom size="big" loading={voteYesLoading} style={{ minWidth: 200, marginLeft: 0}} onClick={() => {vote(1)}}>
                                        <Icon icon="thumbs-up" /> Vote Yes
                                    </ButtomCustom>
                                    <ButtomCustom size="big" loading={voteNoLoading} style={{ minWidth: 200 }} onClick={() => {vote(2)}} className="kai-button-gray">
                                        <Icon icon="thumbs-down" /> Vote No
                                    </ButtomCustom>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </>
                }
            </Panel>
        </div>
    )
}

export default Vote;