import { atom } from "recoil";

const walletState = atom({
    key: 'walletState',
    default: {} as WalletStore
})

export default walletState