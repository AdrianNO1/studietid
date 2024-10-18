import React from 'react';

interface AuthContextType {
  isAdmin: boolean | null;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);