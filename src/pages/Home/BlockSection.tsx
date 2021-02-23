import React from 'react'
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Col, FlexboxGrid, Table, Panel, Icon, Whisper, Tooltip } from 'rsuite';
import languageAtom from '../../atom/language.atom';
import { weiToKAI } from '../../common/utils/amount';
import { getLanguageString } from '../../common/utils/lang';
import { numberFormat } from '../../common/utils/number';
import { millisecondToHMS, renderStringAndTooltip } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import './home.css'

const { Column, HeaderCell, Cell } = Table;

const BlockSection = ({ blockList = [] }: {
    blockList: KAIBlock[]
}) => {
    const { isMobile } = useViewport()
    const language = useRecoilValue(languageAtom)
    return (
        <Panel shaded className="panel-bg-gray">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        rowHeight={70}
                        height={400}
                        data={blockList}
                        hover={false}
                        wordWrap
                        autoHeight={isMobile ? true : false}
                    >
                        <Column flexGrow={2} minWidth={150} verticalAlign="middle">
                            <HeaderCell><span style={{ marginLeft: 40 }}>{getLanguageString(language, 'BLOCK_HEIGHT', 'TEXT')}</span></HeaderCell>
                            <Cell>
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            <span className="container-icon-left" style={{ lineHeight: '28px' }}>
                                                <Icon icon="cubes" className="gray-highlight" />
                                            </span>
                                            <span className="container-content-right text-link">
                                                <Link className="color-white text-bold" to={`/block/${rowData.blockHeight}`} >{numberFormat(rowData.blockHeight)}</Link>
                                                <div className="sub-text">{millisecondToHMS(rowData.age || 0)}</div>
                                            </span>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column flexGrow={2} minWidth={150}>
                            <HeaderCell>{getLanguageString(language, 'PROPOSER', 'TEXT')}</HeaderCell>
                            <Cell>
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            <span className="container-content-right">
                                                <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData?.validator?.hash || ''}</Tooltip>}>
                                                    <Link className="color-white text-bold" to={`/address/${rowData?.validator?.hash || ''}`}>
                                                        {
                                                            renderStringAndTooltip({
                                                                str: rowData?.validator?.label || '',
                                                                headCount: 15,
                                                                showTooltip: false
                                                            })
                                                        }
                                                    </Link>
                                                </Whisper>
                                                <div>
                                                    {
                                                        !rowData.transactions ? <span className="sub-text">0 Txns</span> :
                                                            <Link className="sub-text" to={`/txs?block=${rowData.blockHeight}`} >{numberFormat(rowData.transactions)} Txns</Link>
                                                    }
                                                </div>
                                            </span>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column flexGrow={2} minWidth={110} align="right" verticalAlign="middle">
                            <HeaderCell>{getLanguageString(language, 'REWARDS_KAI', 'TEXT')}</HeaderCell>
                            <Cell dataKey="transactions">
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            {
                                                !rowData.rewards ? '0' :
                                                    numberFormat(weiToKAI(rowData.rewards), 8)
                                            }
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                    </Table>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Panel>
    )
}

export default BlockSection;