import { END_POINT, GET_REQUEST_OPTION } from "../config";

interface BlocksResponse {
    totalBlocks: number;
    blocks: KAIBlock[]
}

export const getBlocks = async (page: number, size: number): Promise<BlocksResponse> => {

    const response = await fetch(`${END_POINT}blocks?page=${page}&limit=${size}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const rawBlockList = responseJSON?.data?.data || [];
    const nowTime = (new Date()).getTime();
    return {
        totalBlocks: responseJSON?.data?.total || 0,
        blocks: rawBlockList.map((o: any) => {
            const createdTime = (new Date(o.time)).getTime()
            return {
                blockHash: o.hash || '',
                blockHeight: o.height || 0,
                transactions: o.numTxs || 0,
                proposalName: o.proposerName || '',
                proposalAddress: o.proposerAddress || '',
                time: new Date(o.time),
                age: (nowTime - createdTime),
                gasUsed: o.gasUsed || 0,
                gasLimit: o.gasLimit || 0,
                rewards: o.rewards || 0
            } as KAIBlock
        })
    }
}

export const getBlockBy = async (block: any): Promise<KAIBlockDetails> => {
    const response = await fetch(`${END_POINT}blocks/${block}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const blockDetail = responseJSON?.data || {}
    if (!blockDetail) {
        return {} as KAIBlockDetails
    }
    const nowTime = (new Date()).getTime()
    const createdTime = (new Date(blockDetail.time)).getTime()
    const gasUsedPercent = blockDetail.gasUsed / blockDetail.gasLimit * 100;
    
    return {
        blockHash: blockDetail.hash,
        blockHeight: blockDetail.height,
        transactions: blockDetail.numTxs || 0,
        validator: blockDetail.proposerAddress || '',
        vaidatorName: blockDetail.proposerName || '',
        commitHash: blockDetail.commitHash,
        gasLimit: blockDetail.gasLimit,
        gasUsed: blockDetail.gasUsed || 0,
        lastBlock: blockDetail.lastBlock,
        dataHash: blockDetail.dataHash,
        validatorHash: blockDetail.validatorHash,
        nextValidatorHash: blockDetail.nextValidatorHash,
        consensusHash: blockDetail.consensusHash,
        appHash: blockDetail.appHash,
        evidenceHash: blockDetail.evidenceHash,
        time: blockDetail.time,
        age: (nowTime - createdTime),
        rewards: blockDetail.rewards,
        gasUsedPercent: gasUsedPercent
    } as KAIBlockDetails
}

export const calculateTPS = (blockList: KAIBlock[]) => {
    const totalTimes = (new Date(blockList[0]?.time)).getTime() - (new Date(blockList[blockList.length - 1]?.time)).getTime()
    let totalTxs = 0;
    blockList.forEach((item: any) => {
        totalTxs += item.transactions;
    });
    const tps = totalTxs / (totalTimes / 1000) || 0

    return tps.toFixed(4)
}

export const getLatestBlock = async (): Promise<KAIBlock> => {
    const response = await fetch(`${END_POINT}blocks?page=1&limit=1`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawBlockList = responseJSON.data.data || []

    if (rawBlockList.length === 0) return {} as KAIBlock
    return rawBlockList[0]
}

export const getBlocksByProposer = async (proposerAddr: string, page: number, size: number): Promise<BlocksResponse> => {
    try {
        const response = await fetch(`${END_POINT}blocks/proposer/${proposerAddr}?page=${page}&limit=${size}`, GET_REQUEST_OPTION);
        const responseJSON = await response.json();
        const rawBlockList = responseJSON?.data?.data || [];
        const nowTime = (new Date()).getTime();
        return {
            totalBlocks: responseJSON?.data?.total || 0,
            blocks: rawBlockList.map((o: any) => {
                const createdTime = (new Date(o.time)).getTime()
                return {
                    blockHash: o.hash,
                    blockHeight: o.height,
                    transactions: o.numTxs,
                    time: new Date(o.time),
                    age: (nowTime - createdTime),
                    gasUsed: o.gasUsed,
                    gasLimit: o.gasLimit,
                    rewards: o.rewards
                }
            })
        }
    } catch (error) {
        return {} as BlocksResponse
    }
}
