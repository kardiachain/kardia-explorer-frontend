import React from 'react';
import './logs.css'
import { renderHashToRedirect } from '../../common';
import Log from './Log'

function Logs({ logs }: {
    logs: Logs[],
}) {

    return (
        Object.keys(logs).length > 0 ? <div>
            {
                logs.map((log: Logs, index: any) => {
                    return <div className="logBody" key={index}>
                        <div className="logRow">
                            <p className="property-title">Address</p>
                            <span className="property-content">
                                {renderHashToRedirect({
                                    hash: log.address,
                                    headCount: 50,
                                    tailCount: 4,
                                    showTooltip: false,
                                    redirectTo: `/address/${log.address}`,
                                    showCopy: true
                                })}
                            </span>
                        </div>

                        {log.methodName ?
                            <div className="logRow">
                                <p className="property-title">Name</p>
                                <span className="property-content">{log.methodName} ({log.argumentsName})</span>
                            </div> : ''
                        }

                        <div className="logRow">
                            <p className="property-title">Topics</p>
                            <ul className="topics">
                                {log.topics.map((it: any, index: any) => {
                                    return (
                                        <li key={index}>
                                            <span className="num">{index + 1}</span> <span className="property-content">{it}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className="logRow borderNone">
                            <p className="property-title">Data</p>
                            <Log data={log.data} />
                        </div>
                    </div>
                })
            }



        </div>
            : <div>
                <p className="property-content">No data found</p>
            </div>
    )
}

export default Logs
