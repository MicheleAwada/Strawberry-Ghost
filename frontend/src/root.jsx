import {Outlet, useLoaderData} from "react-router"
import { RenderMessages, MessagesContext } from "./components/messages"

import { UserContext } from "./components/user"

import Header from "./components/header"

import Box from "@mui/material/Box";
import { useContext, useEffect, useState } from "react";
import Footer from "./components/footer"

import ScrollToTop from "./components/scrollToTop"

import { getUser, is_authenticated, logout, getProducts } from "./api"
import { useGoogleOneTapLogin } from "./routes/googleLogin";


export async function loader() {
    getProducts() // to load products from the beggining if the user opened a non products page but no asyncly
    let user = null;
    if (is_authenticated()) {
        const userGot = await getUser()
        if (!userGot.succeeded && userGot.errorType=="external" && userGot.errorMessage === "Invalid token.") {
            logout()
        }
        if (userGot.succeeded) {
            user = userGot.response
        }
    }
    return user
}

export default function Root() {
    const gotUser = useLoaderData()
    const [_, setUser] = useContext(UserContext)
    useEffect(() => {
        if (gotUser) {
            setUser({...gotUser, is_authenticated: true})
        }
    }, [])

    useGoogleOneTapLogin()


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