import React, { createContext, useContext } from 'react';
import { useUser } from '@/hooks/useUser';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user, loading } = useUser();

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}