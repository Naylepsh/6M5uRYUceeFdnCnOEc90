import React from "react";
import LoggedIn from "./states/LoggedIn";
import LoggedOut from "./states/LoggedOut";
import { AppStateProvider } from "./states/AppState";
import appReducer, { initialState } from "./states/app-reducer";
import useAuth from "./states/use-auth";
import "./App.css";

function App() {
  const { authAttempted, auth } = useAuth();
  if (!authAttempted) return null;
  return <div className="Layout">{auth ? <LoggedIn /> : <LoggedOut />}</div>;
}

export default () => (
  <AppStateProvider reducer={appReducer} initialState={initialState}>
    <App />
  </AppStateProvider>
);
