import { createContext } from 'react';
import { AnyEventObject, assign, createMachine } from 'xstate';
import { addPayeeMachine } from './addPayeeWorkflow';
import { removePayeeMachine } from './removePayeeWorkflow';
import { fetchOnePayeeMachine } from './fetchPayeeWorkflow'

import fetchPayees from '../api/fetchPayees';
import { PayeeData } from '../types/Payee';
import { redirect } from 'react-router';

export const MachineContext = createContext<IContext>({
    payees: [], editing: false
});

const getAllPayees = (context: any, event: any) =>
    new Promise(async (resolve, reject) => {
        let result:Response = await fetchPayees();
        if (result.status === 200) {
            resolve(result.json());
        } else {
            reject(result);
        }
    });

export interface IContext {
    payees: PayeeData[];
    editing: boolean;
    error?: string;
    selected?: PayeeData;
}

export interface PayeeEventData extends AnyEventObject {
    type:string;
    selected?: PayeeData
}

export const appMachine = createMachine<IContext>({
    id: 'app',
    initial: 'init',
    states: {
        init: {},
        addpayees: {
            ...addPayeeMachine
        },
        removepayee: {
            ...removePayeeMachine
        },
        fetchonepayee: { ...fetchOnePayeeMachine }
        ,
        list: {
            states: {
                loading: {
                    invoke: {
                        id: 'fetchPayees',
                        src: getAllPayees,
                        onDone: {
                            target: 'success',
                            actions: assign({ payees: (_context, event) => event.data.data.payees }),
                        },
                        onError: {
                            target: 'failed',
                            actions: (context, event) => console.log(event.data),
                        },
                    },
                },
                success: {},
                failed: {},
            },
        },
    },
    on: {
        LOAD_PAYEES: {
            target: 'list.loading',
        },
        NEW_PAYEE: {
            target: 'addpayees.addNew',
        },
        ADD_PAYEE: {
            target: 'addpayees.adding',
        },
        DELETE_PAYEE: {
            target: 'removepayee.deleting',
            actions: assign({selected:(_ctx: IContext, evt: PayeeEventData) => evt.selected}),
        },
        FETCH_A_PAYEE: {
            target: 'fetchonepayee.fetching',
            actions: assign({selected:(_ctx: IContext, evt: PayeeEventData) => evt.selected, editing:(_ctx: IContext, evt: PayeeEventData) => evt.editing}),
        },
        EDIT_A_PAYEE: {
            target: 'fetchonepayee.editing',
            actions: assign({selected:(_ctx: IContext, evt: PayeeEventData) => evt.selected}),
        },
        SELECTED: {
            actions: assign({selected: (_context: IContext, event: PayeeEventData) => event.selected}),
        },
    },
});