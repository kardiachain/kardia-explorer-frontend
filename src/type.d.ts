interface Fraction {
    numerator: JSBI;
    denominator: JSBI;
}
interface KAITransaction {
    txHash: string;
    from: string;
    to: string;
    value: number;
    time: Date
    blockNumber: number;
    blockHash: string;
    status: number;
    failedReason: string;
    nonce: number;
    age: number;
    transactionIndex: number;
    contractAddress: string;
    gasPrice: number;
    gas: number;
    gasLimit: number;
    input: string;
    logs: any;
    gasUsed: number;
    gasUsedPercent: any;
    txFee: number;
    decodedInputData?: any;
    role: ValidatorRole;
    isInValidatorsList: boolean;
    toName: string;
    fromName: string;
    isSmcInteraction: boolean;
    isContractCreation: boolean;
}

interface KAIBlock {
    blockHash?: string;
    blockHeight: number;
    transactions?: number;
    proposalName: string;
    proposalAddress: string;
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
    yourStakeAmount: number | string;
    claimableAmount: number | string;
    withdrawableAmount: number | string;
    unbondedAmount: number | string;
    role: ValidatorRole;
    unbondedRecords: UnbondedRecord[]
}

interface UnbondedRecord {
    balance: any;
    completionTime: any;
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
    expried?: boolean; 
    externalWallet: boolean;
}

interface Account {
    publickey: string;
    privatekey: string;
}

interface Validators {
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

interface NetworkParams {

    // Staking params
    baseProposerReward: number;
    bonusProposerReward: number;
    maxProposers: number;

    // Validator params
    downtimeJailDuration: number;
    slashFractionDowntime: number;
    unbondingTime: number;
    slashFractionDoubleSign: number;
    signedBlockWindow: number;
    minSignedPerWindow: number;
    minStake: number;
    minValidatorStake: number;
    minAmountChangeName: number;
    minSelfDelegation: number;

    // Minter params
    inflationRateChange: number;
    goalBonded: any;
    blocksPerYear: number;
    inflationMax: number;
    inflationMin: number;

    // Proposal
    deposit: number;
    votingPeriod: any;

}
interface Proposal {
    id: number;
    nominator: string;
    startTime: number;
    endTime: number;
    deposit: string;
    status: number;
    voteYes: number;
    voteNo: number;
    voteAbstain: number;
    params: ProposalParams[];
    numberOfVoteYes: number;
    numberOfVoteNo: number;
    numberOfVoteAbstain: number;
    expriedTime: number;
    validatorVotes: number;
}

interface ProposalParams {
    labelName: string;
    fromValue: any;
    toValue: any;
}

interface ProposalsResponse {
    total: number;
    proposal: Proposal[]
}

interface Logs {
    address: string,
    methodName: string,
    argumentsName: string,
    arguments: {
        _amount: string,
        _delAddr: string
    },
    topics: [],
    data: string,
    blockHeight: number,
    transactionHash: string,
    transactionIndex: string,
    blockHash: string,
    logIndex: number,
    removed: string
}

interface Krc20Token {
    address: string;
    decimals: number;
    symbol?: string
}