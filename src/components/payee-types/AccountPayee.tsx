import { Account } from '../../types/Payee';
import BsbSearch from '../BsbSearch';

interface SetAccount {
    (source: Account): void;
}

interface ChildPropsType {
    setAccount: SetAccount;
    account?: Account;
    editable?: boolean;
}

// eslint-disable-next-line
const AccountPayee = ({
    setAccount,
    account,
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
                        type="text"
                        autoComplete={field}
                        placeholder={label}
                        defaultValue={
                            account ? account[field as keyof Account] : ''
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        onBlur={(
                            evt: React.ChangeEvent<
                                HTMLInputElement | HTMLSelectElement
                            >,
                        ) => {
                            const obj: any = {};
                            obj[field as keyof Account] = evt.target.value;
                            setAccount({ ...account, ...obj });
                        }}
                    />
                ) : (
                    <label className="w-full bg-white">
                        {account ? account[field as keyof Account] : ''}
                    </label>
                )}
            </div>
        );
    };

    const EditableBSB = ({
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
                    <BsbSearch
                        id={field}
                        autoComplete={field}
                        placeholder={label}
                        defaultValue={
                            account ? account[field as keyof Account] : ''
                        }
                        onBSBSelected={(bsb: string) => {
                            const obj: any = {};
                            obj[field as keyof Account] = bsb;
                            setAccount({ ...account, ...obj });
                        }}
                    />
                ) : (
                    <label className="w-full bg-white">
                        {account ? account[field as keyof Account] : ''}
                    </label>
                )}
            </div>
        );
    };

    return (
        <>
            <EditableBSB field="bsb" label="BSB" />
            <EditableField field="accountNumber" label="Account Number" />
            <EditableField field="accountName" label="Account Name" />
        </>
    );
};

export default AccountPayee;
