import { useContext, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { PayeeData } from '../types/Payee';
import { Deleteicon } from './DeleteIcon';
import { AnyStateMachine, InterpreterFrom } from 'xstate';
import { useActor } from '@xstate/react';

function Payeelist() {
    const appActor:InterpreterFrom<AnyStateMachine> = useContext(AppContext) as InterpreterFrom<AnyStateMachine>;
    const [state, send] = useActor(appActor);

    const removePayee = (payee: PayeeData) => {
        send({ type: 'DELETE_PAYEE', selected: payee });
    };
    const editPayee = (payee: PayeeData) => {
        send({ type: 'FETCH_A_PAYEE', selected: payee, editing:true});
    };
    const viewPayee = (payee: PayeeData) => {
        send({ type: 'FETCH_A_PAYEE', selected: payee, editing:false});
    };

    const summary = (payee: PayeeData) => {
        switch (payee.payeeUType) {
            case "domestic":
                switch (payee.domestic?.payeeAccountUType) {
                    case "payid":
                        return payee.domestic?.payId?.identifier
                        break;
                    case "account":
                        return payee.domestic?.account?.accountName
                        break;
                    case "card":
                        return payee.domestic?.card?.cardNumber
                        break;
                }
                break;
            case "biller":
                return payee.biller?.billerName
                break;
            case "international":
                return payee.international?.beneficiaryDetails.name
                break;
        }

    }

    return (
        <>
            {state.matches('list.loading') && (
                <span className="w-full">
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
                        className="feather feather-loader animate-spin text-2xl"
                    >
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                </span>
            )}

            <section>
                {state.context.payees && state.context.payees.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 mx-auto mt-8 md:grid-cols-3">
                        {state.context.payees.map((payee: PayeeData) => (
                            <>
                                <div
                                    key={payee.payeeId}
                                    className="shadow-xl p-9 rounded border border-gray-100"
                                >
                                    <div>
                                        <h6 className="font-bold text-xl text-gray-900">
                                            {payee.nickname}
                                        </h6>
                                    </div>
                                    <div className="mt-6 flex mb-6">
                                        <div className="flex-1">
                                            <span className="text-sm text-gray-500">Type</span>
                                            <p className="text-lg pt-2"> {payee.type}</p>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm text-gray-500">Description</span>
                                            <p className="text-lg pt-2"> {payee.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <ul className="flex-row flex">
                                                <li className="mr-4" key="delete">
                                                    <Deleteicon clickDelete={() => removePayee(payee)} />
                                                </li>
                                                <li key="edit" onClick={() => editPayee(payee)}>
                                                    <svg
                                                        className="w-6 h-6"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                                    </svg>
                                                </li>
                                                <li key="view" onClick={() => viewPayee(payee)}>
                                                    <svg
                                                        className="w-6 h-6"
                                                        fill="currentColor"
                                                        viewBox="0 0 25 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M17.56 17.66a8 8 0 01-11.32 0L1.3 12.7a1 1 0 010-1.42l4.95-4.95a8 8 0 0111.32 0l4.95 4.95a1 1 0 010 1.42l-4.95 4.95zm-9.9-1.42a6 6 0 008.48 0L20.38 12l-4.24-4.24a6 6 0 00-8.48 0L3.4 12l4.25 4.24zM11.9 16a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z"></path>
                                                    </svg>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                )}
            </section>

            <div>
                {state.matches('list.failed') && (
                    <span>Data cannot be loaded {state.context.error?.toString()}</span>
                )}
            </div>
            <div>
                {state.matches('removepayeeMachine.deleting') && (
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
                            className="feather feather-loader animate-spin text-2xl"
                        >
                            <line x1="12" y1="2" x2="12" y2="6"></line>
                            <line x1="12" y1="18" x2="12" y2="22"></line>
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                            <line x1="2" y1="12" x2="6" y2="12"></line>
                            <line x1="18" y1="12" x2="22" y2="12"></line>
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                    </span>
                )}
            </div>
            {state.matches('removepayeeMachine.success') && (
                <div className="bg-green-200 px-2 py-2 text-green-800 mt-2 inline-flex">
                    Your payee has been removed!
                </div>
            )}
            {state.matches('removepayeeMachine.failed') && (
                <div className="bg-green-200 px-2 py-2 text-green-800 mt-2 inline-flex">
                    Your payee has not been removed!
                </div>
            )}
        </>
    );
}

export default Payeelist;