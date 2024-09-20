
import { Form, useActionData, useNavigate, useNavigation, Link as ReactRouterLink } from "react-router-dom"
import { login, set_token } from "../api"

import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'

import { UserContext } from "../components/user"
import { MessagesContext } from "../root"
import { useContext, useEffect, useState } from "react"
import Spinner from "../components/spinner"
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import { getFullError } from "../components/errorMessage"

import PassInput from "../components/passInput";
import { GoogleButton } from "./googleLogin";

export async function action({request}) {
    const formData = await request.formData();
    const response = await login(formData)
    if (response.succeeded) {
        set_token(response.response.auth_token)
    }
    return response
}


export default function Login() {

    const [_, setUser] = useContext(UserContext)
    const { simpleAddMessage } = useContext(MessagesContext)

    
    const navigation = useNavigation()
    const loading = navigation.state === "submitting"
    const actionData = useActionData()
    const navigate = useNavigate()

    let [error, setError] = useState({});
    useEffect(() => {
        if (actionData!==undefined) {
            if (actionData.succeeded) {
                simpleAddMessage("Successfully Logged In", {severity: "success"})
                setUser({...actionData.response, is_authenticated: true})
                setError({})
                navigate("/")
            }
            else {
                if (actionData.error) {
                    setError(actionData.error)
                }
                simpleAddMessage(actionData.errorMessage, {severity: "error"})
            }
        }
    }, [actionData])
    function getFromName(name) {
        const fullErrors = getFullError(error, name)
        return {name: name, helperText: fullErrors.error, error: fullErrors.isError}
    }

    return (
        <Stack alignItems="center" justifyContent="center" sx={{width: "100%", height: "100%", py: "2rem", px: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}, boxSizing: "border-box"}}>
            <Paper sx={{px: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}, py: "3rem"}}>
                <Stack alignItems="center" gap={2}>
                    <Typography gutterBottom variant="h4" color="primary" sx={{textAlign: "center"}}>Log In</Typography>
                    <GoogleButton />
                    <Divider variant="middle" flexItem sx={{}} />
                    <Form method="POST">
                        <Stack flexDirection={"column"} gap={2}>
                            <TextField
                              id="email"
                              {...getFromName("email")}
                              label="Email"
                              required
                            />
                            <PassInput
                              id="passowrd"
                              {...getFromName("password")}
                              required
                            />
                            {
                                getFullError(error, "non_field_errors").isError &&
                                getFullError(error, "non_field_errors").error
                            }
                            <Button variant="contained" color="primary" type="submit" startIcon={loading && <Spinner />}>
                                Submit
                            </Button>
                            <Link variant="body1" component={ReactRouterLink} to="/reset_password" sx={{textAlign: "center"}}>Forgot Password</Link>
                        </Stack>
                    </Form>
                    <Divider variant="middle" flexItem sx={{}} />
                    <Link component={ReactRouterLink} to="/signup" sx={{textAlign: "center"}}><Typography>Sign up instead?</Typography></Link>
                </Stack>
            </Paper>
        </Stack>
    )
}