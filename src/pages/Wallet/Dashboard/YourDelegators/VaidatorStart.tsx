import React, { useState } from 'react';
import { Modal } from 'rsuite';
import { InforMessage, Button, ShowNotifyErr, ShowNotify } from '../../../../common';
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom';
import { startValidatorByEW, isExtensionWallet, startValidator } from '../../../../service';

const VaidatorStart = ({ validator = {} as Validator, showModel, setShowModel, reFetchData }: {
    validator: Validator;
    showModel: boolean;
    setShowModel: (isShow: boolean) => void;
    reFetchData: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const walletLocalState = useRecoilValue(walletState);
    
    const start = async () => {
        try {
            setIsLoading(true);
            const valSmcAddr = validator?.smcAddress || "";
            if (!valSmcAddr) {
                setIsLoading(false);
                return false;
            }

            // Case: start validator interact with Kai Extension Wallet
            if (isExtensionWallet()) {
                startValidatorByEW(valSmcAddr)
                reFetchData();
                setIsLoading(false)
                setShowModel(false)
                return
            }

            const result = await startValidator(valSmcAddr, walletLocalState.account);
            ShowNotify(result)
            reFetchData();
        } catch (error) {
            ShowNotifyErr(error)
        }
        setIsLoading(false);
        setShowModel(false);
    }
    
    return (
        <Modal backdrop="static" size="sm" enforceFocus={true} show={showModel} onHide={() => { setShowModel(false) }}>
            <Modal.Header>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="confirm-letter" style={{ textAlign: 'center' }}>
                    {InforMessage.ConfirmStartingValidator}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="kai-button-gray" onClick={() => { setShowModel(false) }}>
                    Cancel
                </Button>
                <Button loading={isLoading} onClick={start}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default VaidatorStart;