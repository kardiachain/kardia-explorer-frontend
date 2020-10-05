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