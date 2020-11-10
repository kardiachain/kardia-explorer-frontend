import { kardiaContract, kardiaProvider } from '../../plugin/kardia-tool';

const deploySmartContract = async (object: SMCDeployObject) => {
    try {
        const contract = kardiaContract(kardiaProvider, object.bytecode, object.abi);
        const deployment = contract.deploy(object.params);
        const estimatedGas = await deployment.estimateGas({
            from: object.account.publickey
        });
        
        const deployResult = await deployment.send(object.account.privatekey, {
          gas: 1000000 + estimatedGas,
          gasPrice: object.gasPrice + 1,
        });
        return deployResult;
    } catch (error) {
        console.log(error);
        return error;
    }
}



export {
    deploySmartContract
}