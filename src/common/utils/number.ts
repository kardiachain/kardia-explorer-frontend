const onlyNumber = (value: any) => {
    const re = /^(0|[1-9]\d*)(.\d*)?$/;
    if (value === '' || re.test(String(Number(value)))) {
        return true
    }
    return false
}

const onlyInteger = (amount: any) => {
    const re = /^[0-9]+$/;
    if (amount === '' || re.test(amount)) {
        return true
    }
    return false
}

const numberFormat = (amount: any, fractionDigits = 0) => {
    try {
        if (fractionDigits !== 0) {
            return amount && amount.toFixed(fractionDigits).toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
        }
        return amount && amount.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
      } catch (error) {
        return amount
      }
}

export {onlyNumber, numberFormat, onlyInteger}