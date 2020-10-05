import React from 'react';
import { Alert, Icon, IconButton } from 'rsuite';
function truncate(str: string, n: number){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};

const copyToClipboard = (text: string, onSuccess?: () => void, onFail?: () => void) => {
    navigator.clipboard.writeText(text).then(function() {
        onSuccess && onSuccess()
    }, function(err) {
        onFail && onFail()
    });
}


const renderHashString = (hash: string, headCount?: number, tailCount?: number) => {
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

export { renderHashString }