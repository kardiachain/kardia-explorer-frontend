import KardiaTool from 'kardia-tool';

const RPC_ENDPOINT = 'http://10.10.0.251:8545';

const kardiaTool = KardiaTool(RPC_ENDPOINT);
const kardiaApi = kardiaTool.api;
const kardiaCommon = kardiaTool.common;
const kardiaContract = kardiaTool.contract;
const kardiaProvider = kardiaTool.provider;

export {
  kardiaTool,
  kardiaApi,
  kardiaCommon,
  kardiaContract,
  kardiaProvider
};
