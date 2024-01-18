import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import { getProduct } from "../api"

import { flattenArray } from '../utils'

import { useContext, useEffect, useRef, useState } from 'react'
import {useLoaderData, redirect, useFetcher} from "react-router-dom"

import useImageRendering from '../components/useImageRendering'

import FrequentlyBoughtTogether from "../components/frequentlyBoughtTogether";
import { UserContext } from '../components/user'
import { MessagesContext } from '../components/messages'
import IconButton from '@mui/material/IconButton'
import Spinner from '../components/spinner'



export async function loader({params}) {
    const slug = params.slug
    const product = await getProduct({slug})
    if (product===undefined) {
        return redirect("/")
    }
    return product
}

export function ProductDetail({ product }) {
    function AddToCart() {

        // return (

        // )
        return 
    }

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState(0)

    
    const imageSrcsIterable = flattenArray(product.variants.map((variant) => variant.images.map((image) => image.image)))
    const [RenderImageRendering, refreshClasses] = useImageRendering(".currentColorImages", imageSrcsIterable)
    useEffect(refreshClasses, [selectedVariant])

    const allImageAlt = `${product.title}'s image`

    function getSelectedColor() {
        return product.variants[selectedVariant]
    }
    function getImages() {
        return getSelectedColor().images
    }
    function getSelectedImage() {
        return getImages()[selectedImage]
    }
    function getImageAlt(image) {
        if (image.alt!==undefined) {
            return image.alt
        }
        return allImageAlt
    }
    function RenderSelectImages({...props}) {
        return (<Stack flexDirection="row" justifyContent="center" flexWrap="wrap" gap={4} {...props}>
            {getImages().map((image, index) => {
                const borderColorSpread = {}
                if (index === selectedImage) {borderColorSpread.borderColor = "primary.main"}
                return <Paper component="button" onClick={() => setSelectedImage(index)} key={[selectedVariant, index]} variant='outlined' sx={{ borderRadius: "0.5rem", overflow: "hidden", aspectRatio: "1/1", width:"3rem", height: "3rem",  p: "1rem", boxSizing: "content-box", cursor: "pointer", ...borderColorSpread }}>
                            <img loading='eager' className='currentColorImages' src={image.image} alt={getImageAlt(image)} style={{ aspectRatio: "1/1", objectFit: "cover", width: "100%", height: "100%", borderRadius: "0.25rem" }} />
                        </Paper>
    })}
        </Stack>)
    }
    function ColorSelectDivider({ ...props }) {
        const colorsLength = product.variants.length
        return (<Divider flexItem variant='fullWidth' {...props}>
            <Typography variant="body1" color="grey.700" sx={{textAlign: "center"}}>{`${colorsLength} color${colorsLength === 1 ? "" : "s"}`}</Typography>
        </Divider>)
    }
    function RenderVariantSelect({...props}) {
        return (
        <>
            <Stack flexDirection={{xs: "column", md: "row"}} flexWrap="wrap" gap={4} {...props}>
                {product.variants.map((variant, index) => (
                        <Paper component="button" onClick={() => {
                            setSelectedVariant(index)
                            const currentVariantImageLength = variant.images.length
                            if (currentVariantImageLength <= selectedImage) {
                                setSelectedImage(0)
                            }
                        }} key={variant.id || index} variant="elevation" elevation={selectedVariant===index ? 6 : 1} sx={{borderRadius: "0.75rem", width: "auto", px:"1rem", py: "0.75rem", overflow: "hidden", cursor: "pointer", boxSizing: "content-box", borderStyle: "none" }}>
                                    <Stack alignItems="center" justifyContent="center" flexDirection="row" sx={{width: "100%", height: "auto", }}>
                                        <Typography component="p" variant='body2'>{variant.name}</Typography>
                                        {variant.isColor && <><Divider flexItem orientation="vertical" variant="fullWidth" light sx={{mx: 1}} />
                                        <Box sx={{width: "1rem", height: "1rem", borderRadius: "50%", bgcolor: variant.color}}></Box></>}
                                    </Stack>
                        </Paper>
                ))}
            </Stack>
        </>
        )
    }


    const [user, setUser] = useContext(UserContext)
    const is_authenticated = user.is_authenticated

    const { simpleAddMessage } = useContext(MessagesContext)

    const defaultQuantity = 1
    const initalVariantsId = product.variants[0].id
    function getCartItem() {
        if (!user.is_authenticated) return false
        const cartItem = user.cartitem_set.find((cartItem) => initalVariantsId === cartItem.variant) || false
        return cartItem
    }
    const [cartItem, setCartItem] = useState(getCartItem())


    const fetcher = useFetcher();
    const sumbitting = fetcher.state === "submitting";
    useEffect(() => {
        if (fetcher.data && fetcher.data.succeeded) {
            cartItem ? simpleAddMessage("Removed from cart", {severity: "success"}) : simpleAddMessage("Woohoo, added to cart", {severity: "success"})
            setUser(oldUser => ({...oldUser, ...fetcher.data.response}))
        }
    }, [fetcher.data])

    useEffect(() => {
        setCartItem(getCartItem())
    }, [user])



    return <>
        <Grid container spacing={8}  flexWrap={{xs:"wrap-reverse", md:"wrap"}}>
            <Grid xs={12} md={6} lg={6} item>
                <Stack gap={4}>
                    <Box sx={{overflow: "hidden", aspectRatio: "4/3", borderRadius: "1rem", width: "100%", }}>
                        <img src={getSelectedImage().image} alt={getImageAlt(getSelectedImage())} style={{ width: "100%", objectFit: "cover"}} />
                    </Box>
                    <RenderSelectImages />
                    <Box sx={{display: {xs: "block", md: "none"}}}>
                        <ColorSelectDivider sx={{mb: "1.5rem"}} />
                        <RenderVariantSelect />
                    </Box>
                </Stack>
            </Grid>
            <Grid xs={12} md={6} lg={6} item>
                <Box>
                    <Typography variant="h2" component={"h1"} gutterBottom color="initial">{product.title}</Typography>
                    <Typography variant="body1" component={"p"} color="initial">{product.description}</Typography>
                    <Box sx={{display: {xs: "none", md: "block"}}}>
                        <ColorSelectDivider sx={{ my: {md: "1.5rem",lg: "2rem"} }} />
                        <RenderVariantSelect />
                    </Box>
                    <Divider sx={{my: {xs:"1.5rem", md: "2rem", lg: "2.5rem"}}} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={6}>
                            <Button variant="contained" color="primary" sx={{width: "100%"}} startIcon={<ShoppingCartCheckoutIcon />}>
                                Buy Now
                            </Button>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                        <fetcher.Form action={cartItem ? "/deleteCart" : "/addToCart"} method={cartItem ? "DELETE" : "POST"}>
                            <input type="hidden" name="id" value={cartItem ? cartItem.id : 0} />
                            <input type="hidden" name="product" value={product.id} />
                            <input type="hidden" name="quantity" value={defaultQuantity} />
                            <input type="hidden" name="variant" value={initalVariantsId} />
                                <Button type={is_authenticated ? "sumbit" : "button"} onClick={() => {
                                    if (!is_authenticated) {
                                        simpleAddMessage("You cannot add to cart before you login", {severity: "error"})
                                    }
                                }} variant="outlined" color="primary" sx={{width: "100%"}} startIcon={sumbitting ? <Spinner /> : cartItem ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}>
                                    {sumbitting ? "" : cartItem ? "Remove From Cart" : "Add to Cart"}
                                </Button>
                        </fetcher.Form>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
        <RenderImageRendering />
    </>
}




export default function ProductView({ product=null }) {
    if (product===null) product = useLoaderData();

    return (
        <>
            <Container maxWidth="xl" sx={{py:"1rem"}}>
                <Stack>
                    <ProductDetail product={product} />
                    <FrequentlyBoughtTogether sx={{ mt: "5rem" }} product={product} />
                </Stack>
            </Container>
        </>
    )
}