import { weiToKAI } from "../../../common";
import { proposalItems } from "../../../pages/Wallet/Dashboard/Proposal/type";
import { END_POINT, GET_REQUEST_OPTION } from "../config";


const getProposals = async (page: number, size: number): Promise<ProposalsResponse> => {
    const response = await fetch(`${END_POINT}proposal?page=${page}&limit=${size}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const rawTxs = responseJSON?.data?.data || []
    const nowTime = (new Date()).getTime();
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
                params: o.params && o.params.length > 0 ? o.params.map((item: any) => {
                    return {
                        labelName: parseLabelNameByKey(item.labelName),
                        fromValue: convertProposalValue(item.labelName, item.fromValue),
                        toValue: convertProposalValue(item.labelName, item.toValue)
                    } as ProposalParams
                }) : [] as ProposalParams[],
                numberOfVoteAbstain: o.numberOfVoteAbstain,
                numberOfVoteYes: o.numberOfVoteYes,
                numberOfVoteNo: o.numberOfVoteNo,
                expriedTime: ((o.endTime * 1000) - nowTime),
                validatorVotes: o.voteYes / (o.voteNo + o.voteYes + o.voteAbstain) * 100
            }
        })
    }
}

const getProposalDetails = async (id: number): Promise<Proposal> => {
    const response = await fetch(`${END_POINT}proposal/${id}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const data = responseJSON?.data || {};
    if (!data) {
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
        params: data.params && data.params.length > 0 ? data.params.map((item: any) => {
            return {
                labelName: parseLabelNameByKey(item.labelName),
                fromValue: convertProposalValue(item.labelName, item.fromValue),
                toValue: convertProposalValue(item.labelName, item.toValue)
            } as ProposalParams
        }) : [] as ProposalParams[],
        numberOfVoteAbstain: data.numberOfVoteAbstain,
        numberOfVoteYes: data.numberOfVoteYes,
        numberOfVoteNo: data.numberOfVoteNo,
        validatorVotes: data.voteYes / (data.voteNo + data.voteYes + data.voteAbstain) * 100
    } as Proposal;
}

const getCurrentNetworkParams = async (): Promise<NetworkParams> => {
    const response = await fetch(`${END_POINT}proposal/params`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const data = responseJSON?.data || {};

    if (!data) {
        return {} as NetworkParams
    }

    return {
        baseProposerReward: convertProposalValue('baseProposerReward', data.baseProposerReward),
        bonusProposerReward: convertProposalValue('bonusProposerReward', data.bonusProposerReward),
        maxProposers: convertProposalValue('maxProposers', data.maxProposers),
        downtimeJailDuration: convertProposalValue('downtimeJailDuration', data.downtimeJailDuration),
        slashFractionDowntime: convertProposalValue('slashFractionDowntime', data.slashFractionDowntime),
        unbondingTime: convertProposalValue('unbondingTime', data.unbondingTime),
        slashFractionDoubleSign: convertProposalValue('slashFractionDoubleSign', data.slashFractionDoubleSign),
        signedBlockWindow: convertProposalValue('signedBlockWindow', data.signedBlockWindow),
        minSignedPerWindow: convertProposalValue('minSignedPerWindow', data.minSignedPerWindow),
        minStake: convertProposalValue('minStake', data.minStake),
        minValidatorStake: convertProposalValue('minValidatorStake', data.minValidatorStake),
        minAmountChangeName: convertProposalValue('minAmountChangeName', data.minAmountChangeName),
        minSelfDelegation: convertProposalValue('minSelfDelegation', data.minSelfDelegation),
        inflationRateChange: convertProposalValue('inflationRateChange', data.inflationRateChange),
        goalBonded: convertProposalValue('goalBonded', data.goalBonded),
        blocksPerYear: convertProposalValue('blocksPerYear', data.blocksPerYear),
        inflationMax: convertProposalValue('inflationMax', data.inflationMax),
        inflationMin: convertProposalValue('inflationMin', data.inflationMin),
        deposit: convertProposalValue('Deposit', data.Deposit),
        votingPeriod: convertProposalValue('VotingPeriod', data.VotingPeriod)
    } as NetworkParams
}

const parseLabelNameByKey = (key: string): string => {
    switch (key) {
        case 'baseProposerReward':
            return 'Base Proposer Reward'
        case 'bonusProposerReward':
            return 'Bonus Proposer Reward'
        case 'maxProposers':
            return 'Max Proposers'
        case 'downtimeJailDuration':
            return 'Downtime Jail Duration'
        case 'slashFractionDowntime':
            return 'Slash Fraction Downtime'
        case 'unbondingTime':
            return 'Unboding Time'
        case 'slashFractionDoubleSign':
            return 'Slash Fraction Double Sign'
        case 'signedBlockWindow':
            return 'Signed Block Window'
        case 'minSignedPerWindow':
            return 'Min Signed Per Window'
        case 'minStake':
            return 'Min Stake'
        case 'minValidatorStake':
            return 'Min Validator Stake'
        case 'minAmountChangeName':
            return 'Min Amount Change Name'
        case 'minSelfDelegation':
            return 'Min Self Deleagation'
        case 'inflationRateChange':
            return 'Inflation Rate Change'
        case 'goalBonded':
            return 'Goal Bonded'
        case 'blocksPerYear':
            return 'Block Per Year'
        case 'inflationMax':
            return 'Inflation Max'
        case 'inflationMin':
            return 'Inflation Min'
        case 'Deposit':
            return 'Deposit'
        case 'VotingPeriod':
            return 'Voting Period'
        default:
            return '';
    }
}

const convertProposalValue = (key: string, value: any) => {

    const _items = proposalItems.filter((item) => item.value.name === key)[0];
    const _type = _items && (_items as any).value ? (_items as any).value.type : ''
    switch (_type) {
        case 'decimal':
            return weiToKAI(value)
        case 'percent':
            return weiToKAI(value) * 100
        case 'time':
            return value
        default:
            return value
    }
}

export {
    getProposals,
    getProposalDetails,
    getCurrentNetworkParams,
    parseLabelNameByKey,
    convertProposalValue
}