import React from 'react';
import { Alert, Icon, IconButton } from 'rsuite';
function truncate(str: string, n: number) {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
};

const copyToClipboard = (text: string, onSuccess?: () => void, onFail?: () => void) => {
    navigator.clipboard.writeText(text).then(function () {
        onSuccess && onSuccess()
    }, function (err) {
        onFail && onFail()
    });
}


const renderHashString = (hash: string, headCount?: number, tailCount?: number) => {
    if (!hash) return null;
    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }
    return (
        <span>
            {truncate(hash, headCount || 10)}{' '}
            <IconButton
                onClick={() => copyToClipboard(hash, onSuccess)}
                size="xs"
                icon={<Icon icon="copy" />}
            />
        </span>
    );
}

const renderHashToRedirect = (hash: any, headCount?: number, callBack?: () => void) => {
    return (
        <span onClick={() => {callBack && callBack()}}  style={{ cursor: 'pointer', color:'#1f0080' }}>
            {truncate(String(hash), headCount || 10)}{' '}
        </span>
    )
}


const millisecondToHMS = (time: number) => {
    const timeInSeconds = parseInt(String(time / 1000));
    const days = parseInt(String((timeInSeconds / 86400)))
    const hours = parseInt(String((timeInSeconds % 86400) / 3600));
    const minutes = parseInt(String((timeInSeconds % 3600) / 60));
    const seconds = timeInSeconds - days*86400 - hours * 3600 - minutes * 60;

    const hourString = hours ? `${hours} hr${hours > 1 ? 's' : ''}` : '';
    const minuteString = minutes ? `${minutes} min${minutes > 1 ? 's' : ''}` : '';
    const secondString = seconds ? `${seconds} sec${seconds > 1 ? 's' : ''}` : '';
    const daysString = days ? `${days} day${days > 1 ? 's' : ''}` : '';

    return `${daysString} ${hourString} ${minuteString} ${secondString} ago`
};
export { renderHashString, copyToClipboard, truncate, millisecondToHMS, renderHashToRedirect}