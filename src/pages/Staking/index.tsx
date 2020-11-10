import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Panel, Table } from 'rsuite';
import { formatAmount, formatAmountwithPlus, weiToKAI } from '../../common/utils/amount';
import { randomRGBColor, renderHashToRedirect, truncate } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getValidatorsFromSMC } from '../../service/smc';
import { isLoggedIn } from '../../service/wallet';
import './staking.css'
import { Icon } from 'rsuite'
import ValidatorsPieChart from './ValidatorsPieChart';
import StakedPieChart from './StakedPieChart';
import Button from '../../common/components/Button';


const { Column, HeaderCell, Cell } = Table;

const Validators = () => {
    let history = useHistory();
    const { isMobile } = useViewport();
    const [validators, setValidators] = useState([] as ValidatorFromSMC[]);
    const [dataForValidatorsChart, setDataForValidatorsChart] = useState([] as DataChartConfig[]);
    const [dataForStakedPieChart, setDataForStakedPieChart] = useState({} as StakedPieChartConfig);
    const [tableLoading, setTableLoading] = useState(true)
    const [totalStakedAmount, setTotalStakedAmount] = useState(0)
    useEffect(() => {
        (async () => {
            setTableLoading(true)
            const stakingData = await getValidatorsFromSMC();
            const valDetails = stakingData.validators;
            setValidators(valDetails);
            setTableLoading(false)

            // Calculate data for chart
            const dataForValidatorsChart = [] as any[];
            valDetails.forEach((value: ValidatorFromSMC, index: number) => {
                dataForValidatorsChart.push({
                    custom: value.address,
                    name: truncate(value.address, 5, 3),
                    y: value.votingPower,
                    color: randomRGBColor(),
                    sliced: true
                });
            });
            setDataForValidatorsChart(dataForValidatorsChart)
            setDataForStakedPieChart({
                totalVals: stakingData?.totalVals,
                totalDels: stakingData?.totalDels,
                totalStakedAmont: stakingData?.totalStakedAmont,
                totalValidatorStakedAmount: stakingData?.totalValidatorStakedAmount,
                totalDelegatorStakedAmount: stakingData?.totalDelegatorStakedAmount
            });
            setTotalStakedAmount(stakingData.totalStakedAmont)
        })()
    }, []);

    return (
        <div className="container validators-container">
            <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={10} style={{ marginBottom: isMobile ? '15px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon className="highlight" icon="group" size={"2x"} />
                        <p style={{ marginLeft: '12px', fontWeight: 600 }}>Validators</p>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={14} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <Button size="big"
                        onClick={() => { isLoggedIn() ? history.push("/wallet/staking/your-delegators") : history.push('/wallet') }}
                    >
                        Register to become validator
                    </Button>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="space-between" align="top" style={{ marginBottom: '10px' }}>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={12} style={{ marginBottom: isMobile ? '15px' : '0' }}>
                    <Panel shaded>
                        <ValidatorsPieChart dataForChart={dataForValidatorsChart} />
                    </Panel>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={12} style={{ marginBottom: isMobile ? '15px' : '0' }}>
                    <Panel shaded style={{ marginBottom: '15px' }}>
                        <StakedPieChart dataForChart={dataForStakedPieChart || {}} />
                    </Panel>
                    <Panel shaded>
                        <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '10px' }} className="staking-stats">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} xs={12}>
                                <div className="stats-container">
                                    <div className="title">
                                        {/* <Icon className="highlight icon" icon="braille" size={"lg"} /> */}
                                        Total Validators
                                    </div>
                                    <div className="value">{validators.length}</div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} xs={12}>
                                <div className="stats-container">
                                    <div className="title">
                                        {/* <Icon className="highlight icon" icon="bolt" size={"lg"} /> */}
                                        Total Staked Amount
                                    </div>
                                    <div className="value">{formatAmountwithPlus(totalStakedAmount)} KAI</div>
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded>
                        <Table
                            wordWrap
                            hover={false}
                            autoHeight
                            rowHeight={70}
                            data={validators}
                            loading={tableLoading}
                        >

                            <Column width={60} verticalAlign="middle">
                                <HeaderCell>Rank</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div className="rank-tab" style={{ backgroundColor: dataForValidatorsChart[rowData.rank || 0]?.color }}>
                                                {Number(rowData.rank) + 1}
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={2} verticalAlign="middle">
                                <HeaderCell>Validator</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>
                                                {renderHashToRedirect({
                                                    hash: rowData?.address,
                                                    headCount: isMobile ? 10 : 20,
                                                    tailCount: 4,
                                                    showTooltip: true,
                                                    callback: () => { history.push(`/validator/${rowData?.address}`) }
                                                })}
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={2} verticalAlign="middle" align="center">
                                <HeaderCell>Total Staked Amount</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{formatAmount(Number(weiToKAI(rowData.totalStakedAmount)))} KAI</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={1} verticalAlign="middle" align="center">
                                <HeaderCell>Voting power</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{rowData.votingPower || '0'} %</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={1} verticalAlign="middle" align="center">
                                <HeaderCell>Total Delegators</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{rowData.totalDels || '0'}</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column flexGrow={1} verticalAlign="middle" align="center">
                                <HeaderCell>Commission</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{`${rowData.commission || '0'} %`}</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column width={150} verticalAlign="middle" align="center">
                                <HeaderCell>Action</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <Button onClick={() => { isLoggedIn() ? history.push(`/wallet/staking/${rowData.address}`) : history.push('/wallet') }}>Delegate</Button>
                                        );
                                    }}
                                </Cell>
                            </Column>
                        </Table>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}
export default Validators;