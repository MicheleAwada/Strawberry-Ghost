import Button from '@mui/material/Button'

import { MessagesContext } from '../root'
import { useContext } from 'react';
import { getProducts } from "../api";
import { useLoaderData } from "react-router-dom"
import ProductListView from '../components/productListView';
import IndexCarousel from '../components/carousel';
import Container from '@mui/material/Container'

export async function loader() {
    return await getProducts()
}


export default function Index() {
    const products = useLoaderData();
    const simpleAddMessage = useContext(MessagesContext).simpleAddMessage;
	return (
        <>
        <IndexCarousel />
        <ProductListView products={products} />
        </>
	)
}
