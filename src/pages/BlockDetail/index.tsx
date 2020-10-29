import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Col, Divider, FlexboxGrid, List, Panel, Placeholder } from 'rsuite'
import { numberFormat } from '../../common/utils/number';
import { dateToLocalTime, renderHashString, renderHashToRedirect } from '../../common/utils/string';
import { getBlockBy } from '../../service/kai-explorer/block';
import './blockDetail.css'

const { Paragraph } = Placeholder;

const BlockDetail = () => {
    const history = useHistory()
    const [blockDetail, setBlockDetail] = useState<KAIBlockDetails>()
    const { block }: any = useParams();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const blockDetail = await getBlockBy(block);
            setBlockDetail(blockDetail)
            setLoading(false)
        })()
    }, [block])


    return (
        <div className="container block-detail-container">
            <h3>Block Details</h3>
            <Divider />
            <Panel shaded>
                {
                    loading ? <Paragraph style={{ marginTop: 30 }} rows={20} active={true} /> :
                    <List bordered={false}>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Height</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{blockDetail?.blockHeight}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Block Hash</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{renderHashString(blockDetail?.blockHash || '', 64)}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">TimeStamp</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{blockDetail?.time ? dateToLocalTime(blockDetail?.time) : ''}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Number Transactions</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">
                                        {renderHashToRedirect({
                                            hash: blockDetail?.transactions,
                                            headCount: 30,
                                            tailCount: 4,
                                            callback: () => { history.push(`/txs?block=${blockDetail?.blockHeight}`) }
                                        })}
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Gas Limit</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{numberFormat(blockDetail?.gasLimit || 0)}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Gas Used</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{numberFormat(blockDetail?.gasUsed || 0)}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Commit Hash</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{renderHashString(blockDetail?.commitHash || '', 64)}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Proposer</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{renderHashString(blockDetail?.validator || '', 64)}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Validator Hash</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{renderHashString(blockDetail?.validatorHash || '', 64)}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Data Hash</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{renderHashString(blockDetail?.dataHash || '', 64)}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">Consensus Hash</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{renderHashString(blockDetail?.consensusHash || '', 64)}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                    </List>
                }
            </Panel>

        </div>
    )
}

export default BlockDetail