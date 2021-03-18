import { numberFormat } from "../../../common/utils/number";
import { END_POINT, GET_REQUEST_OPTION } from "../config";
import { toChecksum } from 'kardia-tool/lib/common/lib/account'
import { checkValidatorRole } from "..";

interface TransactionsResponse {
    totalTxs: number;
    transactions: KAITransaction[]
}

export const getTransactions = async (page: number, size: number): Promise<TransactionsResponse> => {
    const response = await fetch(`${END_POINT}txs?page=${page - 1}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON?.data?.data || []
    const nowTime = (new Date()).getTime();
    return {
        totalTxs: responseJSON?.data?.total || 0,
        transactions: rawTxs.map((o: any) => {
            const createdTime = (new Date(o.time)).getTime()
            const isContractCreation = (o.input && o.input !== '0x') && ((o.contractAddress && o.contractAddress !== '0x') || (!o.contractAddress || o.to === '0x'));
            return {
                txHash: o.hash,
                from: o.from,
                to: !isContractCreation ? o.to : o.contractAddress,
                value: o.value,
                time: o.time,
                blockNumber: o.blockNumber,
                blockHash: o.blockHash,
                status: o.status === 1,
                failedReason: defineFailedReason(o.status === 1, o.gasUsed, o.gas),
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
    const response = await fetch(`${END_POINT}block/${blockHeight}/txs?page=${page - 1}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON?.data?.data || []
    const nowTime = (new Date()).getTime()

    return {
        totalTxs: responseJSON?.data?.total || 0,
        transactions: rawTxs.map((o: any) => {
            const createdTime = (new Date(o.time)).getTime()
            const isContractCreation = (o.input && o.input !== '0x') && ((o.contractAddress && o.contractAddress !== '0x') || (!o.contractAddress || o.to === '0x'));
            return {
                txHash: o.hash,
                from: o.from,
                to: !isContractCreation ? o.to : o.contractAddress,
                value: o.value,
                time: o.time,
                blockNumber: o.blockNumber,
                blockHash: o.blockHash,
                status: o.status === 1,
                failedReason: defineFailedReason(o.status === 1, o.gasUsed, o.gas),
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
    const gasUsedPercent = numberFormat(tx.gasUsed / tx.gas * 100, 3);
    const isContractCreation = (tx.input && tx.input !== '0x') && ((tx.contractAddress && tx.contractAddress !== '0x') || (!tx.contractAddress || tx.to === '0x'));
    return {
        txHash: tx.hash,
        from: tx.from,
        to: !isContractCreation ? tx.to : tx.contractAddress,
        value: tx.value,
        time: tx.time,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash,
        status: tx.status === 1,
        failedReason: defineFailedReason(tx.status === 1, tx.gasUsed, tx.gas),
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
        const checkSumAddr = address ? toChecksum(address.toLowerCase()) : '';
        const response = await fetch(`${END_POINT}addresses/${checkSumAddr}/txs?page=${page - 1}&limit=${size}`, GET_REQUEST_OPTION)
        const responseJSON = await response.json()
        const rawTxs = responseJSON?.data?.data || []
        const nowTime = (new Date()).getTime()

        return {
            totalTxs: responseJSON?.data?.total || 0,
            transactions: rawTxs.map((o: any) => {
                const createdTime = (new Date(o.time)).getTime()
                const isContractCreation = (o.input && o.input !== '0x') && ((o.contractAddress && o.contractAddress !== '0x') || (!o.contractAddress || o.to === '0x'));
                return {
                    txHash: o.hash,
                    from: o.from,
                    to: !isContractCreation ? o.to : o.contractAddress,
                    value: o.value,
                    time: o.time,
                    blockNumber: o.blockNumber,
                    blockHash: o.blockHash,
                    status: o.status === 1,
                    failedReason: defineFailedReason(o.status === 1, o.gasUsed, o.gas),
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

const defineFailedReason = (status: boolean, gasUsed: number, gasLimit: number): string => {
    if (!status && gasUsed === gasLimit) {
        return 'Transacsion error: Out of gas.'
    }
    return '';
}

export const getContractEvents = async (page: number, size: number, txHash: string): Promise<any> => {
    const response = await fetch(`${END_POINT}contracts/events?page=${page - 1}&limit=${size}&txHash=${txHash}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    if (responseJSON.data.data.length > 0) {
        const it = responseJSON.data.data[0];
        return {
            address: it.address || '',
            methodName: it.methodName || '',
            argumentsName: it.argumentsName || '',
            arguments: it.arguments || '',
            topics: it.topics || '',
            data: it.data || '',
            blockHeight: it.blockHeight || '',
            transactionHash: it.transactionHash || '',
            transactionIndex: it.transactionIndex || '',
            blockHash: it.blockHash || '',
            logIndex: it.logIndex || '',
            removed: it.remove || ''
        }
    }

    return {}

}

export const getTokens = async (address: string): Promise<any> => {
    const response = await fetch(`${END_POINT}addresses/${address}/tokens`, GET_REQUEST_OPTION);
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

