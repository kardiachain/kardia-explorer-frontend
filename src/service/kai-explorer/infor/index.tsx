import { END_POINT, GET_REQUEST_OPTION } from "../config";

export const getTokenInfor = async (): Promise<KaiToken> => {
    const response = await fetch(`${END_POINT}dashboard/token`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawBlockList = responseJSON.data || []

    return rawBlockList;
} 