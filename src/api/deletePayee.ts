import { PayeeData } from "../types/Payee";


const deletePayee = async (payee:PayeeData):Promise<Response> => {
    const res:Response = await fetch(process.env.REACT_APP_BASE_URL + 'payees/' + payee.payeeId, {
      method: 'DELETE',
    });
    return res;
  };
  
  export default deletePayee;
