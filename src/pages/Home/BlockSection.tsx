import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon } from 'rsuite';
import { millisecondToHMS, renderHashToRedirect, truncate } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getBlocks } from '../../service/kai-explorer';

const { Column, HeaderCell, Cell } = Table;

const BlockSection = () => {
    const [blockList, setBlockList] = useState([] as KAIBlock[])
    const { isMobile } = useViewport()
    const history = useHistory();
    useEffect(() => {
        (async () => {
            const blocks = await getBlocks(1, 10);
            setBlockList(blocks)
        })()
    }, [])

    // TODO: use react-chartjs-2 to display chart
    return (
        <Panel header="Latest blocks" shaded>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        autoHeight
                        rowHeight={70}
                        height={400}
                        data={blockList}
                        hover={false}
                    >
                        <Column width={150}>
                            <HeaderCell>Block height</HeaderCell>
                            <Cell dataKey="blockHeight" >
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            <div> <Icon icon="th-large" /> {renderHashToRedirect(rowData.blockHeight, 30, () => { history.push(`/block?block=${rowData.blockHeight}`) })} </div>
                                            <div>{millisecondToHMS(rowData.age || 0)}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={isMobile ? 120 : 350}>
                            <HeaderCell>Block validator</HeaderCell>
                            <Cell>
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            {truncate(rowData.validator.hash, isMobile ? 10 : 30)}
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={100}>
                            <HeaderCell>Txn</HeaderCell>
                            <Cell dataKey="transactions">
                            {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            {renderHashToRedirect(rowData.transactions, 30, () => { history.push(`/txs?block=${rowData.blockHeight}`) })}
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