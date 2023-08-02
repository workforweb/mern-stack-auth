import { createContext, useContext } from 'react';
import { useStorage } from '../hooks/useLocalStorage';

const StateContext = createContext({});

export const StateContextProvider = ({ children }) => {
  const [auth, setAuth, clearAuth] = useStorage('token', {});
  const [user, setUser, clearUser] = useStorage('user', {});

  return (
    <StateContext.Provider
      value={{ auth, setAuth, clearAuth, user, setUser, clearUser }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default function useStateContext() {
  const context = useContext(StateContext);

  if (!context)
    throw new Error(
      'useStateContext must be used within a StateContextProvider'
    );

  return context;
}
