interface KAITransaction {
    txHash: string,
    from: string,
    to: string,
    value: number,
    time: Date
}

interface KAIBlock {
    blockHash: string,
    blockHeight: number,
    transactions: number,
    validator: {
        label: string,
        hash: string
    },
    time: Date
}

interface Validator {
    address: string;
    tokens?: number;
    delegationsShares?: number;
    votingPower?: number;
    jailed?: boolean;
}

interface Delegator {
    address: string;
    delegationsShares: number;
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