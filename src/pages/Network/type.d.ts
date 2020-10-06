type NodeStatus = "online" | "offline"
interface KAINode {
    id: string,
    color: string,
    address: string,
    protocol: string,
    peerCount: number,
    votingPower: number,
    status: NodeStatus,
    rpcURL: string
}