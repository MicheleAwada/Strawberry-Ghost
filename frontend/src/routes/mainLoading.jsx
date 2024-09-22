import Stack from "@mui/material/Stack"
import Spinner from "../components/spinner"

import { Outlet, useNavigation } from "react-router-dom"

export default function MainLoading() {
    const navigation = useNavigation()
    const loading = navigation.state === "loading"
    return <>
        <Outlet />
        {loading &&
            <Stack alignItems="center" justifyContent="center" sx={{ bgcolor: "rgba(255,255,255,0.4)", position: "fixed", top: 0, left: 0, height: "100vh", width: "100vw" }}>
                <Spinner sx={{width: "3rem", height: "3rem" }} color="primary" clockwise />
            </Stack>}
    </>
}