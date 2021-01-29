import React from 'react'
import { CheckPicker, Col, ControlLabel, FlexboxGrid, Form, FormGroup, Modal } from 'rsuite'
import Button from '../../common/components/Button';
import { useViewport } from '../../context/ViewportContext';

const paramsKey = [
    { label: 'Base Proposal Rewards', value: 0 },
    { label: 'Bonus Proposal Rewards', value: 1 },
    { label: 'Max Proposers', value: 2 },
    { label: 'Downtime Jail Duration', value: 3 },
    { label: 'Slash Fraction Downtime', value: 4 },
    { label: 'Slash Fraction Double Sign', value: 5 },
];


const CreateNewProposal = ({ showModal, setShowModal }: {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}) => {
    const { isMobile } = useViewport();

    return (
        <Modal backdrop="static" size={isMobile ? 'md' : 'lg'} enforceFocus={true} show={showModal}
            onHide={() => {
                setShowModal(false)
            }}>
            <Modal.Header>
                <Modal.Title>Create New Proposal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24} style={{ marginBottom: 20 }}>
                                <ControlLabel className="color-white">Select items you want to proposal</ControlLabel>
                                <CheckPicker
                                    placeholder="Choose validator"
                                    className="dropdown-custom"
                                    data={paramsKey}
                                    searchable={true}
                                    onChange={(value) => {
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button> Submit </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateNewProposal;
