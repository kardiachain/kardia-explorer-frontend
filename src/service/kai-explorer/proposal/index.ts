import { weiToKAI } from "../../../common/utils/amount";
import { END_POINT, GET_REQUEST_OPTION } from "../config";


const getProposals = async (page: number, size: number): Promise<ProposalsResponse> => {
    const response = await fetch(`${END_POINT}proposal?page=${page-1}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON?.data?.data || []
    return {
        total: responseJSON?.data?.total || 0,
        proposal: rawTxs.map((o: any) => {
            return {
                id: o.id,
                nominator: o.nominator,
                startTime: o.startTime * 1000,
                endTime: o.endTime * 1000,
                deposit: o.deposit,
                status: o.status,
                voteYes: o.voteYes ? Number(weiToKAI(o.voteYes)) * 10000 : 0,
                voteNo: o.voteNo ? Number(weiToKAI(o.voteNo)) * 10000 : 0,
                voteAbstain: o.voteAbstain,
                params: o.params
            }
        })
    }
}

const getProposalDetails = async (id: number): Promise<Proposal> => {
    const response = await fetch(`${END_POINT}proposal/${id}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const data = responseJSON?.data || {};
    if(!data) {
        return {} as Proposal
    }

    return {
        id: data.id,
        nominator: data.nominator,
        startTime: data.startTime * 1000,
        endTime: data.endTime * 1000,
        deposit: data.deposit,
        status: data.status,
        voteYes: data.voteYes ? Number(weiToKAI(data.voteYes)) * 10000 : 0,
        voteNo: data.voteNo ? Number(weiToKAI(data.voteNo)) * 10000 : 0,
        voteAbstain: data.voteAbstain,
        params: data.params
    } as Proposal;
}

const getCurrentNetworkParams = async (): Promise<NetworkParams> => {
    const response = await fetch(`${END_POINT}proposal/params`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const data = responseJSON?.data || {};

    if(!data) {
        return {} as NetworkParams
    }

    return {
        baseProposerReward: data.baseProposerReward,
        bonusProposerReward: data.bonusProposerReward,
        maxProposers: data.maxProposers,
        downtimeJailDuration: data.downtimeJailDuration,
        slashFractionDowntime: data.slashFractionDowntime,
        unbondingTime: data.unbondingTime,
        slashFractionDoubleSign: data.slashFractionDoubleSign,
        signedBlockWindow: data.signedBlockWindow,
        minSignedPerWindow: data.minSignedPerWindow,
        minStake: data.minStake,
        minValidatorStake: data.minValidatorStake,
        minAmountChangeName: data.minAmountChangeName,
        inflationRateChange: data.inflationRateChange,
        goalBonded: data.goalBonded,
        blocksPerYear: data.blocksPerYear,
        inflationMax: data.inflationMax,
        inflationMin: data.inflationMin,
        deposit: data.Deposit,
        votingPeriod: data.VotingPeriod
    } as NetworkParams

}

export {
    getProposals,
    getProposalDetails,
    getCurrentNetworkParams
}