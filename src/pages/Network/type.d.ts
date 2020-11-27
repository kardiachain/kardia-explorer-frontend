type NodeStatus = "online" | "offline"
interface KAINode {
    id: string,
    color: string,
    address: string,
    protocol: string,
    peers: any[],
    votingPower: number,
    status: NodeStatus,
    listen_addr: string,
    rpcURL: string,
    isValidator: boolean,
    peerCount: number;
}