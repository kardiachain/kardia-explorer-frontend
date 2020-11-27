import { END_POINT, GET_REQUEST_OPTION } from "../config";
export const getNodes = async (): Promise<KAINode[]> => {
    try {
        const rs = await fetch(`${END_POINT}nodes`, GET_REQUEST_OPTION)
        const rsJSON = await rs.json()
        return rsJSON.data.map((item: any) => {
            return {
                id: item.moniker,
                color: '#4287f5',
                address: `0x${item.id}`,
                peers: item.peers,
                protocol: 'KAI',
                votingPower: 100,
                status: "online",
                listen_addr: item.listen_addr,
                rpcURL: "",
                isValidator: true,
                peerCount: item.peers ? item.peers.length : 0
            }
        })
    } catch (error) {
        console.error(error)
        return []
    }
}