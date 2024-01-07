import Button from '@mui/material/Button'

import { MessagesContext } from '../root'
import { useContext } from 'react';
import { getProducts } from "../fakeApi";
import { useLoaderData } from "react-router-dom"
import ProductListView from '../components/productListView';

export async function loader() {
    return await getProducts();
}


export default function Index() {
    const products = useLoaderData();
    const simpleAddMessage = useContext(MessagesContext).simpleAddMessage;
	return (
        <>
        <ProductListView products={products} />
        </>
	)
}
