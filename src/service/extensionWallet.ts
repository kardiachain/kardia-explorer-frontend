import Web3 from 'web3';

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



export {
    kardiaExtensionWalletEnabled
}