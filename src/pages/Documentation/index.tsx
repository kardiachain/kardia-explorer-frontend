import React, { useEffect } from 'react'
import { Icon, Panel, Button, PanelGroup, Grid, Row, Col } from 'rsuite'
import ReactPlayer from "react-player";
import './document.css'
import rs1 from '../../resources/rs1.png';
import rs2 from '../../resources/rs2.gif';
import { useHistory } from 'react-router-dom';


const Documentation = () => {
    let history = useHistory();

    useEffect(() => {

    })


    return (
        <div className="container">

            <Grid fluid>
                <Row gutter={14}>
                    <Col xs={24} md={12}>
                        <p className="document-title">Earn Rewards by Staking KAI Tokens</p>
                        <p className="document-content">Staking is one of the best ways to maximize your holdings. Staking KAI tokens also help the operation and increase KardiaChain network security. Once you stake KAI tokens, you will earn staking rewards at a certain rate and your holdings will be significantly increased by the power of compounding. It’s better than leaving your KAI tokens without doing anything.</p>
                        <Button className="kai-button get-started" onClick={() => { history.push('/staking') }}>Get Started</Button>
                    </Col>
                    <Col xs={24} md={12} className="col-step">
                        <ReactPlayer
                            url="https://www.youtube.com/watch?v=fDW7_Ru7w0A"
                            width="100%"
                        />
                    </Col>
                </Row>
            </Grid>


            <Grid fluid className="step-grid">
                <Row gutter={14}>
                    <Col md={8} xs={24} className="col-step">
                        <Icon className="highlight" icon="edit" size={"4x"} />
                        <p className="step-title">1. Sign Up</p>
                        <p className="step-content">Create wallet and access your wallet</p>
                    </Col>
                    <Col md={8} xs={24} className="col-step step2">
                        <Icon className="highlight" icon="exchange" size={"4x"} />
                        <p className="step-title">2. Fund Your Account</p>
                        <p className="step-content">You need to transfer KAI to your wallet, then you go to the staking section to delegate for validator</p>
                    </Col>
                    <Col md={8} xs={24} className="col-step">
                        <Icon className="highlight" icon="money" size={"4x"} />
                        <p className="step-title">3. Start Earning</p>
                        <p className="step-content">Start earning KAI rewards directly in your wallet as staking rewards.</p>
                    </Col>

                </Row>
            </Grid>

            <Grid fluid>
                <Row gutter={14} style={{ marginBottom: 30 }}>
                    <Col md={12} xs={24}>
                        <p className="document-title">
                            What are staking rewards?
                </p>
                        <p className="document-content">
                            Staking is a process of holding KAI tokens in the wallet to support the operations and security of KardiaChain network. As a return, holders will be rewarded with KAI tokens as an incentive.
                </p>
                    </Col>

                    <Col md={12} xs={24}>
                        <p className="document-title">What is Delegated Proof of Stake?</p>
                   <p className="document-content">Delegated Proof of Stake (DPoS) is a similar consensus to PoS that it secures blockchain through an internal investment. The main difference is that DPoS requires stakeholders to outsource their work to a few chosen delegates that will secure the network. DPoS algorithm creates a voting system that reflects delegates’ reputation. There are very first 21 choosen genesis validators for KardiaChain network. 
                   </p>
                    </Col>
                </Row>

            </Grid>

            <Grid fluid>
                <Row gutter={14} style={{ marginBottom: 30 }}>
                    <Col xs={24}>
                        <p style={{ textAlign: 'center', marginTop: 30, marginBottom: 30 }} className="document-title">Research article about Staking by Mr Athony Vo - CFO KardiaChain</p>
                    </Col>
                    <Col md={12} xs={24}>
                        <p className="document-title">Mainnet — The value of staking</p>
                        <p className="document-content">In this report, Mr Vo provides a thorough overview of a valuation framework in cryptocurrency staking contract that is built upon the Stock Option Theory. Through this report, crypto holders will be provided with a thorough view of a tool to fairly compare between blockchain projects as well as their offering staking rates. Furthermore, such a tool is needed to allow investors to know whether the rate they are receiving is fair to account for potential risk/movement in the underlying tokens. …</p>
                        <Button className="kai-button get-started" onClick={() => { window.open('https://medium.com/@KardiaChain/mainnet-the-value-of-staking-a88bc4676a08', '_blank') }}>Learn More</Button>
                    </Col>
                    <Col md={12} xs={24} className="col-step">
                        <img src={rs1} style={{ width: '100%' }} alt="research_paper1" />
                    </Col>

                </Row>

                <Row gutter={14}>
                    <Col md={12} xs={24}>
                        <p className="document-title">Mainnet — Part 2. Estimation of KAI Staking APR</p>
                        <p className="document-content">Over the past two years, our incredible developers have been building the Kardiachain mainnet platform and in Q4 we will finally see it go live. Based on the framework that we have developed in the first report — “Mainnet — The value of staking”, Today, we would like to offer the second report on this subject — “Estimation of KAI Staking APR” by KardiaChain CFO Anthony Vo, to give you a better understanding of how the team evaluates staking models and attempt to gauge the potential APR % rates that our model may offer.</p>
                        <Button className="kai-button get-started" onClick={() => { window.open('https://medium.com/@KardiaChain/mainnet-part-2-estimation-of-kai-staking-apr-2bb53774be16', '_blank') }}>Learn More</Button>
                    </Col>
                    <Col md={12} xs={24} className="col-step">
                        <img src={rs2} style={{ width: '100%' }} alt="research_paper2" />
                    </Col>
                </Row>
            </Grid>

            <Grid fluid>
                <Row gutter={14}>
                    <Col xs={24}>
                        <p style={{ textAlign: 'center', marginTop: 30, marginBottom: 30 }} className="document-title">FAQ</p>
                    </Col>
                    <Col md={12} xs={24} className="faq-infor">
                        <p className="document-title">Frequently Asked Questions</p>
                        <p className="document-content">Still have questions? Don’t worry, we’re here to help. You can speak directly to an account manager today.</p>
                        <p className="document-content">Telegram: <a href="https://t.me/kardiachain" rel="noopener noreferrer" target="_blank">https://t.me/kardiachain </a></p>
                        <p className="document-content">Email: hello@kardiachain.io</p>
                    </Col>

                    <Col md={12} xs={24}>
                        <PanelGroup accordion bordered>
                            <Panel header="Do I Need to Deposit Funds on Wallet to Stake?">
                                <p className="document-content faq">Yes. To stake with us, you either need to buy KAI on exchange or transfer KAI you already own to one of your wallets.</p>
                            </Panel>
                            <Panel header="How Much Does KAI Pay in Staking Rewards?">
                                <p className="document-content faq">KAI staking reward ranges from 12%-24% APR. On average, it’s about 15% compounded annually.</p>
                            </Panel>
                            <Panel header="When Do I Get My Rewards?">
                                <p className="document-content faq">TBD</p>
                            </Panel>
                            <Panel header="What Fees Do You Charge for Staking?">
                                <p className="document-content faq">There is no fee when staking on-chain with KAI chosen validators. Staking off-chain with staking pools may charge some fees.</p>
                            </Panel>
                        </PanelGroup>
                    </Col>
                </Row>
            </Grid>

        </div>

    )
}

export default Documentation