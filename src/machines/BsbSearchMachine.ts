import { createContext } from 'react';
import { AnyEventObject, assign, createMachine } from 'xstate';
import { addPayeeMachine } from './addPayeeWorkflow';
import { removePayeeMachine } from './removePayeeWorkflow';
import { fetchOnePayeeMachine } from './fetchPayeeWorkflow'

import fetchPayees from '../api/fetchPayees';
import { PayeeData } from '../types/Payee';
import { redirect } from 'react-router';
import { BsbData } from '../types/Bsb';

export const MachineContext = createContext<BSBContext>({
    bsb: "", list: []
}
);

export interface BSBContext {
    bsb: string,
    list: BsbData[];
}


export const bsbSearchMachine = createMachine<BSBContext>({
    id: 'app',
    initial: 'init',
    states: {
        init: {},
        list: {
            states: {
                loading: {
                    entry: assign({ list: [] }),
                    invoke: {
                        id: 'getBSB',
                        src: 'getBSB',
                        onDone: {
                            target: 'success',
                            actions: assign({ list: (_context, event) => event.data.bsbs }),
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
        SEARCH_BSB: {
            target: 'list.loading',
            actions: assign({ bsb: (_ctx: BSBContext, evt: AnyEventObject) => evt.bsbQuery }),
        },
    },
});