import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Col, Divider, FlexboxGrid, List, Panel } from 'rsuite'
import { getBlockBy } from '../../service/kai-explorer/block';
import './blockDetail.css'

const BlockDetail = () => {

    const query = new URLSearchParams(useLocation().search);
    const txHash = query.get("block") || '';
    const [dataDisplay, setDataDisplay] = useState([] as any[])

    useEffect(() => {
        (async () => {
            const block = await getBlockBy(txHash);
            console.log("Block: ", block);
            
            const data = [
                { title: 'Height:', content: block.blockHeight },
                { title: 'Block Hash:', content: block.blockHash },
                { title: 'TimeStamp:', content: block.time },
                { title: 'Number Transactions:', content: block.transactions },
                { title: 'Gas Limit:', content: block.gasLimit },
                { title: 'Gas Used:', content: block.gasUsed },
                { title: 'Commit Hash:', content: block.commitHash },
                { title: 'validator:', content: block.validator },
                { title: 'Validator Hash:', content: block.validatorHash },
                { title: 'Data Hash:', content: block.dataHash },
                { title: 'Consensus Hash:', content: block.consensusHash },
            ] as any[]
            setDataDisplay(data)
        })()
    }, [])


    return (
        <React.Fragment>
        <div className="block-detail-container">
            <h3>Block Details</h3>
            <Divider />
            <Panel shaded>
                <List bordered={false}>
                    {dataDisplay.map((item, index) => (
                        <List.Item key={index} index={index}>
                            <FlexboxGrid justify="start">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="title">{item.title}</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="content">{item.content}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                    ))}
                </List>
            </Panel>
        </div>
    </React.Fragment>
    )
}

export default BlockDetail