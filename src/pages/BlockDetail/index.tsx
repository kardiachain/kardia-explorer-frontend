import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, List, Panel, Placeholder } from 'rsuite'
import { numberFormat } from '../../common/utils/number';
import { dateToLocalTime, renderHashString, renderHashToRedirect } from '../../common/utils/string';
import { getBlockBy } from '../../service/kai-explorer/block';
import './blockDetail.css'

const { Paragraph } = Placeholder;

const BlockDetail = () => {
    const [blockDetail, setBlockDetail] = useState<KAIBlockDetails>()
    const { block }: any = useParams();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        // Refetch txD
        const fetchBlockDetail = setInterval(async () => {
            const blockDetail = await getBlockBy(block);
            if (blockDetail.blockHash) {
                setBlockDetail(blockDetail)
                setLoading(false)
                clearInterval(fetchBlockDetail)
            }
        }, 1000)
        return () => clearInterval(fetchBlockDetail);
    }, [block])


    return (
        <div className="container block-detail-container">
            {/* <h3>Block Details</h3>
            <Divider /> */}
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="cube" size={"2x"} />
                    <p style={{ marginLeft: '12px' }} className="title">Block Details</p>
                </div>
            </div>
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
                                        <div className="content">{numberFormat(Number(blockDetail?.blockHeight))}</div>
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
                                            {!blockDetail?.transactions ? 0 :
                                                <Link to={`/txs?block=${blockDetail?.blockHeight}`}>{numberFormat(Number(blockDetail?.transactions))}</Link>
                                            }
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
                                        <div className="content">{
                                            renderHashToRedirect({
                                                hash: blockDetail?.validator,
                                                headCount: 50,
                                                tailCount: 4,
                                                showTooltip: false,
                                                callback: () => { window.open(`/address/${blockDetail?.validator}`) }
                                            })
                                        }</div>
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
                                        <div className="title">Next Validator Hash</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="content">{renderHashString(blockDetail?.nextValidatorHash || '', 64)}</div>
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