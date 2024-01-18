import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { Form } from 'react-router-dom'

import { getFullError } from '../components/errorMessage'
import { useEffect, useRef, useState } from 'react'

export function action() {
    return null
}


export default function SignUp() {
    const [error, setError] = useState({})
    function getFromName(name) {
        const fullErrors = getFullError(error, name)
        return {name: name, helperText: fullErrors.error, error: fullErrors.isError}
    }

    const [email, setEmail] = useState("")
    const loading1 = false;
    const loading2 = false;

    useEffect(() => {

    }, [])

    return (
        <Stack alignItems="center" justifyContent="center" sx={{width: "100%", height: "100%", p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}, boxSizing: "border-box"}}>
        <Paper sx={{p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"}}}>
            <Form method="POST">
                <Stack flexDirection={"column"} gap={2}>
                    <Typography variant="h5" color="primary" gutterBottom sx={{textAlign: "center"}}>Sign Up</Typography>
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
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value)
                        }}
                        type="email"
                        {...getFromName("email")}
                        label="email"
                        required
                    />
                    <TextField
                        type="password"
                        {...getFromName("password")}
                        label="password"
                        required
                    />
                    {
                        getFullError(error, "non_field_errors").isError && 
                        <Typography id="user-login-form-non-field-errors" color="error">
                            {getFullError(error, "non_field_errors").error}
                        </Typography>
                    }
                    <Form action='email_verification'>
                        <input type='hidden' value={email} name="email" />
                        <Button variant="contained" color="primary" type="submit" startIcon={loading1 && <Spinner />}>
                            Submit1
                        </Button>
                    </Form>
                    <Button variant="contained" color="primary" type="submit" startIcon={loading2 && <Spinner />}>
                        Submit2
                    </Button>
                </Stack>
            </Form>
        </Paper>
    </Stack>
    )
}