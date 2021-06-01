import { GasMode } from '../../enum';

export * from './HelperMessage'
export * from './Message'


export const gasPriceOption = [
    { label: 'Slow', value: GasMode.SLOW },
    { label: 'Normal', value: GasMode.NORMAL },
    { label: 'Fast', value: GasMode.FAST },
];

export const colors = [
    '#F63528',
    '#FF8433',
    '#FFD633',
    '#2CC94B',
    '#00C4F5',
    '#591FFF',
    '#A51FFF',
    '#863232',
    '#ae0001',
    '#b6191a',
    '#be3233',
    '#c64c4d',
    '#ce6666',
    '#d67f80',
    '#de9999',
    '#8f3233',
    '#9a4647',
    '#a55a5b',
    '#F63528',
    '#FF8433',
    '#FFD633',
    '#2CC94B',
    '#00C4F5',
    '#591FFF',
    '#A51FFF',
    '#863232',
    '#ae0001',
    '#b6191a',
    '#be3233',
    '#c64c4d'
]

export const gasLimitDefault = 3000000
export const gasLimitSendTx = 29000
export const gasLimitSendTxKRC20 = 100000
export const MIN_DELEGATION_AMOUNT = 1000
export const MIN_SELF_DELEGATION = 25000
export const MIN_STAKED_AMOUNT_START_VALIDATOR = 12500000

export enum SortType {
    ASC = -1,
    DSC = 1
}

export const KRC20 = 'KRC20'


export const UNKNOW_AVARTAR_DEFAULT_BASE64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAlgCWAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCABQAFADAREAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAkI/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/EABYBAQEBAAAAAAAAAAAAAAAAAAAGB//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AMmIpVgKPL1micKCaWAAAo8vWaJwoJpYAACjy9ZonCgmlgAAKPL1micKCaWAAAAo8vWaAAAJwoJpYAAAACjy9ZoAAAnCgmlgAAAAKPL1mgAACcKCaWAAAo8vWaAAJwoJpYCjy9ZoAAnCgmlgKPL1micKCaWAAAAAo8vWaJwoJpYCjy9ZoAAAAAAAnCgmlgAAAAAAAAAAAAAAAAAAAP/Z'

export const UNVERIFY_TOKEN_DEFAULT_BASE64 = 'data:image/png;base64,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'

export const TrueOrFalse = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
]

