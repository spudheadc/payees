import { createContext } from 'react';
import { AnyEventObject, assign, createMachine } from 'xstate';
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
    /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqDEBlAogQQCUBhACQH0AhLCgbQAYBdRUVAe1gEsAXD1gO2YgAHogAsAJgA0IAJ6IAjADYAHADo6ygMzaduzfIC+B6WlSqANh1hcLrZBA58oGCPzCrHAN1YBrdzC4qWkZBNk4efkERBFEtVS1dRQB2DXk6AFZpOQQk0VUATkLCpPF0+XykpVEjE3QLKxtzOwcnDDAAJ3bWdtVUc2QuADNugFtVAKD6JiQQMO5eARno0VzVTNlEcVFNAvT9UqNjED5WCDhBU1D2ecilxABaRSyHwoKiwvE6RUV5FfEakCmDx8bhXcILKJiKQbBBpfJrBJ6XSGI5AyzWME3RagaLlOiqJLKeSlZ4Ie7EtZ0KlUipJTTieTpUQo2pmdGNZqOKCYiLY4SbTRqQnE9bZRl5ZR0fLKfLpRE6FmAurs1SwACuAGMNXB4DM5rzIQhFOJ4Sl9qKFCUCeJFOljekAWiGqpBsgOOZIDyIXcjSaCXRzaSbelVMl8iokg7DkA */
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