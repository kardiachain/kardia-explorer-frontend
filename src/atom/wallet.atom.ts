import { atom } from "recoil";

const walletState = atom({
    key: 'walletState',
    default: {} as WalletState
})

export default walletState