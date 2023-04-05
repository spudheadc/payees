import { Biller } from '../../types/Payee';

interface SetBiller {
    (source: Biller): void;
}

interface ChildPropsType {
    setBiller: SetBiller;
    biller?: Biller;
    editable?: boolean;
}

// eslint-disable-next-line
const BpayPayee = ({
    setBiller,
    biller,
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
                            biller ? biller[field as keyof Biller] : ''
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        onBlur={(
                            evt: React.ChangeEvent<
                                HTMLInputElement | HTMLSelectElement
                            >,
                        ) => {
                            const obj: any = {};
                            obj[field as keyof Biller] = evt.target.value;
                            setBiller({ ...biller, ...obj });
                        }}
                    />
                ) : (
                    <label className="w-full bg-white">
                        {biller ? biller[field as keyof Biller] : ''}
                    </label>
                )}
            </div>
        );
    };

    const NonEditableField = ({
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
                <label className="w-full bg-white">
                    {biller ? biller[field as keyof Biller] : ''}
                </label>
            </div>
        );
    };

    return (
        <>
            <EditableField field="billerCode" label="Biller Code" />
            <EditableField field="crn" label="Reference Number" />
            <NonEditableField field="billerName" label="Biller Name" />
        </>
    );
};

export default BpayPayee;
