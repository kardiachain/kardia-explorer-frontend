import { colors } from "../../../common/constant"
import { END_POINT, GET_REQUEST_OPTION } from "../config"
import { toChecksum } from 'kardia-tool/lib/common/lib/account';
import { getCache, setCache } from "../../../plugin/localCache";

export const getValidators = async (): Promise<Validators> => {
    try {
        const cacheKey = 'VALIDATORS_LIST';
        const cacheResponse = getCache(cacheKey);
        if (cacheResponse) {
            return cacheResponse;
        }
        const response = await fetch(`${END_POINT}validators`, GET_REQUEST_OPTION)
        const responseJSON = await response.json()
        const raw = responseJSON.data || []
        const colorIndexRandom = Math.floor(Math.random() * (colors?.length - 1)) || 0;
        const responseData: Validators = {
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
                    address: v.address ? toChecksum(v.address.toLowerCase()) : '',
                    votingPower: v.votingPowerPercentage,
                    stakedAmount: v.stakedAmount,
                    commissionRate: v.commissionRate,
                    totalDelegators: v.totalDelegators,
                    maxRate: v.maxRate,
                    maxChangeRate: v.maxChangeRate,
                    name: v.name,
                    smcAddress: v.smcAddress ? toChecksum(v.smcAddress.toLowerCase()) : '',
                    isProposer: v.role === 2,
                    isValidator: v.role === 1,
                    isRegister: v.role === 0,
                    role: checkValidatorRole(v.role),
                }
            }) : []
        }
        setCache(cacheKey, responseData);
        return responseData
    } catch (error) {
        return {} as Validators
    }
}

export const getValidator = async (valAddr: string, page: number, limit: number): Promise<Validator> => {
    try {
        const cacheKey = `VALIDATOR_DATA_${valAddr}_${page}_${limit}`;
        const cacheResponse = getCache(cacheKey);
        if (cacheResponse) {
            return cacheResponse;
        }
        const response = await fetch(`${END_POINT}validators/${valAddr}?page=${page-1}&limit=${limit}`, GET_REQUEST_OPTION)
        const responseJSON = await response.json()
        const val = responseJSON?.data?.data || {}
        if (!val) {
            return {} as Validator
        }
        const responseData: Validator = {
            address: val.address ? toChecksum(val.address.toLowerCase()) : '',
            votingPower: val.votingPowerPercentage,
            stakedAmount: val.stakedAmount,
            commissionRate: val.commissionRate,
            totalDelegators: val.totalDelegators,
            maxRate: val.maxRate,
            maxChangeRate: val.maxChangeRate,
            name: val.name || '',
            smcAddress: val.smcAddress ? toChecksum(val.smcAddress.toLowerCase()) : '',
            role: checkValidatorRole(val.role),
            isProposer: val.role === 2,
            isValidator: val.role === 1,
            isRegister: val.role === 0,
            accumulatedCommission: val.accumulatedCommission,
            missedBlocks: val?.signingInfo?.missedBlockCounter || 0,
            updateTime: val.updateTime * 1000,
            jailed: val.jailed,
            signingInfo: {
                indexOffset: val?.signingInfo?.indexOffset || 0,
                indicatorRate: val?.signingInfo?.indicatorRate || 0,
                jailedUntil: val?.signingInfo?.jailedUntil * 1000 || 0,
                missedBlockCounter: val?.signingInfo?.missedBlockCounter || 0,
                startHeight: val?.signingInfo?.startHeight || 0,
                tombstoned: val?.signingInfo?.tombstoned || false
            },
            delegators: val.delegators ? val.delegators.map((del: any, index: number) => {
                return {
                    owner: del?.address?.toLowerCase() === val?.address?.toLowerCase(),
                    address: del.address ? toChecksum(del.address.toLowerCase()) : '',
                    stakeAmount: del.stakedAmount,
                    rewardsAmount: del.reward
                } as Delegator 
            }) : []
        }
        setCache(cacheKey, responseData)
        return responseData
    } catch (error) {
        return {} as Validator 
    }
}

export const getCandidates = async (): Promise<Candidate[]> => {
    try {
        const cacheKey = 'CANDIDATES_LIST';
        const cacheResponse = getCache(cacheKey);
        if (cacheResponse) {
            return cacheResponse;
        }

        const response = await fetch(`${END_POINT}validators/candidates`, GET_REQUEST_OPTION)
        const responseJSON = await response.json();
        const candidates = responseJSON?.data || [];
        const responseData = candidates.map((v: any, index: number) => {
            return {
                rank: index + 1,
                name: v.name,
                address: v.address ? toChecksum(v.address.toLowerCase()) : '',
                smcAddress: v.smcAddress ? toChecksum(v.smcAddress.toLowerCase()) : '',
                role: checkValidatorRole(v.role),
                isProposer: v.role === 2,
                isValidator: v.role === 1,
                isRegister: v.role === 0,
                votingPower: v.votingPowerPercentage,
                stakedAmount: v.stakedAmount,
                commissionRate: v.commissionRate,
                totalDelegators: v.totalDelegators,
                maxRate: v.maxRate,
                maxChangeRate: v.maxChangeRate
            } as Candidate
        })
    
        setCache(cacheKey, responseData);
        return responseData;
    } catch (error) {
        return [];
    }
}

export const getValidatorByDelegator = async (delAddr: string): Promise<YourValidator[]> => {
    try {
        const response = await fetch(`${END_POINT}delegators/${delAddr}/validators`, GET_REQUEST_OPTION);   
        const responseJSON = await response.json();
        const vals = responseJSON.data || [];
        const nowTime = (new Date()).getTime();
        const responseData = vals ? vals.map((v: any) => {
            return {
                validatorName: v.name || '',
                validatorAddr: v.validator ? toChecksum(v.validator.toLowerCase()) : '',
                yourStakeAmount: v.stakedAmount,
                validatorSmcAddr: v.validatorContractAddr ? toChecksum(v.validatorContractAddr.toLowerCase()) : '',
                claimableAmount: v.claimableRewards || 0,
                unbondedAmount: v.totalUnbondedAmount,
                withdrawableAmount: v.totalWithdrawableAmount,
                role: checkValidatorRole(v.validatorRole),
                unbondedRecords: v.unbondedRecords && v.unbondedRecords.length > 0 ? v.unbondedRecords.filter((r: any) => (Number(r.completionTime) * 1000) > nowTime).map((r: any) => {
                    return {
                        balance: r.balance,
                        completionTime: ((Number(r.completionTime) * 1000) - nowTime)
                    } as UnbondedRecord
                }) : []
            } as YourValidator
        }) : []
        return responseData
    } catch (error) {
        return []
    }
}

export const checkIsValidator = async (valAddr: string): Promise<boolean> => {
    try {
        const response = await fetch(`${END_POINT}validators/${valAddr}?page=0&limit=10`, GET_REQUEST_OPTION);
        if (response.status === 200) {
            return true
        }
        return false;
    } catch (error) {
        return false;
    }
}


export const checkValidatorRole = (role: number): ValidatorRole => {
    let result: ValidatorRole = {
        name: "",
        classname: "",
        character: ""
    };
    switch (role) {
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