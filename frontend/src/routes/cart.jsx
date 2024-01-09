import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import productListView from '../components/productListView'
import ProductListView from '../components/productListView'
import { getCartProducts } from '../fakeApi'
import { useLoaderData } from "react-router-dom"

export async function loader() {
    return await getCartProducts()
}
export default function Cart() {
    const productsInCart = useLoaderData()
    return (
          <ProductListView products={productsInCart} />
    )
}