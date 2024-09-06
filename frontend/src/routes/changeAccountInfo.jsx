import { change_account_info } from "../api";
import { getFullError } from "../components/errorMessage";
import {useNavigation, useActionData, Form} from "react-router-dom"

import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Divider from "@mui/material/Divider"


import Spinner from "../components/spinner";
import { useContext, useEffect, useState } from "react";
import { MessagesContext } from "../root";
import { UserContext } from "../components/user";

import ImageCropperInput from "../components/cropFileInput"

export async function action({ request, params }) {
    const formData = await request.formData()
    return await change_account_info(formData)
}
export default function ChangeAccountInfo() {
    
    const [user, setUser] = useContext(UserContext)
    const [isAuthenticated, setIsAuthenticated] = useState(true)

    const [error, setError] = useState({})
    const [fieldInfo, setFieldInfo] = useState({
        first_name: "",
        last_name: ""
    })

    useEffect(() => {
        setIsAuthenticated(user.is_authenticated)
        setFieldInfo({
            first_name: user.first_name,
            last_name: user.last_name
        })
    }, [user])
    

    const {simpleAddMessage} = useContext(MessagesContext)
    const actionData = useActionData()
    const navigation = useNavigation()
    const loading = navigation.state=== "loading"

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
    function addFromName(name) {
        const fullError = getFullError(error, name)
        return {name: name, helperText: fullError.error, error: fullError.isError}
    }

    useEffect(() => {
        if (actionData) {
            if (actionData.succeeded) {
                setError({})
                simpleAddMessage("Great your account info has been changed", {severity: "success"})
                setUser({...actionData.response, is_authenticated: true})
            } else {
                simpleAddMessage(actionData.errorMessage, {severity: "error"})
                setError(actionData.error)
            }
        }
    }, [actionData])

    if (!isAuthenticated) {
        return <Typography variant='h3' sx={{ textAlign: "center", py: 6 }}>
            You must be logged in to change your account info
        </Typography>
    }

    return (
        <Stack alignItems="center" justifyContent="center" sx={{width: "100%", height: "100%", py: "4rem", px: {xs: "0rem", md: "2rem"}, boxSizing: "border-box"}}>
            <Paper elevation={12} sx={{p: {xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem"} }}>
                    <Stack gap={4}>
                        <Typography variant='h4' color="primary" sx={{ textAlign: "center" }}>Change Account Details</Typography>
                        <Divider />
                        <Form method="PATCH" encType="multipart/form-data">
                            <Stack spacing={2} alignItems="center">
                                <input type="hidden" value={user.id} name="id" />
                                <Stack direction={{xs: "column", md: "row"}} spacing={2} sx={{ width: "100%" }}>
                                    <TextField {...getFromName("first_name")} label="First Name" />
                                    <TextField {...getFromName("last_name")} label="Last Name" />
                                </Stack>
                                <ImageCropperInput cropInfoInputsName={{ x: "avatar_crop_data_x", y: "avatar_crop_data_y", width: "avatar_crop_data_w", height: "avatar_crop_data_h" }} imageCropperProps={{aspectRatio: 1}} fileInputProps={{ ...addFromName("avatar"), buttonText: "Upload Your Avatar", inputProps: { required: false }}} />
                                <Box sx={{ pt: "2rem", boxSizing: "border-box" }}><Button fullWidth  type="submit" variant="contained" startIcon={loading && <Spinner />}>Submit</Button></Box>
                            </Stack>
                        </Form>
                    </Stack>
            </Paper>
        </Stack>
    )

}