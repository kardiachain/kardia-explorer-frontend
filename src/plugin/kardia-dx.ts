import { RPC_ENDPOINT } from '../config/api';
import KardiaClient from "kardia-js-sdk";

const kardiaClient = new KardiaClient({
    endpoint: RPC_ENDPOINT,
});

export default kardiaClient;