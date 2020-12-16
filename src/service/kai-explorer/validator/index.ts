import { colors } from "../../../common/constant"
import { END_POINT, GET_REQUEST_OPTION } from "../config"
import { toChecksum } from 'kardia-tool/lib/common/lib/account';

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
                address: toChecksum(v.address),
                votingPower: v.votingPowerPercentage,
                stakedAmount: v.stakedAmount,
                commissionRate: v.commissionRate,
                totalDelegators: v.totalDelegators,
                maxRate: v.maxRate,
                maxChangeRate: v.maxChangeRate,
                name: v.name,
                smcAddress: toChecksum(v.smcAddress) || '',
                isProposer: v.role === 2,
                isValidator: v.role === 1,
                isRegister: v.role === 0,
                status: checkValidatorStatus(v.role),
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
        address: toChecksum(val.address),
        votingPower: val.votingPowerPercentage,
        stakedAmount: val.stakedAmount,
        commissionRate: val.commissionRate,
        totalDelegators: val.totalDelegators,
        maxRate: val.maxRate,
        maxChangeRate: val.maxChangeRate,
        name: val.name || '',
        smcAddress: toChecksum(val.smcAddress) || '',
        status: checkValidatorStatus(val.role),
        isProposer: val.role === 2,
        isValidator: val.role === 1,
        isRegister: val.role === 0,
        accumulatedCommission: val.accumulatedCommission,
        delegators: val.delegators ? val.delegators.map((del: any, index: number) => {
            return {
                address: toChecksum(del.address),
                stakeAmount: del.stakedAmount,
                rewardsAmount: del.reward
            } as Delegator 
        }) : []
    } as Validator
}

export const getRegisters = async (): Promise<Register[]> => {
    const response = await fetch(`${END_POINT}validators/registered`, GET_REQUEST_OPTION)
    const responseJSON = await response.json();
    const registers = responseJSON.data.validators || [];

    return registers.map((v: any, index: number) => {
        return {
            rank: index + 1,
            name: v.name,
            address: toChecksum(v.address),
            smcAddress: toChecksum(v.smcAddress),
            status: checkValidatorStatus(v.role),
            isProposer: v.role === 2,
            isValidator: v.role === 1,
            isRegister: v.role === 0,
            votingPower: v.votingPowerPercentage,
            stakedAmount: v.stakedAmount,
            commissionRate: v.commissionRate,
            totalDelegators: v.totalDelegators,
            maxRate: v.maxRate,
            maxChangeRate: v.maxChangeRate
        } as Register
    }) || [];
}


// Get validator by delegator
export const getValidatorByDelegator = async (delAddr: string): Promise<YourValidator[]> => {
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


export const checkValidatorStatus = (status: number): ValidatorStatus => {
    let result: ValidatorStatus = {
        content: "",
        color: ""
    };
    switch (status) {
        case 0:
            result = {
                content: "Register",
                color: "register"
            };
            break;
        case 1:
            result = {
                content: "Validator",
                color: "validator"
            };
            break;
        case 2: 
            result = {
                content: "Proposer",
                color: "proposer"
            } 
            break;
    }
    return result;
} 