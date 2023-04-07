import { DigitalWallet } from '../../types/Payee';

interface SetpayId {
    (source: DigitalWallet): void;
}

interface ChildPropsType {
    setPayId: SetpayId;
    payId?: DigitalWallet;
    editable?: boolean;
}

// eslint-disable-next-line
const payIdPayee = ({
    setPayId,
    payId = { identifier: '', type: '' },
    editable = false,
}: ChildPropsType): JSX.Element => {
    const EditableField = ({
        field,
        label,
    }: {
        field: string;
        label: string;
    }): JSX.Element => {
        return (
            <div className="mb-3">
                <label htmlFor={field} className="sr-only">
                    {label}
                </label>

                {editable ? (
                    <input
                        id={field}
                        type={field}
                        autoComplete={field}
                        placeholder={
                            payId ? payId[field as keyof DigitalWallet] : ''
                        }
                        defaultValue={
                            payId ? payId[field as keyof DigitalWallet] : ''
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        onBlur={(
                            evt: React.ChangeEvent<
                                HTMLInputElement | HTMLSelectElement
                            >,
                        ) => {
                            const obj: any = {};
                            obj[field as keyof DigitalWallet] =
                                evt.target.value;
                            setPayId({ ...payId, ...obj });
                        }}
                    />
                ) : (
                    <label className="w-full bg-white">
                        {payId ? payId[field as keyof DigitalWallet] : ''}
                    </label>
                )}
            </div>
        );
    };

    const EditableSelect = ({
        children,
        field,
        label,
    }: {
        children: any;
        field: string;
        label: string;
    }): JSX.Element => {
        return (
            <div className="mb-3">
                <label htmlFor={field} className="sr-only">
                    {label}
                </label>

                {editable ? (
                    <select
                        id={field}
                        value={payId ? payId[field as keyof DigitalWallet] : ''}
                        onChange={(
                            evt: React.ChangeEvent<
                                HTMLInputElement | HTMLSelectElement
                            >,
                        ) => {
                            const obj: any = {};
                            obj[field as keyof DigitalWallet] =
                                evt.target.value;
                            setPayId({ ...payId, ...obj });
                        }}>
                        {children}
                    </select>
                ) : (
                    <label className="w-full bg-white">
                        {payId ? payId[field as keyof DigitalWallet] : ''}
                    </label>
                )}
            </div>
        );
    };

    return (
        <>
            <EditableSelect field="type" label="Type">
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
            </EditableSelect>
            <EditableField field="identifier" label="Identifier" />
        </>
    );
};

export default payIdPayee;
