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
import CheckoutForm from "./components/CheckoutForm";

export const stripePromise = loadStripe("pk_test_51ObSfPGnyNBIXyJqEWPk1CjJmtOROwPNpBshCNFPxhiPSggJHEIDCCps2ZQJtoevN1hqHUynGn8XRuiFqhIjXbab00lfCBgbbu");


export default function Root() {
    const { simpleAddMessage } = useContext(MessagesContext)
    const [clientSecret, setClientSecret] = useState("");
    
    const stripeFetcher = useFetcher()

    useEffect(() => {
        const dummyFormData = new FormData()
        stripeFetcher.submit(dummyFormData, {
            method: "post",
            action: "/create-payment-intent",
        })
    }, [])

    useEffect(() => {
        if (stripeFetcher?.data?.succeeded) {
            setClientSecret(stripeFetcher.data.response.clientSecret)
        } else if (stripeFetcher?.data?.succeeded===false) {
            simpleAddMessage(stripeFetcher.data.errorMessage, { severity: "error" })
        } else {
        }
    }, [stripeFetcher?.data])

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#f06292',
        },
    };

    const options = {
    clientSecret,
    appearance,
    };

    return (
        <Box>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
                </Elements>
            )}
        </Box>
    )
}