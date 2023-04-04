import { AnyEventObject, assign } from 'xstate';
import deletePayee from '../api/deletePayee';


const removePayee = (context: any) =>
    new Promise(async (resolve, reject) => {
        let result = await deletePayee(context.selected);
        if (result.status === 200) {
            resolve(result);
        } else {
            reject(result);
        }
    });

export const removePayeeMachine = {
    initial: 'start',
    states: {
        start: {},
        deleting: {
            invoke: {
                id: 'removePayee',
                src: removePayee,
                onDone: {
                    target: 'success',
                    actions: assign({ payees: (_context: any, event: AnyEventObject) => event.data }),
                },
                onError: {
                    target: 'failed',
                    actions: assign({ error: (_context: any, event: AnyEventObject) => event.data }),
                },
            },
        },
        success: {},
        failed: {},
    },
};