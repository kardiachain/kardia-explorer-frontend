import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Col, FlexboxGrid, Table, Panel, Icon } from 'rsuite';
import { renderHashString, millisecondToHMS } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getBlocks } from '../../service/kai-explorer';

const { Column, HeaderCell, Cell } = Table;

const BlockSection = () => {
    const [blockList, setBlockList] = useState([] as KAIBlock[])
    const { isMobile } = useViewport()
    useEffect(() => {
        (async () => {
            const blocks = await getBlocks(1, 10);
            setBlockList(blocks)
        })()
    }, [])
    return (
        <Panel header="Latest blocks" shaded>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        virtualized
                        rowHeight={60}
                        height={500}
                        data={blockList}
                        onRowClick={data => {
                            console.log(data);
                        }}
                    >
                        <Column width={100}>
                            <HeaderCell>Block height</HeaderCell>
                            <Cell dataKey="blockHeight" >
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            <div> <Icon icon="th-large" /> {rowData.blockHeight} </div>
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
                                            <div>
                                                {/* <a target="_blank" rel="noopener noreferrer" href={`/validator/${rowData.validator.hash}`}>{
                                                    renderHashString(rowData.validator.hash, isMobile ? 10 : 30)}
                                                </a> */}
                                                {renderHashString(rowData.validator.hash, isMobile ? 10 : 30)}
                                            </div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={100}>
                            <HeaderCell>Txn</HeaderCell>
                            <Cell dataKey="transactions" />
                        </Column>
                    </Table>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Panel>
    )
}

export default BlockSection;