import { Alert } from 'rsuite';
import Web3 from 'web3';
import STAKING_ABI from '../resources/smc-compile/staking-abi.json'
import VALIDATOR_ABI from '../resources/smc-compile/validator-abi.json';
import KRC20_API from '../resources/smc-compile/krc20-abi.json'
import { fromAscii } from 'kardia-tool/lib/common/lib/bytes';
import { STAKING_SMC_ADDRESS, PROPOSAL_SMC_ADDRESS } from '../config/api';
import { gasLimitDefault, cellValue, cellValueKRC20, NotificationSuccess, NotifiMessage } from '../common';
import { kardiaContract, kardiaProvider } from '../plugin/kardia-tool';
import PROPOSAL_ABI from '../resources/smc-compile/proposal-abi.json';
import kardiaClient from '../plugin/kardia-dx';

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
        try {

            const accounts = await window.web3.eth.getAccounts();
            const cellAmountDel = amount ? cellValue(amount) : 0;
            if (accounts && accounts[0]) {
            const kardiaTransaction = kardiaClient.transaction;

            const txHash =  await kardiaTransaction.sendTransactionToExtension({
                from: accounts[0],
                gasPrice: gasPrice,
                gas: gasLimit,
                value: cellAmountDel,
                to: toAddress,
               });

            return txHash;

            } else {
                Alert.error("Please login Kardia Extension Wallet.", 5000)
            }
        } catch (error) {
            console.error(error);
        }
    }
}

const sendKRC20ByExtension = async (toAddress: string, amount: number, gasPrice: number, gasLimit: number, tokenContract: string, decimal: any) => {
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

            const response =  await kardiaTransaction.sendTransactionToExtension({
                from: accounts[0],
                gasPrice: gasPrice,
                gas: gasLimit,
                value: 0,
                data: data,
                to: tokenContract,
               });

            return response;

      
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
    gasPrice: number;
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
               const txData = kardiaContract.deploy({params}).txData();
               const kardiaTransaction = kardiaClient.transaction;
               const response =  await kardiaTransaction.sendTransactionToExtension({
                from: accounts[0],
                gasPrice: gasPrice,
                gas: gasLimit,
                value: cellAmountDel,
                data: txData,
               }, true);

               return response;


            } else {
                Alert.error("Please login Kardia Extension Wallet.", 5000)
            }
        } catch (error) {
            console.error(error);
        }
    }

}

const invokeSMCByEW = async ({ abi, smcAddr, methodName, params, amount = 0, gasLimit = gasLimitDefault, gasPrice = 1 }: {
    abi: any;
    smcAddr: string;
    methodName: string;
    params: any[];
    amount?: number;
    gasLimit?: number;
    gasPrice?: number;
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

                const response =  await kardiaTransaction.sendTransactionToExtension({
                    from: accounts[0],
                    gasPrice: gasPrice,
                    gas: gasLimit,
                    value: cellAmountDel,
                    data: txData,
                    to: smcAddr
                   });

                   NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess,
                    callback: () => { window.open(`/tx/${response}`) },
                    seeTxdetail: true
                    });

            } else {
                Alert.error("Please login Kardia Extension Wallet.", 5000)
            }
        } catch (error) {
            console.error(error);
        }
    }
}

// Delegate interact with Kai Extenstion Wallet
const delegateByEW = async (smcAddr: string, amount: number, gasPrice: number, gasLimit: number) => {
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
const createValidatorByEW = async (params: CreateValParams, gasLimit: number, gasPrice: number) => {
    try {
        // convert value percent type to decimal type
        const commissionRateDec = cellValue(params.commissionRate / 100);
        const maxRateDec = cellValue(params.maxRate / 100);
        const maxRateChangeDec = cellValue(params.maxChangeRate / 100);
        // Convert validator name to bytes
        const valName = fromAscii(params.valName);
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
    } catch (error) {
        throw error
    }
}

const updateValidatorNameByEW = async (smcAddr: string, name: string, amountFee: number, gasLimit: number, gasPrice: number) => {
    try {
        // Convert new validator name to bytes
        const valName = fromAscii(name);
        await invokeSMCByEW({
            abi: VALIDATOR_ABI,
            smcAddr: smcAddr,
            methodName: 'updateName',
            params: [valName],
            amount: amountFee
        })
    } catch (error) {
        throw error
    }
}

const updateValidatorCommissionByEW = async (smcAddr: string, newCommissionRate: number, gasLimit: number, gasPrice: number) => {
    try {
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
    } catch (error) {
        throw error
    }
}

const startValidatorByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW({
            abi: VALIDATOR_ABI,
            smcAddr: smcAddr,
            methodName: 'start',
            params: []
        })
    } catch (error) {
        throw error
    }
}


const withdrawCommissionByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW({
            abi: VALIDATOR_ABI,
            smcAddr: smcAddr,
            methodName: 'withdrawCommission',
            params: []
        })
    } catch (error) {
        throw error
    }
}

const withdrawRewardByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW({
            abi: VALIDATOR_ABI,
            smcAddr: smcAddr,
            methodName: 'withdrawRewards',
            params: []
        })
    } catch (error) {
        throw error
    }
}

const withdrawDelegatedAmountByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW({
            abi: VALIDATOR_ABI,
            smcAddr: smcAddr,
            methodName: 'withdraw',
            params: []
        })
    } catch (error) {
        throw error
    }
}

const undelegateWithAmountByEW = async (smcAddr: string, amountUndel: number) => {
    try {
        // convert value number type to decimal type
        const amountUndelDec = cellValue(amountUndel);
        await invokeSMCByEW({
            abi: VALIDATOR_ABI,
            smcAddr: smcAddr,
            methodName: 'undelegateWithAmount',
            params: [amountUndelDec]
        })
    } catch (error) {
        throw error
    }
}

const undelegateAllByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW({
            abi: VALIDATOR_ABI,
            smcAddr: smcAddr,
            methodName: 'undelegate',
            params: []
        })
    } catch (error) {
        throw error
    }
}

const unjailValidatorByEW = async (smcAddr: string) => {
    try {
        await invokeSMCByEW({
            abi: VALIDATOR_ABI,
            smcAddr: smcAddr,
            methodName: 'unjail',
            params: []
        })
    } catch (error) {
        throw error
    }
}

const createProposalByEW = async (paramsKey: any[], paramsValue: any[]) => {
    try {
        await invokeSMCByEW({
            abi: PROPOSAL_ABI,
            smcAddr: PROPOSAL_SMC_ADDRESS,
            methodName: 'addProposal',
            params: [paramsKey, paramsValue],
            amount: 500000
        })
    } catch (error) {
        throw error
    }
}

const proposalVotingByEW = async (proposalId: number, voteOption: number) => {
    try {
        await invokeSMCByEW({
            abi: PROPOSAL_ABI,
            smcAddr: PROPOSAL_SMC_ADDRESS,
            methodName: 'addVote',
            params: [proposalId, voteOption]
        })
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
    unjailValidatorByEW,
    deploySMCByEW,
    invokeSMCByEW,
    createProposalByEW,
    proposalVotingByEW,
    sendKRC20ByExtension
}