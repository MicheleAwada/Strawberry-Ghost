import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"

import ProductItem from "./productItem"
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { ProductPrice } from "./productItem"
import { Fragment, useContext, useEffect, useMemo, useState } from "react"
import { useFetcher } from "react-router-dom"
import { UserContext } from "./user"
import Spinner from "./spinner"
import { MessagesContext } from "./messages"
import { addCartItem, changeCartItem, is_authenticated } from "../api"
import { loader as getUser } from "../root"

import wave from "../assets/components/frequentlyBoughtTogether/wave.svg"
import upside_down_wave from "../assets/components/frequentlyBoughtTogether/wave-upside-down.svg"

function Plus({isEquals=false, ...props}) {
    return <Stack justifyContent="center" alignItems="center" sx={{ width: "100%", height: "100%" }}>
        <Typography {...props} variant="h5">{isEquals ? "=" : "+"}</Typography>
    </Stack>
}

export default function FrequentlyBoughtTogether({ product, products, ...props }) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useContext(UserContext)
    const { simpleAddMessage } = useContext(MessagesContext)
    async function addAllToCart() {
        if (!user.is_authenticated) {
            simpleAddMessage("You must be logged in to add to cart!", {severity: "error"})
            return
        }
        setLoading(true)
        

        
        await Promise.allSettled(allFrequentlyBoughtTogether.map((product) => {
            const cartItem = user?.cartitem_set?.find(cartItem => cartItem.variant === product.variants[0].id) || false
            if (cartItem) { // check if product is already in cart
                return changeCartItem({ id: cartItem.id, quantity: cartItem.quantity, saveForLater: false })
            }
            return addCartItem({ quantity: 1, product: product.id, variant: product.variants[0].id, saveForLater: false })
        }))





        const newUpdatedUser = await getUser()
        setUser({ ...newUpdatedUser, is_authenticated: true })
        setLoading(false)
        simpleAddMessage("Added Products to Cart", {severity: "success"})

    }
    

    const frequentlyBoughtTogether = product.frequentlyBoughtTogether.map(productId => products.find(product => product.id === productId))
    const allFrequentlyBoughtTogether = [product, ...frequentlyBoughtTogether]
    const totalCost = allFrequentlyBoughtTogether.reduce((acc, product) => acc+parseFloat(product.price),0)

    // const sumGridProps = { xs: 12, sm: 6, md: 4, lg:12, }
    // const productGridProps = { xs: 12, sm: 4.5, md: 4, lg:3, }
    // const plusGridProps = { xs: 12, sm: 1, md: 2, lg:1, height: {xs: "2rem", sm: "initial"} }
    // const equalsGridProps = { xs: 12, sm: 1, md: 1, lg:12, height: {xs: "2rem", sm: "initial"} }
    return (
        <Stack sx={{ width: "100%"}}>
            <Box sx={{ backgroundImage: `url(${wave})`, backgroundRepeat: "no-repeat", backgroundSize: "contain", aspectRatio: 9/1, width: "100%" }} />
            <Stack bgcolor="background.dark" {...props}  justifyContent="center" alignItems="center" sx={{ width: "100%", px: {xs: "2rem", sm: "4rem"}, boxSizing: "border-box", py: "2rem" }}>
                <Typography color="text.secondary" sx={{ width: "100%" }} mb={6} variant="h4" component="h4" textAlign="left">Frequently Bought Together</Typography>
                <Box sx={{ width: "100%" }}>
                    <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="center" gap={6}>
                        {allFrequentlyBoughtTogether.map((currentProduct, index) => {
                            const isEquals = allFrequentlyBoughtTogether.length-1===index
                            return <Fragment key={currentProduct.id || index}>
                                    <Box sx={{ width: {xs: "100%", sm: "35%", md: "30%", lg: "15%"}, }}>
                                        <ProductItem product={currentProduct} />
                                    </Box>
                                    <Box sx={{ width: {xs: (isEquals ? "100%" : "initial"), md: "initial"} }}>
                                        <Plus isEquals={isEquals} />
                                    </Box>
                            </Fragment>
                            }
                            )}
                        <Box sx={{ width: {xs: "100%",sm: "initial"} }}>
                            <Stack justifyContent="center" sx={{ height: "100%" }}>
                                <Paper variant="outlined" sx={{ py: "4rem", px: { xs: 0, sm: "4rem" }, width: { xs: "100%", sm: "initial" } }}>
                                    <Stack alignItems="center" justifyContent="center" gap="1rem">
                                        <ProductPrice price={totalCost} textColor="primary" />
                                        <Button variant="contained" startIcon={loading ? <Spinner /> : <AddShoppingCartIcon />} onClick={addAllToCart}>{"Add to Cart"}</Button>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Stack>
            <Box sx={{ backgroundImage: `url(${upside_down_wave})`, backgroundRepeat: "no-repeat", backgroundSize: "contain", aspectRatio: 9/1, width: "100%" }} />
        </Stack>
    )
}