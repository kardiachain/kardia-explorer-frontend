import { END_POINT, GET_REQUEST_OPTION } from "../config"

export const getBalance = async (address: string): Promise<number> => {
    const response = await fetch(`${END_POINT}addresses/${address}/balance`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    return responseJSON.data || 0
}