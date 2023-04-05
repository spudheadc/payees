import { PayeeData } from '../types/Payee';

const getPayee = async (payee: PayeeData) => {
    return await fetch(
        process.env.REACT_APP_BASE_URL + 'payees/' + payee.payeeId,
        {
            method: 'GET',
        },
    );
};

export default getPayee;
