import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"

import { Form, useActionData, useNavigation } from "react-router-dom"
import { contact } from "../api"
import { useContext, useEffect, useRef, useState } from "react"
import { MessagesContext } from "../root"
import { getFullError } from "../components/errorMessage"
import Spinner from "../components/spinner"

export async function action({ request }) {
    const formData = await request.formData();
    return await contact(formData)
}


export default function ContactUs() {
    const isSm = useMediaQuery(theme => theme.breakpoints.up("sm"));

    const navigation = useNavigation()
    const loading = navigation.state === "submitting"
    const actionData = useActionData()

    const { simpleAddMessage } = useContext(MessagesContext)
    const [error, setError] = useState({})
    const formRef = useRef(null)

    function getFromName(name) {
        const fullErrors = getFullError(error, name)
        return { name: name, helperText: fullErrors.error, error: fullErrors.isError }
    }

    useEffect(() => {
        if (actionData?.succeeded === true) {
            simpleAddMessage("Thank you for your message!", { severity: "success" })
            setError({})
            formRef!==null && formRef.current.reset()
        } else if (actionData?.succeeded === false) {
            setError(actionData?.error || {})
            simpleAddMessage(actionData?.errorMessage || "Something went wrong", { severity: "error" })
        }
    }, [actionData])

    return <Box sx={{py: "2rem"}}>
        <Stack gap={6}>
            <Typography variant={isSm ? "h2" : "h3"} component="h1" sx={{textAlign: "center"}} color="primary">Contact Us!</Typography>
            <Container maxWidth="md">
                <Form ref={formRef} method="POST" action="">
                    <Stack gap={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField label="Your Name" {...getFromName("name")} fullWidth required={true} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Your Email" type="email" {...getFromName("email")} fullWidth required={true} />
                            </Grid>
                        </Grid>
                        <TextField label="Your Title" {...getFromName("title")} required={true} />
                        <TextField multiline minRows={2} maxRows={12} label="Your Body" {...getFromName("body")} required={true} />
                        <Button type="submit" variant="contained" startIcon={loading ? <Spinner /> : undefined}>Submit</Button>
                    </Stack>
                </Form>
            </Container>
        </Stack>
    </Box>
}