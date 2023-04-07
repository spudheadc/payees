import { createContext } from 'react';
import { AnyEventObject, assign, createMachine } from 'xstate';

import addPayee from '../api/addPayee';
import deletePayee from '../api/deletePayee';
import editPayee from '../api/editPayee';
import fetchPayees from '../api/fetchPayees';
import getPayee from '../api/getPayee';
import { PayeeData, PayeesReturn } from '../types/Payee';
import { initialisePayee } from '../utils/PayeeUtils';
import { payeeValidationMachine } from './PayeeValidationMachine';
import { choose, log, raise } from 'xstate/lib/actions';

export const MachineContext = createContext<IContext>({
    payees: [],
    editing: false,
});

const getAllPayees = (): Promise<PayeesReturn> =>
    new Promise<PayeesReturn>((resolve, reject) => {
        fetchPayees()
            .then((result: Response) => {
                if (result.status === 200) {
                    resolve(result.json());
                } else {
                    reject(result);
                }
            })
            .catch(err => reject(err));
    });
const addingPayee = (context: IContext, event: PayeeEventData) =>
    new Promise((resolve, reject) => {
        addPayee(event.selected as PayeeData)
            .then((result: Response) => {
                if (result.status === 200) {
                    resolve(result.json());
                } else {
                    reject(result);
                }
            })
            .catch(err => reject(err));
    });

const getOnePayee = (context: IContext) =>
    new Promise((resolve, reject) => {
        if (!context.selected) reject('No selected payee');
        getPayee(context.selected as PayeeData)
            .then((result: Response) => {
                if (result.status === 200) {
                    resolve(result.json());
                } else {
                    reject(result);
                }
            })
            .catch(err => reject(err));
    });

const editOnePayee = (context: IContext) =>
    new Promise((resolve, reject) => {
        if (!context.selected) reject('No selected payee');
        editPayee(context.selected as PayeeData)
            .then((result: Response) => {
                if (result.status === 200) {
                    resolve(result.json());
                } else {
                    reject(result);
                }
            })
            .catch(err => reject(err));
    });
const removePayee = (context: IContext) =>
    new Promise((resolve, reject) => {
        if (!context.selected) reject('No selected payee');
        deletePayee(context.selected as PayeeData)
            .then((result: Response) => {
                if (result.status === 200) {
                    resolve(result.json());
                } else {
                    reject(result);
                }
            })
            .catch(err => reject(err));
    });

export interface IContext {
    payees: PayeeData[];
    editing: boolean;
    error?: string;
    selected?: PayeeData;
}

export interface PayeeEventData extends AnyEventObject {
    type: string;
    selected?: PayeeData;
}

