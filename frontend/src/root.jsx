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
import { useFetcher } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export const stripePromise = loadStripe("pk_test_51ObSfPGnyNBIXyJqEWPk1CjJmtOROwPNpBshCNFPxhiPSggJHEIDCCps2ZQJtoevN1hqHUynGn8XRuiFqhIjXbab00lfCBgbbu");

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

    async function getAndSetUser() {
        const refreshedUser = await loader()
        if (refreshedUser !== null) {
            setUser({...refreshedUser, is_authenticated: true})
        }

    }

    useEffect(() => {
        if (gotUser) {
            setUser({...gotUser, is_authenticated: true})
        }

        const refreshUserInterval = setInterval(getAndSetUser, 20000)


        return () => clearInterval(refreshUserInterval)
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