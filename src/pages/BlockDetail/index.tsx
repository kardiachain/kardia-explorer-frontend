import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Col, FlexboxGrid, Icon, List, Panel, Placeholder } from 'rsuite'
import languageAtom from '../../atom/language.atom';
import { weiToKAI } from '../../common/utils/amount';
import { getLanguageString } from '../../common/utils/lang';
import { numberFormat } from '../../common/utils/number';
import { dateToUTCString, millisecondToHMS, renderHashString, renderHashToRedirect } from '../../common/utils/string';
import { getBlockBy } from '../../service/kai-explorer/block';
import './blockDetail.css'

const { Paragraph } = Placeholder;

const BlockDetail = () => {
    const [blockDetail, setBlockDetail] = useState<KAIBlockDetails>()
    const { block }: any = useParams();
    const [loading, setLoading] = useState(true)
    const language = useRecoilValue(languageAtom)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const blockDetail = await getBlockBy(block);
            if (blockDetail.blockHash) {
                setBlockDetail(blockDetail)
                setLoading(false)
            }
        })()
    }, [block])


    return (
        <div className="container block-detail-container">
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    {getLanguageString(language, 'BLOCK_DETAILS', 'TEXT')}
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">
                {
                    loading ? <Paragraph style={{ marginTop: 30 }} rows={20} active={true} /> :
                        <List bordered={false}>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'HEIGHT', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(blockDetail?.blockHeight)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'BLOCK_HASH', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{renderHashString(blockDetail?.blockHash || '', 64)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'TIME_STAMP', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content"><Icon className="orange-highlight" icon="clock-o" style={{ marginRight: 5 }} />{millisecondToHMS(blockDetail?.age || 0)} ({blockDetail?.time ? dateToUTCString(blockDetail?.time) : ''})</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'NUMBER_OF_TXS', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">
                                            {!blockDetail?.transactions ? 0 :
                                                <Link to={`/txs?block=${blockDetail?.blockHeight}`}>{numberFormat(blockDetail?.transactions)}</Link>
                                            }
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'BLOCK_REWARDS', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">
                                            {numberFormat(weiToKAI(blockDetail?.rewards))} KAI
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'GAS_LIMIT', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(blockDetail?.gasLimit || 0)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'GAS_USED', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(blockDetail?.gasUsed || 0)} ({blockDetail?.gasUsedPercent}%)</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'LAST_BLOCK_HASH', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">
                                            {renderHashToRedirect({
                                                hash: blockDetail?.lastBlock,
                                                headCount: 70,
                                                tailCount: 4,
                                                showTooltip: false,
                                                redirectTo: `/block/${blockDetail?.lastBlock}`,
                                                showCopy: true
                                            })}
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'COMMIT_HASH', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{renderHashString(blockDetail?.commitHash || '', 64)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'PROPOSER', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">
                                            <span className="color-white text-bold" style={{marginRight: 8}} >{blockDetail?.vaidatorName || ''}</span>
                                            {
                                                renderHashToRedirect({
                                                    hash: blockDetail?.validator,
                                                    headCount: 50,
                                                    tailCount: 4,
                                                    showTooltip: false,
                                                    redirectTo: `/address/${blockDetail?.validator}`,
                                                    showCopy: true
                                                })
                                            }
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'VALIDATORS_HASH', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{renderHashString(blockDetail?.validatorHash || '', 64)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'NEXT_VALIDATORS_HASH', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{renderHashString(blockDetail?.nextValidatorHash || '', 64)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'DATA_HASH', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{renderHashString(blockDetail?.dataHash || '', 64)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            {/* <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Consensus Hash</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{renderHashString(blockDetail?.consensusHash || '', 64)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item> */}
                        </List>
                }
            </Panel>

        </div>
    )
}

export default BlockDetail