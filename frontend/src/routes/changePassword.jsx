import { Form, useActionData, useFetcher, useNavigate, useNavigation } from "react-router-dom";
import VerificationInput from "react-verification-input";


import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"


import Stepper from "@mui/material/Stepper"

import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"

import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"

import { useContext, useEffect, useState } from "react";
import { getFullError } from "../components/errorMessage";
import { change_password, logout } from "../api";
import PassInput from "../components/passInput";
import Spinner from "../components/spinner";
import { UserContext } from "../components/user";
import { MessagesContext } from "../root";

export async function action({ request }) {
    const formData = await request.formData()
    return await change_password(formData)
}





export default function ChangePassword() {
    const [user] = useContext(UserContext)
    const [isAuthenticated, setIsAuthenticated] = useState(true)
    useEffect(() => {
        setIsAuthenticated(user.is_authenticated)
    }, [user])

    const {simpleAddMessage} = useContext(MessagesContext)

    const navigate = useNavigate()

    const actionData = useActionData()
    const navigation = useNavigation()
    const loading = navigation.state === "submitting"

    
    const [error, setError] = useState({})
    const [fieldInfo, setFieldInfo] = useState({
        old_password: "",
        password: "",
        password2: "",
    })


    function onChangeInfo(e, name, eIsValue=false) {
        const value = eIsValue ? e : e.target.value
        setFieldInfo(oldInfo => ({...oldInfo, [name]: value}))
    }
    function getFromName(name, hidden=false, onChangeInfoArgs=[]) {
        const fullError = getFullError(error, name)
        let baseReturn = { name: name, value: fieldInfo[name], onChange: e => onChangeInfo(e, name, ...onChangeInfoArgs)}
        if (hidden) return baseReturn
        baseReturn = {...baseReturn, helperText: fullError.error, error: fullError.isError}
        return baseReturn
    }


    useEffect(() => {
        if (actionData) {
            if (actionData.succeeded) {
                setError({})
                simpleAddMessage("Password Successfully Changed, you can now log in", {severity: "success"})
                logout()
                navigate("/login")
            } else {
                setError(actionData.error)
                simpleAddMessage(actionData.errorMessage, {severity: "error"})
            }
        }
    }, [actionData])

    if (!isAuthenticated) {
        return <Typography variant='h3' sx={{ textAlign: "center", py: 6 }}>
            You must be logged in to change your password
        </Typography>
    }
    
    return (
        <Stack alignItems="center" justifyContent="center" sx={{width: "100%", height: "100%", py: {xs: "1rem", md: "2rem"}, px: {xs: "0rem", md: "2rem"}, boxSizing: "border-box"}}>
            <Paper sx={{p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}}}>
                    <Stack gap={4}>
                        <Typography variant='h4' color="primary" sx={{ textAlign: "center" }}>Change Password</Typography>
                        <Divider />
                        <Form onSubmit={(e) => {
                            if (getFromName("password").value !== getFromName("password2").value) {
                                setError({password2: ["Passwords do not match"]})
                                e.preventDefault()
                            }
                        }} method="POST">
                            <Stack spacing={2}>
                                <PassInput {...getFromName("old_password")} label="Old Password" required />
                                <PassInput {...getFromName("password")} label="New Password" required />
                                <PassInput {...getFromName("password2")} label="Confirm Password" required />
                                <Button type="submit" variant="contained" disabled={loading} startIcon={loading && <Spinner />}>Submit</Button>
                            </Stack>
                        </Form>
                    </Stack>
            </Paper>
        </Stack>
    )
}