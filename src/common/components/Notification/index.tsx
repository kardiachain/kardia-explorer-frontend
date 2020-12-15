import { Notification } from "rsuite";

const NotificationSuccess = ({title="Success", description, duration = 10000}: {
    title?: string;
    description: any;
    duration?: number
}) => {
    Notification.success({
        title: title,
        duration: duration,
        description: description
    });
}

const NotificationError = ({title="Error", description, duration = 10000}: {
    title?: string;
    description: any;
    duration?: number
}) => {
    Notification.error({
        title: title,
        duration: duration,
        description: description
    });
}

export {
    NotificationSuccess,
    NotificationError
}