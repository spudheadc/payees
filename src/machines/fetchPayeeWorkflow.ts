import { AnyEventObject, assign } from 'xstate';
import getPayee from '../api/getPayee';
import editPayee from '../api/editPayee';
import { redirect } from 'react-router';
import { IContext, PayeeEventData } from '.';
import { PayeeData } from '../types/Payee';

const getOnePayee = (context: IContext, event: PayeeEventData) =>
    new Promise(async (resolve, reject) => {
        if(!context.selected)
            reject("No selected payee");
        let result: Response = await getPayee(context.selected as PayeeData);
        if (result.status === 200) {
            resolve(result.json());
        } else {
            reject(result);
        }
    });

const editOnePayee = (context: IContext, event: PayeeEventData) =>
    new Promise(async (resolve, reject) => {
        if(!context.selected)
            reject("No selected payee");
        let result = await editPayee(context.selected as PayeeData);
        if (result.status === 200) {
            resolve(result.json());
        } else {
            reject(result);
        }
    });

export const fetchOnePayeeMachine = {
    initial: 'start',
    states: {
        start: {},
        fetching: {
            invoke: {
                id: 'getOnePayee',
                src: getOnePayee,
                onDone: {
                    target: 'success',
                    actions: assign({ selected: (_context: IContext, event: PayeeEventData) => event.data.data.payee }),
                },
                onError: {
                    target: 'failed',
                    actions: assign({ error: (_context: IContext, event: PayeeEventData) => event.data }),
                },
            },
        },
        editing: {
            invoke: {
                id: 'editOnePayee',
                src: editOnePayee,
                onDone: {
                    target: '..list.loading',
                    actions:['navigateToHome'],
                },
                onError: {
                    target: 'failed',
                    actions: assign({ error: (_context: IContext, event: PayeeEventData) => event.data }),
                },
            },
        },
        success: {
            entry:'navigateToEdit'
        },
        failed: {},
        updated: {},
    },
};