import { getOrders } from "../fakeApi";
import { useLoaderData } from "react-router-dom"


import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useState } from "react";
import ProductListView from "../components/productListView";

import { OrderProductCardActions } from "./cart";
import { OrderProductCardExtras } from "./cart";
import Divider from '@mui/material/Divider'



export async function loader() {
    return await getOrders()
}

export default function Orders() {
    const orders = useLoaderData();
    
    const createDict = length => Object.assign({}, ...Array.from({ length }, (_, i) => ({ [i + 1]: false })));
    const [openedOrder, setOpenedOrder] = useState(createDict(orders.length))
    function handleOrderClick(orderId) {
        return setOpenedOrder(old => ({...old, [orderId]: !old[orderId]}))
    }
    function isOrderOpened(orderId) {
        return openedOrder[orderId]
    }
    const getStatusColor = (status) => (
    {
        'making': 'primary',
        'shipping': 'secondary',
        'shipped': 'error',
        'delivered': 'info',
    }[status] || "primary");

    const getOrderProducts = (order) => {
        return order.productsBought.map((productDetail) => {
            const variant = productDetail.variant
            const quantity = 2
            return {...productDetail.product, variant, quantity }
        })
    }
    return (
        <Container maxWidth="xl" sx={{ my: 4 }}>
            <Stack gap={4}>
                {orders.map(order => {
                    const isOpened = isOrderOpened(order.id)
                    return <Paper key={order.id} variant="outlined" >
                        <Stack>
                            <Stack component="button" sx={{ cursor: "pointer", bgcolor: "grey.100", border: "none", px: {xs:2, md:4}, py:4 }} onClick={() => handleOrderClick(order.id)} flexDirection="row" justifyContent="space-between">
                                <Stack gap={2} flexDirection="row" alignItems="end" flexWrap="wrap">
                                    <Typography variant="h4" color="initial">
                                        Order on {order.time}
                                    </Typography>
                                    <Chip label={`${order.status}`} color={getStatusColor(order.status)} variant="outlined" sx={{ mb: 0.5 }} />
                                </Stack>
                                {isOpened ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </Stack>
                            <Collapse in={isOpened}>
                                <Box sx={{ height: "2rem", width: "100%", bgcolor: "grey.100" }}>
                                    <Box sx={{ height: "2rem", width: "100%", bgcolor: "white", borderRadius: "16rem 16rem 0 0" }} />
                                </Box>
                                <Box py={6}>
                                    <Typography variant="h5" component="h5" sx={{ textAlign: "center" }}>Details</Typography>
                                    <Stack flexDirection="row" flexWrap="wrap" gap={4} alignItems="center">
                                        <Paper variant="elevation" elevation={4}>
                                          
                                        </Paper>
                                    </Stack>
                                    <Divider
                                      variant="inset"
                                      orientation="horizontal"
                                      sx={{my: 3}}
                                    />
                                    <Typography variant="h5" component="h5" sx={{ textAlign: "center" }}>Products Bought</Typography>
                                    <ProductListView products={getOrderProducts(order)} productItemProps={{ ProductCartActions: OrderProductCardActions, ProductCardExtras: OrderProductCardExtras  }} />
                                </Box>
                            </Collapse>
                        </Stack>
                    </Paper>
                })}
            </Stack>
        </Container>
    )
}