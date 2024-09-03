import { deleteProduct, getProduct } from "../api";
import { Form, useActionData, useLoaderData, useNavigate } from "react-router-dom"
import ProductItem from "../components/productItem";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext, useEffect } from "react";
import { MessagesContext } from "../root";

export async function loader({params}) {
    const slug = params.slug
    return (await getProduct({slug})) || null
}

export async function action({request, params}) {
    const slug = params.slug
    return await deleteProduct({slug_for_delete: slug})
}


export default function AdminDeleteProduct() {
    const product = useLoaderData()
    const actionData = useActionData()

    const {simpleAddMessage} = useContext(MessagesContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (actionData?.succeeded) {
            simpleAddMessage("Product Deleted", {severity: "success"})
        } else if (actionData?.succeeded === false) {
            simpleAddMessage(actionData.errorMessage, {severity: "error"})
        } if (product === null) {
            simpleAddMessage("product can't be found", {severity: "error"})
            navigate("/admin")
        }
    }, [product, actionData])

    const isSm = useMediaQuery(theme => theme.breakpoints.up('sm'))

    if (product === null) {
        return <></>
    }

    return <Stack gap={4} alignItems="center" pt={4}>
        <Stack>
            <Typography variant={isSm ? "h2" : "h4"} sx={{ textAlign: "center" }}>ARE YOU SURE?!</Typography>
            <Typography variant={isSm ? "h4" : "h6"} sx={{ textAlign: "center" }}>Delete {product.title}</Typography>
        </Stack>
        <Box sx={{ maxWidth: "20rem" }}>
            <ProductItem product={product} />
        </Box>
        <Form method="POST">
            <Button variant="contained" color="error" type="submit">Delete</Button>
        </Form>
    </Stack>
}