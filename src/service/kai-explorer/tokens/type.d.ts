export interface ITokenContract {
    name: string;
    address: string;
    info: string;
    logo: string;
    type: string;
}

export interface IContractList {
    total: number;
    contracts: ITokenContract[];
}

export interface ITokenDetails {
    name: string;
    address: string;
    ownerAddress: string;
    txHash: string;
    createdAt: number;
    type: string;
    balance: any;
    info: string;
    logo: string;
    tokenName: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
    updatedAt: string;
}

export interface ITokenTranferTx {
    txHash: string;
    from: string;
    to: string;
    value: any;
    age: any;
    decimals: number;
}

export interface ITokenTranferTxList {
    total: number;
    txs: ITokenTranferTx[]
}