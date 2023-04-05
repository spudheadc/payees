import { Account, Biller, DigitalWallet, PayeeData } from '../types/Payee';

export const initialisePayee = (): PayeeData => {
    return {
        nickname: '',
        description: '',
        type: 'biller',
        creationDate: '',
        payeeUType: 'biller',
        biller: { billerCode: '', crn: '' },
        domestic: undefined,
        digitalWallet: undefined,
        international: undefined,
    };
};

export const convertToBiller = (
    payee: PayeeData | undefined,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
): PayeeData => {
    if (!payee) payee = initialisePayee();

    const biller: Biller = initialiseBiller(payee);
    biller[event.target.id as keyof Biller] = event.target.value;

    return { ...payee };
};

export const convertToType = (
    payee: PayeeData | undefined,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
): PayeeData => {
    if (!payee) payee = initialisePayee();
    switch (event.target.value) {
        case 'biller':
            initialiseBiller(payee);
            break;
        case 'payid':
            initialisePayId(payee);
            break;
        case 'account':
            initialiseAccount(payee);
            break;
    }

    return { ...payee };
};

export const convertToBsbAccount = (
    payee: PayeeData | undefined,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
): PayeeData => {
    if (!payee) payee = initialisePayee();
    const account: Account = initialiseAccount(payee);
    account[event.target.id as keyof Account] = event.target.value;

    return { ...payee };
};

export const convertToPayId = (
    payee: PayeeData | undefined,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
): PayeeData => {
    if (!payee) payee = initialisePayee();
    const payId: DigitalWallet = initialisePayId(payee);
    payId[event.target.id as keyof DigitalWallet] = event.target.value;

    return { ...payee };
};

function initialiseBiller(payee: PayeeData) {
    payee.type = 'biller';
    payee.payeeUType = 'biller';
    if (!payee.biller) payee.biller = { billerCode: '', crn: '' };
    payee.domestic = undefined;
    payee.international = undefined;
    return payee.biller;
}

function initialisePayId(payee: PayeeData): DigitalWallet {
    payee.type = 'domestic';
    payee.payeeUType = 'domestic';
    if (!payee.domestic) payee.domestic = { payeeAccountUType: '' };
    payee.biller = undefined;
    payee.international = undefined;
    payee.domestic.payeeAccountUType = 'payid';
    payee.domestic.account = undefined;
    payee.domestic.card = undefined;
    if (!payee.domestic.payId)
        payee.domestic.payId = { identifier: '', type: 'email' };
    return payee.domestic.payId;
}

function initialiseAccount(payee: PayeeData): Account {
    payee.type = 'domestic';
    payee.payeeUType = 'domestic';
    if (!payee.domestic) payee.domestic = { payeeAccountUType: '' };
    payee.biller = undefined;
    payee.international = undefined;
    payee.domestic.payeeAccountUType = 'account';
    payee.domestic.payId = undefined;
    payee.domestic.card = undefined;
    if (!payee.domestic.account)
        payee.domestic.account = {
            accountName: '',
            bsb: '',
            accountNumber: '',
        };
    return payee.domestic.account;
}
