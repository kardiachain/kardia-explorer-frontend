import { gasLimitDefault } from '../../common/constant';
import { cellValue, weiToKAI } from '../../common/utils/amount';
import { dateToLocalTime } from '../../common/utils/string';
import { STAKING_SMC_ADDRESS } from '../../config/api';
import { kardiaContract, kardiaProvider } from '../../plugin/kardia-tool';
import STAKING_ABI from '../../resources/smc-compile/staking-abi.json'
import STAKING_BYTE_CODE from '../../resources/smc-compile/staking-bin.json'

const stakingContract = kardiaContract(kardiaProvider, STAKING_BYTE_CODE, STAKING_ABI);

const invokeCallData = async (methodName: string, params: any[]) => {
    const invoke = await stakingContract.invoke({
        params: params,
        name: methodName
    })

    return await invoke.call(STAKING_SMC_ADDRESS, {}, "latest")
}

const invokeSendAction = async (methodName: string, params: any[], account: Account, amountVal: number = 0, gasLimit = gasLimitDefault, gasPrice = 2) => {
    const invoke = await stakingContract.invoke({
        params: params,
        name: methodName,
    });

    // const estimatedGas = await invoke.estimateGas({
    //     from: account.publickey,
    //     amount: amountVal,
    // });

    const invokeResult = await invoke.send(account.privatekey, STAKING_SMC_ADDRESS, {
        from: account.publickey,
        amount: amountVal,
        gas: gasLimit,
        gasPrice: gasPrice
    });

    return invokeResult;
}


const getValidatorsFromSMC = async (): Promise<StakingContractResponse> => {
    const invoke = await invokeCallData("getValidators", [])
    let totalVotingPower = 0;
    let totalDels = 0;
    let totalStakedAmont = 0
    let totalValidatorStakedAmount = 0;
    const promiseArr = invoke[0].map(async (item: any, i: number) => {
        const valAddr = item
        const validatorDetail = await getValidator(valAddr);
        const totalDelsOfVal = await getNumberDelOfValidator(valAddr);
        const votingPower = await getValidatorPower(valAddr);
        const validatorStaked = await getDelegatorStake(valAddr, valAddr)
        totalVotingPower += votingPower || 0;
        totalDels += totalDelsOfVal || 0;
        totalStakedAmont += Number(weiToKAI(invoke[1][i]));
        totalValidatorStakedAmount += Number(weiToKAI(validatorStaked));

        return {
            rank: i,
            address: valAddr,
            totalStakedAmount: invoke[1][i],
            delegationsShares: invoke[2][i],
            totalDels: totalDelsOfVal,
            votingPower: votingPower || 0,
            commission: validatorDetail.commission,
        } as ValidatorFromSMC

    })

    let validators: ValidatorFromSMC[] = await Promise.all(promiseArr);

    validators.sort(function (a: ValidatorFromSMC, b: ValidatorFromSMC) {
        return (b.votingPower || 0) - (a.votingPower || 0)
    }).map((val, index) => {
        val.votingPower = Number(new Intl.NumberFormat('en', { maximumFractionDigits: 3 }).format((Number(val.votingPower) / totalVotingPower) * 100));
        val.rank = index;
        return val;
    })

    return {
        totalVals: validators.length,
        totalDels: totalDels,
        totalVotingPower: totalVotingPower,
        totalStakedAmont: totalStakedAmont,
        totalValidatorStakedAmount: totalValidatorStakedAmount,
        totalDelegatorStakedAmount: totalStakedAmont - totalValidatorStakedAmount,
        validators: validators
    } as StakingContractResponse
}

const getDelegationsByValidator = async (valAddr: string): Promise<Delegator[]> => {
    let delegators: Delegator[] = [];
    if (!valAddr) return delegators;
    const invoke = await invokeCallData("getDelegationsByValidator", [valAddr])
    for (let i = 0; i < invoke[0].length; i++) {
        const delAddr = invoke[0][i]
        const stakeAmount = await getDelegatorStake(valAddr, delAddr)
        const rewardAmount = await getDelegationRewards(valAddr, delAddr)
        let delegator: Delegator = {
            address: delAddr,
            delegationsShares: invoke[1][i],
            stakeAmount: stakeAmount,
            validatorAddress: valAddr,
            rewardsAmount: rewardAmount
        }
        delegators.push(delegator)
    }
    return delegators
}


// Get delegator stake amount for validator
// @return stakeAmount
const getDelegatorStake = async (valAddr: string, delAddr: string): Promise<number> => {
    return await invokeCallData("getDelegatorStake", [valAddr, delAddr])
}

// Get delegator rewards amount with special validator
// @return rewardAmount
const getDelegationRewards = async (valAddr: string, delAddr: string): Promise<number> => {
    return await invokeCallData("getDelegationRewards", [valAddr, delAddr])
}

const getNumberDelOfValidator = async (valAddr: string): Promise<number> => {
    const invoke = await invokeCallData("getDelegationsByValidator", [valAddr])
    const listVals = invoke[0]
    return listVals.length
}

