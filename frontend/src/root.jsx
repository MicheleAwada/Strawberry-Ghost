import {Outlet, useLoaderData} from "react-router"
import { RenderMessages, MessagesContext } from "./components/messages"

import { UserContext } from "./components/user"
import { getProducts, getUser } from "./fakeApi"

import Header from "./components/header"

import Box from "@mui/material/Box";
import { useContext, useEffect } from "react";
import Footer from "./components/footer"



export async function loader() {
    getProducts() // to load products from the beggining if the user opened a non products page
    return null
}

export default function Root() {
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