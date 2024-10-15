"use client";
import React, { createContext, useContext } from 'react';
import { useUser } from '@/hooks/useUser';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user, setUser, loading, getUserData } = useUser();

  return (
    <UserContext.Provider value={{ user, setUser, loading, getUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}