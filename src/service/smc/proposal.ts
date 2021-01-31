import { invokeSendAction } from '.';
import { cellValue } from '../../common/utils/amount';
import { kardiaContract, kardiaProvider } from '../../plugin/kardia-tool';
import PROPOSAL_ABI from '../../resources/smc-compile/proposal-abi.json';
import { toChecksum } from 'kardia-tool/lib/common/lib/account';

const proposalSmcAddr = '0x910cbd665263306807e5ace0351e4358dc6164d8';

const proposalContract = kardiaContract(kardiaProvider, "", PROPOSAL_ABI);

const createNewProposal = async (account: Account, paramsKey: any[], paramsValue: any[], gasLimit: number, gasPrice: number) => {
    try {
        const amount =  cellValue(500000);
        return await invokeSendAction(
            proposalContract,
            toChecksum(proposalSmcAddr.toLowerCase()),
            "addProposal",
            [paramsKey, paramsValue],
            account,
            amount,
            gasLimit,
            gasPrice
        );
    } catch (error) {
        throw error;
    }
}

const voting = async (account: Account, proposalId: number, voteOption: number) => {
    try {
        return await invokeSendAction(
            proposalContract,
            toChecksum(proposalSmcAddr.toLowerCase()),
            "addVote",
            [proposalId, voteOption],
            account,
            0
        );
    } catch (error) {
        throw error
    }
}


export {
    createNewProposal,
    voting
}