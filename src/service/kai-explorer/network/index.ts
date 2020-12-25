import { END_POINT, GET_REQUEST_OPTION } from "../config";
export const getNodes = async (): Promise<KAINode[]> => {
    try {
        const rs = await fetch(`${END_POINT}nodes`, GET_REQUEST_OPTION)
        const rsJSON = await rs.json()
        return rsJSON.data.map((item: any) => {
            return {
                nodeName: item.moniker,
                address: `0x${item.id}`,
                status: true,
                peerCount: item.peersCount || 0
            }
        })
    } catch (error) {
        console.error(error)
        return []
    }
}