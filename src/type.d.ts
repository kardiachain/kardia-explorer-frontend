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
    validatorName: string;
    validatorAddr: string;
    validatorSmcAddr: string;
    yourStakeAmount: number;
    claimableAmount: number;
    withdrawableAmount: number;
    unbondedAmount: number;
}
interface Delegator {
    address: string;
    delegationsShares?: number;
    stakeAmount: number;
    validatorAddress?: string;
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

interface Validators {
    totalValidators: number;
    totalDelegators: number;
    totalStakedAmount: number;
    totalValidatorStakedAmount: number;
    totalDelegatorStakedAmount: number;
    totalProposer: number;
    totalNominators: number;
    validators: Validator[]
}

interface Validator {
    rank?: number;
    address: string;
    votingPower: any;
    stakedAmount: number;
    commissionRate: any;
    totalDelegators: any;
    maxRate: any;
    maxChangeRate: any;
    name: string;
    delegators: Delegator[]
    color?: string;
    smcAddress: string;
    isProposer: boolean;
    isValidator: boolean;
    isRegister: boolean;
    role: ValidatorRole;
    accumulatedCommission: number;
}

interface Nominator {
    rank?: number;
    address: string;
    votingPower: any;
    stakedAmount: number;
    commissionRate: any;
    totalDelegators: any;
    maxRate: any;
    maxChangeRate: any;
    name: string;
    smcAddress: string;
    isProposer: boolean;
    isValidator: boolean;
    isRegister: boolean;
    role: ValidatorRole
}

interface ValidatorRole {
    name: string;
    classname: string;
    character: string;
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