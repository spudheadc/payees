

const fetchPayees = async () => {
    const res = await fetch(process.env.REACT_APP_BASE_URL + 'payees', {
      method: 'GET'
    });
    return res;
  };
  
  export default fetchPayees;