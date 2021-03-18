import { checkValidatorRole } from "..";
import { END_POINT, GET_REQUEST_OPTION } from "../config"

export const getHolderAccount = async (address: string): Promise<HolderAccount> => {
    const response = await fetch(`${END_POINT}addresses/${address}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raw = responseJSON?.data ? responseJSON?.data : {};
    return {
        address: raw.address || '',
        name: raw.name || '',
        isContract: raw.isContract || '',
        balance: raw.balance || '0',
        isInValidatorsList: raw.isInValidatorsList,
        role: checkValidatorRole(raw.role)
    } as HolderAccount
}

export const getTotalStats = async (): Promise<TotalStats> => {
    const response = await fetch(`${END_POINT}dashboard/holders/total`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    return responseJSON.data || 0
}

interface HolderAccountResponse {
    totalAccount: number;
    holderAccounts: HolderAccount[]
}

export const getAccounts = async (page: number, size: number, sort: any): Promise<HolderAccountResponse> => {
    const response = await fetch(`${END_POINT}addresses?page=${page}&limit=${size}&sort=${sort}`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const raws = responseJSON?.data?.data || [];
    return {
        totalAccount: responseJSON?.data?.total || 0,
        holderAccounts: raws.map((item: any, index: number) => {
            return {
                index: item.rank,
                address: item.address || '',
                name: item.name || '',
                isContract: item.isContract || false,
                balance: item.balance || '0',
                isInValidatorsList: item.isInValidatorsList,
                role: checkValidatorRole(item.role)
            } as HolderAccount
        })
    } as HolderAccountResponse
}
