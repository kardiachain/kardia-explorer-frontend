import { Alert } from 'rsuite';
import Web3 from 'web3';
import STAKING_ABI from '../resources/smc-compile/staking-abi.json'
import VALIDATOR_ABI from '../resources/smc-compile/validator-abi.json';
import KRC20_API from '../resources/smc-compile/krc20-abi.json'
import { STAKING_SMC_ADDRESS, PROPOSAL_SMC_ADDRESS } from '../config/api';
import { gasLimitDefault, cellValue, cellValueKRC20, ShowNotify, calGasprice } from '../common';
import PROPOSAL_ABI from '../resources/smc-compile/proposal-abi.json';
import kardiaClient from '../plugin/kardia-dx';
import { KardiaUtils } from 'kardia-js-sdk';
import { GasMode } from '../enum';
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

const generateTxForEW = async (toAddress: string, amount: number, gasPrice: GasMode, gasLimit: number) => {
    if (!kardiaExtensionWalletEnabled()) {
        Alert.error("Please install the Kardia Extension Wallet to access.", 5000)
    } else {
        try {

            const accounts = await window.web3.eth.getAccounts();
            const cellAmountDel = amount ? cellValue(amount) : 0;
            if (accounts && accounts[0]) {
                const kardiaTransaction = kardiaClient.transaction;

                const _gasPrice = await calGasprice(gasPrice)
                const response = await kardiaTransaction.sendTransactionToExtension({
                    from: accounts[0],
                    gasPrice: _gasPrice,
                    gas: gasLimit,
                    value: cellAmountDel,
                    to: toAddress,
                }, true);
                
                ShowNotify(response);      

            } else {
                Alert.error("Please login Kardia Extension Wallet.", 5000)
            }
        } catch (error) {
            console.error(error);
        }
    }
}

const sendKRC20ByExtension = async (toAddress: string, amount: number, gasPrice: GasMode, gasLimit: number, tokenContract: string, decimal: any) => {
    if (!kardiaExtensionWalletEnabled()) {
        Alert.error("Please install the Kardia Extension Wallet to access.", 5000)
    } else {
        try {
            const accounts = await window.web3.eth.getAccounts();
            const cellAmountDel = amount ? cellValueKRC20(amount, decimal) : 0;
            const kardiaContract = kardiaClient.contract;
            kardiaContract.updateAbi(KRC20_API);
            const data = await kardiaContract.invokeContract("transfer", [toAddress, cellAmountDel]).txData();
            const kardiaTransaction = kardiaClient.transaction;
            const _gasPrice = await calGasprice(gasPrice)
            const response = await kardiaTransaction.sendTransactionToExtension({
                from: accounts[0],
                gasPrice: _gasPrice,
                gas: gasLimit,
                value: 0,
                data: data,
                to: tokenContract,
            }, true);
            ShowNotify(response);
        } catch (error) {
            console.error(error);
        }
    }
}

const deploySMCByEW = async ({ abi, bytecode, params, amount = 0, gasLimit, gasPrice }: {
    abi: any;
    bytecode: any;
    params: any;
    amount?: number;
    gasLimit: number;
    gasPrice: GasMode;
}) => {
    if (!kardiaExtensionWalletEnabled()) {
        Alert.error("Please install the Kardia Extension Wallet to access.", 5000)
    } else {
        try {
            const accounts = await window.web3.eth.getAccounts()
            if (accounts && accounts[0]) {
                const abiJson = typeof abi === 'string' ? JSON.parse(abi) : JSON.parse(JSON.stringify(abi));
                const cellAmountDel = amount ? cellValue(amount) : 0;

                const kardiaContract = kardiaClient.contract;
                kardiaContract.updateAbi(abiJson);
                kardiaContract.updateByteCode(bytecode);
                const txData = kardiaContract.deploy({ params }).txData();
                const kardiaTransaction = kardiaClient.transaction;
                const _gasPrice = await calGasprice(gasPrice)
                const response = await kardiaTransaction.sendTransactionToExtension({
                    from: accounts[0],
                    gasPrice: _gasPrice,
                    gas: gasLimit,
                    value: cellAmountDel,
                    data: txData,
                }, true);

                ShowNotify(response);     
                return response


            } else {
                Alert.error("Please login Kardia Extension Wallet.", 5000)
            }
        } catch (error) {
            console.error(error);
        }
    }

}

const invokeSMCByEW = async ({ abi, smcAddr, methodName, params, amount = 0, gasLimit = gasLimitDefault, gasPrice = GasMode.NORMAL }: {
    abi: any;
    smcAddr: string;
    methodName: string;
    params: any[];
    amount?: number;
    gasLimit?: number;
    gasPrice?: GasMode;
}) => {
    if (!kardiaExtensionWalletEnabled()) {
        Alert.error("Please install the Kardia Extension Wallet to access.", 5000)
    } else {
        try {
            const accounts = await window.web3.eth.getAccounts()
            if (accounts && accounts[0]) {

                const abiJson = typeof abi === 'string' ? JSON.parse(abi) : JSON.parse(JSON.stringify(abi));
                const cellAmountDel = amount ? cellValue(amount) : 0;

                const kardiaContract = kardiaClient.contract;
                const kardiaTransaction = kardiaClient.transaction;
                kardiaContract.updateAbi(abiJson);

                const txData = kardiaContract.invokeContract(methodName, params).txData();

                const _gasPrice = await calGasprice(gasPrice)
                const response = await kardiaTransaction.sendTransactionToExtension({
                    from: accounts[0],
                    gasPrice: _gasPrice,
                    gas: gasLimit,
                    value: cellAmountDel,
                    data: txData,
                    to: smcAddr
                }, true);

                ShowNotify(response);      

            } else {
                Alert.error("Please login Kardia Extension Wallet.", 5000)
            }
        } catch (error) {
            console.error(error);
        }
    }
}

