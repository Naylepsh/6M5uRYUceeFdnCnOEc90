import React, { createContext, useReducer, useContext } from "react";

const Context = createContext();

export function AppStateProvider({ reducer, initialState = {}, children }) {
  const val = useReducer(reducer, initialState);
  return <Context.Provider value={val} children={children} />;
}

export function useAppState() {
  return useContext(Context);
}
