// CentralPropsContext.js
import React, { createContext, useContext } from 'react';
import { useAppState } from './centralprops';

const CentralPropsContext = createContext();

export const CentralPropsProvider = ({ children }) => {
  const appState = useAppState();

  return (
    <CentralPropsContext.Provider value={appState}>
      {children}
    </CentralPropsContext.Provider>
  );
};

export const useCentralProps = () => useContext(CentralPropsContext);
