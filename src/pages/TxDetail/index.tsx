import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Col, Divider, FlexboxGrid, List, Panel, Tag } from 'rsuite';
import { weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { dateToLocalTime, renderHashToRedirect } from '../../common/utils/string';
import { getTxByHash } from '../../service/kai-explorer';
import './txDetail.css'

const TxDetail = () => {
    const history = useHistory();
    const { txHash }: any = useParams();
    const [txDetail, setTxDetail] = useState<KAITransaction>()

    useEffect(() => {
        (async () => {
            const tx = await getTxByHash(txHash);
            setTxDetail(tx)
        })()
    }, [txHash])

    return (
        <div className="tx-detail-container">
            <h3>Transaction Details</h3>
            <Divider />
            <Panel shaded>
                <List bordered={false}>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Transaction Hash</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{txDetail?.txHash}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Block Number</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{renderHashToRedirect(txDetail?.blockNumber, 30, () => { history.push(`/block/${txDetail?.blockNumber}`) })}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Block Hash</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{renderHashToRedirect(txDetail?.blockHash, 70, () => { history.push(`/block/${txDetail?.blockHash}`) })}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Status</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                {
                                    txDetail?.status ?
                                        <div className="content"><Tag color="green">SUCCESS</Tag></div> :
                                        <div className="content"><Tag color="yellow">PENDING</Tag></div>
                                }

                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">TimeStamp</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{txDetail?.time ? dateToLocalTime(txDetail?.time) : ''}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">From</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{renderHashToRedirect(txDetail?.from, 50, () => { })}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">To</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{renderHashToRedirect(txDetail?.to, 50, () => { })}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Value</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{weiToKAI(txDetail?.value)} KAI</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Gas Price</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{numberFormat(txDetail?.gasPrice || 0)}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Gas Limit</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{numberFormat(txDetail?.gasLimit || 0)}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Nonce</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{numberFormat(txDetail?.nonce || 0)}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Transaction Index</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{txDetail?.transactionIndex}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                    <List.Item>
                        <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                <div className="title">Input Data</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                <div className="content">{txDetail?.input}</div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                </List>
            </Panel>
        </div>
    )
}

export default TxDetail;