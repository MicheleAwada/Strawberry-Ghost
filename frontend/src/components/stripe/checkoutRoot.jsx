import { useContext, useEffect, useState } from "react";

import { Outlet, useFetcher, useLoaderData, useLocation, useNavigate, Link as ReactRouterLink } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { MessagesContext } from "../messages";
import CheckoutForm from "./CheckoutForm";
import Spinner from "../spinner";

import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

import { create_payment_intent, getProducts } from "../../api";
import { UserContext } from "../user";
import { getVariant } from "../../utils";

// export const stripePromise = stripecode

export default function CheckoutRoot() {
    const [user] = useContext(UserContext)


    const { simpleAddMessage } = useContext(MessagesContext)
    const [clientSecret, setClientSecret] = useState("");

    const location = useLocation()
    const { state } = location

    const formData = state?.formData || null
    
    
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        
        const clientSecret = new URLSearchParams(location.search).get("payment_intent_client_secret") || null
        if (clientSecret===null) {
            (async () => {
                const data = await create_payment_intent(formData)
                if (data.succeeded) {
                    setClientSecret(data.response.clientSecret)
                    setTotalPrice(data.response.cost)
                    if (data.response.modified_changed) {
                        simpleAddMessage("Successful, but please note that some of your cart products may have changed", { severity: "success" })
                    }
                    
                } else {
                    simpleAddMessage(data.errorMessage, { severity: "error" })
                }
            })();
        } else {
            setClientSecret(clientSecret)
        }
    }, [])



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
        clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm totalPrice={totalPrice} />
            </Elements>) : <Stack alignItems="center" py={8}>
                <Spinner color="primary" clockwise={true} sx={{ width: "4rem", height: "4rem", aspectRatio: "1/1" }} />
            </Stack>
    )
}