import { kardiaContract, kardiaProvider } from '../../plugin/kardia-tool';

const deploySmartContract = async (object: SMCDeployObject) => {
    try {
        const contract = kardiaContract(kardiaProvider, object.bytecode, object.abi);
        const deployment = contract.deploy(object.params);
        // const estimatedGas = await deployment.estimateGas({
        //     from: object.account.publickey
        // });
        const deployResult = await deployment.send(object.account.privatekey, {
            gas: object.gasLimit,
            gasPrice: object.gasPrice + 1,
        });
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
            // const estimatedGas = await invoke.estimateGas({
            //   from: object.account.publickey,
            //   amount: object.amount,
            //   gas: object.gas,
            //   gasPrice: object.gasPrice + 1,
            // });
            //console.log(estimatedGas);
            invokeResult = await invoke.send(object.account.privatekey, object.contractAddress, {
            //   amount: object.amount,
              gas: object.gasLimit || 10000000,
              gasPrice: object.gasPrice || 1
            });
            
            return invokeResult;
          } else {
            invokeResult = await invoke.call(object.contractAddress,{},"latest");
            console.log(invokeResult);
            return invokeResult;
          }
    } catch (error) {
        console.log(error)
        return error
    }
}

export {
    deploySmartContract,
    invokeFunctionFromContractAbi
}