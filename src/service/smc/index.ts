import { gasLimitDefault } from '../../common';
import { KardiaContract, KardiaUtils } from 'kardia-js-sdk';
import { RPC_ENDPOINT } from '../../config';

const deploySmartContract = async (object: SMCDeployObject) => {
    try {
        const contract = new KardiaContract({
            provider: RPC_ENDPOINT,
            bytecodes: object.bytecode,
            abi: JSON.parse(object.abi)
        })
        const deployment = contract.deploy({params: object.params});
        const deployResult = await deployment.send(object.account.privatekey, {
            gas: object.gasLimit,
            gasPrice: KardiaUtils.toHydro(object.gasPrice ? object.gasPrice : 1, 'oxy'),
        }, true);
        return deployResult;
    } catch (err) {
        throw err
    }
}

const invokeFunctionFromContractAbi = async (object: SMCInvokeObject) => {
    try {
        const paramsJson = JSON.parse(JSON.stringify(object.params))
        const contract = new KardiaContract({
            provider: RPC_ENDPOINT,
            abi: JSON.parse(object.abi)
        })
        const invoke = contract.invokeContract(object.functionName, paramsJson);
        let invokeResult = null; 
        if (!object.isPure) {
            invokeResult = await invoke.send(object.account.privatekey, object.contractAddress, {
              amount: object.amount,
              gas: object.gasLimit,
              gasPrice: KardiaUtils.toHydro(object.gasPrice ? object.gasPrice : 1, 'oxy')
            }, true);
            return invokeResult;
          } else {
            invokeResult = await invoke.call(object.contractAddress, {}, "latest");
            return invokeResult;
          }
    } catch (err) {
        throw err
    }
}

const invokeCallData = async (
    contractInstance: any,
    contractAddr: string,
    methodName: string,
    params: any[]
) => {
    const invoke = await contractInstance.invokeContract(methodName, params)
    return await invoke.call(contractAddr, {}, "latest")
}

const invokeSendAction = async (
    abi: any,
    contractAddr: string,
    methodName: string,
    params: any[],
    account: Account,
    amountVal: number = 0,
    gasLimit = gasLimitDefault,
    gasPrice = 2
) => {
    if (!account.publickey) {
        return;
    }
    const contract = new KardiaContract({
        provider: RPC_ENDPOINT,
        abi: abi
    })
    const invoke = await contract.invokeContract(methodName, params);
    const invokeResult = await invoke.send(account.privatekey, KardiaUtils.toChecksum(contractAddr), {
        from: account.publickey,
        amount: amountVal,
        gas: gasLimit,
        gasPrice: KardiaUtils.toHydro(gasPrice, 'oxy')
    }, true);

    return invokeResult;
}

export {
    deploySmartContract,
    invokeFunctionFromContractAbi,
    invokeCallData,
    invokeSendAction,
}
export * from './staking'
export * from './proposal'