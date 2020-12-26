import React, { useState } from 'react';
import { Modal } from 'rsuite';
import Button from '../../../../common/components/Button';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import { NotifiMessage } from '../../../../common/constant/Message';
import { startValidator } from '../../../../service/smc/staking';
import { getAccount } from '../../../../service/wallet';

const VaidatorStart = ({ validator = {} as Validator, showModel, setShowModel, reFetchData }: {
    validator: Validator;
    showModel: boolean;
    setShowModel: (isShow: boolean) => void;
    reFetchData: () => void;
}) => {
    const myAccount = getAccount() as Account;
    const [isLoading, setIsLoading] = useState(false);
    
    // @Function using for starting become validator
    const start = async () => {
        try {
            setIsLoading(true);
            const valSmcAddr = validator?.smcAddress || "";
            if (!valSmcAddr) {
                setIsLoading(false);
                return false;
            }

            const result = await startValidator(valSmcAddr, myAccount);
            if (result && result.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess,
                    callback: () => { window.open(`/tx/${result.transactionHash}`) },
                    seeTxdetail: true
                });
                reFetchData();

            } else {
                NotificationError({
                    description: NotifiMessage.TransactionError,
                    callback: () => { window.open(`/tx/${result.transactionHash}`) },
                    seeTxdetail: true
                });
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                });
            } catch (error) {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        }
        setIsLoading(false);
        setShowModel(false);
    }
    
    return (
        <Modal backdrop="static" size="sm" enforceFocus={true} show={showModel} onHide={() => { setShowModel(false) }}>
            <Modal.Header>
                <Modal.Title>Confirm starting to become validator</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>
                    Are you sure you want to starting to become validator.
                            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button loading={isLoading} onClick={start}>
                    Confirm
                </Button>
                <Button className="kai-button-gray" onClick={() => { setShowModel(false) }}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default VaidatorStart;