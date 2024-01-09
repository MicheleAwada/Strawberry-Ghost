import { createContext, useState } from "react";


const baseUser = {
    isAuthenticated: false,
}
export const UserContext = createContext([baseUser, () => {}]);

export default function UserProvider({ children }) {
    const [user, setUser] = useState(baseUser)
    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}