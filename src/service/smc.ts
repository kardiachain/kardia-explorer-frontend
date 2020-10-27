import { cellValue } from '../common/utils/amount';
import { kardiaContract, kardiaProvider } from '../plugin/kardia-tool';
import STAKING_ABI from '../resources/smc-compile/staking-abi.json'
import STAKING_BYTE_CODE from '../resources/smc-compile/staking-bin.json'

const stakingContract = kardiaContract(kardiaProvider, STAKING_BYTE_CODE, STAKING_ABI);
const STAKING_SMC_ADDRESS = '0x535B3D7A252fa034Ed71F0C53ec0C6F784cB64E1';

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
        let delegator: Delegator = {
            address: invoke[0][i],
            delegationsShares: invoke[1][i]
        }
        delegators.push(delegator)
    }
    return delegators
}

const getNumberDelOfValidator = async (valAddr: string): Promise<number> => {
    const invoke = await invokeCallData("getDelegationsByValidator", [valAddr])
    const listVals = invoke[0]
    return listVals.length
}

const getValidatorsByDelegator = async (delAddr: string): Promise<ValidatorFromSMC[]> => {
    const valAddr = await invokeCallData("getValidatorsByDelegator", [delAddr])
    let validators: ValidatorFromSMC[] = [];
    if (valAddr.length === 0) return validators
    for (let i = 0; i < valAddr.length; i++) {
        let validator: ValidatorFromSMC = {
            address: valAddr[i],
        }
        validators.push(validator)
    }
    return validators
}

const getValidator = async (valAddr: string): Promise<ValidatorFromSMC> => {
    const invoke = await invokeCallData("getValidator", [valAddr])
    const votingPower = await getValidatorPower(valAddr)
    let validators: ValidatorFromSMC = {
        address: invoke[0],
        delegationsShares: invoke[1],
        jailed: invoke[2],
        votingPower: votingPower
    }
    return validators
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
    const cellAmountDel = cellValue(amountDel);
    return await invokeSendAction("delegate", [valAddr], account, cellAmountDel);
}

const createValidator = async (commssionRate: number, maxRate: number, maxRateChange: number, minSeftDelegation: number, account: Account, amountDel: number) => {
    const cellAmountDel = cellValue(amountDel);
    return await invokeSendAction("createValidator", [commssionRate, maxRate, maxRateChange, minSeftDelegation], account, cellAmountDel);
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
    getValidatorPower
}