// Delegate interact with Kai Extenstion Wallet
const delegateByEW = async (smcAddr: string, amount: number, gasPrice: GasMode, gasLimit: number) => {
    try {
        await invokeSMCByEW({
            abi: VALIDATOR_ABI,
            smcAddr: smcAddr,
            methodName: 'delegate',
            params: [],
            amount: amount,
            gasLimit: gasLimit,
            gasPrice: gasPrice
        })
    } catch (error) {
        throw error
    }
}

// Create validator interact with Kai Extension Wallet
const createValidatorByEW = async (params: CreateValParams, gasLimit: number, gasPrice: GasMode) => {
    // convert value percent type to decimal type
    const commissionRateDec = cellValue(params.commissionRate / 100);
    const maxRateDec = cellValue(params.maxRate / 100);
    const maxRateChangeDec = cellValue(params.maxChangeRate / 100);
    // Convert validator name to bytes
    const valName = KardiaUtils.bytes.fromAscii(params.valName);
    const delAmountDec = Number(params.yourDelegationAmount);
    await invokeSMCByEW({
        abi: STAKING_ABI,
        smcAddr: STAKING_SMC_ADDRESS,
        methodName: 'createValidator',
        params: [valName, commissionRateDec, maxRateDec, maxRateChangeDec],
        amount: delAmountDec,
        gasLimit: gasLimit,
        gasPrice: gasPrice
    })
}

const updateValidatorNameByEW = async (smcAddr: string, name: string, amountFee: number, gasLimit: number, gasPrice: GasMode) => {
    // Convert new validator name to bytes
    const valName = KardiaUtils.bytes.fromAscii(name);
    await invokeSMCByEW({
        abi: VALIDATOR_ABI,
        smcAddr: smcAddr,
        methodName: 'updateName',
        params: [valName],
        amount: amountFee,
        gasLimit: gasLimit,
        gasPrice: gasPrice
    })
}

const updateValidatorCommissionByEW = async (smcAddr: string, newCommissionRate: number, gasLimit: number, gasPrice: GasMode) => {
        // convert value percent type to decimal type
    const newCommissionRateDec = cellValue(newCommissionRate / 100);
    await invokeSMCByEW({
        abi: VALIDATOR_ABI,
        smcAddr: smcAddr,
        methodName: 'updateCommissionRate',
        params: [newCommissionRateDec],
        gasLimit: gasLimit,
        gasPrice: gasPrice
    })
}

const startValidatorByEW = async (smcAddr: string) => {
    await invokeSMCByEW({
        abi: VALIDATOR_ABI,
        smcAddr: smcAddr,
        methodName: 'start',
        params: []
    })
}


const withdrawCommissionByEW = async (smcAddr: string) => {
    await invokeSMCByEW({
        abi: VALIDATOR_ABI,
        smcAddr: smcAddr,
        methodName: 'withdrawCommission',
        params: []
    })
}

const withdrawRewardByEW = async (smcAddr: string) => {
    await invokeSMCByEW({
        abi: VALIDATOR_ABI,
        smcAddr: smcAddr,
        methodName: 'withdrawRewards',
        params: []
    })
}

const withdrawDelegatedAmountByEW = async (smcAddr: string) => {
    await invokeSMCByEW({
        abi: VALIDATOR_ABI,
        smcAddr: smcAddr,
        methodName: 'withdraw',
        params: []
    })
}

const undelegateWithAmountByEW = async (smcAddr: string, amountUndel: number) => {
    // convert value number type to decimal type
    const amountUndelDec = cellValue(amountUndel);
    await invokeSMCByEW({
        abi: VALIDATOR_ABI,
        smcAddr: smcAddr,
        methodName: 'undelegateWithAmount',
        params: [amountUndelDec]
    })
}

const undelegateAllByEW = async (smcAddr: string) => {
    await invokeSMCByEW({
        abi: VALIDATOR_ABI,
        smcAddr: smcAddr,
        methodName: 'undelegate',
        params: []
    })
}

const unjailValidatorByEW = async (smcAddr: string) => {
    await invokeSMCByEW({
        abi: VALIDATOR_ABI,
        smcAddr: smcAddr,
        methodName: 'unjail',
        params: []
    })
}

const createProposalByEW = async (paramsKey: any[], paramsValue: any[]) => {
    await invokeSMCByEW({
        abi: PROPOSAL_ABI,
        smcAddr: PROPOSAL_SMC_ADDRESS,
        methodName: 'addProposal',
        params: [paramsKey, paramsValue],
        amount: 500000
    })
}

const proposalVotingByEW = async (proposalId: number, voteOption: number) => {
    await invokeSMCByEW({
        abi: PROPOSAL_ABI,
        smcAddr: PROPOSAL_SMC_ADDRESS,
        methodName: 'addVote',
        params: [proposalId, voteOption]
    })
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
    unjailValidatorByEW,
    deploySMCByEW,
    invokeSMCByEW,
    createProposalByEW,
    proposalVotingByEW,
    sendKRC20ByExtension
}