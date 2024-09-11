import { useNavigate, Link as ReactRouterLink, useRouteError } from "react-router-dom"

import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import useMediaQuery from "@mui/material/useMediaQuery"

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { logout } from "../api"
import { useState } from "react"

export default function ErrorElement() {
    const error = useRouteError()
    const navigate = useNavigate()
    const isSm = useMediaQuery(theme => theme.breakpoints.up('sm'))

    const [extraOptions, setExtraOptions] = useState(false)
    return (
        <Stack alignItems="center" pt="8rem" px={{xs: 1, sm: 2, md: 4}} gap={2}>
            <Typography variant={isSm ? "h2" : "h4"} sx={{ textAlign: "center" }}>Whops An Error Occured</Typography>
            <Typography sx={{ textAlign: "center" }}>{error.message}</Typography>
            <Stack alignItems="center" justifyContent="center" flexDirection="row" flexWrap="wrap" gap={{xs: 1, sm: 2, md: 4}}>
                <Button variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>
                <Button variant="contained" LinkComponent={ReactRouterLink} to="/">Go To Home</Button>
            </Stack>
            <Stack alignItems="center" gap={4}>
                <Stack alignItems="center" flexDirection="row" gap={0.5}>
                    <Typography>Extra Options: </Typography>
                    <IconButton onClick={() => setExtraOptions(!extraOptions)}>{extraOptions ? <ExpandLessIcon/> : <ExpandMoreIcon />}</IconButton>
                </Stack>
                <Collapse in={extraOptions}>
                    <Stack flexDirection="row" gap={2} alignItems="center">
                        <Typography>Sometimes logging out can help</Typography>
                        <Button variant="outlined" onClick={logout}>Logout</Button>
                    </Stack>
                </Collapse>
            </Stack>
        </Stack>
    )
}