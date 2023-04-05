import { useActor } from '@xstate/react';
import React, { useContext } from 'react';
import { AnyStateMachine, InterpreterFrom } from 'xstate';
import { AppContext } from '../App';
import { Account, Biller, DigitalWallet, PayeeData } from '../types/Payee';
import { convertToType } from '../utils/PayeeUtils';
import AccountPayee from './payee-types/AccountPayee';
import BpayPayee from './payee-types/BpayPayee';
import PayIdPayee from './payee-types/PayIdPayee';

// eslint-disable-next-line
function AddPayee({}) {
    const appActor: InterpreterFrom<AnyStateMachine> = useContext(
        AppContext,
    ) as InterpreterFrom<AnyStateMachine>;
    const [state, send] = useActor(appActor);

    const addPayee = async () => {
        send({
            type: 'ADD_PAYEE',
            selected: state.context.selected,
        });
    };

    const getSelectType = (payee: PayeeData): string => {
        switch (payee.payeeUType) {
            case 'biller':
                return 'biller';
            case 'domestic':
                switch (payee.domestic?.payeeAccountUType) {
                    case 'payid':
                        return 'payid';
                    case 'account':
                        return 'account';
                }
        }
        return 'biller';
    };

    const PayeeType = ({
        payee,
    }: {
        payee: PayeeData | undefined;
    }): JSX.Element => {
        if (!payee) return <></>;

        let TypeElement: JSX.Element = <></>;
        switch (payee.payeeUType) {
            case 'biller':
                TypeElement = (
                    <BpayPayee
                        biller={payee.biller}
                        setBiller={(biller: Biller) =>
                            send({
                                type: 'SELECTED',
                                selected: { ...payee, biller: { ...biller } },
                            })
                        }
                        editable={true}
                    />
                );
                break;
            case 'domestic':
                switch (payee.domestic?.payeeAccountUType) {
                    case 'payid':
                        TypeElement = (
                            <PayIdPayee
                                payid={payee.domestic.payId}
                                setPayId={(payId: DigitalWallet) =>
                                    send({
                                        type: 'SELECTED',
                                        selected: {
                                            ...payee,
                                            domestic: {
                                                payeeAccountUType: 'payid',
                                                payId: { ...payId },
                                            },
                                        },
                                    })
                                }
                                editable={true}
                            />
                        );
                        break;
                    case 'account':
                        TypeElement = (
                            <AccountPayee
                                account={payee.domestic.account}
                                setAccount={(account: Account) =>
                                    send({
                                        type: 'SELECTED',
                                        selected: {
                                            ...payee,
                                            domestic: {
                                                payeeAccountUType: 'account',
                                                account: { ...account },
                                            },
                                        },
                                    })
                                }
                                editable={true}
                            />
                        );
                        break;
                }
        }
        return (
            <>
                <label htmlFor="nickname" className="sr-only">
                    nickname
                </label>

                <input
                    id="nickname"
                    type="text"
                    autoComplete="nickname"
                    placeholder={state.context.selected.nickname}
                    defaultValue={
                        state.context.selected.nickname
                            ? state.context.selected.nickname
                            : ''
                    }
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    onBlur={(
                        evt: React.ChangeEvent<
                            HTMLInputElement | HTMLSelectElement
                        >,
                    ) => {
                        const obj: any = {};
                        obj.nickname = evt.target.value;
                        send({
                            type: 'SELECTED',
                            selected: { ...payee, ...obj },
                        });
                    }}
                />
                {TypeElement}
            </>
        );
    };

    return (
        <div>
            <div className="flex items-left justify-left">
                <div className="max-w-md w-full">
                    <div>
                        <h4 className="text-left text-2xl font-bold text-gray-500">
                            Fill details to add a payee.
                        </h4>
                    </div>
                    <form className="mt-10 space-y-6">
                        <input type="hidden" name="remember" value="true" />

                        <div>
                            <select
                                id="type"
                                value={getSelectType(state.context.selected)}
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>,
                                ) =>
                                    send({
                                        type: 'SELECTED',
                                        selected: convertToType(
                                            state.context.selected,
                                            event,
                                        ),
                                    })
                                }>
                                <option value="biller">BPAY</option>
                                <option value="account">BSB/Account</option>
                                <option value="payid">Pay Id</option>
                            </select>
                        </div>
                        <PayeeType payee={state.context.selected} />

                        <div className="inline-flex rounded-md shadow">
                            <input
                                type="button"
                                value="Add Payee"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                                onClick={addPayee}></input>
                        </div>

                        {state.matches('addpayeeMachine.adding') && (
                            <span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-loader">
                                    <line x1="12" y1="2" x2="12" y2="6"></line>
                                    <line
                                        x1="12"
                                        y1="18"
                                        x2="12"
                                        y2="22"></line>
                                    <line
                                        x1="4.93"
                                        y1="4.93"
                                        x2="7.76"
                                        y2="7.76"></line>
                                    <line
                                        x1="16.24"
                                        y1="16.24"
                                        x2="19.07"
                                        y2="19.07"></line>
                                    <line x1="2" y1="12" x2="6" y2="12"></line>
                                    <line
                                        x1="18"
                                        y1="12"
                                        x2="22"
                                        y2="12"></line>
                                    <line
                                        x1="4.93"
                                        y1="19.07"
                                        x2="7.76"
                                        y2="16.24"></line>
                                    <line
                                        x1="16.24"
                                        y1="7.76"
                                        x2="19.07"
                                        y2="4.93"></line>
                                </svg>
                            </span>
                        )}
                    </form>
                </div>
            </div>
            {state.matches('addpayeeMachine.success') && (
                <div className="bg-green-200 px-2 py-2 text-green-800 mt-2 inline-flex">
                    Your payee has been added!
                </div>
            )}
            {state.matches('addpayeeMachine.failed') && (
                <div className="bg-red-200 px-2 py-2 text-red-800 mt-2 inline-flex">
                    Sorry we cannot add new payee!
                </div>
            )}
        </div>
    );
}

export default AddPayee;
