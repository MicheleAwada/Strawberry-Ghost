import {Outlet, useLoaderData} from "react-router"
import { RenderMessages, MessagesContext } from "./components/messages"

import { UserContext } from "./components/user"
import { getProducts, getUser } from "./fakeApi"

import Header from "./components/header"

import Box from "@mui/material/Box";
import { useContext, useEffect } from "react";



export async function loader() {
    getProducts() // to load products from the beggining
    const user = getUser()
    return user
}

export default function Root() {
    const user = useLoaderData();
    const [_, setUser] = useContext(UserContext)
    useEffect(() => {
        setUser(user)
    }, [])
    
    return (
        <Box>
            <RenderMessages />
            <Header />
            <Outlet />
        </Box>
    )
}


export { MessagesContext }