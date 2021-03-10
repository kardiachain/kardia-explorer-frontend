import { info } from "console";
import { END_POINT, GET_REQUEST_OPTION } from "../config"

export const getContractsList = async (page: number, size: number, sort: any): Promise<any> => {
    const response = await fetch(`${END_POINT}contracts?page=${page - 1}&limit=${size}&sort=${sort}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];
    return {
        total: responseJSON?.data?.total || 0,
        contracts: raws.map((item: any, index: number) => {
            return {
                address: item.address,
                info: item.info,
                name: item.name,
                type: item.type,
            }
        })


    }
}

export const getContractInfor = async (contractAddress: string): Promise<any> => {
    const response = await fetch(`${END_POINT}contracts/${contractAddress}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data || [];
    return {
                abi: raws.abi || '',
                address: raws.address || '',
                balance: raws.balance || '',
                bytecode: raws.bytecode || '',
                createdAt: raws.createdAt || '',
                decimals: raws.decimals || '',
                holderCount: raws.holderCount || '',
                info: raws.info || '',
                internalTxCount: raws.internalTxCount || '',
                isContract: raws.isContract || '',
                logo: raws.logo || '',
                name: raws.name || '',
                ownerAddress: raws.ownerAddress || '',
                tokenName: raws.tokenName || '',
                tokenSymbol: raws.tokenSymbol || '',
                tokenTxCount: raws.tokenTxCount || '',
                totalSupply: raws.totalSupply || '',
                txCount: raws.txCount || '',
                txHash: raws.txHash || '',
                type: raws.type || '',
                updatedAt: raws.updatedAt || '',
    }
}

