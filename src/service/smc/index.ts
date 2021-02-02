import { gasLimitDefault } from '../../common/constant';
import { kardiaContract, kardiaProvider } from '../../plugin/kardia-tool';

const deploySmartContract = async (object: SMCDeployObject) => {
    try {
        const paramsJson = JSON.parse(JSON.stringify(object.params))
        const contract = kardiaContract(kardiaProvider, object.bytecode, JSON.parse(object.abi));
        const deployment = contract.deploy(paramsJson);
        const deployResult = await deployment.send(object.account.privatekey, {
            gas: object.gasLimit,
            gasPrice: object.gasPrice ? object.gasPrice * 10**9 : 10**9,
        });
        return deployResult;
    } catch (err) {
        throw err
    }
}

const invokeFunctionFromContractAbi = async (object: SMCInvokeObject) => {
    try {
        const paramsJson = JSON.parse(JSON.stringify(object.params))
        const contract = kardiaContract(kardiaProvider, "", JSON.parse(object.abi));
        const invoke = contract.invoke({
          params: paramsJson,
          name: object.functionName
        });
        let invokeResult = null; 
        if (!object.isPure) {
            invokeResult = await invoke.send(object.account.privatekey, object.contractAddress, {
              amount: object.amount,
              gas: object.gasLimit,
              gasPrice: object.gasPrice ? object.gasPrice * 10**9 : 10**9
            });
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
    if (!account.publickey) {
        return;
    }
    const invoke = await contractInstance.invoke({
        params: params,
        name: methodName,
    });
    const invokeResult = await invoke.send(account.privatekey, contractAddr, {
        from: account.publickey,
        amount: amountVal,
        gas: gasLimit,
        gasPrice: gasPrice ? gasPrice * 10**9 : 10**9
    });

    return invokeResult;
}

export {
    deploySmartContract,
    invokeFunctionFromContractAbi,
    invokeCallData,
    invokeSendAction,
}