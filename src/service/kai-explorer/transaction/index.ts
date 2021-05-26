import { END_POINT, GET_REQUEST_OPTION } from "../config";
import { checkValidatorRole } from "..";
import { KardiaUtils } from "kardia-js-sdk";

interface TransactionsResponse {
    totalTxs: number;
    transactions: KAITransaction[]
}

export const getTransactions = async (page: number, size: number): Promise<TransactionsResponse> => {
    const response = await fetch(`${END_POINT}txs?page=${page}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON?.data?.data || []
    const nowTime = (new Date()).getTime();
    return {
        totalTxs: responseJSON?.data?.total || 0,
        transactions: rawTxs.map((o: any) => {
            const createdTime = (new Date(o.time)).getTime()
            const isContractCreation = o.contractAddress && o.contractAddress !== '0x'
            return {
                txHash: o.hash,
                from: o.from,
                to: !isContractCreation ? o.to : o.contractAddress,
                value: o.value,
                time: o.time,
                blockNumber: o.blockNumber,
                blockHash: o.blockHash,
                status: o.status,
                failedReason: defineFailedReason(o),
                nonce: o.nonce,
                age: (nowTime - createdTime),
                transactionIndex: o.transactionIndex,
                contractAddress: o.contractAddress,
                gasPrice: o.gasPrice,
                gas: o.gas,
                gasLimit: o.gas,
                input: o.input,
                logs: o.logs,
                txFee: o.txFee ? o.txFee : (o.gasUsed * o.gasPrice),
                role: checkValidatorRole(o.role),
                isInValidatorsList: o.isInValidatorsList,
                toName: o.toName ? o.toName : (isContractCreation ? 'Contract Creation' : ''),
                fromName: o.fromName ? o.fromName : '',
                isSmcInteraction: o.input && o.input !== '0x',
                isContractCreation: isContractCreation,
            }
        })
    }
}

export const getTxsByBlockHeight = async (blockHeight: any, page: number, size: number): Promise<TransactionsResponse> => {
    const response = await fetch(`${END_POINT}block/${blockHeight}/txs?page=${page}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON?.data?.data || []
    const nowTime = (new Date()).getTime()

    return {
        totalTxs: responseJSON?.data?.total || 0,
        transactions: rawTxs.map((o: any) => {
            const createdTime = (new Date(o.time)).getTime()
            const isContractCreation = o.contractAddress && o.contractAddress !== '0x'
            return {
                txHash: o.hash,
                from: o.from,
                to: !isContractCreation ? o.to : o.contractAddress,
                value: o.value,
                time: o.time,
                blockNumber: o.blockNumber,
                blockHash: o.blockHash,
                status: o.status,
                failedReason: defineFailedReason(o),
                nonce: o.nonce,
                age: (nowTime - createdTime),
                transactionIndex: o.transactionIndex,
                contractAddress: o.contractAddress,
                gasPrice: o.gasPrice,
                gas: o.gas,
                gasLimit: o.gas,
                input: o.input,
                logs: o.logs,
                txFee: o.txFee ? o.txFee : (o.gasUsed * o.gasPrice),
                role: checkValidatorRole(o.role),
                isInValidatorsList: o.isInValidatorsList,
                toName: o.toName ? o.toName : (isContractCreation ? 'Contract Creation' : ''),
                fromName: o.fromName ? o.fromName : '',
                isSmcInteraction: o.input && o.input !== '0x',
                isContractCreation: isContractCreation,
            }
        })
    }
}

export const getTxByHash = async (txHash: string): Promise<KAITransaction> => {
    const response = await fetch(`${END_POINT}txs/${txHash}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()

    const tx = responseJSON?.data || {};
    if (!tx) {
        return {} as KAITransaction
    }
    const nowTime = (new Date()).getTime()
    const createdTime = (new Date(tx.time)).getTime()
    const gasUsedPercent = tx.gasUsed / tx.gas * 100;
    const isContractCreation = tx.contractAddress && tx.contractAddress !== '0x'
    return {
        txHash: tx.hash,
        from: tx.from,
        to: !isContractCreation ? tx.to : tx.contractAddress,
        value: tx.value,
        time: tx.time,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash,
        status: tx.status,
        failedReason: defineFailedReason(tx),
        nonce: tx.nonce,
        age: (nowTime - createdTime),
        transactionIndex: tx.transactionIndex,
        contractAddress: tx.contractAddress,
        gasPrice: tx.gasPrice,
        gas: tx.gas,
        gasUsed: tx.gasUsed,
        gasLimit: tx.gas,
        input: tx.input,
        logs: tx.logs && tx.logs.length > 0 ? tx.logs.filter((item: any) => item.methodName === 'Transfer') : [],
        gasUsedPercent: gasUsedPercent,
        txFee: tx.txFee ? tx.txFee : (tx.gasUsed * tx.gasPrice),
        decodedInputData: tx.decodedInputData,
        role: checkValidatorRole(tx.role),
        isInValidatorsList: tx.isInValidatorsList,
        toName: tx.toName ? tx.toName : (isContractCreation ? 'Contract Creation' : ''),
        fromName: tx.fromName ? tx.fromName : '',
        isSmcInteraction: tx.input && tx.input !== '0x',
        isContractCreation: isContractCreation,
    }
}

export const getTxsByAddress = async (address: string, page: number, size: number): Promise<TransactionsResponse> => {
    try {
        const checkSumAddr = address ? KardiaUtils.toChecksum(address) : '';
        const response = await fetch(`${END_POINT}addresses/${checkSumAddr}/txs?page=${page}&limit=${size}`, GET_REQUEST_OPTION)
        const responseJSON = await response.json()
        const rawTxs = responseJSON?.data?.data || []
        const nowTime = (new Date()).getTime()

        return {
            totalTxs: responseJSON?.data?.total || 0,
            transactions: rawTxs.map((o: any) => {
                const createdTime = (new Date(o.time)).getTime()
                const isContractCreation = o.contractAddress && o.contractAddress !== '0x'
                return {
                    txHash: o.hash,
                    from: o.from,
                    to: !isContractCreation ? o.to : o.contractAddress,
                    value: o.value,
                    time: o.time,
                    blockNumber: o.blockNumber,
                    blockHash: o.blockHash,
                    status: o.status,
                    failedReason: defineFailedReason(o),
                    nonce: o.nonce,
                    age: (nowTime - createdTime),
                    transactionIndex: o.transactionIndex,
                    contractAddress: o.contractAddress,
                    gasPrice: o.gasPrice,
                    gas: o.gas,
                    gasLimit: o.gas,
                    input: o.input,
                    logs: o.logs,
                    txFee: o.txFee ? o.txFee : (o.gasUsed * o.gasPrice),
                    role: checkValidatorRole(o.role),
                    isInValidatorsList: o.isInValidatorsList,
                    toName: o.toName ? o.toName : (isContractCreation ? 'Contract Creation' : ''),
                    fromName: o.fromName ? o.fromName : '',
                    isSmcInteraction: o.input && o.input !== '0x',
                    isContractCreation: isContractCreation,
                }
            })
        }

    } catch (error) {
        return {} as TransactionsResponse
    }
}

const defineFailedReason = (txData: any): string => {
    try {
        const {status, gasUsed, gasLimit, revertReason } = txData
        if (revertReason) {
            return `Fail with error: ${revertReason}`
        }
        if (status !== 1 && gasUsed === gasLimit) {
            return 'Fail with error: Out of gas.'
        }
        return ''
    } catch (error) {
        return ''
    }
}

export const getContractEvents = async (page: number, size: number, txHash: string): Promise<any> => {
    const response = await fetch(`${END_POINT}contracts/events?page=${page}&limit=${size}&txHash=${txHash}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    if (responseJSON.data.data.length > 0) {
        return responseJSON.data.data;
    }

    return {}

}

export const getTokens = async (address: string): Promise<any> => {
    const _address = KardiaUtils.toChecksum(address)
    const response = await fetch(`${END_POINT}addresses/${_address}/tokens`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    if (responseJSON.data.data != null) {
        return {
            tokens: responseJSON.data.data.map((it: any) => {
                return {
                    balance: it.balance,
                    contractAddress: it.contractAddress,
                    holderAddress: it.holderAddress,
                    logo: it.logo,
                    tokenDecimals: it.tokenDecimals,
                    label: it.tokenName,
                    value: {
                        contractAddress: it.contractAddress,
                        tokenSymbol: it.tokenSymbol,
                        balance: it.balance,
                        tokenDecimals: it.tokenDecimals
                    },
                    tokenSymbol: it.tokenSymbol,
                    updatedAt: it.updatedAt,
                }
            })
        }
    }
    return {}
}

