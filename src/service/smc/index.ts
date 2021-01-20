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

export {
    deploySmartContract,
    invokeFunctionFromContractAbi
}