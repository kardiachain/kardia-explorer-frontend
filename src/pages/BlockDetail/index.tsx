import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { Col, Divider, FlexboxGrid, List, Panel } from 'rsuite'
import { numberFormat } from '../../common/utils/number';
import { dateToLocalTime, renderHashToRedirect } from '../../common/utils/string';
import { getBlockBy } from '../../service/kai-explorer/block';
import './blockDetail.css'

const BlockDetail = () => {
    const history = useHistory()
    const query = new URLSearchParams(useLocation().search);
    const blockHash = query.get("block") || '';
    const [blockDetail, setBlockDetail] = useState<KAIBlockDetails>()

    useEffect(() => {
        (async () => {
            const block = await getBlockBy(blockHash);
            setBlockDetail(block)
        })()
    }, [blockHash])


    return (
        <div className="block-detail-container">
            <h3>Block Details</h3>
            <Divider />
            <Panel shaded>
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
                                <div className="content">{blockDetail?.blockHash}</div>
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
                                    {renderHashToRedirect(blockDetail?.transactions, 30, () => { history.push(`/txs?block=${blockDetail?.blockHeight}`) })}
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
                                <div className="content">{blockDetail?.commitHash}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Validator</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{blockDetail?.validator}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Validator Hash</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{blockDetail?.validatorHash}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Data Hash</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{blockDetail?.dataHash}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Consensus Hash</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{blockDetail?.consensusHash}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                </List>
            </Panel>
        </div>
    )
}

export default BlockDetail