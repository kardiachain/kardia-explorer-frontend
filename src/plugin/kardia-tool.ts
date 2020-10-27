import KardiaTool from 'kardia-tool';
import { RPC_ENDPOINT } from '../config/api';

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
