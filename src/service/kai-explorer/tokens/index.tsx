import { KRC20, UNKNOW_AVARTAR_DEFAULT_BASE64 } from "../../../common/constant";
import { END_POINT, GET_REQUEST_OPTION } from "../config"
import { IContractList, ITokenContract, ITokenDetails } from "./type";

export const getContractsList = async (page: number, size: number): Promise<IContractList> => {
    const response = await fetch(`${END_POINT}contracts?page=${page - 1}&limit=${size}&type=${KRC20}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];
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

