import { END_POINT, GET_REQUEST_OPTION } from "../config";

export const getTransactions = async (page: number, size: number): Promise<KAITransaction[]> => {
    const response = await fetch(`${END_POINT}txs?page=${page}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON.data.data || []
    const nowTime = (new Date()).getTime()
    return rawTxs.map((o: any) => {
        const createdTime = (new Date(o.time)).getTime()
        return {
            txHash: o.hash,
            from:  o.from,
            to:  o.to,
            value: o.value,
            time: o.time,
            blockNumber: o.blockNumber,
            blockHash:  o.blockHash,
            status: o.status,
            nonce: o.nonce,
            age: (nowTime - createdTime),
            transactionIndex: o.transactionIndex,
            contractAddress:  o.contract_address,
            gasPrice: o.gasPrice,
            gas: o.gas,
            gasLimit: o.gasLimit,
            input:  o.input,
            logs:  o.logs,
        } as KAITransaction
    })
}

export const getTxsByBlockHeight = async (blockHeight: number, page: number, size: number) : Promise<KAITransaction[]> => {
    const response = await fetch(`${END_POINT}block/${blockHeight}/txs?page=${page}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON.data.data || []
    const nowTime = (new Date()).getTime()
    return rawTxs.map((o: any) => {
        const createdTime = (new Date(o.time)).getTime()
        return {
            txHash: o.hash,
            from:  o.from,
            to:  o.to,
            value: o.value,
            time: o.time,
            blockNumber: o.blockNumber,
            blockHash:  o.blockHash,
            status: o.status,
            nonce: o.nonce,
            age: (nowTime - createdTime),
            transactionIndex: o.transactionIndex,
            contractAddress:  o.contract_address,
            gasPrice: o.gasPrice,
            gas: o.gas,
            gasLimit: o.gasLimit,
            input:  o.input,
            logs:  o.logs,
        } as KAITransaction
    })
}

export const getTxByHash = async (txHash: string): Promise<KAITransaction> => {
    const response = await fetch(`${END_POINT}txs/${txHash}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    
    const tx = responseJSON.data || {};
    if(!tx) {
        return {} as KAITransaction
    }
    const nowTime = (new Date()).getTime()
    const createdTime = (new Date(tx.time)).getTime()
    return {
        txHash:tx.hash,
        from: tx.from,
        to: tx.to,
        value:tx.value,
        time:tx.time,
        blockNumber:tx.blockNumber,
        blockHash: tx.blockHash,
        status:tx.status,
        nonce:tx.nonce,
        age: (nowTime - createdTime),
        transactionIndex:tx.transactionIndex,
        contractAddress: tx.contract_address,
        gasPrice:tx.gasPrice,
        gas:tx.gas,
        gasLimit:tx.gasLimit,
        input: tx.input,
        logs: tx.logs,
    } as KAITransaction
}