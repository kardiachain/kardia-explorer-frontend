interface KAITransaction {
    txHash: string;
    from: string;
    to: string;
    value: number;
    time: Date
    blockNumber: number;
    blockHash: string;
    status: boolean;
    nonce: number;
    age: number;
    transactionIndex: number;
    contractAddress: string;
    gasPrice: number;
    gas: number;
    gasLimit: number;
    input: string;
    logs: string;
    gasUsed: number;
    toSmcName: string;
    toSmcAddr: string;
    gasUsedPercent: any;
    txFee: number;
}

interface KAIBlock {
    blockHash?: string;
    blockHeight: number;
    transactions?: number;
    validator: {
        label?: string;
        hash: string;
    };
    time: Date;
    age?: number;
    gasLimit: number;
    gasUsed: number;
    rewards: number;
}

interface KAIBlockDetails {
    blockHash: string;
    blockHeight: number;
    transactions: number;
    validator: string;
    commitHash: string;
    gasLimit: number;
    gasUsed: number;
    lastBlock: string;
    dataHash: string;
    validatorHash: string;
    nextValidatorHash: string;
    consensusHash: string;
    appHash: string;
    evidenceHash: string;
    time: Date;
    age: number;
    rewards: number;
    gasUsedPercent: any;
}

interface StakingContractResponse {
    totalVals: number;
    totalDels: number;
    totalVotingPower: number;
    totalStakedAmont: number;
    totalValidatorStakedAmount: number;
    totalDelegatorStakedAmount: number
    validators: ValidatorFromSMC[]
}

interface ValidatorFromSMC {
    name?: string;
    rank?: number;
    address: string;
    delegationsShares?: number;
    votingPower?: number;
    jailed?: boolean;
    commission?: number;
    totalDels?: number;
    totalStakedAmount?: number;
    maxRate: number;
    maxChangeRate: number; 
}

interface YourValidator {
    validatorAddr: string;
    yourStakeAmount: number;
    claimableAmount: number;
    withdrawableAmount: number;
    unbondedAmount: number;
    withdrawable: UBDEntries[];
}
interface Delegator {
    address: string;
    delegationsShares: number;
    stakeAmount: number;
    validatorAddress: string;
    rewardsAmount: number;
}

interface WalletStore {
    address: string;
    privatekey: string;
    isAccess: boolean;
}

interface Account {
    publickey: string;
    privatekey: string;
}

interface Validator {
    address: string;
    votingPower: number;
    name: string;
    peerCount: number;
    rpcUrl: string;
}

interface KaiToken {
    change_1h?: number;
    change_7d?: number;
    change_24h?: number;
    circulating_supply?: number;
    decimal?: number;
    market_cap?: number;
    name?: string;
    price?: number;
    symbol?: string;
    total_supply?: number;
    volume_24h?: number;
}

interface TotalStats {
    totalHolders: number;
    totalContracts: number;
}

interface ToSmcAddress {
    toSmcAddr: string;
    toSmcName: string;
}

interface UBDEntries {
    withdrawableAmount: number;
    withdrawableTime: any;
    enableWithdraw: boolean;
}