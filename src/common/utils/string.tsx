import React from 'react';
import { Alert, ButtonProps, Icon, IconButton, Tooltip, Whisper } from 'rsuite';
function truncate(str: string, n: number, e: number) {
    if (n > str.length - e) {
        return str
    }
    return str.substr(0, n - 1) + '...' + str.substr(str.length - e - 1);
};

const copyToClipboard = (text: string, onSuccess?: () => void, onFail?: () => void) => {
    navigator?.clipboard?.writeText(text).then(function () {
        onSuccess && onSuccess()
    }, function (err) {
        onFail && onFail()
    });
}

const renderCopyButton = ({str, size, callback}: {
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
        <span className="hex">
            {truncate(hash, headCount || 10, tailCount || 4)}{' '}
            {renderCopyButton({str: hash, size: "xs", callback: () => copyToClipboard(hash, onSuccess)})}
        </span>
    );
}

const renderHashStringAndTooltip = (hash: string, headCount?: number, tailCount?: number, showTooltip?: boolean) => {
    return showTooltip ? (
        <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{hash}</Tooltip>}>
            <span className="hex">
                {truncate(hash, headCount || 10, tailCount || 4)}{' '}
            </span>
        </Whisper>
    ) : (
            <span className="hex">
                {truncate(hash, headCount || 10, tailCount || 4)}{' '}
            </span>
        );
}

const renderHashToRedirect = ({
    hash, headCount = 6, tailCount = 4, showTooltip = true, callback, showCopy = false
}: {
    hash: any, headCount?: number, tailCount?: number, showTooltip?: boolean, callback?: () => void, showCopy?: boolean
}) => {
    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }
    return showTooltip ? (
        <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{hash}</Tooltip>}>
            <span className="hex" style={{ cursor: 'pointer', color:'#9E3144' }}>
                <span onClick={() => {callback && callback()}}>{truncate(String(hash), headCount, tailCount)}{' '}</span>
                {showCopy && renderCopyButton({str: hash, size: "xs", callback: () => copyToClipboard(hash, onSuccess)})}
            </span>
        </Whisper>
    ) : (
        <span className="hex" style={{ cursor: 'pointer', color:'#9E3144' }}>
            <span onClick={() => {callback && callback()}} >{truncate(String(hash), headCount, tailCount)}{' '}</span>
            {showCopy && renderCopyButton({str: hash, size: "xs", callback: () => copyToClipboard(hash, onSuccess)})}
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

    if(daysString) {
        return `${daysString} ago`
    }
    if(hourString) {
        return `${hourString} ago`
    }
    if(minuteString) {
        return `${minuteString} ago`
    }
    return `${secondString} ago`
};
const dateToLocalTime = (time: Date) => {
    const d = new Date(time);
    return d.toLocaleString()
}

const randomRGBColor = (): string => {
    const rrr =  Math.floor(Math.random() * 255);
    const ggg =  Math.floor(Math.random() * 255);
    const bbb =  Math.floor(Math.random() * 255);
    return `rgb(${rrr},${ggg},${bbb})`
} 
export { renderHashString, copyToClipboard, truncate, millisecondToHMS, renderHashToRedirect, dateToLocalTime, renderHashStringAndTooltip, randomRGBColor, renderCopyButton}
