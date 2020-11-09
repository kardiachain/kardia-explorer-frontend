import { kardiaContract, kardiaProvider } from '../../plugin/kardia-tool';

const deploySmartContract = async (object: SMCDeployObject) => {
    try {
        const contract = kardiaContract(kardiaProvider, object.bytecode, object.abi);
        const deployment = contract.deploy(object.params);
        // const estimatedGas = await deployment.estimateGas({
        //     from: object.account.publickey,
        //     gasPrice: object.gasPrice,
        //     gas: object.gasLimit,
        // });

        // console.log("estimatedGas", estimatedGas);
        
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

export {
    deploySmartContract
}