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

const kaiValueString = (value: any) => {
    console.log(value);
    
    if (!value || '0' === value) {
      return '-'
    }
    const cellString = value.toString().padStart(36, '0');
    const kaiNumString = parseInt(cellString.slice(0, 18));
    const kaiDecimalString = cellString.slice(-18);
    const finalVal = `${kaiNumString}.${kaiDecimalString}`;
    return `${removeTrailingZeros(finalVal)} KAI`;
};
  
const kaiValueNumber = (value: any) => {
    if (!value || '0' === value) {
      return 0;
    }
    return Number(value) / 1000000000000000000;
};

const removeTrailingZeros = (value: any) => {
    const regEx1 = /^[0]+/;
    const regEx2 = /[0]+$/;
    const regEx3 = /[.]$/;
  
    const valueInString = value.toString();
  
    let after = valueInString.replace(regEx1, '');  // Remove leading 0's
  
    if (after.indexOf('.') > -1) {
      after = after.replace(regEx2, '');  // Remove trailing 0's
    }
    after = after.replace(regEx3, '');  // Remove trailing decimal
  
    if (after.indexOf('.') === 0) {
      after = '0' + after
    }
    return after ? after : '0';
};

export { renderHashString, copyToClipboard, truncate, kaiValueNumber, kaiValueString}