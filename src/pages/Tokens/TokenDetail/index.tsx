import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel, Nav } from 'rsuite';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';
import { useViewport } from '../../../context/ViewportContext';
import './style.css'
import Transfers from './Transfers';
import { getTokenContractInfor } from '../../../service/kai-explorer';
import { renderHashToRedirect } from '../../../common/utils/string';
import { ITokenDetails } from '../../../service/kai-explorer/tokens/type';

const TokenDetail = () => {
    const { contractAddress }: any = useParams()
    let history = useHistory();
    const { isMobile } = useViewport();
    const [loading, setLoading] = useState(false);
    const [activeKey, setActiveKey] = useState('validators')
    const [tokenInfor, setTokenInfor] = useState<ITokenDetails>({} as ITokenDetails);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await getTokenContractInfor(contractAddress);
            console.log("rs", rs);
            setTokenInfor(rs);
            setLoading(false);
        })()
    }, [])

    return (
        <div className="container txs-container">
            <div style={{ marginBottom: 10 }}>
                <img src={tokenInfor.logo} style={{ width: '28px', height: '28px', marginRight: '10px' }} alt="logo" />
                <span className="color-white">Token {tokenInfor.tokenName} [{tokenInfor.symbol}]</span>
            </div>

            <FlexboxGrid>
                <FlexboxGridItem colspan={24} md={24} sm={24} style={{ marginRight: !isMobile ? 5 : 0, borderRadius: 8 }} className="wrap-token">
                    <Panel header="Overview [KRC-20]">
                        <div className="row">
                            <p className="flex3 color-graylight">Name:</p>
                            <span className="flex9 color-graylight">
                                {tokenInfor.name}
                            </span>
                        </div>
                        <div className="row">
                            <p className="flex3 color-graylight">Token name:</p>
                            <span className="flex9 color-graylight">
                                {tokenInfor.tokenName}
                            </span>
                        </div>
                        <div className="row">
                            <p className="flex3 color-graylight">Contract:</p>
                            <span className="flex9 color-graylight">
                                {
                                    renderHashToRedirect({
                                        hash: tokenInfor.address,
                                        headCount: isMobile ? 5 : 50,
                                        tailCount: 15,
                                        showTooltip: false,
                                        redirectTo: `/address/${tokenInfor.address}`,
                                        showCopy: true
                                    })
                                }
                            </span>
                        </div>
                        <div className="row" style={{borderBottom: 'none'}}>
                            <p className="flex3 color-graylight">Decimals:</p>
                            <span className="flex9 color-graylight">{tokenInfor.decimals}</span>
                        </div>
                    </Panel>
                </FlexboxGridItem>
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
                                    {`Transfers`}
                                </Nav.Item>
                                <Nav.Item eventKey="candidates">
                                    {`Holders`}
                                </Nav.Item>
                            </Nav>
                        </div>
                        {
                            (() => {
                                switch (activeKey) {
                                    case 'validators':
                                        return (
                                            <Transfers />
                                        );

                                }
                            })()
                        }
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>

        </div>
    )
}
export default TokenDetail;