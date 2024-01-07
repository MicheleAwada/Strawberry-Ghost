import {Outlet} from "react-router"
import { RenderMessages, MessagesContext } from "./components/messages"

import Header from "./components/header"

import Box from "@mui/material/Box";

export default function Root() {
    return (
        <Box>
            <RenderMessages />
            <Header />
            <Outlet />
        </Box>
    )
}


export { MessagesContext }