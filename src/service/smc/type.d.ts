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
    bytecode: string;
    gasLimit: number;
    gasPrice: number;
    params: any;
    isPure?: boolean
    functionName?: string;
    amount?: number;
}