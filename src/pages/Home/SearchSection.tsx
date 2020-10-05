import React, { useState } from 'react';
import { Button, Icon, Input, Modal } from 'rsuite';
import QrReader from 'react-qr-reader';
import { useViewport } from '../../context/ViewportContexrt';

const SearchSection = () => {
    const {isMobile} = useViewport();
    const [showQRModel, setShowQRModal] = useState(false);

    const scanSuccess = (data: any) => {
        console.log(data)
    }

    const scanError = (err: any) => {
        console.error(err)
    }

    return (
        <div className="search-section">
            <div className="search-input-wrapper">
                <Input block size="lg" placeholder="Search by Address / TxHash / BlockHash ..." />
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
                        <Icon icon="search"  /> Search
                    </Button>
                }
            </div>
        </div>
    )
};

export default SearchSection;