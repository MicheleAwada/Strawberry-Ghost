import {Outlet, useLoaderData} from "react-router"
import { RenderMessages, MessagesContext } from "./components/messages"

import { UserContext } from "./components/user"
import { getProducts, getUser } from "./fakeApi"

import Header from "./components/header"

import Box from "@mui/material/Box";
import { useContext, useEffect } from "react";



export async function loader() {
    getProducts() // to load products from the beggining if the user opened a non products page
    const user = await getUser()
    return user
}

export default function Root() {
    const acutalUser = useLoaderData();
    const [_, setUser] = useContext(UserContext)
    useEffect(() => {
        setUser(acutalUser)
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