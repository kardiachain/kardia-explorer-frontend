import { cellValue } from '../../common';
import { STAKING_SMC_ADDRESS } from '../../config';
import STAKING_ABI from '../../resources/smc-compile/staking-abi.json'
import VALIDATOR_ABI from '../../resources/smc-compile/validator-abi.json';
import { invokeSendAction } from '.';
import { KardiaUtils } from 'kardia-js-sdk';
import { GasMode } from '../../enum';



const delegateAction = async (valSmcAddr: string, account: Account, amountDel: number, gasLimit: number, gasPrice: GasMode) => {
    const cellAmountDel = cellValue(amountDel);
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "delegate", [], account, cellAmountDel, gasLimit, gasPrice);
}

const createValidator = async (params: CreateValParams, account: Account, gasLimit: number, gasPrice: GasMode) => {
    // convert value percent type to decimal type
    const commissionRateDec = cellValue(params.commissionRate / 100);
    const maxRateDec = cellValue(params.maxRate / 100);
    const maxRateChangeDec = cellValue(params.maxChangeRate / 100);
    // Convert validator name to bytes
    const valName = KardiaUtils.bytes.fromAscii(params.valName);
    // Convert amount to decimal type
    const delAmountDec = cellValue(params.yourDelegationAmount);
    return await invokeSendAction(STAKING_ABI, STAKING_SMC_ADDRESS, "createValidator", [valName, commissionRateDec, maxRateDec, maxRateChangeDec], account, delAmountDec, gasLimit, gasPrice);
}

const updateValidatorName = async (valSmcAddr: string, name: string, account: Account, amountFee: number, gasLimit: number, gasPrice: GasMode) => {
    // Convert amount to decimal type
    const amountFeeDec = cellValue(amountFee);
    // Convert new validator name to bytes
    const valName = KardiaUtils.bytes.fromAscii(name);
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "updateName", [valName], account, amountFeeDec, gasLimit, gasPrice);
}

const updateValidatorCommission = async (valSmcAddr: string, newCommissionRate: number, account: Account, gasLimit: number, gasPrice: GasMode) => {
    // convert value percent type to decimal type
    const newCommissionRateDec = cellValue(newCommissionRate / 100);
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "updateCommissionRate", [newCommissionRateDec], account, 0, gasLimit, gasPrice);
}

const startValidator = async (valSmcAddr: string, account: Account) => {
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "start", [], account, 0);
}

const withdrawCommission = async (valSmcAddr: string, account: Account) => {
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "withdrawCommission", [], account, 0);
}

const withdrawReward = async (valSmcAddr: string, account: Account) => {
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "withdrawRewards", [], account, 0);
}

const withdrawDelegatedAmount = async (valSmcAddr: string, account: Account) => {
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "withdraw", [], account, 0);
}

const undelegateWithAmount = async (valSmcAddr: string, amountUndel: number, account: Account) => {
    // convert value number type to decimal type
    const amountUndelDec = cellValue(amountUndel);
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "undelegateWithAmount", [amountUndelDec], account, 0);
}

const undelegateAll = async (valSmcAddr: string, account: Account) => {
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "undelegate", [], account, 0);
}

const unjailValidator = async (valSmcAddr: string, account: Account) => {
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "unjail", [], account, 0);
}

const stopValidator = async (valSmcAddr: string, account: Account) => {
    return await invokeSendAction(VALIDATOR_ABI, valSmcAddr, "stop", [], account, 0);

}

export {
    delegateAction,
    createValidator,
    withdrawReward,
    withdrawDelegatedAmount,
    undelegateWithAmount,
    withdrawCommission,
    undelegateAll,
    startValidator,
    unjailValidator,
    updateValidatorName,
    updateValidatorCommission,
    stopValidator
}
