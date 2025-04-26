"use client";
import React from 'react';
import { useContext, createContext, useState, ReactNode, Children } from "react";

interface UserData {
    id: string;
    email: string;
    is_admin: boolean;
    name: string;
    address: string;
    phone: string;
    }

interface UserContextType{
    userData: UserData| null;
    setUserData: (data: UserData | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: {children: ReactNode}){
    const [userData, setUserData] = useState<UserData | null>(null);
    
        return (
            <UserContext.Provider value={{userData, setUserData}}>
                {children}
            </UserContext.Provider>
        );

}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}
