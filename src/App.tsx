import { useInterpret } from '@xstate/react';
import {
    JSXElementConstructor,
    ReactElement,
    ReactFragment,
    ReactPortal,
    createContext,
} from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { AnyStateMachine, InterpreterFrom } from 'xstate';
import './App.css';
import AddPayee from './components/AddPayee';
import EditPayee from './components/EditPayee';
import Header from './components/Header';
import Payeelist from './components/PayeeList';
import { IContext, appMachine } from './machines';

export const AppContext = createContext({});

function App() {
    const AppContextProvider = (props: {
        children:
            | string
            | number
            | boolean
            | ReactElement<any, string | JSXElementConstructor<any>>
            | ReactFragment
            | ReactPortal
            | null
            | undefined;
    }) => {
        const navigate = useNavigate();
        const authActor: InterpreterFrom<AnyStateMachine> = useInterpret(
            appMachine,
            {
                actions: {
                    navigateToHome: () => navigate('/'),
                    navigateToEdit: (context: IContext) =>
                        navigate('/editpayee/' + context.selected?.payeeId),
                    navigateToAdd: () => navigate('/addpayee'),
                },
            },
        );
        return (
            <AppContext.Provider value={authActor}>
                {props.children}
            </AppContext.Provider>
        );
    };

    return (
        <div className="App m-auto p-8 md:w-3/4">
            <BrowserRouter>
                <AppContextProvider>
                    <Header />
                    <Routes>
                        <Route path="/" Component={Payeelist} />
                        <Route path="/addpayee" Component={AddPayee} />
                        <Route path="/editpayee/:id" element={<EditPayee />} />
                    </Routes>
                </AppContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
