import { colors } from "../../../common/constant"
import { END_POINT, GET_REQUEST_OPTION } from "../config"
import { toChecksum } from 'kardia-tool/lib/common/lib/account';

export const getValidators = async (): Promise<Validators> => {
    try {
        const response = await fetch(`${END_POINT}validators`, GET_REQUEST_OPTION)
        const responseJSON = await response.json()
        const raw = responseJSON.data || []
        const colorIndexRandom = Math.floor(Math.random() * (colors?.length - 1)) || 0;
    
        return {
            totalValidators: raw.totalValidators,
            totalDelegators: raw.totalDelegators,
            totalStakedAmount: raw.totalStakedAmount,
            totalValidatorStakedAmount: raw.totalValidatorStakedAmount,
            totalDelegatorStakedAmount: raw.totalDelegatorStakedAmount,
            totalProposer: raw.totalProposers,
            totalCandidates: raw.totalCandidates,
            validators: raw.validators ? raw.validators.map((v: any, i: number) => {
                return {
                    rank: i + 1,
                    color: colors[i] || colors[colorIndexRandom],
                    address: toChecksum(v.address),
                    votingPower: v.votingPowerPercentage,
                    stakedAmount: v.stakedAmount,
                    commissionRate: v.commissionRate,
                    totalDelegators: v.totalDelegators,
                    maxRate: v.maxRate,
                    maxChangeRate: v.maxChangeRate,
                    name: v.name,
                    smcAddress: toChecksum(v.smcAddress) || '',
                    isProposer: v.status === 2,
                    isValidator: v.status === 1,
                    isRegister: v.status === 0,
                    role: checkValidatorRole(v.status),
                }
            }) : []
        } as Validators
    } catch (error) {
        return {} as Validators
    }
}

export const getValidator = async (valAddr: string, page: number, limit: number): Promise<Validator> => {
    try {
        const response = await fetch(`${END_POINT}validators/${valAddr}?page=${page-1}&limit=${limit}`, GET_REQUEST_OPTION)
        const responseJSON = await response.json()
        const val = responseJSON?.data?.data || {}
        if (!val) {
            return {} as Validator
        }
        return {
            address: toChecksum(val.address),
            votingPower: val.votingPowerPercentage,
            stakedAmount: val.stakedAmount,
            commissionRate: val.commissionRate,
            totalDelegators: val.totalDelegators,
            maxRate: val.maxRate,
            maxChangeRate: val.maxChangeRate,
            name: val.name || '',
            smcAddress: toChecksum(val.smcAddress) || '',
            role: checkValidatorRole(val.status),
            isProposer: val.status === 2,
            isValidator: val.status === 1,
            isRegister: val.status === 0,
            accumulatedCommission: val.accumulatedCommission,
            missedBlocks: val.missedBlocks,
            updateTime: val.updateTime,
            delegators: val.delegators ? val.delegators.map((del: any, index: number) => {
                return {
                    address: toChecksum(del.address),
                    stakeAmount: del.stakedAmount,
                    rewardsAmount: del.reward
                } as Delegator 
            }) : []
        } as Validator
    } catch (error) {
        return {} as Validator 
    }
}

export const getCandidates = async (): Promise<Candidate[]> => {
    try {
        const response = await fetch(`${END_POINT}validators/candidates`, GET_REQUEST_OPTION)
        const responseJSON = await response.json();
        const candidates = responseJSON?.data?.validators || [];
    
        return candidates.map((v: any, index: number) => {
            return {
                rank: index + 1,
                name: v.name,
                address: toChecksum(v.address),
                smcAddress: toChecksum(v.smcAddress),
                role: checkValidatorRole(v.status),
                isProposer: v.status === 2,
                isValidator: v.status === 1,
                isRegister: v.status === 0,
                votingPower: v.votingPowerPercentage,
                stakedAmount: v.stakedAmount,
                commissionRate: v.commissionRate,
                totalDelegators: v.totalDelegators,
                maxRate: v.maxRate,
                maxChangeRate: v.maxChangeRate
            } as Candidate
        }) || [];
    } catch (error) {
        return [];
    }
}


// Get validator by delegator
export const getValidatorByDelegator = async (delAddr: string): Promise<YourValidator[]> => {
    try {
        const response = await fetch(`${END_POINT}delegators/${delAddr}/validators`, GET_REQUEST_OPTION);
        const responseJSON = await response.json();
        const vals = responseJSON.data || [];
    
        return vals ? vals.map((v: any) => {
            return {
                validatorName: v.validatorName || '',
                validatorAddr: toChecksum(v.validator) || '',
                yourStakeAmount: v.stakedAmount,
                validatorSmcAddr: toChecksum(v.validatorContractAddr) || '',
                claimableAmount: v.claimableRewards,
                unbondedAmount: v.unbondedAmount,
                withdrawableAmount: v.withdrawableAmount
            } as YourValidator
        }) : []
    } catch (error) {
        return []
    }
}


// check validator had register
export const checkIsValidator = async (valAddr: string): Promise<boolean> => {
    try {
        const response = await fetch(`${END_POINT}validators/${valAddr}?page=0&limit=10`, GET_REQUEST_OPTION);
        if (response.status === 200) {
            return true
        }
    } catch (error) {
        return false;
    }
    return false;
}


export const checkValidatorRole = (status: number): ValidatorRole => {
    let result: ValidatorRole = {
        name: "",
        classname: "",
        character: ""
    };
    switch (status) {
        case 0:
            result = {
                name: "Candidate",
                classname: "candidate",
                character: "C"
            };
            break;
        case 1:
            result = {
                name: "Validator",
                classname: "validator",
                character: 'V'
            };
            break;
        case 2: 
            result = {
                name: "Proposer",
                classname: "proposer",
                character: "P"
            } 
            break;
    }
    return result;
} 