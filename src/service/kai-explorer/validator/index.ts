import { colors } from "../../../common/constant"
import { END_POINT, GET_REQUEST_OPTION } from "../config"

export const getValidators = async (): Promise<Validators> => {
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
        totalProposer: raw.totalProposer,
        validators: raw.validators ? raw.validators.map((v: any, i: number) => {
            return {
                rank: i + 1,
                color: colors[i] || colors[colorIndexRandom],
                address: v.address,
                votingPower: v.votingPowerPercentage,
                stakedAmount: v.stakedAmount,
                commissionRate: v.commissionRate,
                totalDelegators: v.totalDelegators,
                maxRate: v.maxRate,
                maxChangeRate: v.maxChangeRate,
                name: v.name,
                smcAddress: v.smcAddress || '',
                isProposer: v.isProposer
            }
        }) : []
    } as Validators
}

export const getValidator = async (valAddr: string, page: number, limit: number): Promise<Validator> => {
    const response = await fetch(`${END_POINT}validators/${valAddr}?page=${page-1}&limit=${limit}`, GET_REQUEST_OPTION)
    const responseJSON = await response.json()
    const val = responseJSON?.data?.data || {}
    if (!val) {
        return {} as Validator
    }
    return {
        address: val.address,
        votingPower: val.votingPowerPercentage,
        stakedAmount: val.stakedAmount,
        commissionRate: val.commissionRate,
        totalDelegators: val.totalDelegators,
        maxRate: val.maxRate,
        maxChangeRate: val.maxChangeRate,
        name: val.name || val.address,
        smcAddress: val.smcAddress || '',
        isProposer: val.isProposer,
        delegators: val.delegators ? val.delegators.map((del: any, index: number) => {
            return {
                address: del.address,
                stakeAmount: del.stakedAmount,
                rewardsAmount: del.reward
            } as Delegator 
        }) : []
    } as Validator
}

// Get validator by delegator
export const getValidatorByDelegator = async (delAddr: string): Promise<YourValidator[]> => {
    const response = await fetch(`${END_POINT}delegators/${delAddr}/validators`, GET_REQUEST_OPTION);
    const responseJSON = await response.json();
    const vals = responseJSON.data || [];

    return vals ? vals.map((v: any) => {
        return {
            validatorName: v.validatorName || '',
            validatorAddr: v.validator || '',
            yourStakeAmount: v.stakedAmount,
            validatorSmcAddr: v.validatorContractAddr || '',
            claimableAmount: v.claimableRewards,
            unbondedAmount: v.unbondedAmount,
            withdrawableAmount: v.withdrawableAmount
        } as YourValidator
    }) : []
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