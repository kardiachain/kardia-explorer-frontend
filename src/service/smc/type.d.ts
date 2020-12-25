interface SMCDeployObject {
    account: Account;
    abi: string;
    bytecode: string;
    gasLimit: number;
    gasPrice: number;
    params: any;
}

interface SMCInvokeObject {
    contractAddress: string;
    account: Account;
    abi: string;
    gasLimit: number;
    gasPrice: number;
    params: any;
    isPure: boolean
    functionName: string;
    amount: numner;
}

interface CreateValParams {
    valName: string;
    commissionRate: number;
    maxRate: number;
    maxChangeRate: number;
    yourDelegationAmount: number;
}

interface UpdateValParams {
    valSmcAddr: string;
    newValName: string;
    newCommissionRate: number;
}