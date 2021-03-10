import React, { useEffect, useState } from 'react';
import { Col, FlexboxGrid, Icon, Panel, Table, Tooltip, Whisper, Nav } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { useHistory, useParams } from 'react-router-dom';
import { getContractEvents } from '../../service/kai-explorer';
import './logs.css'
import { renderHashToRedirect } from '../../common/utils/string';

function Logs() {
    const { txHash }: any = useParams();
    let history = useHistory();
    const { isMobile } = useViewport();
    const [loading, setLoading] = useState(false);

    const [logs, setLogs] = useState({} as any);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getContractEvents(1, 10, txHash);
            setLogs(data);
            console.log('data', data);
            setLoading(false);
        })()
    }, [])

    return (
        <div>
            <div className="row">
                <p className="property-title">Address</p>
                <span className="property-content">
                    {renderHashToRedirect({
                        hash: logs.address,
                        headCount: 50,
                        tailCount: 4,
                        showTooltip: false,
                        redirectTo: `/address/${logs.address}`,
                        showCopy: false
                    })}
                </span>
            </div>

            <div className="row">
                <p className="property-title">Name</p>
                <span className="property-content">{logs.methodName} ({logs.argumentsName})</span>
            </div>

            <div className="row">
                <p className="property-title">Topics</p>
                <ul className="topics">
                    <li>
                        <span className="num">1</span> <span className="property-content">{logs.topics ? logs.topics[0] : ''}</span>
                    </li>
                    <li>
                        <span className="num">2</span> <span className="property-content">{logs.topics ? logs.topics[1] : ''}</span>
                    </li>
                    <li>
                        <span className="num">3</span> <span className="property-content">{logs.topics ? logs.topics[2] : ''}</span>
                    </li>
                </ul>
            </div>

            <div className="row borderNone">
                <p className="property-title">Data</p>
                <span className="property-content">{logs.data}</span>
            </div>
        </div>
    )
}

export default Logs
