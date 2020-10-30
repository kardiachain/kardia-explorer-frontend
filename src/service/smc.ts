import { cellValue } from '../common/utils/amount';
import { STAKING_SMC_ADDRESS } from '../config/api';
import { kardiaContract, kardiaProvider } from '../plugin/kardia-tool';
import STAKING_ABI from '../resources/smc-compile/staking-abi.json'
import STAKING_BYTE_CODE from '../resources/smc-compile/staking-bin.json'

const stakingContract = kardiaContract(kardiaProvider, STAKING_BYTE_CODE, STAKING_ABI);

const invokeCallData = async (methodName: string, params: any[]) => {
    const invoke = await stakingContract.invoke({
        params: params,
        name: methodName
    })
    const result = await invoke.call(STAKING_SMC_ADDRESS)
    return result
}

const invokeSendAction = async (methodName: string, params: any[], account: Account, amountVal: number) => {
    const invoke = await stakingContract.invoke({
        params: params,
        name: methodName,
    });

    const estimatedGas = await invoke.estimateGas({
        from: account.publickey,
        amount: amountVal,
        gas: 2100,
        gasPrice: 2
    });

    const invokeResult = await invoke.send(account.privatekey, STAKING_SMC_ADDRESS, {
        from: account.publickey,
        amount: amountVal,
        gas: 900000 + estimatedGas,
        gasPrice: 2
    });

    return invokeResult;
}


const getValidatorsFromSMC = async (): Promise<ValidatorFromSMC[]> => {
    const invoke = await invokeCallData("getValidators", [])
    let validators: ValidatorFromSMC[] = [];
    for (let i = 0; i < invoke[0].length; i++) {
        const totalDels = await getNumberDelOfValidator(invoke[0][i])
        const votingPower = await getValidatorPower(invoke[0][i])
        let validator: ValidatorFromSMC = {
            address: invoke[0][i],
            totalStakedAmount: invoke[1][i],
            delegationsShares: invoke[2][i],
            totalDels: totalDels,
            votingPower: votingPower
        }
        validators.push(validator)
    }
    return validators
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
        const validator: YourValidator = {
            validatorAddr: valAddress,
            yourStakeAmount: stakeAmount,
            yourRewardAmount: rewardAmount
        }
        validators.push(validator)
    }
    return validators
}

const getValidator = async (valAddr: string): Promise<ValidatorFromSMC> => {
    const invoke = await invokeCallData("getValidator", [valAddr])
    const votingPower = await getValidatorPower(valAddr)
    const totalDels = await getNumberDelOfValidator(valAddr)
    
    let validator: ValidatorFromSMC = {
        address: valAddr,
        totalStakedAmount: invoke[0],
        delegationsShares: invoke[1],
        jailed: invoke[2],
        votingPower: votingPower,
        totalDels: totalDels
    }
    
    return validator
}

const isValidator = async (valAddr: string): Promise<boolean> => {
    try {
        const invoke = await invokeCallData("getValidator", [valAddr])
        if(invoke) return true
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


const delegateAction = async (valAddr: string, account: Account, amountDel: number) => {
    // const cellAmountDel = cellValue(amountDel);
    return await invokeSendAction("delegate", [valAddr], account, amountDel);
}

const createValidator = async (commissionRate: number, maxRate: number, maxRateChange: number, minSeftDelegation: number, account: Account, amountDel: number) => {

    // convert value number type to decimal type
    // const cellAmountDel = cellValue(amountDel);
    // const minSeftDelegationDec = cellValue(minSeftDelegation);
    
    // convert value percent type to decimal type
    const commissionRateDec = cellValue(commissionRate / 100);
    const maxRateDec = cellValue(maxRate / 100);
    const maxRateChangeDec = cellValue(maxRateChange / 100)
    return await invokeSendAction("createValidator", [commissionRateDec, maxRateDec, maxRateChangeDec, minSeftDelegation], account, amountDel);
}

// Delegator withdraw reward
const withdrawReward = async (valAddr: string, account: Account) => {
    return await invokeSendAction("withdrawReward", [valAddr], account, 0)
}

// Delegator withdraw
const withdraw = async (valAddr: string, account: Account) => {
    return await invokeSendAction("withdraw", [valAddr], account, 0)
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
    withdraw
}
