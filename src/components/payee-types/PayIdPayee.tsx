import { ChangeEventHandler } from 'react';
import { DigitalWallet } from '../../types/Payee';

interface SetPayId {
    (source: DigitalWallet): void
}


interface ChildPropsType {
    setPayId: SetPayId,
    payid?: DigitalWallet,
    editable?: boolean
}

// eslint-disable-next-line
const PayIdPayee = ({ setPayId, payid = { identifier: '', type: '' }, editable = false }: ChildPropsType): JSX.Element => {
    const updatePayId = (field: string, value: string) => {
        let obj: any = {};
        obj[field] = value;
        setPayId({ ...payid, ...obj });
    };

    const EditableField = ({ field, label }: { field: string, label: string }): JSX.Element => {
        return (<div className="mb-3">
            <label htmlFor={field} className="sr-only">
                {label}
            </label>

            {editable ?
                <input
                    id={field}
                    type={field}
                    autoComplete={field}
                    placeholder={payid ? payid[field as keyof DigitalWallet] : ""}
                    defaultValue={payid ? payid[field as keyof DigitalWallet] : ""}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    onBlur={(evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                        let obj: any = {};
                        obj[field as keyof DigitalWallet] = evt.target.value;
                        setPayId({ ...payid, ...obj });
                    }} /> : <label className="w-full bg-white">{payid ? payid[field as keyof DigitalWallet] : ""}</label>}
        </div>);
    };

    const EditableSelect = ({children, field, label}: {children:any, field: string, label: string}): JSX.Element => {
        return (<div className="mb-3">
            <label htmlFor={field} className="sr-only">
                {label}
            </label>

            {editable ?
                <select id={field} value={payid ? payid[field as keyof DigitalWallet] : ""} onChange={(evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                    let obj: any = {};
                    obj[field as keyof DigitalWallet] = evt.target.value;
                    setPayId({ ...payid, ...obj });
                }}>
                    {children}
                </select> : <label className="w-full bg-white">{payid ? payid[field as keyof DigitalWallet] : ""}</label>}
        </div>);
    };

    return (
        <>
            <EditableSelect field="type" label="Type">
                <option value="email">Email</option>
                <option value="phone">Phone Number</option></EditableSelect>
            <EditableField field='identifier' label="Identifier" />
        </>
    );
}

export default PayIdPayee;