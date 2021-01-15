import { Alert } from 'rsuite';
import Web3 from 'web3';
import abiJS from 'kardia-tool/lib/common/lib/abi';
import { isHexStrict, toHex } from 'kardia-tool/lib/common/lib/utils';
import STAKING_ABI from '../resources/smc-compile/staking-abi.json'
import VALIDATOR_ABI from '../resources/smc-compile/validator-abi.json';
import { cellValue } from '../common/utils/amount';
import { fromAscii } from 'kardia-tool/lib/common/lib/bytes';
import { STAKING_SMC_ADDRESS } from '../config/api';
import { gasLimitDefault } from '../common/constant';

declare global {
    interface Window {
        kardiachain: any;
        web3: any;
    }
}

const kardiaExtensionWalletEnabled = () => {
    if (window.kardiachain) {
        window.web3 = new Web3(window.kardiachain);
        if (window.kardiachain.isKaiWallet) {
            window.kardiachain.enable();
            return true;
        }
    }
    return false;
}

const generateTxForEW = async (toAddress: string, amount: number, gasPrice: number, gasLimit: number) => {
    if (!kardiaExtensionWalletEnabled()) {
        Alert.error("Please install the Kardia Extension Wallet to access.", 5000)
    } else {
        const accounts = await window.web3.eth.getAccounts();
        if (accounts && accounts[0]) {
            const tx = window.web3.eth.sendTransaction({
                from: accounts[0],
                gasPrice: Number(gasPrice),
                gas: Number(gasLimit),
                to: toAddress,
                value: amount
            });
        } else {
            Alert.error("Please login Kardia Extension Wallet.", 5000)
        }
    }
}

const findFunctionFromAbi = (abi: any, type = 'function', name = '') => {
    if (type !== 'constructor') {
        return abi.filter((item: any) => item.type === type && item.name === name)
    }
    return abi.filter((item: any) => item.type === type)
}

const encodeArray = (params: any) => {
    params && params.length > 0 && params.map((param: any) => {
        if (isHexStrict(param)) {
            return param;
        } else {
            return toHex(param);
        }
    })
}

const getMethodData = (abi: any, methodName: string, params: any[]) => {
    try {
        const functionFromAbi = findFunctionFromAbi(abi, 'function', methodName);
        const paramsDecorate = params && params.map(param => {
            if (Array.isArray(param)) {
                return encodeArray(param);
            } else if (isHexStrict(param)) {
                return param;
            } else {
                return toHex(param);
            }
        })
        return abiJS && abiJS.methodData(functionFromAbi, paramsDecorate)
    } catch (error) {
        console.log(error);
    }
    return '';
}

const invokeSMCByEW = async (
    abi: any,
    smcAddr: string,
    methodName: string,
    params: any[],
    amount: number = 0,
    gasLimit = gasLimitDefault,
    gasPrice = 1
) => {
    if (!kardiaExtensionWalletEnabled()) {
        Alert.error("Please install the Kardia Extension Wallet to access.", 5000)
    } else {
        try {
            const accounts = await window.web3.eth.getAccounts()
            if (accounts && accounts[0]) {
                const data = getMethodData(abi, methodName, params);
                const contract = await new window.web3.eth.Contract(abi, smcAddr);
                await contract.methods[methodName](...params).send({
                    from: accounts[0],
                    gasPrice: gasPrice,
                    gas: gasLimit,
                    value: Number(amount),
                    data: data,
                })
            } else {
                Alert.error("Please login Kardia Extension Wallet.", 5000)
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// Delegate interact with Kai Extenstion Wallet
const delegateByEW = async (smcAddr: string, amount: number, gasPrice: number, gasLimit: number) => {
    try {
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'delegate', [], amount, gasPrice, gasLimit)
    } catch (error) {
        throw error
    }
}

// Create validator interact with Kai Extension Wallet
const createValidatorByEW = async (params: CreateValParams, gasLimit: number, gasPrice: number) => {
    try {
        // convert value percent type to decimal type
        const commissionRateDec = cellValue(params.commissionRate / 100);
        const maxRateDec = cellValue(params.maxRate / 100);
        const maxRateChangeDec = cellValue(params.maxChangeRate / 100);
        // Convert validator name to bytes
        const valName = fromAscii(params.valName);
        const delAmountDec = Number(params.yourDelegationAmount);
        await invokeSMCByEW(STAKING_ABI, STAKING_SMC_ADDRESS, 'createValidator', [valName, commissionRateDec, maxRateDec, maxRateChangeDec], delAmountDec, gasPrice, gasLimit)   
    } catch (error) {
        throw error
    }
}

const updateValidatorNameByEW = async (smcAddr: string, name: string, amountFee: number, gasLimit: number, gasPrice: number) => {
    try {
        // Convert new validator name to bytes
        const valName = fromAscii(name);
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'updateName', [valName], amountFee, gasPrice, gasLimit)
    } catch (error) {
        throw error
    }
}

const updateValidatorCommissionByEW = async (smcAddr: string, newCommissionRate: number, gasLimit: number, gasPrice: number) => {
    try {
        // convert value percent type to decimal type
        const newCommissionRateDec = cellValue(newCommissionRate / 100);
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'updateCommissionRate', [newCommissionRateDec], 0, gasPrice, gasLimit)
    } catch (error) {
        throw error
    }
}

const startValidatorByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'start', [])
    } catch (error) {
        throw error
    }
}


const withdrawCommissionByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'withdrawCommission', [])
    } catch (error) {
        throw error
    }
}

const withdrawRewardByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'withdrawRewards', [])
    } catch (error) {
        throw error
    }
}

const withdrawDelegatedAmountByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'withdraw', [])
    } catch (error) {
        throw error
    }
}

const undelegateWithAmountByEW = async (smcAddr: string, amountUndel: number) => {
    try {
        // convert value number type to decimal type
        const amountUndelDec = cellValue(amountUndel);
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'undelegateWithAmount', [amountUndelDec])
    } catch (error) {
        throw error
    }
}

const undelegateAllByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'undelegate', [])
    } catch (error) {
        throw error
    }
}

const unjailValidatorByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW(VALIDATOR_ABI, smcAddr, 'unjail', [])
    } catch (error) {
        throw error
    }
}

export {
    kardiaExtensionWalletEnabled,
    generateTxForEW,
    delegateByEW,
    createValidatorByEW,
    updateValidatorNameByEW,
    updateValidatorCommissionByEW,
    startValidatorByEW,
    withdrawCommissionByEW,
    withdrawRewardByEW,
    withdrawDelegatedAmountByEW,
    undelegateWithAmountByEW,
    undelegateAllByEW,
    unjailValidatorByEW
} 