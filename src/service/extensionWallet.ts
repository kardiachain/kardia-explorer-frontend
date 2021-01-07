import Web3 from 'web3';

const kardiaExtensionWalletEnabled = () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        if (window.ethereum.isKaiWallet) {
            window.ethereum.enable();
            return true;
        }
    }
    return false;
}



export {
    kardiaExtensionWalletEnabled
}