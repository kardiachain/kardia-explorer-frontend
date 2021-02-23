import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Nav, Panel } from 'rsuite';
import { formatAmountwithPlus, weiToKAI } from '../../common/utils/amount';
import { truncate } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getAccount, isLoggedIn } from '../../service/wallet';
import './staking.css'
import ValidatorsPieChart from './ValidatorsPieChart';
import StakedPieChart from './StakedPieChart';
import Button from '../../common/components/Button';
import { checkIsValidator, getCandidates, getValidators } from '../../service/kai-explorer';
import ValidatorList from './ValidatorList';
import { StakingIcon } from '../../common/components/IconCustom';
import CandidateList from './CandidateList';
import StakingCalculator from './StakingCalculator';
import { useRecoilValue } from 'recoil';
import languageAtom from '../../atom/language.atom';
import { getLanguageString } from '../../common/utils/lang';

const Validators = () => {
    let history = useHistory();
    const { isMobile } = useViewport();
    const [validators, setValidators] = useState([] as Validator[]);
    const [validatorsLoading, setValidatorsLoading] = useState(true);
    const [candidates, setCandidates] = useState([] as Candidate[]);
    const [candidatesLoading, setCandidatesLoading] = useState(true);
    const [dataForValidatorsChart, setDataForValidatorsChart] = useState([] as DataChartConfig[]);
    const [dataForStakedPieChart, setDataForStakedPieChart] = useState({} as StakedPieChartConfig);
    const [totalStakedAmount, setTotalStakedAmount] = useState(0)
    const [totalValidator, setTotalValidator] = useState(0)
    const [totalDelegator, setTotalDelegator] = useState(0)
    const [totalProposer, setTotalProposer] = useState(0)
    const [totalCandidate, setTotalCandidate] = useState(0)
    const myAccount = getAccount() as Account
    const [isVal, setIsVal] = useState(false)
    const [activeKey, setActiveKey] = useState('validators')
    const [stakingCalculator, setStakingCalculator] = useState(false);
    const language = useRecoilValue(languageAtom)

    useEffect(() => {
        (async () => {
            if (myAccount.publickey) {
                const isVal = await checkIsValidator(myAccount.publickey);
                setIsVal(isVal);
            }
        })()
    }, [myAccount.publickey]);

    useEffect(() => {
        (async () => {
            setValidatorsLoading(true);
            setCandidatesLoading(true)
            // fetch data validator and candidate
            const fetchData = await Promise.all([
                getValidators(),
                getCandidates()
            ]);

            setCandidates(fetchData[1]);
            const stakingData = fetchData[0];
            const valDetails = stakingData?.validators || [] as Validator[];
            setValidators(stakingData?.validators || [] as Validator[]);

            // Calculate data for chart
            const dataForValidatorsChart = [] as any[];
            valDetails.filter(v => v.isProposer).forEach((value: Validator, index: number) => {
                dataForValidatorsChart.push({
                    custom: value.address,
                    name: value.name || truncate(value.address, 5, 3),
                    y: Number(value.votingPower),
                    color: value.color,
                    sliced: true
                });
            });

            setDataForValidatorsChart(dataForValidatorsChart)
            setDataForStakedPieChart({
                totalVals: stakingData?.totalValidators,
                totalDels: stakingData?.totalDelegators,
                totalStakedAmont: weiToKAI(stakingData?.totalStakedAmount),
                totalValidatorStakedAmount: weiToKAI(stakingData?.totalValidatorStakedAmount),
                totalDelegatorStakedAmount: weiToKAI(stakingData?.totalDelegatorStakedAmount)
            });
            setTotalStakedAmount(stakingData.totalStakedAmount)
            setTotalValidator(stakingData.totalValidators)
            setTotalDelegator(stakingData.totalDelegators)
            setTotalProposer(stakingData.totalProposer)
            setTotalCandidate(stakingData.totalCandidates)
            setValidatorsLoading(false);
            setCandidatesLoading(false)
        })()
    }, []);

    return (
        <div className="container validators-container">
            <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={10} style={{ marginBottom: isMobile ? '15px' : '0' }}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            {getLanguageString(language, 'STAKING', 'TEXT')}
                        </div>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={14} style={{ textAlign: 'right' }}>
                    <Button size={isMobile ? "normal" : "big"} className="kai-button-gray" style={{marginBottom: 10}} onClick={() => { setStakingCalculator(true) }}>
                        {getLanguageString(language, 'STAKING_CALCULATOR', 'TEXT')}
                    </Button>
                    {
                        !isVal ?
                            <Button size={isMobile ? "normal" : "big"} style={{marginBottom: 10}}
                                onClick={() => { isLoggedIn() ? history.push("/wallet/staking/for-validator") : history.push('/wallet') }}
                            >
                                {getLanguageString(language, 'REGISTER_TO_BECOME_VALIDATOR', 'BUTTON')}
                            </Button> : <></>
                    }
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="space-between" align="top" style={{ marginBottom: '10px' }}>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={12} style={{ marginBottom: isMobile ? '10px' : '0' }}>
                    <Panel shaded className="panel-bg-gray">
                        <div className="color-white" style={{ fontWeight: 600 }}>
                            <span style={{ fontSize: 24 }}>
                                {getLanguageString(language, 'PROPOSERS', 'TEXT')}
                            </span>
                        </div>
                        <ValidatorsPieChart dataForChart={dataForValidatorsChart} />
                    </Panel>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={12} style={{ marginBottom: isMobile ? '10px' : '0' }}>
                    <Panel shaded className="panel-bg-gray" style={{ marginBottom: '10px' }}>
                        <div className="color-white" style={{ fontWeight: 600 }}>
                            <span style={{ fontSize: 24 }}>{getLanguageString(language, 'TOTAL_STAKED', 'TEXT')}</span>
                            <div style={{ opacity: 0.6 }}>{getLanguageString(language, 'AMOUNT', 'TEXT')}: {formatAmountwithPlus(Number(weiToKAI(totalStakedAmount)))} KAI</div>
                        </div>
                        <StakedPieChart dataForChart={dataForStakedPieChart || {}} />
                    </Panel>
                    <Panel shaded className="panel-bg-gray">
                        <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '10px' }} className="staking-stats">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} xs={12} >
                                <div className="stats-container">
                                    <div className="icon">
                                        <StakingIcon character='P' color="proposer" />
                                    </div>
                                    <div className="content">
                                        <div className="value color-white">{totalProposer}</div>
                                        <div className="title color-graylight">
                                            {getLanguageString(language, 'PROPOSERS', 'TEXT')}
                                        </div>
                                    </div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} xs={12} >
                                <div className="stats-container">
                                    <div className="icon">
                                        <StakingIcon character='V' color="validator" />
                                    </div>
                                    <div className="content">
                                        <div className="value color-white">{totalValidator}</div>
                                        <div className="title color-graylight">
                                            {getLanguageString(language, 'VALIDATORS', 'TEXT')}
                                        </div>
                                    </div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} xs={12}>
                                <div className="stats-container">
                                    <div className="icon">
                                        <StakingIcon character='C' color="candidate" />
                                    </div>
                                    <div className="content">
                                        <div className="value color-white">{totalCandidate}</div>
                                        <div className="title color-graylight">
                                            {getLanguageString(language, 'CANDIDATES', 'TEXT')}
                                        </div>
                                    </div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} xs={12}>
                                <div className="stats-container">
                                    <div className="icon">
                                        <StakingIcon character='D' color="delegator" />
                                    </div>
                                    <div className="content">
                                        <div className="value color-white">{totalDelegator}</div>
                                        <div className="title color-graylight">
                                            {getLanguageString(language, 'DELEGATORS', 'TEXT')}
                                        </div>
                                    </div>
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded className="panel-bg-gray">
                        <div className="custom-nav">
                            <Nav
                                appearance="subtle"
                                activeKey={activeKey}
                                onSelect={setActiveKey}
                                style={{ marginBottom: 20 }}>
                                <Nav.Item eventKey="validators">
                                    {`${getLanguageString(language, 'VALIDATORS', 'TEXT')} (${validators.length})`}
                                </Nav.Item>
                                <Nav.Item eventKey="candidates">
                                    {`${getLanguageString(language, 'CANDIDATES', 'TEXT')} (${candidates.length})`}
                                </Nav.Item>
                            </Nav>
                        </div>
                        {
                            (() => {
                                switch (activeKey) {
                                    case 'validators':
                                        return (
                                            <ValidatorList validators={validators} loading={validatorsLoading} />
                                        );
                                    case 'candidates':
                                        return (
                                            <CandidateList candidates={candidates} loading={candidatesLoading} />
                                        )
                                }
                            })()
                        }
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>

            <StakingCalculator showModal={stakingCalculator} setShowModal={setStakingCalculator} validators={validators} totalStakedAmount={totalStakedAmount} />
        </div>
    )
}
export default Validators;