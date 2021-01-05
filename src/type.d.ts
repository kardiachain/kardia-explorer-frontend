interface KAITransaction {
    txHash: string;
    from: string;
    to: string;
    value: number;
    time: Date
    blockNumber: number;
    blockHash: string;
    status: boolean;
    failedReason: string;
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
    decodedInputData?: any;
    role: ValidatorRole;
    isInValidatorsList: boolean;
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
    vaidatorName: string;
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
    role: ValidatorRole;
}
interface Delegator {
    owner: boolean;
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
    externalWallet?: boolean;
    walletType?: string;
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
    totalCandidates: number;
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
    missedBlocks: number;
    jailed: boolean;
    updateTime: number;
    signingInfo: SigningInfo
}

interface SigningInfo {
    indexOffset: number;
    indicatorRate: number;
    jailedUntil: number;
    missedBlockCounter: number;
    startHeight: number;
    tombstoned: boolean;
}

interface Candidate {
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
    erc20_circulating_supply: number;
    mainnet_circulating_supply: number;
    market_cap: number;
    total_supply: number;
    decimal?: number;
    name?: string;
    price?: number;
    symbol?: string;
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

interface HolderAccount {
    index: number;
    address: string;
    name: string;
    isContract: boolean;
    balance: any;
    role: ValidatorRole;
    isInValidatorsList: boolean;
}