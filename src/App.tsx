import React, { createContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { createActorContext, useInterpret } from '@xstate/react';
import { IContext, appMachine } from './machines';
import { BrowserRouter, Route, Routes, redirect, useNavigate } from 'react-router-dom';
import AddPayee from './components/AddPayee';
import { ActionMeta, ActionObject, ActorRef, AnyStateMachine, BaseActionObject, DoneEvent, EventData, EventObject, InteropSubscribable, Interpreter, InterpreterFrom, NoInfer, Observer, ResolveTypegenMeta, ServiceMap, Spawnable, State, StateConfig, StateMachine, StateSchema, StateValue, Subscription, TypegenDisabled } from 'xstate';
import Header from './components/Header';
import Payeelist from './components/PayeeList';
import EditPayee from './components/EditPayee';
import { StateListener, EventListener, ContextListener, Listener } from 'xstate/lib/interpreter';

export const AppContext = createContext({});



function App() {

  const AppContextProvider = (props: any) => {
    const navigate = useNavigate();
    const authActor: InterpreterFrom<AnyStateMachine> = useInterpret(appMachine, {
      actions: {
        navigateToHome: (context: any, event: any) => navigate("/"),
        navigateToEdit: (context: IContext, event: any) => navigate("/editpayee/" + context.selected?.payeeId),
        navigateToAdd: (context: any, event: any) => navigate("/addpayee")
      }
    });
    return <AppContext.Provider value={authActor}>{props.children}</AppContext.Provider>
  }

  return (
    <div className="App m-auto p-8 md:w-3/4">
      <BrowserRouter>
        <AppContextProvider>
          <Header />
          <Routes>
            <Route path="/" Component={Payeelist} />
            <Route path="/addpayee" Component={AddPayee} />
            <Route path="/editpayee/:id" element = {<EditPayee editable={true}/>}/>
          </Routes>
        </AppContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
