import { fractionDivide, toFixed, toFraction } from "./fraction";
import { BigNumber } from "bignumber.js";
import { KardiaUtils } from "kardia-js-sdk";

const cellValue = (kaiValue: any) => {
  return KardiaUtils.toHydro(kaiValue, 'kai')
};

const cellValueKRC20 = (kaiValue: any, decimal: number) => {
  const rawValue = new BigNumber(kaiValue);
  return rawValue.multipliedBy(new BigNumber(10 ** decimal)).toFixed(0, 1)
};

const weiToKAI = (value: any): any => {
  try {
    if (!value || value === '0') return '0'
    return KardiaUtils.fromHydro(value, 'kai')
  } catch (error) {  }
};

const weiToOXY = (value: any): any => {
  try {
    if (!value || value === '0') return '0'
    return KardiaUtils.fromHydro(value, 'oxy')
  } catch (error) {}
};

const oxyToKAI = (value: any): any => {
  try {
    if (!value || value === '0') return '0'
    return KardiaUtils.fromHydro(value, 'oxy')
  } catch (error) { }
};

const convertValueFollowDecimal = (value: any, decimals: number): any => {
  try {
    if (!value || value === '0') {
      return 0
    }
    if (!decimals) {
      return value
    }

    const valueConvert = fractionDivide(toFraction(value), toFraction(String(10 ** decimals)))
    return removeTrailingZeros(toFixed(valueConvert, decimals))
  } catch (error) {
    console.error(error)
    return '0'
  }
};

const formatFullAmount = (amount: string) => {
  try {
    return amount && amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  } catch (error) {
    return amount
  }
}

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
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value / 1000000000)}B`;
  }

  if (value >= 1000000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value / 1000000)}M`;
  }

  if (value >= 1000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value / 1000)}K`;
  }

  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
}

const formatAmountwithPlus = (value: number) => {

  if (value >= 1000000000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value / 1000000000)}B+`;
  }

  if (value >= 1000000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value / 1000000)}M+`;
  }

  if (value >= 1000) {
    return `${new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value / 1000)}K+`;
  }

  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
}



export { weiToKAI, cellValue, formatAmount, formatAmountwithPlus, formatFullAmount, weiToOXY, oxyToKAI, convertValueFollowDecimal, cellValueKRC20 }