import { KardiaContract, KardiaUtils } from 'kardia-js-sdk';
import { invokeSendAction } from '.';
import { cellValue } from '../../common';
import { RPC_ENDPOINT } from '../../config';
import PROPOSAL_ABI from '../../resources/smc-compile/proposal-abi.json';

const proposalSmcAddr = '0x910cbd665263306807e5ace0351e4358dc6164d8';

const proposalContract = new KardiaContract({
    provider: RPC_ENDPOINT,
    abi: PROPOSAL_ABI
})

const createNewProposal = async (account: Account, paramsKey: any[], paramsValue: any[], gasLimit: number, gasPrice: number) => {
        const amount =  cellValue(500000);
        return await invokeSendAction(
            proposalContract,
            KardiaUtils.toChecksum(proposalSmcAddr),
            "addProposal",
            [paramsKey, paramsValue],
            account,
            amount,
            gasLimit,
            gasPrice
        );
}

const voting = async (account: Account, proposalId: number, voteOption: number) => {
    return await invokeSendAction(
        proposalContract,
        KardiaUtils.toChecksum(proposalSmcAddr),
        "addVote",
        [proposalId, voteOption],
        account,
        0
    );
}


export {
    createNewProposal,
    voting
}