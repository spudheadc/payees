import { useContext } from 'react';
import { AppContext } from '../App';
import { AnyStateMachine, InterpreterFrom } from 'xstate';
import { useActor } from '@xstate/react';

function Header() {
    const appActor: InterpreterFrom<AnyStateMachine> = useContext(
        AppContext,
    ) as InterpreterFrom<AnyStateMachine>;
    const [state, send] = useActor(appActor);

    return (
        <>
            <div className="lg:flex lg:items-center lg:justify-between mb-14">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        My Payees
                    </h2>
                </div>
                <div className="mt-5 flex lg:mt-0 lg:ml-4">
                    <span className="sm:ml-3">
                        {state.matches('list.success') && (
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => send('NEW_PAYEE')}>
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
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add A Payee
                            </button>
                        )}
                    </span>
                </div>
            </div>
        </>
    );
}

export default Header;
