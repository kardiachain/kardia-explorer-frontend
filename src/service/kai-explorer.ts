import { END_POINT } from "./config";

const getTransactions = (page: number, size: number) => {
    // TODO: Integrate API get transactions
    const now = new Date();
    now.setDate(now.getDate() - 1)
    const data = [
        {
            txHash: '0xe7efc4658bb655e0ce77925bc80ff6dcf55e89e8469cb7e3907a6b984b498732',
            from: '0x2BB7316884C7568F2C6A6aDf2908667C0d241A66',
            to: '0x34bb1b8FF9103aCF2dcb5774BaF056139F1f57dc',
            value: 100,
            time: now
        },
        {
            txHash: '0xe7efc4658bb655e0ce77925bc80ff6dcf55e89e8469cb7e3907a6b984b498732',
            from: '0x2BB7316884C7568F2C6A6aDf2908667C0d241A66',
            to: '0x34bb1b8FF9103aCF2dcb5774BaF056139F1f57dc',
            value: 200,
            time: now
        },
        {
            txHash: '0xe7efc4658bb655e0ce77925bc80ff6dcf55e89e8469cb7e3907a6b984b498732',
            from: '0x2BB7316884C7568F2C6A6aDf2908667C0d241A66',
            to: '0x34bb1b8FF9103aCF2dcb5774BaF056139F1f57dc',
            value: 300000,
            time: now
        },
        {
            txHash: '0xe7efc4658bb655e0ce77925bc80ff6dcf55e89e8469cb7e3907a6b984b498732',
            from: '0x2BB7316884C7568F2C6A6aDf2908667C0d241A66',
            to: '0x34bb1b8FF9103aCF2dcb5774BaF056139F1f57dc',
            value: 300000,
            time: now
        },
        {
            txHash: '0xe7efc4658bb655e0ce77925bc80ff6dcf55e89e8469cb7e3907a6b984b498732',
            from: '0x2BB7316884C7568F2C6A6aDf2908667C0d241A66',
            to: '0x34bb1b8FF9103aCF2dcb5774BaF056139F1f57dc',
            value: 300000,
            time: now
        }
    ]
    return data;
}

const getBlocks = async (page: number, size: number): Promise<KAIBlock[]> => {
    const requestOptions = {
        method: 'GET'
    };

    const skip = (page - 1) * size
    console.log(`${END_POINT}blocks?skip=${skip}&limit=${size}`)
    const response = await fetch(`${END_POINT}blocks?skip=${skip}&limit=${size}`, requestOptions)
    const responseJSON = await response.json()
    return responseJSON.data.map((o: any) => {
        return {
            blockHash: o.hash,
            blockHeight: o.height,
            transactions: o.numTxs,
            validator: {
                label: 'Validator',
                hash: o.validator
            },
            time: new Date(o.time)
        }
    })
}

export {getTransactions, getBlocks}