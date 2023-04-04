import { actions, AnyEventObject, assign, EventObject } from 'xstate';
import addPayee from '../api/addPayee';
import { PayeeData } from '../types/Payee';
import { IContext, PayeeEventData } from '.';
import { initialisePayee } from '../utils/PayeeUtils';

const addingPayee = (context: IContext, event: PayeeEventData) =>
  new Promise(async (resolve, reject) => {
    let result = await addPayee(event.selected as PayeeData);
    if (result.status === 200) {
      resolve(result.json());
    } else {
      reject(result);
    }
  });

export const addPayeeMachine = {
  initial: 'addNew',
  states: {
    addNew: {
      entry: [assign({ selected: initialisePayee() }), 'navigateToAdd']
    },
    adding: {
      invoke: {
        id: 'addingPayee',
        src: addingPayee,
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
    success: {},
    failed: {},
  },
};