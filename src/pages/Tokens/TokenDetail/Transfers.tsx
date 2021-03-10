import React, { useEffect, useState } from 'react';
import { Col, FlexboxGrid, Icon, Panel, Table, Tooltip, Whisper, Nav } from 'rsuite';
import { numberFormat } from '../../../common/utils/number';
import { useViewport } from '../../../context/ViewportContext';
import { useHistory } from 'react-router-dom';
import bnb from '../../../resources/bnb.webp';

const { Column, HeaderCell, Cell } = Table;

function Transfers() {
    let history = useHistory();
    const { isMobile } = useViewport();
    const [tokens, setTokens] = useState([])

    return (
        <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                        <Table
                            rowHeight={60}
                            height={400}
                            data={tokens}
                            autoHeight
                            hover={false}
                            wordWrap
                        >
                            <Column flexGrow={3} minWidth={isMobile ? 150 : 250} verticalAlign="middle">
                                <HeaderCell>Token</HeaderCell>
                                <Cell>
                                    {(rowData: any) => {
                                        return (
                                            <div>
                                                <img src={bnb} style={{ width: '19px', height: '19px', marginRight: '10px' }} alt="logo" />
                                                <span className="container-content-right">
                                                    <div className="sub-text">
                                                        {rowData.name}
                                                    </div>
                                                </span>
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={2} minWidth={isMobile ? 70 : 100} verticalAlign="middle">
                                <HeaderCell>Price</HeaderCell>
                                <Cell>
                                    {(rowData: any) => {
                                        return (
                                            <div>
                                                $ {numberFormat(rowData.price)}
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={3} minWidth={isMobile ? 150 : 200} verticalAlign="middle">
                                <HeaderCell>Change(%)</HeaderCell>
                                <Cell>
                                    {(rowData: any) => {
                                        return (
                                            <div>
                                                {rowData.change}
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={3} minWidth={isMobile ? 150 : 200} verticalAlign="middle">
                                <HeaderCell>Volume(24H)</HeaderCell>
                                <Cell>
                                    {(rowData: any) => {
                                        return (
                                            <div>
                                                $ {numberFormat(rowData.volume)}
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                <HeaderCell>Market Cap</HeaderCell>
                                <Cell>
                                    {(rowData: any) => {
                                        return (
                                            <div>
                                                $ {numberFormat(rowData.marketCap)}
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                <HeaderCell>Holders</HeaderCell>
                                <Cell>
                                    {(rowData: any) => {
                                        return (
                                            <div>
                                                {numberFormat(rowData.holders)}
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                        </Table>

                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default Transfers
