import VerificationInput from "react-verification-input";

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { Form, Link as ReactRouterLink, useActionData, useFetcher, useNavigate, useNavigation, useSubmit } from 'react-router-dom'

import { getFullError } from '../components/errorMessage'
import { useContext, useEffect, useRef, useState } from 'react'
import { set_token, signup, verification } from '../api'
import Spinner from '../components/spinner'
import { MessagesContext } from '../root';
import { UserContext } from "../components/user";
import { GoogleButton } from "./googleLogin";
import PassInput from "../components/passInput";
import ResendVerifyEmail from "../components/resendVerifyEmail";


export async function action({ request }) {
    const formData = await request.formData();
    return await signup(formData)
}

export async function verificationAction({ request }) {
    const formData = await request.formData();
    const response = await verification(formData)
    return response
}







function SignupForm({ setStep, getFromName, setError }) {
    
    const fetcher = useFetcher()
    const emailVerificationFetcher = useFetcher()
    const loading = fetcher.state==="submitting";

    const { simpleAddMessage } = useContext(MessagesContext)

    useEffect(() => {
        if (fetcher.data) {
            let succeeded = false
            if (fetcher.data?.error && Object.keys(fetcher.data.error).length===1 && "email_verification_code" in fetcher.data.error)
            {
                // we know we didnt send verification code so we will act like this is a success for now
                succeeded = true
            }
            if (succeeded) {
                setStep(1)
                emailVerificationFetcher.submit({email: getFromName("email").value}, { method: "POST", action: "/email_verification" })
                simpleAddMessage("Great! Check your email for a verification code.", {severity: "success"})
                setError({})
            } else {
                if (fetcher.data.error) {
                    setError(fetcher.data.error)
                }
                simpleAddMessage(fetcher.data.errorMessage, {severity: "error"})
            }
        }
    }, [fetcher.data])

    useEffect(() => {
        if (emailVerificationFetcher.data) {
            if (emailVerificationFetcher.data.succeeded) {
                // dont say anything cause we already told them to check their email
            } else {
                simpleAddMessage(emailVerificationFetcher.data.errorMessage, {severity: "error"})
            }
        }
    }, [emailVerificationFetcher])

    return ( 
        <Stack gap={2} alignItems="center">
            <fetcher.Form action='/signup' method="POST">
                <Stack flexDirection={"column"} gap={2}>
                    <Typography variant="h5" color="primary" gutterBottom sx={{textAlign: "center"}}>Sign Up</Typography>
                    <Stack alignItems="center">
                        <GoogleButton />
                    </Stack>
                    <Divider variant="middle" flexItem sx={{my: "1rem"}} />
                    <Grid container spacing={2}>
                        <Grid xs={12} md={6}
                            item
                        >
                            <TextField {...getFromName("first_name")}
                            label="First Name"
                            sx={{width: "100%"}}
                            required />
                        </Grid>
                        <Grid xs={12} md={6}
                            item
                        >
                            <TextField {...getFromName("last_name")}
                                sx={{width: "100%"}}
                                label="Last Name"
                                required/>
                        </Grid>
                    </Grid>
                    <TextField
                        type="email"
                        {...getFromName("email")}
                        label="Email"
                        required
                    />
                    <PassInput
                        {...getFromName("password")}
                        required
                    />
                    {/* <PassInput
                        {...getFromName("password2")}
                        required
                    /> */}
                    <FormControlLabel control={<Checkbox required aria-required {...getFromName("agreed_to_terms", true, [e => e.target.checked])} />} label={<Typography component="span">
                        By signing up with an account, you agree to Strawberry Ghost's <Link component={ReactRouterLink} to="/terms_of_services">Terms of Service</Link>.
                    </Typography>} />
                    {
                        getFromName("non_field_errors").error &&
                        <Typography id="user-login-form-non-field-errors" color="error">
                            {getFromName("non_field_errors").helperText}
                        </Typography>
                    }
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Box />
                        <Button variant="contained" color="primary" type="submit" startIcon={loading && <Spinner />}>
                            Submit
                        </Button>
                    </Stack>
                    <Divider variant="middle" flexItem sx={{my: "1rem"}} />
                    <Link component={ReactRouterLink} to="/login" color="primary"><Typography>Login instead?</Typography></Link>
                </Stack>
            </fetcher.Form>
        </Stack>
    )
}

