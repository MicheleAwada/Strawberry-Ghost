import { createContext, useState } from "react";
import { getUser } from "../fakeApi";


export const UserContext = createContext([getUser(), () => {}]);

export default function UserProvider({ children }) {
    const [user, setUser] = useState(getUser())
    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}