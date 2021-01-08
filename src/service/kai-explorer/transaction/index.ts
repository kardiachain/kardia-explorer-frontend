import { numberFormat } from "../../../common/utils/number";
import { STAKING_SMC_ADDRESS } from "../../../config/api";
import { END_POINT, GET_REQUEST_OPTION } from "../config";
import { toChecksum } from 'kardia-tool/lib/common/lib/account'
import { checkValidatorRole } from "..";

interface TransactionsResponse {
    totalTxs: number;
    transactions: KAITransaction[]
}

export const getTransactions = async (page: number, size: number): Promise<TransactionsResponse> => {
    const response = await fetch(`${END_POINT}txs?page=${page-1}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON?.data?.data || []
    const nowTime = (new Date()).getTime();
    return {
        totalTxs: responseJSON?.data?.total || 0,
        transactions: rawTxs.map((o: any) => {
            const createdTime = (new Date(o.time)).getTime()
            const toSmcAddress = defineToSmcAddress(o.to, o.contractAddress, o.decodedInputData);
            
            return {
                txHash: o.hash,
                from:  o.from,
                to:  o.to,
                value: o.value,
                time: o.time,
                blockNumber: o.blockNumber,
                blockHash:  o.blockHash,
                status: o.status === 1,
                failedReason: defineFailedReason(o.status === 1, o.gasUsed, o.gas),
                nonce: o.nonce,
                age: (nowTime - createdTime),
                transactionIndex: o.transactionIndex,
                contractAddress:  o.contractAddress,
                gasPrice: o.gasPrice,
                gas: o.gas,
                gasLimit: o.gas,
                input:  o.input,
                logs:  o.logs,
                toSmcName:  o.toName ? o.toName : toSmcAddress.toSmcName,
                toSmcAddr: toSmcAddress.toSmcAddr,
                txFee: o.txFee ? o.txFee : (o.gasUsed * o.gasPrice * 10**9),
                role: checkValidatorRole(o.role),
                isInValidatorsList: o.isInValidatorsList
            }
        })
    }
}

export const getTxsByBlockHeight = async (blockHeight: any, page: number, size: number) : Promise<TransactionsResponse> => {
    const response = await fetch(`${END_POINT}block/${blockHeight}/txs?page=${page-1}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON?.data?.data || []
    const nowTime = (new Date()).getTime()

    return {
        totalTxs: responseJSON?.data?.total || 0,
        transactions: rawTxs.map((o: any) => {
            const createdTime = (new Date(o.time)).getTime()
            const toSmcAddress = defineToSmcAddress(o.to, o.contractAddress, o.decodedInputData)
            return {
                txHash: o.hash,
                from:  o.from,
                to:  o.to,
                value: o.value,
                time: o.time,
                blockNumber: o.blockNumber,
                blockHash:  o.blockHash,
                status: o.status === 1,
                failedReason: defineFailedReason(o.status === 1, o.gasUsed, o.gas),
                nonce: o.nonce,
                age: (nowTime - createdTime),
                transactionIndex: o.transactionIndex,
                contractAddress:  o.contractAddress,
                gasPrice: o.gasPrice,
                gas: o.gas,
                gasLimit: o.gas,
                input:  o.input,
                logs:  o.logs,
                toSmcName:  o.toName ? o.toName : toSmcAddress.toSmcName,
                toSmcAddr: toSmcAddress.toSmcAddr,
                txFee: o.txFee ? o.txFee : (o.gasUsed * o.gasPrice * 10**9),
                role: checkValidatorRole(o.role),
                isInValidatorsList: o.isInValidatorsList
            }
        })
    }
}

export const getTxByHash = async (txHash: string): Promise<KAITransaction> => {
    const response = await fetch(`${END_POINT}txs/${txHash}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    
    const tx = responseJSON?.data || {};
    if(!tx) {
        return {} as KAITransaction
    }
    const nowTime = (new Date()).getTime()
    const createdTime = (new Date(tx.time)).getTime()
    const toSmcAddress = defineToSmcAddress(tx.to, tx.contractAddress, tx.decodedInputData)
    const gasUsedPercent = numberFormat(tx.gasUsed / tx.gas * 100, 3);
    return {
        txHash:tx.hash,
        from: tx.from,
        to: tx.to,
        value:tx.value,
        time:tx.time,
        blockNumber:tx.blockNumber,
        blockHash: tx.blockHash,
        status: tx.status === 1,
        failedReason: defineFailedReason(tx.status === 1, tx.gasUsed, tx.gas),
        nonce:tx.nonce,
        age: (nowTime - createdTime),
        transactionIndex:tx.transactionIndex,
        contractAddress: tx.contractAddress,
        gasPrice:tx.gasPrice,
        gas:tx.gas,
        gasUsed: tx.gasUsed,
        gasLimit: tx.gas,
        input: tx.input,
        logs: tx.logs,
        toSmcName: tx.toName ? tx.toName : toSmcAddress.toSmcName,
        toSmcAddr: toSmcAddress.toSmcAddr,
        gasUsedPercent: gasUsedPercent,
        txFee: tx.txFee ? tx.txFee : (tx.gasUsed * tx.gasPrice * 10**9),
        decodedInputData: tx.decodedInputData,
        role: checkValidatorRole(tx.role),
        isInValidatorsList: tx.isInValidatorsList
    }
}

export const getTxsByAddress = async (address: string, page: number, size: number): Promise<TransactionsResponse> => {
    const checkSumAddr = address ? toChecksum(address.toLowerCase()) : '';
    const response = await fetch(`${END_POINT}addresses/${checkSumAddr}/txs?page=${page-1}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON?.data?.data || []
    const nowTime = (new Date()).getTime()

    return {
        totalTxs: responseJSON?.data?.total || 0,
        transactions: rawTxs.map((o: any) => {
            const createdTime = (new Date(o.time)).getTime()
            const toSmcAddress = defineToSmcAddress(o.to, o.contractAddress, o.decodedInputData)
            return {
                txHash: o.hash,
                from:  o.from,
                to:  o.to,
                value: o.value,
                time: o.time,
                blockNumber: o.blockNumber,
                blockHash:  o.blockHash,
                status: o.status === 1,
                failedReason: defineFailedReason(o.status === 1, o.gasUsed, o.gas),
                nonce: o.nonce,
                age: (nowTime - createdTime),
                transactionIndex: o.transactionIndex,
                contractAddress:  o.contractAddress,
                gasPrice: o.gasPrice,
                gas: o.gas,
                gasLimit: o.gas,
                input:  o.input,
                logs:  o.logs,
                toSmcName: o.toName ? o.toName : toSmcAddress.toSmcName,
                toSmcAddr: toSmcAddress.toSmcAddr,
                txFee: o.txFee ? o.txFee : (o.gasUsed * o.gasPrice * 10**9),
                role: checkValidatorRole(o.role),
                isInValidatorsList: o.isInValidatorsList
            }
        })
    }
}

const defineFailedReason = (status: boolean, gasUsed: number, gasLimit: number): string => {
    if (!status && gasUsed === gasLimit) {
        return 'Transacsion error: Out of gas.'
    }
    return '';
}


const defineToSmcAddress = (toAddress: string, smcAddr: string, decodedInputData: any): ToSmcAddress => {
    if (toAddress?.toLocaleLowerCase() === STAKING_SMC_ADDRESS?.toLocaleLowerCase()) {
        return {
            toSmcAddr: toAddress,
            toSmcName: "Staking Master Contract"
        }
    }

    if (decodedInputData && toAddress?.toLocaleLowerCase() !== STAKING_SMC_ADDRESS?.toLocaleLowerCase()) {
        return {
            toSmcAddr: toAddress,
            toSmcName: "Validator Contract"
        }
    }

    if(toAddress?.toLocaleLowerCase() === "0x") {
        return {
            toSmcAddr: smcAddr,
            toSmcName: "Contract Creation"
        }
    }
    return {
        toSmcAddr: "",
        toSmcName: ""
    }
}