const getBsb = async (bsb: string) => {
    const res: Response = await fetch(
        process.env.REACT_APP_BASE_URL + 'refdata/bsb/' + bsb,
        {
            method: 'GET',
        },
    );
    return res;
};

export default getBsb;
