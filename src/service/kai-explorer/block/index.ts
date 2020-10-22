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
    const bockDetail = responseJSON.data || {}
    if (!bockDetail) {
        return {} as KAIBlockDetails
    }
    const nowTime = (new Date()).getTime()
    const createdTime = (new Date(bockDetail.time)).getTime()
    return {
        blockHash: bockDetail.hash,
        blockHeight: bockDetail.height,
        transactions: bockDetail.numTxs || 0,
        validator: bockDetail.validator,
        commitHash: bockDetail.commitHash,
        gasLimit: bockDetail.gasLimit,
        gasUsed: bockDetail.gasUsed || 0,
        lastBlock: bockDetail.lastBlock,
        dataHash: bockDetail.dataHash,
        validatorHash: bockDetail.validatorHash,
        consensusHash: bockDetail.consensusHash,
        appHash: bockDetail.appHash,
        evidenceHash: bockDetail.evidenceHash,
        time: bockDetail.time,
        age: (nowTime - createdTime)
    } as KAIBlockDetails
}

export const getHeightestBlockNumber = async (): Promise<number> => {
    const response = await fetch(`${END_POINT}blocks?page=1&limit=1`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawBlockList = responseJSON.data.data || []

    if (rawBlockList.length === 0) return 0
    return rawBlockList[0].height
} 