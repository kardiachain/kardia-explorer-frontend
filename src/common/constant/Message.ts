export const ErrorMessage = {
    Require: 'This field is required.',
    ValueInvalid: 'The value is invalid',
    CommissionRateMoreThanHundred: 'The commission rate value cannot be more than 100%',
    DelBelowMinimum: 'Self-delegated amount is below minimum',
    PrivateKeyInvalid: 'Private Key format is invalid',
    AddressInvalid: 'Address format is invalid',
    AmountNotZero: 'Send amount must be greater than 0',
    BalanceNotEnough: 'Not enough KAI to send',
    NumberInvalid: 'The number format is invalid',
    MaxChangeRateMoreThanMaxRate: 'Commission max change rate can not be more than the max rate',
    CommissionRateMoreThanMaxRate: 'Commission rate cannot be more than the max rate',
    MaxRateMoreThanHundred: 'The commission max rate value cannot be more than 100%',
    MaxChangeRateMoreThanHundred: 'The commission max change rate value cannot be more than 100%',
    MnemonicVerifyIncorrect: 'Mnemonic verify incorrect! Please write it down correctly!',
    MnemonicPhraseInvalid: 'The Mnemonic Phrase is incorrect. Please try again.',
    AbiInvalid: 'The ABI format is invalid',
    CannotSendKAIToYourSelf: 'Cannot send KAI to yourself.',
    FileUploadInvalid: 'The upload file format is invalid.',
    MinSelfDelegationBelowMinimum: 'The minimum self delegation amount is 10M',
    ValueNotMoreThanStakedAmount: 'The value not be more than your staked amount.',
    StakedAmountNotEnough: 'Your stake amount not enough 12.5M KAI to start become validator.',
    BelowMinimumDelegationAmount: 'The minimum delegation amount is 1K KAI',
    CommissionMoreThanMaximunRateRangeChange: 'Change commission cannot be more than the maximum rate range.',
    PassWordNotLongEnough: 'Password not long enough',
    PassCodeNotLongEnough: 'Pass code not long enough',
    ConfirmPasswordNotMatch: 'Confirm pass code don\'t match',
    PasswordIncorrect: 'Incorrect pass code',
    BelowMinimumMinSelfDelegation: 'The minimum delegation amount is 25K KAI',
}

export const NotifiMessage = {
    TransactionSuccess: 'Congratulations! Your transaction has executed successfully.',
    TransactionError: 'Sorry! Your transaction has executed unsuccessfully.'
}

export const InforMessage = {
    DelegationConfirm: 'Carefully verify your stats before confirm delegation',
    SendTxConfirm: 'Carefully verify your transaction before sending the transaction',
    CreateValidatorConfirm: 'Carefully verify your stats before confirm create a validator',
    ClaimRewardConfirm: 'Are you sure you want to withdraw all your rewarded token',
    WithdrawStakedAmountConfirm: 'Are you sure you want to withdraw your staked token',
    ConfirmStartingValidator: 'Are you sure you want to starting to become validator',
    WithdrawCommissionRewardsConfirm: 'Are you sure you want to withdraw all your commission reward tokens',
    StartValidatorCondition: '* Your staked amount must be at least 12.5M KAI to become a validator.',
    CreateProposalCondition: '* Your staked amount must be at least 500K KAI to create proposal.'
}