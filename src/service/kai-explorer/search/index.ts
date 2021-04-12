import { UNVERIFY_TOKEN_DEFAULT_BASE64 } from "../../../common";
import { END_POINT, GET_REQUEST_OPTION } from "../config";
import { SearchItem } from "./type";

export const searchAll = async (text: string): Promise<SearchItem[]> => {
    try {
        const rs = await fetch(`${END_POINT}search?name=${text}`, GET_REQUEST_OPTION)
        const rsJSON = await rs.json()
        
        if (!rsJSON.data && rsJSON.data.length < 1) return [] as SearchItem[]
        
        return rsJSON.data.map((item: any, index: number) => {
            return {
                name: item.name ? item.name : '',
                symbol: item.symbol ? item.symbol : '',
                type: item.type ? item.type : '', 
                address: item.address ? item.address : '',
                logo: item.logo ? item.logo : UNVERIFY_TOKEN_DEFAULT_BASE64,
                info: item.info ? item.info : ''
            }
        })
    } catch (error) {
        return [] as SearchItem[]
    }
}