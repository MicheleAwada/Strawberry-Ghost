import React, { useContext, useEffect, useState } from "react";
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Spinner from "../spinner";
import { MessagesContext } from "../messages";
import { useNavigate } from "react-router-dom";
import { ProductPrice } from "../productItem";


export default function CheckoutForm({ totalPrice }) {
  const { simpleAddMessage } = useContext(MessagesContext)
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function setBothMessages(message, severity) {
    setMessage(message);
    simpleAddMessage(message, { severity: severity })
  }
  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setBothMessages("Payment succeeded!", "success");
          navigate("/checkout/success/", { replace: true });
          break;
        case "processing":
          setBothMessages("Your payment is processing.", "info");
          break;
        case "requires_payment_method":
          setBothMessages("Your payment was not successful, please try again.", "error");
          break;
        default:
          setBothMessages("Something went wrong.", "error");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // PROD
        // return_url: "http://localhost:5173/checkout",
        return_url: "https://strawberryghost.org/checkout",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  }

  return (
    <Box sx={{ py: "2rem", maxWidth: {xs: "calc(100% - 2rem)", sm: "calc(100% - 8rem)", md: "90%", lg: "50rem"}, mx: "auto" }}>
        <form id="payment-form" onSubmit={handleSubmit}>
          <Stack gap={4}>
              <Stack>
                <Stack flexDirection="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" component="h1">Checkout</Typography>
                    <Typography variant="subtitle2">Safe with Stripe</Typography>
                  </Box>
                    <Stack alignItems="center" gap={1} flexDirection="row">
                      <Typography variant="body1" component="h1">Total Cost</Typography>
                      <Typography variant="subtitle2"><ProductPrice price={totalPrice} /></Typography>
                    </Stack>
                </Stack>
              </Stack>
              <PaymentElement id="payment-element" options={paymentElementOptions} />
              <AddressElement options={{
                mode: 'shipping',
                allowedCountries: ['US'],
                blockPoBox: true,
                fields: {
                    phone: 'always',
                },
                validation: {
                    phone: {
                    required: 'never',
                    },
                },
                }} />
              <Stack flexDirection="row" justifyContent="space-between">
              <Box>{message && 
                <Typography id="payment-message" sx={{ textAlign: "right" }} color="primary">{message}</Typography>
              }</Box>
                  <Button variant="contained" disabled={isLoading || !stripe || !elements} type="submit">
                    {/* <span id="button-text"> */}
                      {isLoading ? <Spinner /> : "Pay now"}
                    {/* </span> */}
                  </Button>
              </Stack>
              {/* Show any error or success messages */}
          </Stack>
        </form>
    </Box>
  );
}