const getValidatorsByDelegator = async (delAddr: string): Promise<YourValidator[]> => {
    const valAddr = await invokeCallData("getValidatorsByDelegator", [delAddr])
    let validators: YourValidator[] = [];
    if (valAddr.length === 0) return validators
    for (let i = 0; i < valAddr.length; i++) {
        const valAddress = valAddr[i];
        const stakeAmount = await getDelegatorStake(valAddress, delAddr)
        const rewardAmount = await getDelegationRewards(valAddress, delAddr)
        const ubdEntries = await getUBDEntries(valAddress, delAddr)
        let withdrawableAmount = 0;
        let unbondedAmount = 0;
        ubdEntries.filter(item => item.enableWithdraw).forEach(item => {
            withdrawableAmount += item.withdrawableAmount;
        });
        ubdEntries.filter(item => !item.enableWithdraw).forEach(item => {
            unbondedAmount += item.withdrawableAmount;
        });



        const validator: YourValidator = {
            validatorAddr: valAddress,
            yourStakeAmount: stakeAmount,
            claimableAmount: rewardAmount,
            withdrawable: ubdEntries,
            withdrawableAmount: withdrawableAmount,
            unbondedAmount: unbondedAmount
        }

        validators.push(validator)
    }


    return validators
}

const getUBDEntries = async (valAddr: string, delAddr: string): Promise<UBDEntries[]> => {
    const ubdEntries = await invokeCallData("getUBDEntries", [valAddr, delAddr])

    const result: UBDEntries[] = []
    for (let i = 0; i < ubdEntries[0].length; i++) {
        const enableTime = dateToLocalTime(ubdEntries[1][i] * 1000);
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

const getValidator = async (valAddr: string): Promise<ValidatorFromSMC> => {
    try {
        if (!valAddr) {
            return {} as ValidatorFromSMC
        }
        const invoke = await invokeCallData("getValidator", [valAddr])
        const votingPower = await getValidatorPower(valAddr)
        const totalDels = await getNumberDelOfValidator(valAddr)

        let validator: ValidatorFromSMC = {
            address: valAddr,
            totalStakedAmount: invoke[0],
            delegationsShares: invoke[1],
            jailed: invoke[2],
            votingPower: votingPower,
            totalDels: totalDels,
            commission: weiToKAI(Number(invoke[3]) * 100) || 0,
        }
        return validator

    } catch (error) {
        return {} as ValidatorFromSMC
    }
}

const isValidator = async (valAddr: string): Promise<boolean> => {
    try {
        if (!valAddr) return false;
        const invoke = await invokeCallData("getValidator", [valAddr])
        if (invoke) return true
    } catch (error) {
        return false
    }
    return false

}

const getValidatorCommission = async (valAddr: string): Promise<number> => {
    const commission = await invokeCallData("getValidatorCommission", [valAddr])
    return commission;
}

const getValidatorPower = async (valAddr: string): Promise<number> => {
    return await invokeCallData("getValidatorPower", [valAddr])
}


const delegateAction = async (valAddr: string, account: Account, amountDel: number, gasLimit: number, gasPrice: number) => {
    try {
        const cellAmountDel = cellValue(amountDel);
        return await invokeSendAction("delegate", [valAddr], account, cellAmountDel, gasLimit, gasPrice);
    } catch (error) {
        throw error;
    }
}

const createValidator = async (commissionRate: number, maxRate: number, maxRateChange: number, minSeftDelegation: number, account: Account, amountDel: number, gasLimit: number, gasPrice: number) => {
    try {
        // convert value number type to decimal type
        const cellAmountDel = cellValue(amountDel);
        const minSeftDelegationDec = cellValue(minSeftDelegation);

        // convert value percent type to decimal type
        const commissionRateDec = cellValue(commissionRate / 100);
        const maxRateDec = cellValue(maxRate / 100);
        const maxRateChangeDec = cellValue(maxRateChange / 100)
        return await invokeSendAction("createValidator", [commissionRateDec, maxRateDec, maxRateChangeDec, minSeftDelegationDec], account, cellAmountDel, gasLimit, gasPrice);
    } catch (error) {
        throw error;
    }
}

// @Function: update validator
const updateValidator = async (commissionRate: number, minSeftDelegation: number, account: Account) => {
    try {
        // convert value number type to decimal type
        const minSeftDelegationDec = cellValue(minSeftDelegation);

        // convert value percent type to decimal type
        const commissionRateDec = cellValue(commissionRate / 100);
        return await invokeSendAction("updateValidator", [commissionRateDec, minSeftDelegationDec], account);
    } catch (error) {
        throw error;
    }
}

// Delegator withdraw reward
const withdrawReward = async (valAddr: string, account: Account) => {
    try {
        return await invokeSendAction("withdrawReward", [valAddr], account, 0);
    } catch (error) {
        throw error;
    }
}

// Delegator withdraw
const withdraw = async (valAddr: string, account: Account) => {
    try {
        return await invokeSendAction("withdraw", [valAddr], account, 0)
    } catch (error) {
        throw error;
    }
}

// Undelegate
const undelegateStake = async (valAddr: string, amountUndel: number, account: Account) => {
    try {
        // convert value number type to decimal type
        const amountUndelDec = cellValue(amountUndel);
        return await invokeSendAction("undelegate", [valAddr, amountUndelDec], account, 0)
    } catch (error) {
        throw error
    }
}

export {
    invokeCallData,
    invokeSendAction,
    getDelegationsByValidator,
    getValidatorsByDelegator,
    getValidator,
    getValidatorCommission,
    delegateAction,
    createValidator,
    getValidatorsFromSMC,
    isValidator,
    getNumberDelOfValidator,
    getValidatorPower,
    withdrawReward,
    withdraw,
    updateValidator,
    undelegateStake
}
