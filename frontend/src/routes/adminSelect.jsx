import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom"

import SelectProducts from "../components/selectProducts";
import { getProducts } from "../api";

import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

export async function loader() {
    return await getProducts()
}

export default function AdminUpdateSelect({ isDelete = false }) {
    const products = useLoaderData()
    const navigate = useNavigate()
    const selectedProductIdState = useState([])
    const [selectedProductId] = selectedProductIdState

    useEffect(() => {
        if (selectedProductId.length>0) {
            const id = selectedProductId[0]
            const product = products.find(product => product.id === id)
            const slug = product.slug
            navigate(`/admin/products/${isDelete ? "delete" : "update"}/${slug}`)
        }
    }, [selectedProductId])

    return (
        <Container maxWidth="lg">
            <Stack gap={2} pt={4}>
                <Typography sx={{ textAlign: "center" }} variant="h4">{`Click on the select icon of the desired product to ${isDelete ? "Delete" : "Update"}`}</Typography>
                <SelectProducts products={products} selectedProductIdState={selectedProductIdState} />
            </Stack>
        </Container>
    )
}