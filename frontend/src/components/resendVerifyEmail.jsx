import Button from "@mui/material/Button"
import Box from "@mui/material/Box"

import { useFetcher } from "react-router-dom";

import { useContext, useEffect } from "react";
import { MessagesContext } from "./messages";
import Spinner from "./spinner";

export default function ResendVerifyEmail({ email }) {
    const fetcher = useFetcher()
    const resendEmailLoading = fetcher.state === "submitting";
    const { simpleAddMessage } = useContext(MessagesContext)
    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.succeeded) {
                simpleAddMessage("Resended Verificaiton Code to Email.", {severity: "success"})
                setError({})
            } else {
                if (fetcher.data.error) {
                    setError(fetcher.data.error)
                }
                simpleAddMessage(fetcher.data.errorMessage, {severity: "error"})
            }
        }
    }, [fetcher.data])

    function resendEmail() {
        const formData = new FormData();
        formData.append("email", email)
        fetcher.submit(formData, {method: "POST", action: "/email_verification"})
    }

    return <Box sx={{width: "100%"}}>
        <input type="hidden" value={email} name="email" />
        <Button variant="outlined" onClick={resendEmail} startIcon={resendEmailLoading && <Spinner />} fullWidth>Resend Email</Button>
    </Box>
} 