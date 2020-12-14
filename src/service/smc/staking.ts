import { gasLimitDefault } from '../../common/constant';
import { cellValue } from '../../common/utils/amount';
import { dateToUTCString } from '../../common/utils/string';
import { STAKING_SMC_ADDRESS } from '../../config/api';
import { kardiaContract, kardiaProvider } from '../../plugin/kardia-tool';
import STAKING_ABI from '../../resources/smc-compile/staking-abi.json'
import VALIDATOR_ABI from '../../resources/smc-compile/validator-abi.json';
import { fromAscii } from 'kardia-tool/lib/common/lib/bytes';
import { toChecksum } from 'kardia-tool/lib/common/lib/account';

const stakingContract = kardiaContract(kardiaProvider, "", STAKING_ABI);
const validatorContract = kardiaContract(kardiaProvider, "", VALIDATOR_ABI);

const invokeCallData = async (
    contractInstance: any,
    contractAddr: string,
    methodName: string,
    params: any[]
) => {
    const invoke = await contractInstance.invoke({
        params: params,
        name: methodName
    })

    return await invoke.call(contractAddr, {}, "latest")
}

const invokeSendAction = async (
    contractInstance: any,
    contractAddr: string,
    methodName: string,
    params: any[],
    account: Account,
    amountVal: number = 0,
    gasLimit = gasLimitDefault,
    gasPrice = 2
) => {
    const invoke = await contractInstance.invoke({
        params: params,
        name: methodName,
    });

    console.log("Params", params);
    const invokeResult = await invoke.send(account.privatekey, contractAddr, {
        from: account.publickey,
        amount: amountVal,
        gas: gasLimit,
        gasPrice: gasPrice
    });

    console.log("invokeResult", invokeResult);
    return invokeResult;
}


const getValidatorsByDelegator = async (delAddr: string): Promise<YourValidator[]> => {
    // const valAddr = await invokeCallData(stakingContract, STAKING_SMC_ADDRESS, "getValidatorsByDelegator", [delAddr])
    let validators: YourValidator[] = [];
    // if (valAddr.length === 0) return validators
    // for (let i = 0; i < valAddr.length; i++) {
    //     const valAddress = valAddr[i];
    //     const stakeAmount = await getDelegatorStake(valAddress, delAddr)
    //     const rewardAmount = await getDelegationRewards(valAddress, delAddr)
    //     const ubdEntries = await getUBDEntries(valAddress, delAddr)
    //     let withdrawableAmount = 0;
    //     let unbondedAmount = 0;
    //     ubdEntries.filter(item => item.enableWithdraw).forEach(item => {
    //         withdrawableAmount += item.withdrawableAmount;
    //     });
    //     ubdEntries.filter(item => !item.enableWithdraw).forEach(item => {
    //         unbondedAmount += item.withdrawableAmount;
    //     });



    //     const validator: YourValidator = {
    //         validatorAddr: valAddress,
    //         yourStakeAmount: stakeAmount,
    //         claimableAmount: rewardAmount,
    //         withdrawable: ubdEntries,
    //         withdrawableAmount: withdrawableAmount,
    //         unbondedAmount: unbondedAmount
    //     }

    //     validators.push(validator)
    // }


    return validators
}

const getUBDEntries = async (valAddr: string, delAddr: string): Promise<UBDEntries[]> => {
    const ubdEntries = await invokeCallData(stakingContract, STAKING_SMC_ADDRESS, "getUBDEntries", [valAddr, delAddr])

    const result: UBDEntries[] = []
    for (let i = 0; i < ubdEntries[0].length; i++) {
        const enableTime = dateToUTCString(ubdEntries[1][i] * 1000);
        const now = (new Date()).getTime()
        const item = {
            withdrawableAmount: ubdEntries[0][i],
            withdrawableTime: enableTime,
            enableWithdraw: ubdEntries[1][i] * 1000 < now ? true : false
        }
        result.push(item);
    }
    return result;
}

