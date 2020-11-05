const cellValue = (kaiValue: any) => {
  let cellString = removeTrailingZeros(kaiValue);
  let decimalStr = cellString.split('.')[1];
  let numberStr = cellString.split('.')[0];
  if (!decimalStr) {
    numberStr = numberStr.padEnd(18 + numberStr.length, '0');
  } else {
    decimalStr = decimalStr.padEnd(18, '0');
  }
  cellString = `${numberStr}${decimalStr || ''}`;
  return cellString;
};

const weiToKAI = (value: any) => {
  if (!value || value === '0') {
    return '0'
  }
  
  value = value.toLocaleString('en-US', { useGrouping: false });
  const cellString = value.toString().padStart(36, '0');

  const kaiNumString = parseInt(cellString.slice(0, 18));
  const kaiDecimalString = cellString.slice(-18);
  return`${removeTrailingZeros(`${kaiNumString}.${kaiDecimalString}`)}`;
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
  return after ? after : 0;
};

const formatAmount = (value: number) => {

  if (value >= 1000000000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 18 }).format(value / 1000000000)}B`;
  }

  if (value >= 1000000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 18 }).format(value / 1000000)}M`;
  }

  if (value >= 1000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 18 }).format(value / 1000)}K`;
  }

  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
}

const formatAmountwithPlus = (value: number) => {

  if (value >= 1000000000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value / 1000000000)}B+`;
  }

  if (value >= 1000000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value / 1000000)}M+`;
  }

  if (value >= 1000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value / 1000)}K+`;
  }

  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
}



export { weiToKAI, cellValue, formatAmount, formatAmountwithPlus }