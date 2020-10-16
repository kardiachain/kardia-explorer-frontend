import { cellValue } from '../common/utils/amount';
import { kardiaContract, kardiaProvider } from '../plugin/kardia-tool';
import STAKING_ABI from '../resources/smc-compile/staking-abi.json'
import STAKING_BYTE_CODE from '../resources/smc-compile/staking-bin.json'

const stakingContract = kardiaContract(kardiaProvider, STAKING_BYTE_CODE, STAKING_ABI);
const STAKING_SMC_ADDRESS = '0xF3E77cDEeD0A979be6fb54dEdc50551e84F9C53a';

const invokeCallData = async (methodName: string, params: any[]) => {
    try {
        const invoke = await stakingContract.invoke({
            params: params,
            name: methodName
        })
        const result = await invoke.call(STAKING_SMC_ADDRESS)
        return result
    } catch (error) {
        throw error
    }
}

const invokeSendAction = async (methodName: string, params: any[], account: Account, amountVal: number) => {
    try {
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
    } catch (error) {
        throw error
    }
}


const getValidators = async (): Promise<Validator[]> => {
    const invoke = await invokeCallData("getValidatorSets", [])
    let validators: Validator[] = [];
    for (let i = 0; i < invoke[0].length; i++) {
        let validator: Validator = {
            address: invoke[0][i],
            votingPower: invoke[1][i],
        }
        validators.push(validator)
    }
    return validators
}

const getDelegationsByValidator = async (valAddr: string) : Promise<Delegator[]> => {
    let delegators: Delegator[] = [];

    if(!valAddr) return delegators;

    const invoke = await invokeCallData("getDelegationsByValidator", [valAddr])
    for (let i = 0; i < invoke[0].length; i++) {
        let delegator: Delegator = {
            address: invoke[0][i],
            delegationsShares: invoke[1][i]
        }
        delegators.push(delegator)
    }
    return delegators
}

const getValidatorsByDelegator = async (delAddr: string) : Promise<String> => {
    const valAddr = await invokeCallData("getValidatorsByDelegator", [delAddr])
    return valAddr
}

const getValidator = async (valAddr: string): Promise<Validator> => {
    const invoke = await invokeCallData("getValidator", [valAddr])
    let validators: Validator = {
        address: invoke[0],
        delegationsShares: invoke[1],
        jailed: invoke[2]
    }
    return validators
}

const getValidatorCommission = async (valAddr: string): Promise<number> => {
    const commission = await invokeCallData("getValidatorCommission", [valAddr])
    return commission;
}

const delegateAction = async (valAddr: string, account: Account, amountDel: number) => {
    try {
        const cellAmountDel = cellValue(amountDel);
        return await invokeSendAction("delegate", [valAddr], account, cellAmountDel);
    } catch (error) {
        throw error    
    }
}

const createValidator = async (commssionRate: number, maxRate: number, maxRateChange: number, minSeftDelegation: number, account: Account, amountDel: number) => {
    try {
        const cellAmountDel = cellValue(amountDel);
        return await invokeSendAction("delegate", [commssionRate, maxRate, maxRateChange, minSeftDelegation], account, cellAmountDel);
    } catch (error) {
        throw error 
    }
  }

export {
    invokeCallData,
    invokeSendAction,
    getValidators,
    getDelegationsByValidator,
    getValidatorsByDelegator,
    getValidator,
    getValidatorCommission,
    delegateAction,
    createValidator
}