import { getOrders } from "../fakeApi";
import { useLoaderData } from "react-router-dom"


import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export async function loader() {
    return await getOrders()
}

export default function Orders() {
    const orders = useLoaderData();
    console.log("route")
    console.log(orders)
    return (
        <Stack>
            {orders.map((order, index) => {
                
                return <Box key={index} my={4}>
                    <Typography variant="h4" color="initial">
                        Order on {order.time}
                    </Typography>
                </Box>
            })}
        </Stack>
    )
}