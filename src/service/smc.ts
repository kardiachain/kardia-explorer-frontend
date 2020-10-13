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
        return null;
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
        return null;
    }
}


const getValidators = async () => {
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

export {invokeCallData, invokeSendAction, getValidators}