import { PayeeData } from '../types/Payee';

const editPayee = async (payee: PayeeData) => {
    const formater = {
        data: payee,
    };
    const res: Response = await fetch(
        process.env.REACT_APP_BASE_URL + 'payees/' + payee.payeeId,
        {
            method: 'PUT',
            body: JSON.stringify(formater),
        },
    );
    return res;
};

export default editPayee;
