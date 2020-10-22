import { END_POINT, GET_REQUEST_OPTION } from "../config";
export const getBlocks = async (page: number, size: number): Promise<KAIBlock[]> => {

    const response = await fetch(`${END_POINT}blocks?page=${page-1}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()

    const rawBlockList = responseJSON.data.data || []
    const nowTime = (new Date()).getTime()
    return rawBlockList.map((o: any) => {
        const createdTime = (new Date(o.time)).getTime()
        return {
            blockHash: o.hash,
            blockHeight: o.height,
            transactions: o.numTxs,
            validator: {
                label: 'Validator',
                hash: o.proposerAddress || ''
            },
            time: new Date(o.time),
            age: (nowTime - createdTime),
            gasUsed: o.gasUsed,
            gasLimit: o.gasLimit
        } as KAIBlock
    });
}

// Common for get block detail by blockhash or blocknumber
export const getBlockBy = async (block: any): Promise<KAIBlockDetails> => {
    const response = await fetch(`${END_POINT}blocks/${block}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const blockDetail = responseJSON.data || {}
    if (!blockDetail) {
        return {} as KAIBlockDetails
    }
    const nowTime = (new Date()).getTime()
    const createdTime = (new Date(blockDetail.time)).getTime()
    return {
        blockHash: blockDetail.hash,
        blockHeight: blockDetail.height,
        transactions: blockDetail.numTxs || 0,
        validator: blockDetail.validator,
        commitHash: blockDetail.commitHash,
        gasLimit: blockDetail.gasLimit,
        gasUsed: blockDetail.gasUsed || 0,
        lastBlock: blockDetail.lastBlock,
        dataHash: blockDetail.dataHash,
        validatorHash: blockDetail.validatorHash,
        consensusHash: blockDetail.consensusHash,
        appHash: blockDetail.appHash,
        evidenceHash: blockDetail.evidenceHash,
        time: blockDetail.time,
        age: (nowTime - createdTime)
    } as KAIBlockDetails
}

export const getLatestBlockNumber = async (): Promise<number> => {
    const response = await fetch(`${END_POINT}blocks?page=1&limit=1`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawBlockList = responseJSON.data.data || []

    if (rawBlockList.length === 0) return 0
    return rawBlockList[0].height
} 