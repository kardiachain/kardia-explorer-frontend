import { KRC20, UNKNOW_AVARTAR_DEFAULT_BASE64 } from "../../../common/constant";
import { END_POINT, GET_REQUEST_OPTION } from "../config"
import { IContractList, ITokenContract, ITokenDetails, ITokenTranferTxList } from "./type";

export const getContractsList = async (page: number, size: number): Promise<IContractList> => {
    const response = await fetch(`${END_POINT}contracts?page=${page - 1}&limit=${size}&type=${KRC20}`, GET_REQUEST_OPTION);
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
                logo: item.logo ? `data:image/jpeg;base64,${item.logo}` : UNKNOW_AVARTAR_DEFAULT_BASE64
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
        decimals: raw.decimals || '',
        info: raw.info || '',
        logo: raw.logo ? `data:image/jpeg;base64,${raw.logo}` : UNKNOW_AVARTAR_DEFAULT_BASE64,
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
    const response = await fetch(`${END_POINT}contracts/events?page=${page-1}&limit=${size}&methodName=Transfer&contractAddress=${tokenAddr}`, GET_REQUEST_OPTION);
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
                from: item.arguments && item.arguments.from ? item.arguments.from : '',
                to: item.arguments && item.arguments.to ? item.arguments.to : '',
                value: item.arguments && item.arguments.value ? item.arguments.value : '0',
                age: (nowTime - createdTime),
                decimals: item.decimals ? item.decimals : 18
            }
        })
    }
}

