import { END_POINT, GET_REQUEST_OPTION } from "../kai-explorer/config";

export const getContractKRC721 = async (page: number, size: number) => {
    const response = await fetch(`${END_POINT}contracts?page=${page}&limit=${size}&type=KRC721`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];

    if (!raws || raws.length < 1) return {}

    return {
        total: responseJSON?.data?.total || 0,
        contracts: raws.map((item: any) => {
            return {
                address: item.address ? item.address : '',
                decimal: item.decimal ? item.decimal : '',
                isVerified: item.isVerified,
                name: item.name ? item.name : '',
                status: item.status ? item.status : '',
                tokenSymbol: item.tokenSymbol ? item.tokenSymbol : '',
                totalSupply: item.totalSupply ? item.totalSupply : '0',
                type: item.type ? item.type : ''
            }
        })
    }
}

export const getTokenHoldersByTokenKRC721 = async (tokenAddr: string, page: number, size: number) => {
    const response = await fetch(`${END_POINT}krc721/${tokenAddr}/holders?page=${page}&limit=${size}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];
    if (!raws || raws.length < 1) return {}

    return {
        total: responseJSON?.data?.total || 0,
        holders: raws.map((item: any) => {
            return {
                holderAddress: item.address ? item.address : '',
                tokenID: item.tokenID ? item.tokenID : '',
            }
        })
    }
}

