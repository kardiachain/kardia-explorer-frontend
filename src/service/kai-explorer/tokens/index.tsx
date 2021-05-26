import { KRC20, UNVERIFY_TOKEN_DEFAULT_BASE64 } from "../../../common";
import { END_POINT, GET_REQUEST_OPTION } from "../config"
import { IContractList, ITokenContract, ITokenDetails, ITokenHolderByTokenList, ITokenTranferTxList } from "./type";
import { KardiaUtils } from 'kardia-js-sdk';

export const getContractsList = async (page: number, size: number, status: 'Verified' | 'Unverified'): Promise<IContractList> => {
    const response = await fetch(`${END_POINT}contracts?page=${page}&limit=${size}&type=${KRC20}&status=${status}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];

    if (!raws || raws.length < 1) return {} as IContractList

    return {
        total: responseJSON?.data?.total || 0,
        contracts: raws.map((item: any) => {
            return {
                address: item.address ? item.address : '',
                info: item.info ? item.info : '',
                name: item.name ? item.name : '',
                type: item.type ? item.type : '',
                logo: item.logo ? item.logo : UNVERIFY_TOKEN_DEFAULT_BASE64,
                tokenSymbol: item.tokenSymbol ? item.tokenSymbol : '',
                totalSupply: item.totalSupply ? item.totalSupply : '0',
                decimal: item.decimal ? item.decimal : 0
            } as ITokenContract
        })
    }
}

export const getTokenContractInfor = async (contractAddress: string): Promise<ITokenDetails> => {
    const response = await fetch(`${END_POINT}contracts/${contractAddress}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raw = responseJSON?.data || [];
    return {
        address: raw.address || '',
        balance: raw.balance || '',
        createdAt: raw.createdAt || '',
        decimals: raw.decimals || 0,
        info: raw.info || '',
        logo: raw.logo ? raw.logo : UNVERIFY_TOKEN_DEFAULT_BASE64,
        name: raw.name || '',
        ownerAddress: raw.ownerAddress || '',
        tokenName: raw.tokenName || '',
        symbol: raw.tokenSymbol || '',
        totalSupply: raw.totalSupply || '',
        txHash: raw.txHash || '',
        type: raw.type || '',
        updatedAt: raw.updatedAt || '',
    }
}

export const getTokenTransferTx = async (tokenAddr: string, page: number, size: number): Promise<ITokenTranferTxList> => {
    const response = await fetch(`${END_POINT}token/txs?contractAddress=${tokenAddr}&page=${page}&limit=${size}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];
    
    if (!raws || raws.length < 1) return {} as ITokenTranferTxList
    const nowTime = (new Date()).getTime()

    return {
        total: responseJSON?.data?.total || 0,
        txs: raws.map((item: any) => {
            const createdTime = (new Date(item.time)).getTime()
            return {
                txHash: item.transactionHash ? item.transactionHash : '',
                from: item.from? item.from : '',
                to: item.to ? item.to : '',
                value: item.value ? item.value : '0',
                age: (nowTime - createdTime),
                decimals: item.decimals ? item.decimals : 0,
                tokenName: item.tokenName ? item.tokenName : '',
                tokenType: item.tokenType ? item.tokenType : '',
                tokenSymbol: item.tokenSymbol ? item.tokenSymbol : '',
                logo: item.logo ? item.logo : UNVERIFY_TOKEN_DEFAULT_BASE64,
                tokenAddress: item.address ? item.address : ''
            }
        })
    }
}

export const getKrc20Txs = async (address: string, page: number, size: number): Promise<ITokenTranferTxList> => {
    const response = await fetch(`${END_POINT}token/txs?address=${KardiaUtils.toChecksum(address)}&page=${page}&limit=${size}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];
    
    if (!raws || raws.length < 1) return {} as ITokenTranferTxList
    const nowTime = (new Date()).getTime()

    return {
        total: responseJSON?.data?.total || 0,
        txs: raws.map((item: any) => {
            const createdTime = (new Date(item.time)).getTime()
            return {
                txHash: item.transactionHash ? item.transactionHash : '',
                from: item.from? item.from : '',
                to: item.to ? item.to : '',
                value: item.value ? item.value : '0',
                age: (nowTime - createdTime),
                decimals: item.decimals ? item.decimals : 0,
                tokenName: item.tokenName ? item.tokenName : '',
                tokenType: item.tokenType ? item.tokenType : '',
                tokenSymbol: item.tokenSymbol ? item.tokenSymbol : '',
                logo: item.logo ? item.logo : UNVERIFY_TOKEN_DEFAULT_BASE64,
                tokenAddress: item.address ? item.address : ''
            }
        })
    }
}

export const getTokenHoldersByToken = async (tokenAddr: string, page: number, size: number) : Promise<ITokenHolderByTokenList> => {
    const response = await fetch(`${END_POINT}token/holders/${tokenAddr}?page=${page}&limit=${size}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];
    if (!raws || raws.length < 1) return {} as ITokenHolderByTokenList

    return {
        total: responseJSON?.data?.total || 0,
        holders: raws.map((item: any) => {
            return {
                holderAddress: item.holderAddress ? item.holderAddress : '',
                balance: item.balance ? item.balance : '',
                tokenDecimals: item.tokenDecimals ? item.tokenDecimals : 0
            }
        })
    }
}

