import React, { useEffect, useState } from 'react';
import { Button, Col, Icon, Input, Modal, Panel, Row } from 'rsuite';
import NumberFormat from 'react-number-format';
import QrReader from 'react-qr-reader';
import { useViewport } from '../../context/ViewportContext';
import { getLatestBlockNumber } from '../../service/kai-explorer';

const SearchSection = () => {
    const {isMobile} = useViewport();
    const [showQRModel, setShowQRModal] = useState(false);
    const [latestBlock, setLatestBlock] = useState(0)

    useEffect(() => {
        (async () => {
            const blockNumber = await getLatestBlockNumber()
            setLatestBlock(blockNumber);
        })()
    },[])

    const scanSuccess = (data: any) => {
        console.log(data)
    }

    const scanError = (err: any) => {
        console.error(err)
    }

    // TODO: use react-chartjs-2 to display chart
    return (
        <div className="search-section">
            <Row className="stat-group">
                <Col md={6} sm={12} xs={12}>
                    <Panel shaded bordered header="Block height" className="stat-container">
                        <NumberFormat value={latestBlock} displayType={'text'} thousandSeparator={true} />
                    </Panel>
                </Col>
                <Col md={6} sm={12} xs={12}>
                    <Panel shaded bordered header="Live TPS" className="stat-container">
                        <NumberFormat value={0.0139} displayType={'text'} thousandSeparator={true} />
                    </Panel>
                </Col>
                <Col md={6} sm={12} xs={12}>
                    <Panel shaded bordered header="Total transactions" className="stat-container">
                        <NumberFormat value={123456789} displayType={'text'} thousandSeparator={true} />
                    </Panel>
                </Col>
                <Col md={6} sm={12} xs={12}>
                    <Panel shaded bordered header="Total holders" className="stat-container">
                        <NumberFormat value={12345} displayType={'text'} thousandSeparator={true} />
                    </Panel>
                </Col>
            </Row>
            <div className="search-input-wrapper">
                <Input size="lg" placeholder="Search by Address / TxHash / BlockHash ..." />
                {
                    isMobile ? 
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px'}}>
                        <div style={{width: '47%'}}>
                            <Button appearance="primary" block>
                                <Icon icon="search"  /> Search
                            </Button>
                        </div>
                        <div style={{width: '47%'}}>
                            <Button appearance="ghost" block onClick={() => setShowQRModal(true)}>
                                <Icon icon="qrcode"  /> Scan QR code
                            </Button>
                        </div>
                        <Modal size="xs" show={showQRModel} onHide={() => setShowQRModal(false)}>
                            <Modal.Header>
                                <Modal.Title>Scan Tx QR code</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <QrReader
                                    delay={300}
                                    onError={scanError}
                                    onScan={scanSuccess}
                                    style={{ width: '100%' }}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={() => setShowQRModal(false)} appearance="subtle">
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    :
                    <Button block appearance="primary">
                        <Icon icon="search" /> Search
                    </Button>
                }
            </div>
        </div>
    )
};

export default SearchSection;