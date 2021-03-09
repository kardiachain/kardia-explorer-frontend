import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel, Table, Tooltip, Whisper } from 'rsuite';
import { numberFormat } from '../../common/utils/number';
import { useViewport } from '../../context/ViewportContext';
import bnb from '../../resources/bnb.webp';
import { renderHashToRedirect } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { SortType } from '../../common/constant';
import { getContractsList } from '../../service/kai-explorer';

import './tokens.css'
const { Column, HeaderCell, Cell } = Table;


const Tokens = () => {
    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const { isMobile } = useViewport();

    const [page, setPage] = useState(TABLE_CONFIG.page);
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault);
    const [sortType, setSortType] = useState(SortType.ASC);


    const [tokens, setTokens] = useState([])
    const [totalContract, setTotalContract] = useState(0);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await getContractsList(page, size, sortType);
            console.log('rs', rs);
            // const contractInfor = await getContractInfor(rs);

            setTokens(rs?.contracts);
            setTotalContract(rs?.total);
            setLoading(false);
        })()
    }, [page, size, sortType])

    const handleSort = () => {
        if (sortType === SortType.ASC) {
            setSortType(SortType.DSC);
        } else {
            setSortType(SortType.ASC);
        }
    }

    return (
        <div className="container txs-container">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Token Tracker KRC20
                        </div>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded className="panel-bg-gray">
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
                                                        <img src={bnb} style={{ width: '19px', height:'19px', marginRight:'10px' }} alt="logo" />
                                                        <span className="container-content-right">
                                                            <div className="sub-text">
                                                                {
                                                                renderHashToRedirect({
                                                                    hash: rowData.name,
                                                                    headCount: isMobile ? 5 : 10,
                                                                    tailCount: 4,
                                                                    showTooltip: false,
                                                                    redirectTo: `/token/${rowData.contractAddress}`
                                                                })
                                                                }
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
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}
export default Tokens;