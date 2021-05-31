import { GasMode } from "../../enum"
import kardiaClient from "../../plugin/kardia-dx"

const getRecomendedGasPrice = async () => {
    const gasPrice = await kardiaClient.kaiChain.getGasPrice()
    return Number(gasPrice)
}

export const calGasprice = async (mode: GasMode)  => {
    try {
        let calculatedGasPrice = await getRecomendedGasPrice();
        if (mode === GasMode.SLOW) {
            const _calculated = Math.ceil(calculatedGasPrice * 0.75)
            calculatedGasPrice = _calculated >= 10**9 ? _calculated : calculatedGasPrice
        } else if (mode === GasMode.FAST) {
            calculatedGasPrice = Math.ceil(calculatedGasPrice * 1.25)
        }
        return calculatedGasPrice.toString()
    } catch (error) {
        return '1000000000'
    }
}