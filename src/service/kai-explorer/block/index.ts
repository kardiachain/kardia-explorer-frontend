import { END_POINT, REQUEST_GET } from "../config";
export const getBlocks = async (page: number, size: number): Promise<KAIBlock[]> => {

    const response = await fetch(`${END_POINT}blocks?skip=${page}&limit=${size}`, REQUEST_GET)
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
                hash: o.validator
            },
            time: new Date(o.time),
            age: (nowTime - createdTime),
            gasUsed: o.gasUsed,
            gasLimit: o.gasLimit
        } as KAIBlock
    }) as KAIBlock[];
}

// Common for get block detail by blockhash or blocknumber
export const getBlockBy = async (block: any): Promise<KAIBlockDetails> => {
    const response = await fetch(`${END_POINT}blocks/${block}`, REQUEST_GET)
    const responseJSON = await response.json()
    const bockDel = responseJSON.data || {}
    if(!bockDel) {
        return {} as KAIBlockDetails
    }
    const nowTime = (new Date()).getTime()
    const createdTime = (new Date(bockDel.time)).getTime()
    return {
        blockHash: bockDel.hash,
        blockHeight: bockDel.height,
        transactions: bockDel.numTxs || 0,
        validator: bockDel.validator,
        commitHash: bockDel.commitHash,
        gasLimit: bockDel.gasLimit,
        gasUsed: block.gasUsed || 0,
        lastBlock: bockDel.lastBlock,
        dataHash: bockDel.dataHash,
        validatorHash: bockDel.validatorHash,
        consensusHash: bockDel.consensusHash,
        appHash: bockDel.appHash,
        evidenceHash: bockDel.evidenceHash,
        time: bockDel.time,
        age: (nowTime - createdTime),
    } as KAIBlockDetails
}