export const appMachine = createMachine<IContext>(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqDEA5AogdQH0AFAQQE0ccBtABgF1FRUB7WASwBc3mA7RkAB6IAzAEZhAGhABPROICcAOgDsNMcIBM8msvkaAbJoC+RqWkwkAIpeLlKtBkhAt2XXvyEIAtKNHKpsgj6ACyiigCsBjTh+uE0weHhohomZugYljgAMjgAKji2FNT0-C6c3HxOnqIBcsHBNIoa4coAHAnywsohyakg5hgAYnkAwgASBCSF9iVOZW6VoJ5eGgm1CL5xiq1J4a3y4QfNwa19AziWAJK5k9PFjkys5e5ViF5d63qtimraraKtDStGg6M7pADK2RwI3ylgcpSeCw8iGUyjCe0OqPkokO8larXWomC+jBqEUyAgEFQyGkYDg5MpbB4UAwEF4YEUTIAbswANYcikQJlQIg0unwuaIirIhCRMInYT6fQaYSRRLhSQyRDBMSKTQaDQ0WJiWL6eKkhlUsX0wXCjBgABODuYDsUqAANsgOAAzF0AW0twtFtLAEsermlrwQxO+rWEwV08mVNCTymC630ynCiliqLaoRiqotDrAfuYXLA1JDiggYHdYC4zNZ7M5PB5-MUJbLFeD4tm4eei0EKLTigOYh2rRCylWGkJMWzJ3qKeXAL2xdL5cr1prdYbdsdztdHq9vodAa7W97of7zilLyW2uEjU0unxom0+kBc61G2JSn0eQEh2AxYhOC1vQbABjAALdkqzpRRII4WC7TZHgOW5PkORgDgAHkMOvMM7wjB9h2jURGmCDQ-BxfEukBeRCUNZQ9SzGgNDRKdgjxCDoLgjCEI5ZDUKbQ8XTdT0fX9RRcIIsAiNveZI0fCiqJotE9jjNotEJGhWlYpMDOUYRnyBNM+JQgTt2rSByibdDMLbbDFDs-DCOtYjlLIzx8WzcICzaT80xTdZAWzPElWiXxkixSzYPgnc3IPJ0JJPaTz1coV3IUzylPvIdPFCdTaK0hjdN-IyImVJIgI-ZoaFEC13TYWAOEUd1mApNCWywjsRJg69YC8gqZXEXRFBxfSZ1WTpDH0dYVUaKbOKCmJM3aZrWvazrurE1Ljyks8AwGoaRtIwq5C6JQpoMg0eMVRV1k0YRJrUBo9gNXQDGCExTBAHhmFreAnHMBELplFZOnWSImjUcQ-Go1UAV+-7zEtISQYHJEow-fQ9R1LNiXiSIgPTX8gUaQ11HiA0WjiVG0jJQVMctLAwAAd3BwcZVWYICa6AKzQSLR6mezMVHhsQtKJJMLRZ61YEDZluZx1SDG+VF4x1HRATNJ7f2VV6zU6fY4njQ1wnlylWe9ZA2HrCBVZU8ivw0MdhDq7EDLjI0M3kViE1AtQNLNJq0fQTtNwrITnZ8xAaO+AwAuorQcSiJjf3EQFJqAvZipTEyrYjslLxjnda3rRsoDjy6EFApowNT7FIn0Gos547NPdRGLUXaA4N27GzELth3IFrmVlTCE2+ep5IdXneIcwTNEcWSdRGf6SOBsSkMJ9xvE9UOURALxYkNf8X8fcbmIdXEeolRSEukP43eR-44V9-V4kj+xU-2mVF+S+gRkhLxaP8SIRoZz4lOM-HegkkrZU-pKCGUZVj41VH-eQZ9AEGU+LEFQpp6jPhBA0WBTMX5WTfhyWAABXKCUE4BYxIjzKMbd+bz3aCZBIDFyYgMTtsIE6dPop3DhQ+Bw9hL20dl-V2RJJqrC4fGDU+ZCSbBzFxbBJplSb3Ri1Nqsjqgn1YvpOMmZ4hSx-CA6iOY4haHjIqFUD0tptQ6l1IUKsUGsNUskHEPx6LmIaOoKxCcbG4LIeZPGxcKH6PanQhhTDDFyFvhEeibRogZIWhTJI2xujtF8IYAEioXHtVHjIrxatyI4hCKk7SwI4hxCyYEVU3xojGkNF+RIsCTBAA */
        id: 'app',
        initial: 'list',
        states: {
            addpayees: {
                states: {
                    addNew: {
                        entry: [
                            assign({ selected: initialisePayee() }),
                            'navigateToAdd',
                        ],
                        on: {
                            ADD_PAYEE: {
                                target: 'validating',
                            },
                            SELECTED: {
                                actions: 'assignSelected',
                            },
                        },
                    },
                    validating: {
                        invoke: {
                            id: 'payeeValidationMachine',
                            src: payeeValidationMachine,
                            data: {
                                payee: (context: any, _event: any) =>
                                    context.selected,
                                errors: [],
                            },
                            onDone: {
                                actions: choose([
                                    {
                                        cond: (_context, event) => {
                                            console.log(
                                                'Event ' +
                                                    JSON.stringify(event),
                                            );
                                            return (
                                                event.data.errors.length == 0
                                            );
                                        },
                                        actions: raise('ADD_PAYMENT'),
                                    },
                                    {
                                        actions: raise('VALIDATION_ERRORS'),
                                    },
                                ]),
                            },
                        },
                        on: {
                            ADD_PAYMENT: {
                                target: 'adding',
                            },
                            VALIDATION_ERRORS: {
                                target: 'addNew',
                            },
                        },
                    },
                    adding: {
                        entry: log('Invoking add'),
                        invoke: {
                            id: 'addingPayee',
                            src: addingPayee,
                            onDone: {
                                target: '#app.list.loading',
                                actions: ['navigateToHome', 'log'],
                            },
                            onError: {
                                target: 'failed',
                                actions: ['assignError', 'errorLog'],
                            },
                        },
                    },
                    failed: {},
                },
            },
            removepayee: {
                states: {
                    deleting: {
                        invoke: {
                            id: 'removePayee',
                            src: removePayee,
                            onDone: {
                                target: '#app.list.loading',
                                actions: ['navigateToHome', 'log'],
                            },
                            onError: {
                                target: 'failed',
                                actions: ['assignError', 'errorLog'],
                            },
                        },
                    },
                    failed: {},
                },
            },
            fetchonepayee: {
                states: {
                    fetching: {
                        invoke: {
                            id: 'getOnePayee',
                            src: getOnePayee,
                            onDone: {
                                target: 'success',
                                actions: ['assignSelectedPayee', 'log'],
                            },
                            onError: {
                                target: 'failed',
                                actions: ['assignError', 'errorLog'],
                            },
                        },
                    },
                    editing: {
                        invoke: {
                            id: 'editOnePayee',
                            src: editOnePayee,
                            onDone: {
                                target: '#app.list.loading',
                                actions: ['navigateToHome', 'log'],
                            },
                            onError: {
                                target: 'failed',
                                actions: ['assignError', 'errorLog'],
                            },
                        },
                    },
                    success: {
                        entry: 'navigateToEdit',
                        on: {
                            EDIT_A_PAYEE: {
                                target: 'editing',
                                actions: 'assignSelected',
                            },
                            CANCEL: {
                                target: '#app.list.loading',
                                actions: 'navigateToHome',
                            },
                            SELECTED: {
                                actions: 'assignSelected',
                            },
                        },
                    },
                    failed: {},
                },
            },
            list: {
                initial: 'loading',
                states: {
                    loading: {
                        invoke: {
                            id: 'fetchPayees',
                            src: getAllPayees,
                            onDone: {
                                target: 'success',
                                actions: ['assignPayees'],
                            },
                            onError: {
                                target: 'failed',
                                actions: ['assignError', 'errorLog'],
                            },
                        },
                    },
                    success: {
                        on: {
                            NEW_PAYEE: {
                                target: '#app.addpayees.addNew',
                            },
                            DELETE_PAYEE: {
                                target: '#app.removepayee.deleting',
                                actions: 'assignSelected',
                            },
                            FETCH_A_PAYEE: {
                                target: '#app.fetchonepayee.fetching',
                                actions: assign({
                                    selected: (
                                        _ctx: IContext,
                                        evt: PayeeEventData,
                                    ) => evt.selected,
                                    editing: (
                                        _ctx: IContext,
                                        evt: PayeeEventData,
                                    ) => evt.editing,
                                }),
                            },
                        },
                    },
                    failed: {},
                },
            },
        },
    },
    {
        actions: {
            log: (context, event) => console.log(event.data),
            errorLog: (context, event) => console.error(event.data),
            assignSelected: assign({
                selected: (_ctx: IContext, evt: PayeeEventData) => evt.selected,
            }),
            assignError: assign({
                error: (ctx: IContext, event: PayeeEventData) => event.data,
            }),
            assignPayees: assign({
                payees: (ctx: IContext, event) => event.data.data.payees,
            }),
            assignSelectedPayee: assign({
                selected: (_ctx: IContext, event) => event.data.data.payee,
            }),
        },
    },
);
