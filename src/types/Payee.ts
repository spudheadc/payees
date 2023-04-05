export interface PayeesReturn {
    data: PayeeDataArray;
}
export interface PayeeDataArray {
    payees: PayeeData[];
}

export interface PayeeData {
    payeeId?: string;
    nickname: string;
    description: string;
    type: string;
    creationDate: string;
    payeeUType: string;
    biller?: Biller;
    domestic?: Domestic;
    digitalWallet?: DigitalWallet;
    international?: International;
}

export interface Biller {
    billerCode: string;
    crn: string;
    billerName?: string;
}

export interface DigitalWallet {
    name?: string;
    identifier: string;
    type: string;
    provider?: string;
}

export interface Domestic {
    payeeAccountUType: string;
    account?: Account;
    card?: Card;
    payId?: DigitalWallet;
}

export interface Account {
    accountName: string;
    bsb: string;
    accountNumber: string;
}

export interface Card {
    cardNumber: string;
}

export interface International {
    beneficiaryDetails: BeneficiaryDetails;
    bankDetails: BankDetails;
}

export interface BankDetails {
    country: string;
    accountNumber: string;
    bankAddress: BankAddress;
    beneficiaryBankBIC: string;
    fedWireNumber: string;
    sortCode: string;
    chipNumber: string;
    routingNumber: string;
    legalEntityIdentifier: string;
}

export interface BankAddress {
    name: string;
    address: string;
}

export interface BeneficiaryDetails {
    name: string;
    country: string;
    message: string;
}
