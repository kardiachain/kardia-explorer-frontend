import React, { useEffect, useState } from 'react'
import { Panel, FlexboxGrid, Table, Icon, Col, Divider } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { getBlocks } from '../../service/kai-explorer';
import { millisecondToHMS, renderHashString } from '../../common/utils/string';
import './block.css'
import TablePagination from 'rsuite/lib/Table/TablePagination';
const { Column, HeaderCell, Cell } = Table;

const BlockList = () => {
    const [blockList, setBlockList] = useState([] as KAIBlock[])
    const { isMobile } = useViewport()
    useEffect(() => {
        (async () => {
            const blocks = await getBlocks(1, 10);
            setBlockList(blocks)
        })()
    }, [])

    const handleChangePage = () => {

    }

    const handleChangeLength = () => {

    }
    return (
        <React.Fragment>
            <div className="block-container">
                <h3>Blocks</h3>
                <Divider />
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                        <Panel shaded>
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
                                            <HeaderCell>Block</HeaderCell>
                                            <Cell>
                                                {(rowData: KAIBlock) => {
                                                    return (
                                                        <div> <Icon icon="th-large" /> {rowData.blockHeight} </div>
                                                    );
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column width={150}>
                                            <HeaderCell>Age</HeaderCell>
                                            <Cell>
                                                {(rowData: KAIBlock) => {
                                                    return (
                                                        <div>{millisecondToHMS(rowData.age || 0)}</div>
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
                                    <TablePagination
                                        lengthMenu={[
                                            {
                                                value: 10,
                                                label: 10
                                            },
                                            {
                                                value: 20,
                                                label: 20
                                            }
                                        ]}
                                        activePage={1}
                                        displayLength={5}
                                        total={blockList.length}
                                        onChangePage={handleChangePage}
                                        onChangeLength={handleChangeLength}
                                    />
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </React.Fragment>
    )
}

export default BlockList