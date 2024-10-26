"use client";
import React, { createContext, useContext } from 'react';
import { useUser } from '@/hooks/useUser';
import { deleteChunks } from '@supabase/ssr';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user, setUser, loading, getUserData, deleteUserPhoto } = useUser();

  return (
    <UserContext.Provider value={{ user, setUser, loading, getUserData, deleteUserPhoto }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}