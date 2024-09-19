import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'

import { useContext } from "react"
import { logout } from "../api"
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
        <Stack alignItems="center" justifyContent="center" sx={{width: "100%", height: "100%", py: {xs: "1rem", md: "2rem"}, px: {xs: "0rem", md: "2rem"}, boxSizing: "border-box"}}>
            <Paper sx={{p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}}}>
                    <Stack gap={4}>
                        <Typography variant='h4' color="primary" sx={{ textAlign: "center", width: "25rem" }}>Are You Sure You Want To Logout?!</Typography>
                        <Divider />
                        <Stack alignItems="center">
                            <Button variant="contained" color="primary" onClick={onLogout}>
                                logout
                            </Button>
                        </Stack>
                    </Stack>
            </Paper>
        </Stack>
    )
}