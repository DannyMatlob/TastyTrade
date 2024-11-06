import React, {createContext, useState, ReactNode, useContext} from 'react';

// Should be enough for basic usages. Use UID to locate a specific user in firebase DB.
interface User {
    uid: string | null;
    name: string | null;
    email: string | null;
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the context with default values.
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component.
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserProvider not being hooked to pages correctly! [UserContext.tsx]');
    }
    return context;
}