import React from 'react'
import { Icon, Whisper, Tooltip } from 'rsuite'
import { NotifiMessage } from '../../constant'
import { NotificationError, NotificationSuccess } from '../Notification'

export const Helper = ({info, style, className}:{info: string; style?: React.CSSProperties; className?: string }) => {
    return (
        <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{info}</Tooltip>}>
            <Icon className={className} style={style} icon="info"/>
        </Whisper>
    )
}

export const ShowNotify = (response: any) => { 
      // transaction fail
      if (response.status === 0) {
        NotificationError({
            description: NotifiMessage.TransactionError,
            callback: () => { window.open(`/tx/${response.transactionHash}`) },
            seeTxdetail: true
        });
    }
    
    // transaction success

    if(response.status === 1){
        NotificationSuccess({
            description: NotifiMessage.TransactionSuccess,
            callback: () => { window.open(`/tx/${response.transactionHash}`) },
            seeTxdetail: true
        });
    }
}

export const ShowNotifyErr = (error: any) => {
    try {
        const errJson = JSON.parse(error?.message);
        NotificationError({
            description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
        })
    } catch (error) {
        NotificationError({
            description: NotifiMessage.TransactionError
        });
    }
}