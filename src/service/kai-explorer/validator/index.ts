import { END_POINT, GET_REQUEST_OPTION } from "../config"

export const getValidators = async (): Promise<Validator[]> => {
    const response = await fetch(`${END_POINT}validators`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON.data || []

    return rawTxs.map((o: any) => {
        return {
            address: o.address,
            votingPower: o.votingPower,
            name: o.name,
            peerCount: o.peerCount,
            rpcUrl: o.rpcUrl
        } as Validator
    }) as Validator[]
}