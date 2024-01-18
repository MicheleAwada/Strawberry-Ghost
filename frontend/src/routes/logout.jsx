import { useContext } from "react"
import { logout } from "../api"
import Button from '@mui/material/Button'
import { UserContext } from "../components/user"
import { baseUser } from "../components/user"
import { MessagesContext } from "../root"
import {useNavigate} from "react-router-dom"

import { googleLogout } from '@react-oauth/google';


export default function Logout() {
    const [user, setUser] = useContext(UserContext)
    const {simpleAddMessage} = useContext(MessagesContext)
    const navigate = useNavigate();
    function onLogout() {
        const wasAuthenticated = user.is_authenticated
        logout()
        if (user.is_google_user) {
            googleLogout();
        }
        setUser(baseUser)
        wasAuthenticated ? simpleAddMessage("Successfully Logged Out") : simpleAddMessage("You're already logged out!", {severity: "info"})
        navigate("/")

    }
    return (
        <Button variant="contained" color="primary" onClick={onLogout}>
            logout
        </Button>
    )
}