import React, { useContext } from 'react';

import { useActor } from '@xstate/react';
import { AnyStateMachine, InterpreterFrom } from 'xstate';
import { AppContext } from '../App';
import { Account, Biller, DigitalWallet, PayeeData } from '../types/Payee';
import AccountPayee from './payee-types/AccountPayee';
import BpayPayee from './payee-types/BpayPayee';
import PayIdPayee from './payee-types/PayIdPayee';

function EditPayee() {
    const appActor: InterpreterFrom<AnyStateMachine> = useContext(
        AppContext,
    ) as InterpreterFrom<AnyStateMachine>;
    const [state, send] = useActor(appActor);

    const editApayee = () => {
        send({
            type: 'EDIT_A_PAYEE',
            selected: state.context.selected,
        });
    };

    const cancel = () => {
        send({
            type: 'CANCEL',
            selected: state.context.selected,
        });
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
                        editable={state.context.editing}
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
                                editable={state.context.editing}
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
                                editable={state.context.editing}
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
                {state.context.editing ? (
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
                ) : (
                    <label className="w-full bg-white">
                        {state.context.selected.nickname
                            ? state.context.selected.nickname
                            : ''}
                    </label>
                )}
                {TypeElement}
            </>
        );
    };

    return (
        <div>
            <div className="flex items-left justify-left">
                <div className="max-w-md w-full">
                    <div>
                        <div
                            onClick={cancel}
                            className="inline-flex rounded-md shadow text-green-600 font-semibold">
                            <svg
                                className="w-6 h-6 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                            </svg>
                            Go back
                        </div>
                        <h4 className="text-left text-2xl font-bold text-gray-500">
                            Fill details to edit payee details.
                        </h4>
                    </div>
                </div>
            </div>
            <section>
                {state.matches('fetchOnePayeeMachine.fetching') && (
                    <>
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
                            className="feather feather-loader animate-spin text-2xl">
                            <line x1="12" y1="2" x2="12" y2="6"></line>
                            <line x1="12" y1="18" x2="12" y2="22"></line>
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
                            <line x1="18" y1="12" x2="22" y2="12"></line>
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
                    </>
                )}
                <div>
                    <form className="mt-10 space-y-6">
                        <input type="hidden" name="remember" value="true" />

                        <PayeeType payee={state.context.selected} />
                        {state.context.editing && (
                            <div className="inline-flex rounded-md shadow">
                                <input
                                    type="button"
                                    value="Edit My Payee"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                                    onClick={editApayee}></input>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
}

export default EditPayee;
