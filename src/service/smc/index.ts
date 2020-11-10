import { kardiaContract, kardiaProvider } from '../../plugin/kardia-tool';

const deploySmartContract = async (object: SMCDeployObject) => {
    try {
        const contract = kardiaContract(kardiaProvider, object.bytecode, object.abi);
        const deployment = contract.deploy(object.params);
        // const estimatedGas = await deployment.estimateGas({
        //     from: object.account.publickey
        // });
        console.log("Object: ", object);
        const deployResult = await deployment.send(object.account.privatekey, {
            gas: 10000000,
            gasPrice: object.gasPrice + 1,
        });
        return deployResult;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const invokeFunctionFromContractAbi = async (object: SMCInvokeObject) => {
    try {
        console.log(object);
        const contract = kardiaContract(kardiaProvider, object.bytecode, object.abi);
        const invoke = contract.invoke({
          params: object.params || [],
          name: object.functionName,
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
              amount: object.amount,
              gas: 10000000,
              gasPrice: 2
            });
            console.log(invokeResult);
            return invokeResult;
          } else {
            invokeResult = await invoke.call(object.contractAddress);
            console.log("invokeResult Call", invokeResult);
            return invokeResult;
          }
    } catch (error) {
        console.log(error)
        return error
    }
}

export {
    deploySmartContract
}