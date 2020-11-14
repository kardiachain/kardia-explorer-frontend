import { kardiaContract, kardiaProvider } from '../../plugin/kardia-tool';

const deploySmartContract = async (object: SMCDeployObject) => {
    try {
        const contract = kardiaContract(kardiaProvider, object.bytecode, object.abi);
        const deployment = contract.deploy(object.params);
        const deployResult = await deployment.send(object.account.privatekey, {
            gas: object.gasLimit,
            gasPrice: object.gasPrice,
        });

        console.log(deployResult);
        
        return deployResult;
    } catch (err) {
        throw err
    }
}

const invokeFunctionFromContractAbi = async (object: SMCInvokeObject) => {
    try {
        const contract = kardiaContract(kardiaProvider, "", JSON.parse(object.abi));
        const invoke = contract.invoke({
          params: object.params,
          name: object.functionName
        });

        let invokeResult = null; 
        if (!object.isPure) {
            invokeResult = await invoke.send(object.account.privatekey, object.contractAddress, {
            //   amount: object.amount,
              gas: object.gasLimit,
              gasPrice: object.gasPrice
            });
            return invokeResult;
          } else {
            invokeResult = await invoke.call(object.contractAddress, {}, "latest");
            console.log(invokeResult);
            return invokeResult;
          }
    } catch (err) {
        console.log(err)
        throw err
    }
}

export {
    deploySmartContract,
    invokeFunctionFromContractAbi
}