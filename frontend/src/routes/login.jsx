
import { Form, useActionData, useNavigate, useNavigation } from "react-router-dom"
import { login, set_token } from "../api"

import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

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

    const [user, setUser] = useContext(UserContext)
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
                navigate("/")
            }
            else {
                setError(actionData.error)
                simpleAddMessage(actionData.errorMessage, {severity: "error"})
            }
        }
    }, [actionData])
    function getFromName(name) {
        const fullErrors = getFullError(error, name)
        return {name: name, helperText: fullErrors.error, error: fullErrors.isError}
    }

    return (
        <Stack alignItems="center" justifyContent="center" sx={{width: "100%", height: "100%", p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}, boxSizing: "border-box"}}>
            <Paper sx={{p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}}}>
                <Stack alignItems="center" gap={2}>
                    <Form method="POST">
                        <Stack flexDirection={"column"} gap={2}>
                            <Typography variant="h5" color="primary" sx={{textAlign: "center"}}>Log In</Typography>
                            <TextField
                              id="email"
                              {...getFromName("username")}
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
                                <Typography id="user-login-form-non-field-errors" color="error">
                                {getFullError(error, "non_field_errors").error}
                            </Typography>
                            }
                            <Button variant="contained" color="primary" type="submit" startIcon={loading && <Spinner />}>
                                Submit
                            </Button>
                        </Stack>
                    </Form>
                    <Divider variant="middle" flexItem sx={{}} />
                    <GoogleButton />
                </Stack>
            </Paper>
        </Stack>
    )
}