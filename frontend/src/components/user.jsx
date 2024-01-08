import { createContext, useState } from "react";

export const UserContext = createContext();

const baseUser = {
    isAuthenticated: false,
}

export default function UserProvider({ children }) {
    const [user, setUser] = useState(baseUser)
    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}