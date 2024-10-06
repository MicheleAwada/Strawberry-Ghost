
import { MessagesContext } from '../root'
import { useContext, useRef } from 'react';
import { getProducts } from "../api";
import { useLoaderData } from "react-router-dom"
import ProductListView from '../components/productListView';

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { HeaderHeightContext } from '../components/header';

export async function loader() {
    const products =  await getProducts()
    return products
}


export default function Index() {
    const products = useLoaderData();
    const { simpleAddMessage } = useContext(MessagesContext);
    const [headerHeight] = useContext(HeaderHeightContext)
    const productListViewRef = useRef()
    function buttonOnClick() {
        if (!productListViewRef.current) {
            return;
        }

        const topPosition = productListViewRef.current.offsetTop - headerHeight;

        window.scrollTo({
            top: topPosition,
            behavior: "smooth",
        });
    }
	return (
        <>
        <Box ref={productListViewRef}>
            <ProductListView paginated={true} products={products} />
        </Box>
        </>
	)
}
