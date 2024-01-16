import {Outlet, useLoaderData} from "react-router"
import { RenderMessages, MessagesContext } from "./components/messages"

import { UserContext } from "./components/user"
import { getProducts } from "./fakeApi"

import Header from "./components/header"

import Box from "@mui/material/Box";
import { useContext, useEffect, useState } from "react";
import Footer from "./components/footer"

import ScrollToTop from "./components/scrollToTop"

import { getUser, is_authenticated, set_token } from "./api"


export async function loader() {
    getProducts() // to load products from the beggining if the user opened a non products page
    let user = {};
    if (is_authenticated()) {
        user = await getUser()
    }
    return user
}

export default function Root() {
    const gotUser = useLoaderData()
    const [user, setUser] = useContext(UserContext)
    useEffect(() => {if (gotUser.response) {
        setUser({...gotUser.response, is_authenticated: true})
    }}, [])
    ScrollToTop()
    return (
        <Box>
            <RenderMessages />
            <Header />
            <Outlet />
            <Footer />
        </Box>
    )
}


export { MessagesContext }