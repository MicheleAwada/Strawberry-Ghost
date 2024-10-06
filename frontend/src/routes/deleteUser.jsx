import { Form, useActionData, useNavigate, useNavigation, useSubmit } from "react-router-dom"

import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import PassInput from "../components/passInput"
import { getFullError } from "../components/errorMessage"
import { useContext, useEffect, useRef, useState } from "react"
import { delete_account, is_authenticated, logout } from "../api"
import Spinner from "../components/spinner"
import { UserContext, baseUser } from "../components/user"
import { MessagesContext } from "../root"

export async function action({ request }) {
    const formData = await request.formData()
    return await delete_account(formData)
}

export default function DeleteUser() {
    const actionData = useActionData()
    const navigation = useNavigation()
    const loading = navigation.state === "submitting"
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [error, setError] = useState({})
    function getFromName(name) {
        const errorGot = getFullError(error, name)
        return {name: name, helperText: errorGot.error, error: errorGot.isError}
    }
    const {simpleAddMessage} = useContext(MessagesContext)
    const [user, setUser] = useContext(UserContext)
    const navigate = useNavigate() 
    useEffect(() => {
        if (actionData) {
            if (actionData.succeeded) {
                setError({})
                simpleAddMessage("Account Deleted", {severity: "success"})
                navigate("/")
                logout()
                setUser(baseUser)
            } else {
                setError(actionData.error)
                simpleAddMessage(actionData.errorMessage, {severity: "error"})
                setConfirmDeleteModal(false)
            }
        }
    }, [actionData])
    const formRef = useRef(null)
    const submit = useSubmit()
    function getFormData() {
        const formData = new FormData(formRef.current)
        return formData
    }
    function deleteAction() {
        const formData = getFormData()
        submit(formData, { method: "delete" })
    }

    const [isAuthenticated, setIsAuthenticated] = useState(true)
    useEffect(() => {
        setIsAuthenticated(user.is_authenticated)
    }, [user])
    if (!isAuthenticated) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ py: "4rem", px: { xs: "0.5rem", md: "4rem" }, boxSizing: "border-box" }} />
        )
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        p: 4,
      };


    return (
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ py: "4rem", px: { xs: "0.5rem", md: "4rem" }, boxSizing: "border-box" }}>
            <Paper elevation={8} sx={{ p: { xs: "2rem", md: "4rem" } }}>
                <Form ref={formRef} method="delete">
                    <Stack spacing={4}>
                        <Typography variant="h4" component="h4" textAlign="center" color="error">Delete Account</Typography>
                        <PassInput {...getFromName("password")} />
                        <Button type="button" onClick={() => setConfirmDeleteModal(true)}>Delete Account</Button>
                    </Stack>
                </Form>
            </Paper>
            <Box>
                <Modal open={confirmDeleteModal} onClose={() => setConfirmDeleteModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Paper sx={style}>
                        <Stack spacing={4}>
                            <Typography variant="h3" color="primary" sx={{ textAlign: "center" }} component="h3">ARE YOU 100% SURE YOU WANT TO DELETE YOUR ACCOUNT?!</Typography>
                            <Button variant="contained" startIcon={loading && <Spinner />} onClick={deleteAction}>DELETE</Button>
                        </Stack>
                    </Paper>
                </Modal>
            </Box>
        </Box>
    )
}