export const CompilerVersion = [
    {
        label: 'v0.8.4+commit.c7e474f2',
        value: 'v0.8.4+commit.c7e474f2'
    },
    {
        label: 'v0.8.3+commit.8d00100c',
        value: 'v0.8.3+commit.8d00100c'
    },
    {
        label: 'v0.8.2+commit.661d1103',
        value: 'v0.8.2+commit.661d1103'
    },
    {
        label: 'v0.8.1+commit.df193b15',
        value: 'v0.8.1+commit.df193b15'
    },
    {
        label: 'v0.8.0+commit.c7dfd78e',
        value: 'v0.8.0+commit.c7dfd78e'
    },
    {
        label: 'v0.7.6+commit.7338295f',
        value: 'v0.7.6+commit.7338295f'
    },
    {
        label: 'v0.7.5+commit.eb77ed08',
        value: 'v0.7.5+commit.eb77ed08'
    },
    {
        label: 'v0.7.4+commit.3f05b770',
        value: 'v0.7.4+commit.3f05b770'
    },
    {
        label: 'v0.7.3+commit.9bfce1f6',
        value: 'v0.7.3+commit.9bfce1f6'
    },
    {
        label: 'v0.7.2+commit.51b20bc0',
        value: 'v0.7.2+commit.51b20bc0'
    },
    {
        label: 'v0.7.1+commit.f4a555be',
        value: 'v0.7.1+commit.f4a555be'
    },
    {
        label: 'v0.7.0+commit.9e61f92b',
        value: 'v0.7.0+commit.9e61f92b'
    },
    {
        label: 'v0.6.12+commit.27d51765',
        value: 'v0.6.12+commit.27d51765'
    },
    {
        label: 'v0.6.11+commit.5ef660b1',
        value: 'v0.6.11+commit.5ef660b1'
    },
    {
        label: 'v0.6.10+commit.00c0fcaf',
        value: 'v0.6.10+commit.00c0fcaf'
    },
    {
        label: 'v0.6.9+commit.3e3065ac',
        value: 'v0.6.9+commit.3e3065ac'
    },
    {
        label: 'v0.6.8+commit.0bbfe453',
        value: 'v0.6.8+commit.0bbfe453'
    },
    {
        label: "v0.6.7+commit.b8d736ae",
        value: "v0.6.7+commit.b8d736ae"
    },
    { label: "v0.6.6+commit.6c089d02", value: "v0.6.6+commit.6c089d02" },
    { label: "v0.6.5+commit.f956cc89", value: "v0.6.5+commit.f956cc89" },
    { label: "v0.6.4+commit.1dca32f3", value: "v0.6.4+commit.1dca32f3" },
    { label: "v0.6.3+commit.8dda9521", value: "v0.6.3+commit.8dda9521" },
    { label: "v0.6.2+commit.bacdbe57", value: "v0.6.2+commit.bacdbe57" },
    { label: "v0.6.1+commit.e6f7d5a4", value: "v0.6.1+commit.e6f7d5a4" },
    { label: "v0.6.0+commit.26b70077", value: "v0.6.0+commit.26b70077" },
    { label: "v0.5.17+commit.d19bba13", value: "v0.5.17+commit.d19bba13" },
    { label: "v0.5.16+commit.9c3226ce", value: "v0.5.16+commit.9c3226ce" },
    { label: "v0.5.15+commit.6a57276f", value: "v0.5.15+commit.6a57276f" },
    { label: "v0.5.14+commit.01f1aaa4", value: "v0.5.14+commit.01f1aaa4" },
    { label: "v0.5.13+commit.5b0b510c", value: "v0.5.13+commit.5b0b510c" },
    { label: "v0.5.12+commit.7709ece9", value: "v0.5.12+commit.7709ece9" },
    { label: "v0.5.11+commit.22be8592", value: "v0.5.11+commit.22be8592" },
    { label: "v0.5.11+commit.c082d0b4", value: "v0.5.11+commit.c082d0b4" },
    { label: "v0.5.10+commit.5a6ea5b1", value: "v0.5.10+commit.5a6ea5b1" },
    { label: "v0.5.9+commit.c68bc34e", value: "v0.5.9+commit.c68bc34e" },
    { label: "v0.5.9+commit.e560f70d", value: "v0.5.9+commit.e560f70d" },
    { label: "v0.5.8+commit.23d335f2", value: "v0.5.8+commit.23d335f2" },
    { label: "v0.5.7+commit.6da8b019", value: "v0.5.7+commit.6da8b019" },
    { label: "v0.5.6+commit.b259423e", value: "v0.5.6+commit.b259423e" },
    { label: "v0.5.5+commit.47a71e8f", value: "v0.5.5+commit.47a71e8f" },
    { label: "v0.5.4+commit.9549d8ff", value: "v0.5.4+commit.9549d8ff" },
    { label: "v0.5.3+commit.10d17f24", value: "v0.5.3+commit.10d17f24" },
    { label: "v0.5.2+commit.1df8f40c", value: "v0.5.2+commit.1df8f40c" },
    { label: "v0.5.1+commit.c8a2cb62", value: "v0.5.1+commit.c8a2cb62" },
    { label: "v0.5.0+commit.1d4f565a", value: "v0.5.0+commit.1d4f565a" },
    { label: "v0.4.26+commit.4563c3fc", value: "v0.4.26+commit.4563c3fc" },
    { label: "v0.4.25+commit.59dbf8f1", value: "v0.4.25+commit.59dbf8f1" },
    { label: "v0.4.24+commit.e67f0147", value: "v0.4.24+commit.e67f0147" },
    { label: "v0.4.23+commit.124ca40d", value: "v0.4.23+commit.124ca40d" },
    { label: "v0.4.22+commit.4cb486ee", value: "v0.4.22+commit.4cb486ee" },
    { label: "v0.4.21+commit.dfe3193c", value: "v0.4.21+commit.dfe3193c" },
    { label: "v0.4.20+commit.3155dd80", value: "v0.4.20+commit.3155dd80" },
    { label: "v0.4.19+commit.c4cbbb05", value: "v0.4.19+commit.c4cbbb05" },
    { label: "v0.4.18+commit.9cf6e910", value: "v0.4.18+commit.9cf6e910" },
    { label: "v0.4.17+commit.bdeb9e52", value: "v0.4.17+commit.bdeb9e52" },
    { label: "v0.4.16+commit.d7661dd9", value: "v0.4.16+commit.d7661dd9" },
    { label: "v0.4.15+commit.8b45bddb", value: "v0.4.15+commit.8b45bddb" },
    { label: "v0.4.15+commit.bbb8e64f", value: "v0.4.15+commit.bbb8e64f" },
    { label: "v0.4.14+commit.c2215d46", value: "v0.4.14+commit.c2215d46" },
    { label: "v0.4.13+commit.0fb4cb1a", value: "v0.4.13+commit.0fb4cb1a" },
    { label: "v0.4.12+commit.194ff033", value: "v0.4.12+commit.194ff033" },
    { label: "v0.4.11+commit.68ef5810", value: "v0.4.11+commit.68ef5810" },
]