const isValidator = async (valAddr: string): Promise<boolean> => {
    try {
        if (!valAddr) return false;
        const invoke = await invokeCallData(stakingContract, STAKING_SMC_ADDRESS, "getValidator", [valAddr])
        if (invoke) return true
    } catch (error) {
        return false
    }
    return false

}

const delegateAction = async (valSmcAddr: string, account: Account, amountDel: number, gasLimit: number, gasPrice: number) => {
    try {
        const cellAmountDel = cellValue(amountDel);
        return await invokeSendAction(validatorContract, toChecksum(valSmcAddr), "delegate", [], account, cellAmountDel, gasLimit, gasPrice);
    } catch (error) {
        throw error;
    }
}

const createValidator = async (params: CreateValParams, account: Account, gasLimit: number, gasPrice: number) => {
    try {
        // convert value number type to decimal type
        const minSeftDelegationDec = cellValue(params.minSeftDelegation);

        // convert value percent type to decimal type
        const commissionRateDec = cellValue(params.commissionRate / 100);
        const maxRateDec = cellValue(params.maxRate / 100);
        const maxRateChangeDec = cellValue(params.maxChangeRate / 100);
        // Convert validator name to bytes
        const valName = fromAscii(params.valName);
        return await invokeSendAction(stakingContract, STAKING_SMC_ADDRESS, "createValidator", [valName, commissionRateDec, maxRateDec, maxRateChangeDec, minSeftDelegationDec], account, 0, gasLimit, gasPrice);
    } catch (error) {
        throw error;
    }
}

// @Function: update validator
const updateValidator = async (params: UpdateValParams, account: Account, gasLimit: number, gasPrice: number) => {
    try {
        // convert value number type to decimal type
        const minSeftDelegationDec = cellValue(params.newMinSelfDelegation);
        // convert value percent type to decimal type
        const commissionRateDec = cellValue(params.newCommissionRate / 100);
        // Convert new validator name to bytes
        const valName = fromAscii(params.newValName);
        // Checksum validator's smart contract address
        const valSmcAddr = toChecksum(params.valSmcAddr);
        return await invokeSendAction(validatorContract, valSmcAddr, "updateValidator", [valName, commissionRateDec, minSeftDelegationDec], account, 0, gasLimit, gasPrice);
    } catch (error) {
        throw error;
    }
}

// Validator withdraw commission reward
const withdrawCommission = async (valSmcAddr: string, account: Account) => {
    try {
        return await invokeSendAction(validatorContract, toChecksum(valSmcAddr), "withdrawCommission", [], account, 0);
    } catch (error) {
        throw error
    }
}

// Delegator withdraw reward
const withdrawReward = async (valSmcAddr: string, account: Account) => {
    try {
        return await invokeSendAction(validatorContract, toChecksum(valSmcAddr), "withdrawRewards", [], account, 0);
    } catch (error) {
        throw error;
    }
}

// Delegator withdraw
const withdraw = async (valSmcAddr: string, account: Account) => {
    try {
        return await invokeSendAction(validatorContract, toChecksum(valSmcAddr), "withdraw", [], account, 0);
    } catch (error) {
        throw error;
    }
}

// Undelegate with amount
const undelegateWithAmount = async (valSmcAddr: string, amountUndel: number, account: Account) => {
    try {
        // convert value number type to decimal type
        const amountUndelDec = cellValue(amountUndel);
        return await invokeSendAction(validatorContract, toChecksum(valSmcAddr), "undelegateWithAmount", [amountUndelDec], account, 0);
    } catch (error) {
        throw error;
    }
}

// Undelegate all amount
const undelegateAll = async (valSmcAddr: string, account: Account) => {
    try {
        return await invokeSendAction(validatorContract, toChecksum(valSmcAddr), "undelegate", [], account, 0);
    } catch (error) {
        throw error;
    }
}

export {
    invokeCallData,
    invokeSendAction,
    getValidatorsByDelegator,
    delegateAction,
    createValidator,
    isValidator,
    withdrawReward,
    withdraw,
    updateValidator,
    undelegateWithAmount,
    withdrawCommission,
    undelegateAll
}
