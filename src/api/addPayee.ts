import { PayeeData } from "../types/Payee";


const addPayee = async (payee:PayeeData) => {
    const formater = {
      data: payee
    };
    const res:Response = await fetch(process.env.REACT_APP_BASE_URL + 'payees', {
      method: 'POST',
      body: JSON.stringify(formater),
    });
    return res;
  };
  
  export default addPayee;

