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

import { useContext, useEffect, useState } from "react";
import { reset_password } from "../api";
import { getFullError } from "../components/errorMessage";
import { MessagesContext } from "../root";
import Spinner from "../components/spinner";

export async function action({ request }) {
    const formData = await request.formData()
    return await reset_password(formData)
}


function EnterEmail({getFromName, setError, setStep}) {
    const fetcher = useFetcher()
    const loading = fetcher.state === "submitting"
    
    const { simpleAddMessage } = useContext(MessagesContext)

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.succeeded) {
                setError({})
                simpleAddMessage("Great, now enter a new desired password", {severity: "success"})
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
        <fetcher.Form action="/email_verification" method="POST">
            <Stack gap={2}>
                <Stack gap={0}>
                    <Typography variant='h5' color="primary" sx={{ textAlign: "center" }}>Enter your email</Typography>
                </Stack>
                <TextField required type="email" {...getFromName("email")} label="Email" />
                <Stack flexDirection="row" justifyContent="space-between">
                    <Box />
                    <Button type="submit" variant="contained" startIcon={loading ? <Spinner /> : null}>Submit</Button>
                </Stack>
            </Stack>
        </fetcher.Form>
    )
}
function EnterPassword({getFromName, setError, setStep}) {
    return (
        <Stack gap={2}>
            <Stack gap={0}>
                <Typography variant='h5' color="primary" sx={{ textAlign: "center" }}>Enter New Password</Typography>
            </Stack>
            <TextField required type="password" {...getFromName("password1")} label="Password1" />
            <TextField required type="password" {...getFromName("password2")} label="Password2" />
            <Stack flexDirection="row" justifyContent="space-between">
                <Button type="button" variant="outlined" onClick={() => setStep(step => step-1)}>
                    Back
                </Button>
                <Button type="button" variant="contained" onClick={() => {
                    if (getFromName("password1").value !== getFromName("password2").value) {
                        setError({
                            password2: ["Passwords do not match"]
                        })
                    } else {
                        setError({})
                        setStep(step => step+1)
                    }
                }}>Submit</Button>
            </Stack>
        </Stack>
    )
}

function VerificationCode({ setError, getFromName, setStep }) {
    const navigation = useNavigation()
    const navigate = useNavigate()
    const loading = navigation.state === "submitting"
    const actionData = useActionData()
    const { simpleAddMessage } = useContext(MessagesContext)

    useEffect(() => {
        if (actionData) {
            if (actionData.succeeded) {
                setError({})
                simpleAddMessage("Great, your password has been reset, you may now login", {severity: "success"})
                navigate("/login")
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
            <Stack gap={2}>
                <Stack gap={0}>
                    <Typography variant='h5' color="primary" sx={{ textAlign: "center" }}>Enter the code</Typography>
                    <Typography variant='body1' color="primary" sx={{ textAlign: "center" }}>that we sent to your email</Typography>
                </Stack>
                <input type="hidden" name="email" value={getFromName("email").value} />
                <input type="hidden" name="password" value={getFromName("password1").value} />
                <VerificationInput
                    classNames={{
                    container: "container",
                    character: "character",
                    characterInactive: "character--inactive",
                    characterSelected: "character--selected",
                    characterFilled: "character--filled",
                    }}
                inputProps={{name: validationGetFromName.name}} value={validationGetFromName.value} onChange={validationGetFromName.onChange} validChars="0-9" placeholder="."  />
                <Stack flexDirection="row" justifyContent="space-between">
                    <Button type="button" variant="outlined" onClick={() => setStep(step => step-1)}>
                        Back
                    </Button>
                    <Button type="sumbit" variant="contained" startIcon={loading ? <Spinner /> : null}>Submit</Button>
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




export default function SignUp() {
    const [step, setStep] = useState(0)

    const steps = [
        'Enter email',
        'Enter New Password',
        'Verify Email',
      ];
      
    const [error, setError] = useState({})
    const [fieldInfo, setFieldInfo] = useState({
        email: "",
        password1: "",
        password2: "",
        email_verification_code: "",
    })


    function onChangeInfo(e, name, eIsValue=false) {
        const value = eIsValue ? e : e.target.value
        setFieldInfo(oldInfo => ({...oldInfo, [name]: value}))
    }
    function getFromName(name, hidden=false, onChangeInfoArgs=[]) {
        const fullError = getFullError(error, name)
        console.log("the name is " + name)
        console.log(fullError)
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
    return (
        <Stack alignItems="center" justifyContent="center" sx={{width: "100%", height: "100%", py: {xs: "1rem", md: "2rem"}, px: {xs: "0rem", md: "2rem"}, boxSizing: "border-box"}}>
            <Paper sx={{p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}}}>
                <Stack gap={2}>
                    <HorizontalLinearAlternativeLabelStepper  />
                    <GetContentFromStep step={step} setStep={setStep} setError={setError} getFromName={getFromName} />
                </Stack>
            </Paper>
        </Stack>
    )
}