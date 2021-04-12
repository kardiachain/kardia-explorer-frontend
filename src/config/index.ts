export const TABLE_CONFIG = {
    page: 1,
    limitDefault: 25,
    pagination: {
        lengthMenu: [
            {
                value: 10,
                label: 10
            },
            {
                value: 25,
                label: 25
            },
            {
                value: 50,
                label: 50
            },
            {
                value: 100,
                label: 100
            }
        ]
    }
}

export const BLOCK_NUMBER_FOR_CAL_TPS = 10;
export const BLOCK_COUNT_FOR_CHART = 11;
export const RECORDS_NUMBER_SHOW_HOMEPAGE = 5;

export * from './api'