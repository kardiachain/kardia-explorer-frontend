import React from "react";
import { Notification } from "rsuite";
import "./style.css"

const NotificationSuccess = ({callback, title="Success", description, duration = 7000, seeTxdetail=false}: {
    callback?: () => void;
    title?: string;
    description: any;
    duration?: number;
    txDetails?: string;
    seeTxdetail?: boolean;
}) => {
    Notification.success({
        title: title,
        duration: duration,
        description: () => {
            return (
                <>
                    <span>{description}</span> <br/>
                    {
                        seeTxdetail ? 
                        <div onClick={() => callback && callback()} className="see-tx-detail">{`See transaction details >>`}</div> : <></>
                    }
                </>
            )
        }
    });
}

const NotificationError = ({callback, title="Error", description, duration = 7000, seeTxdetail=false}: {
    callback?: () => void;
    title?: string;
    description: any;
    duration?: number;
    seeTxdetail?: boolean;
}) => {
    Notification.error({
        title: title,
        duration: duration,
        description: () => {
            return (
                <>
                    <span>{description}</span> <br/>
                    {
                        seeTxdetail ? 
                        <div onClick={() => callback && callback()} className="see-tx-detail">{`See transaction details >>`}</div> : <></>
                    }
                </>
            )
        }
    });
}

const NotificationWarning = ({callback, title="Warning", description, duration = 7000, seeTxdetail=false}: {
    callback?: () => void;
    title?: string;
    description: any;
    duration?: number;
    seeTxdetail?: boolean;
}) => {
    Notification.warning({
        title: title,
        duration: duration,
        description: () => {
            return (
                <>
                    <span>{description}</span> <br/>
                    {
                        seeTxdetail ? 
                        <div onClick={() => callback && callback()} className="see-tx-detail">{`See transaction details >>`}</div> : <></>
                    }
                </>
            )
        }
    });
}

export {
    NotificationSuccess,
    NotificationError,
    NotificationWarning
}