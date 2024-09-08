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
import { MessagesContext } from "../root";
import Spinner from "../components/spinner";
import PassInput from "../components/passInput";
import { change_email } from "../api";
import { UserContext } from "../components/user";
import ResendVerifyEmail from "../components/resendVerifyEmail";

export async function action({ request }) {
    const formData = await request.formData()
    return await change_email(formData)
}


function EnterEmail({getFromName, setError, setStep}) {
    const validateDataFetcher = useFetcher()


    const fetcher = useFetcher()
    const loading = fetcher.state === "submitting" || validateDataFetcher.state === "submitting"

    const { simpleAddMessage } = useContext(MessagesContext)
    useEffect(() => {
        if (validateDataFetcher.data) {
            const data = validateDataFetcher.data
            if (data.succeeded) {
                fetcher.submit({email: getFromName("email").value}, { method: "POST", action: "/email_verification" })
                setError({})
            } else {
                const email_error = data.error?.email
                if (email_error === undefined) {
                    fetcher.submit({email: getFromName("email").value}, { method: "POST", action: "/email_verification" })
                    setError({})
                } else {
                    setError({email: email_error})
                }
            }
        }
    }, [validateDataFetcher.data])
    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.succeeded) {
                setError({})
                simpleAddMessage("Great, verify you password", {severity: "success"})
                setStep(step => step+1)
            } else {
                if (fetcher.data.error) {
                    setError(fetcher.data.error)
                }
                simpleAddMessage(fetcher.data.errorMessage, {severity: "error"})
            }
        }
    }, [fetcher.data])



    return (
        <validateDataFetcher.Form method="POST" onSubmit={() => {setError({})}}>
            <Stack spacing={2}>
                <Stack spacing={0}>
                    <Typography variant='h5' color="primary" sx={{ textAlign: "center" }}>Enter your new email</Typography>
                </Stack>
                <TextField required type="email" {...getFromName("email")} label="Email" />
                <Stack flexDirection="row" justifyContent="space-between">
                    <Box />
                    <Button type="submit" variant="contained" startIcon={loading ? <Spinner /> : null}>Submit</Button>
                </Stack>
            </Stack>
        </validateDataFetcher.Form>
    )
}
function EnterPassword({getFromName, setError, setStep}) {
    const validateDataFetcher = useFetcher()

    const loading = validateDataFetcher.state === "submitting"

    useEffect(() => {
        if (validateDataFetcher.data) {
            const data = validateDataFetcher.data
            if (data.succeeded) {
                setError({})
                setStep(step => step+1)
            } else {
                const password_error = data.error?.password
                if (password_error === undefined) {
                    setError({})
                    setStep(step => step+1)
                } else {
                    setError({password: password_error})
                }
            }
        }
    }, [validateDataFetcher.data])
    return (
        <validateDataFetcher.Form onSubmit={() => {
            setError({})
            }} method="POST">
            <Stack spacing={2}>
                <Stack spacing={0}>
                    <Typography variant='h5' color="primary" sx={{ textAlign: "center" }}>Verify Your Password</Typography>
                </Stack>
                <PassInput required {...getFromName("password")} label="Password" />
                <Stack flexDirection="row" justifyContent="space-between">
                    <Button type="button" variant="outlined" onClick={() => setStep(step => step-1)}>
                        Back
                    </Button>
                    <Button type="submit" variant="contained" startIcon={loading ? <Spinner /> : null}>Submit</Button>
                </Stack>
            </Stack>
        </validateDataFetcher.Form>
    )
}

function VerificationCode({ setError, getFromName, setStep }) {
    const [_user, setUser] = useContext(UserContext)
    const navigation = useNavigation()
    const navigate = useNavigate()
    const loading = navigation.state === "submitting"
    const actionData = useActionData()
    const { simpleAddMessage } = useContext(MessagesContext)

    useEffect(() => {
        if (actionData) {
            if (actionData.succeeded) {
                setError({})
                simpleAddMessage("Great your email has been changed", {severity: "success"})
                setUser(user => ({...user, email: actionData.response.email}))
                navigate("/account")
            } else {
                if (actionData.error) {
                    setError(actionData.error)
                }
                simpleAddMessage(actionData.errorMessage, {severity: "error"})
            }
        }
    }, [actionData])

    const validationGetFromName = getFromName("email_verification_code", true, [true])

    return (
        <Form method="POST">
            <Stack spacing={4}>
                <Stack spacing={0}>
                    <Typography variant='h5' color="primary" sx={{ textAlign: "center" }}>Enter the code</Typography>
                    <Typography variant='body1' color="primary" sx={{ textAlign: "center" }}>that we sent to your email</Typography>
                </Stack>
                <input type="hidden" name="email" value={getFromName("email").value} />
                <input type="hidden" name="password" value={getFromName("password").value} />
                <Stack alignItems="center">
                    <VerificationInput
                        classNames={{
                        container: "container",
                        character: "character",
                        characterInactive: "character--inactive",
                        characterSelected: "character--selected",
                        characterFilled: "character--filled",
                        }}
                    inputProps={{name: validationGetFromName.name}} value={validationGetFromName.value} onChange={validationGetFromName.onChange} validChars="0-9" placeholder="."  />
                </Stack>
                <Stack spacing={4}>
                    <ResendVerifyEmail />
                    <Stack flexDirection="row" justifyContent="space-between" gap={2}>
                        <Button type="button" variant="outlined" onClick={() => setStep(step => step-1)}>
                            Back
                        </Button>
                        <Button type="submit" variant="contained" startIcon={loading ? <Spinner /> : null}>Submit</Button>
                    </Stack>
                </Stack>
            </Stack>
        </Form>
    )
}



function GetContentFromStep({step, setStep, setError, getFromName}) {
    switch (step) {
        case 0:
            return <EnterEmail setStep={setStep} setError={setError} getFromName={getFromName} />
        case 1:
            return <EnterPassword setStep={setStep} setError={setError} getFromName={getFromName} />
        case 2:
            return <VerificationCode setStep={setStep} setError={setError} getFromName={getFromName} />
    }
}




export default function ChangeEmail() {
    const [user] = useContext(UserContext)
    const [isAuthenticated, setIsAuthenticated] = useState(true)
    useEffect(() => {
        setIsAuthenticated(user.is_authenticated)
    }, [user])


    const [step, setStep] = useState(0)

    const steps = [
        'Enter New email',
        'Verify Your Password',
        'Verify Email',
      ];
      
    const [error, setError] = useState({})
    const [fieldInfo, setFieldInfo] = useState({
        email: "",
        password: "",
        email_verification_code: "",
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


    function HorizontalLinearAlternativeLabelStepper() {
        return (
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={step} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        )
    }

    if (!isAuthenticated) {
        return <Typography variant='h3' sx={{ textAlign: "center", py: 6 }}>
            You must be logged in to change your email
        </Typography>
    }

    return (
        <Stack alignItems="center" justifyContent="center" sx={{width: "100%", height: "100%", py: {xs: "1rem", md: "2rem"}, px: {xs: "0rem", md: "2rem"}, boxSizing: "border-box"}}>
            <Paper sx={{p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}}}>
                    <Stack gap={4}>
                        <Typography variant='h4' color="primary" sx={{ textAlign: "center" }}>Change Email</Typography>
                        <HorizontalLinearAlternativeLabelStepper  />
                        <Divider />
                        <GetContentFromStep step={step} setStep={setStep} setError={setError} getFromName={getFromName} />
                    </Stack>
            </Paper>
        </Stack>
    )
}