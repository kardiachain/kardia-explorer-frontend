import React, { useState } from 'react'
import { Col, FlexboxGrid, Tag } from 'rsuite'
import Button from '../../common/components/Button';
import { useViewport } from '../../context/ViewportContext';
import CreateNewProposal from './CreateNewProposal';
import ListProposal from './ListProposal';

const Proposal = () => {
    const { isMobile } = useViewport();
    const [showCreateProposal, setShowCreateProposal] = useState(false);

    return (
        <div className="container proposal-container">
            <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={10} style={{ marginBottom: isMobile ? '15px' : '0' }}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Network Proposal
                        </div>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={14} style={{ textAlign: 'right' }}>
                    {/* <Button size={isMobile ? "normal" : "big"} style={{ marginBottom: 10 }}
                        onClick={() => setShowCreateProposal(true)}>Create Proposal
                    </Button> */}
                    <Button size={isMobile ? "normal" : "big"} style={{ marginBottom: 10 }} disable={true}>Create Proposal (Coming Soon)
                    </Button>
                </FlexboxGrid.Item>
            </FlexboxGrid>

            <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={24} style={{ marginBottom: isMobile ? '15px' : '0' }}>
                    <ListProposal />
                </FlexboxGrid.Item>
            </FlexboxGrid>

            <CreateNewProposal showModal={showCreateProposal} setShowModal={setShowCreateProposal} />
        </div>
    )
}

export default Proposal


export const RenderStatus = ({status} : {
    status: number
}) => {

    switch (status) {
        case 0:
            return (
                <Tag color="green" className="tab tab-pending">ON GOING</Tag>
            )
        case 1:
            return (
                <Tag color="green" className="tab tab-success">SUCCESS</Tag>
            )
        case 2:
            return (
                <Tag className="tab tab-failed" color="red">FAILED</Tag>
            )
        default:
            return (
                <></>
            )
    }
}