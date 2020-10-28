import React from 'react';
import { Alert, ButtonProps, Icon, IconButton } from 'rsuite';
function truncate(str: string, n: number, e: number) {
    if (n > str.length - e) {
        return str
    }
    return str.substr(0, n - 1) + '...' + str.substr(str.length - e - 1);
};

const copyToClipboard = (text: string, onSuccess?: () => void, onFail?: () => void) => {
    navigator.clipboard.writeText(text).then(function () {
        onSuccess && onSuccess()
    }, function (err) {
        onFail && onFail()
    });
}

export const renderCopyButton = ({str, size, callback}: {
    str: string,
    size: ButtonProps["size"],
    callback: () => void
}) => {
    return (
        <IconButton
            onClick={() => copyToClipboard(str, callback)}
            size={size}
            icon={<Icon icon="copy" />}
        />
    )
}


const renderHashString = (hash: string, headCount?: number, tailCount?: number) => {
    if (!hash) return null;
    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }
    return (
        <span>
            {truncate(hash, headCount || 10, tailCount || 4)}{' '}
            <IconButton
                onClick={() => copyToClipboard(hash, onSuccess)}
                size="xs"
                icon={<Icon icon="copy" />}
            />
        </span>
    );
}

const renderHashToRedirect = ({
    hash, headCount = 6, tailCount = 4, callback
}: {
    hash: any, headCount?: number, tailCount?: number, callback?: () => void
}) => {
    return (
        <span onClick={() => {callback && callback()}}  style={{ cursor: 'pointer', color:'#1f0080' }}>
            {truncate(String(hash), headCount, tailCount)}{' '}
        </span>
    )
}


const millisecondToHMS = (time: number) => {
    const timeInSeconds = Math.floor(time / 1000);
    const days = Math.floor((timeInSeconds / 86400))
    const hours = Math.floor((timeInSeconds % 86400) / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds - days*86400 - hours * 3600 - minutes * 60;

    const hourString = hours ? `${hours} hr${hours > 1 ? 's' : ''}` : '';
    const minuteString = minutes ? `${minutes} min${minutes > 1 ? 's' : ''}` : '';
    const secondString = seconds ? `${seconds} sec${seconds > 1 ? 's' : ''}` : '';
    const daysString = days ? `${days} day${days > 1 ? 's' : ''}` : '';

    return `${daysString} ${hourString} ${minuteString} ${secondString} ago`
};
const dateToLocalTime = (time: Date) => {
    const d = new Date(time);
    return d.toLocaleString()
}
export { renderHashString, copyToClipboard, truncate, millisecondToHMS, renderHashToRedirect, dateToLocalTime}