function VerificationForm({ setStep, getFromName, setError }) {
    const navigation = useNavigation();
    const loading = navigation.state==="submitting"; 


    const validationGetFromName = getFromName("email_verification_code", true, [e => e])
    return (
        <Form method="POST">
            <Stack flexDirection={"column"} gap={2}>
                <Stack gap={0}>
                    <Typography variant='h5' color="primary" sx={{ textAlign: "center" }}>Enter the code</Typography>
                    <Typography variant='body1' color="primary" sx={{ textAlign: "center" }}>that we sent to your email</Typography>
                </Stack>
                <input type='hidden' {...getFromName("first_name", true)} />
                <input type='hidden' {...getFromName("last_name", true)} />
                <input type='hidden' {...getFromName("email", true)} />
                <input type='hidden' {...getFromName("password", true)} />
                <input type='hidden' {...getFromName("agreed_to_terms", true, [e => e.target.checked])} />
                <VerificationInput
                  classNames={{
                    container: "container",
                    character: "character",
                    characterInactive: "character--inactive",
                    characterSelected: "character--selected",
                    characterFilled: "character--filled",
                  }}
                inputProps={{name: validationGetFromName.name}} value={validationGetFromName.value} onChange={validationGetFromName.onChange} validChars="0-9" placeholder="."  />
                {
                    getFromName("non_field_errors").error &&
                    <Typography id="user-login-form-non-field-errors" color="error">
                        {getFromName("non_field_errors").helperText}
                    </Typography>
                }
                <Stack gap={4}>
                    <ResendVerifyEmail email={getFromName("email").value} />
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Button variant="outlined" color="primary" type="button" onClick={() => setStep(step => step-1)}>
                            Back
                        </Button>
                        <Button variant="contained" color="primary" type="submit" startIcon={loading && <Spinner />}>
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Form>
    )
}

function GetContentFromStep({step, setStep, setError, getFromName}) {
    switch (step) {
        case 0:
            return <SignupForm setStep={setStep} setError={setError} getFromName={getFromName} />
        case 1:
            return <VerificationForm setStep={setStep} setError={setError} getFromName={getFromName} />
    }
}




export default function SignUp() {
    const [step, setStep] = useState(0)

    const steps = [
        'Account Details',
        'Verify Email',
      ];
      
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

    const [info, setInfo] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        email_verification_code: "",
        agreed_to_terms: false
    })
    const [error, setError] = useState({})
    function onChangeInfo(e, name, getValueFromE=(e) => e.target.value) {
        const value = getValueFromE(e)
        setInfo(oldInfo => ({...oldInfo, [name]: value}))
    }
    function getFromName(name, hidden=false, onChangeInfoArgs=[]) {
        const fullErrors = getFullError(error, name)
        let baseReturn = { name: name, value: info[name], onChange: e => onChangeInfo(e, name, ...onChangeInfoArgs)}
        if (hidden) return baseReturn
        baseReturn = {...baseReturn, helperText: fullErrors.error, error: fullErrors.isError}
        return baseReturn
    }

    const {simpleAddMessage} = useContext(MessagesContext)

    const actionData = useActionData()
    const navigate = useNavigate()
    const [user, setUser] = useContext(UserContext)
    useEffect(() => {
        if (actionData!==undefined) {
            if (actionData.succeeded) {
                simpleAddMessage("Woohoo, Your account was created!", {severity: "success"})
                setUser({...actionData.response, is_authenticated: true})
                set_token(actionData.response.auth_token)
                navigate("/")
            } else {
                if (actionData.error) {
                    setError(actionData.error)
                }
                simpleAddMessage(actionData.errorMessage, {severity: "error"})
            }
        }
    }, [actionData])


    return (
        <Stack alignItems="center" justifyContent="center" sx={{width: "100%", height: "100%", py: {xs: "1rem", md: "2rem"}, px: {xs: "0rem", md: "2rem"}, boxSizing: "border-box"}}>
            <Paper sx={{p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}}}>
                <Stack gap={2}>
                    <HorizontalLinearAlternativeLabelStepper />
                    <GetContentFromStep step={step} setStep={setStep} setError={setError} getFromName={getFromName} />
                </Stack>
            </Paper>
        </Stack>
    )
}