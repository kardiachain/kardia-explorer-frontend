import { info } from "console";
import { END_POINT, GET_REQUEST_OPTION } from "../config"

export const getContractsList = async (page: number, size: number, sort: any): Promise<any> => {
    const response = await fetch(`${END_POINT}contracts?page=${page - 1}&limit=${size}&sort=${sort}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];
    return {
        total: responseJSON?.data?.total || 0,
        contracts: raws.map((item: any, index: number) => {
            console.log('item', item);
            return {
                address: item.address,
                info: item.info,
                name: item.name,
                type: item.type,
            }
        })
    }
}

export const getContractInfo = async (contractAddress: string): Promise<any> => {
    const response = await fetch(`${END_POINT}contracts/${contractAddress}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];
    return {
        total: responseJSON?.data?.total || 0,
        contracts: raws.map((item: any, index: number) => {
            console.log('item', item);
            return {
          
            }
        })
    }
}

