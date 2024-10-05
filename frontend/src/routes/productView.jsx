import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MenuList from "@mui/material/MenuList"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { getProduct, getProducts } from "../api"

import { flattenArray } from '../utils'

import { useContext, useEffect, useRef, useState } from 'react'
import {useLoaderData, redirect, useFetcher, Form, useNavigation, useNavigate } from "react-router-dom"

import useImageRendering from '../components/useImageRendering'

import FrequentlyBoughtTogether from "../components/frequentlyBoughtTogether";
import { UserContext } from '../components/user'
import { MessagesContext } from '../components/messages'
import IconButton from '@mui/material/IconButton'
import Spinner from '../components/spinner'

import QuantitySelect from "../components/quantitySelect"
import VariantSelect from '../components/variantSelect'

import { ProductPrice } from '../components/productItem'
import TooltipIf from '../components/TooltipIf'
import { OrderProductCardActions } from './cart'
import ProductListView from '../components/productListView'
import ReviewsPopup from '../components/reviewsPopup'
import Reviews from '../components/productViewReviews'
import { ChangeReviewDialog } from '../components/changeReview'

export async function loader({params}) {
    const products = await getProducts()

    const slug = params.slug
    const product = await getProduct({slug})
    if (product===undefined) {
        return redirect("/")
    }
    return {product, products}
}

export function getInitialVariant(product, index=false) {
    const variantList = product.variants
    let i = 0
    for (const item of variantList) {
        const stockValue = item?.stock;

        if (stockValue && stockValue > 0) {
            const currentIndex = variantList.indexOf(item);
            return index ? currentIndex : item
        }
        i++
    }
    return index ? 0 : variantList[0]
}

export function RecommendedProducts({ product, products }) {
    let recommended_products = product?.recommended_products?.map((productid) => {
        return products.find(product => product.id === productid) || null
    }) || []
    recommended_products = recommended_products.filter((product) => product !== null)
    return (
        <Box>
            <Typography variant="h4" mb={2} textAlign="center">Similar Recommended Products</Typography>
            <ProductListView products={recommended_products} />
        </Box>
    )
}


export function ProductDetail({ product }) {


    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState(getInitialVariant(product, true))
    const actualSelectedVariant = product.variants[selectedVariant]
    const selectedVariantOutOfStock = actualSelectedVariant.stock <= 0
    
    const imageSrcsIterable = flattenArray(product.variants.map((variant) => variant.images.map((image) => image.image)))
    const [RenderImageRendering, refreshClasses] = useImageRendering(".currentColorImages", imageSrcsIterable)
    useEffect(refreshClasses, [selectedVariant])

    const allImageAlt = `${product.title}'s image`

    function getImages() {
        return actualSelectedVariant.images
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
                            <img loading='eager' className='currentColorImages' draggable={false} src={image.image} alt={getImageAlt(image)} style={{ aspectRatio: "1/1", objectFit: "cover", width: "100%", height: "100%", borderRadius: "0.25rem" }} />
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
                        }} key={variant.id} variant="outlined" sx={{ bgcolor: (variant.stock <= 0 && "grey.100"), borderColor: (index === selectedVariant ? (variant.stock === 0 ? "primary.dark" : "primary.main") : "grey.300"), width: "auto", px:"1rem", py: "0.75rem", overflow: "hidden", cursor: "pointer", boxSizing: "content-box" }}>
                                    <Stack alignItems="center" justifyContent="center" flexDirection="row" sx={{width: "100%", height: "auto", }}>
                                        <Stack flexDirection="row" gap={1} alignItems="baseline">
                                            <Typography component="p" variant='body2'>{`${variant.name}`}</Typography>
                                            <Typography component="p" variant='overline'>{`${variant.stock === 0 ? "(out of stock)" : ""}`}</Typography>
                                        </Stack>
                                        {variant?.color !== null && <><Divider flexItem orientation="vertical" variant="fullWidth" light sx={{mx: 1}} />
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




    const fetcher = useFetcher();
    const sumbitting = fetcher.state === "submitting";
    useEffect(() => {
        if (fetcher.data && fetcher.data.succeeded) {
            const method = fetcher.formMethod
            simpleAddMessage(method === "POST" ? "Woohoo, added to cart" : "Woohoo, changed cart", {severity: "success"})
            setUser(oldUser => ({...oldUser, ...fetcher.data.response}))
        }
    }, [fetcher.data])



    
    // const initalVariantsId = getInitialVariant(product).id
    // const variantState = useState(initalVariantsId)
    // const [formSelectedVariant, setFormSelectedVariant] = variantState
    // const formSelectedActualVariant = product.variants.find(variant => variant.id === formSelectedVariant)
    // const formSelectedVariantStock = formSelectedActualVariant?.stock
    // const formSelectedVariantOutOfStock = formSelectedActualVariant && formSelectedVariantStock <= 0
    
    const defaultQuantity = 1
    const quantityState = useState(defaultQuantity)
    const [quantity, setQuantity] = quantityState
    
    const cartItem = user?.cartitem_set?.find((cartItem) => actualSelectedVariant.id === cartItem.variant) || false

    const navigate = useNavigate()


    const [reviewModalOpen, setReviewModalOpen] = useState(false)

    return <>
        <Box sx={{ p: "2rem", }}>
            <Grid container spacing={8} flexWrap={{xs:"wrap-reverse", md:"wrap"}}>
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
                <Grid xs={12} md={6} lg={6} item sx={{ overflow: "hidden" }}>
                    <Box>
                        <Typography variant="h2" component={"h1"} gutterBottom sx={{ width: "100%" }} color="initial">{product.title}</Typography>
                        <Typography variant="body1" component={"p"} gutterBottom color="initial">{product.description}</Typography>
                        <ProductPrice price={product.price} sx={{ mt: "1rem" }} />
                        <Box sx={{ my: "1rem"}} display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
                            <ReviewsPopup product={product} />
                            {(product.variants.some(variant => variant.can_review)) && (
                                <>
                                    <Button variant="outlined" onClick={() => setReviewModalOpen(true)}>{actualSelectedVariant.posted_review ? "Edit Review" : "Review Product"}</Button>
                                    <ChangeReviewDialog changeReviewProps={{ product: product }} openState={[reviewModalOpen, setReviewModalOpen]} />
                                </>
                            )}
                        </Box>
                        {actualSelectedVariant.stock == 0 ? <Typography color="error">Out of stock</Typography> : actualSelectedVariant.stock < 10 && <Typography color="error">Only {actualSelectedVariant.stock} left in stock</Typography>}
                        <Box sx={{display: {xs: "none", md: "block"}}}>
                            <ColorSelectDivider sx={{ my: {md: "1.5rem",lg: "2rem"} }} />
                            <RenderVariantSelect />
                        </Box>
                        {/* <Divider sx={{my: {xs:"1.5rem", md: "2rem", lg: "2.5rem"}}} /> */}
                        <Stack gap={2} mt={4}>
                            <Stack flexDirection="row">
                                <QuantitySelect quantityState={quantityState} max={actualSelectedVariant.stock} id="product-view-quantity" />
                            </Stack>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} lg={6}>
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        const formData = new FormData(e.target)
                                        navigate("/checkout", {state: {formData: formData}})
                                    }} method="POST">
                                        <input type="hidden" name="variant_id" value={actualSelectedVariant.id} />
                                        <input type="hidden" name="quantity" value={quantity} />
                                        <TooltipIf placement='top' tooltipText={selectedVariantOutOfStock ? (!is_authenticated ? "This variant is out of stock, and you need to login": "This variant is out of stock") : "You need to login first"} condition={!is_authenticated || selectedVariantOutOfStock}>
                                            <Box>
                                                <Button disabled={selectedVariantOutOfStock} type={is_authenticated ? "button" : "button"} onClick={() => {
                                                    if (!is_authenticated) {
                                                        simpleAddMessage("You cannot checkout before you login. Additionally, checking out is temporarily disabled due to some complications with stripe", {severity: "error"})
                                                    } else {
                                                        simpleAddMessage("Checking out is temporarily disabled due to some complications with stripe", {severity: "error"})
                                                    }
                                                }} variant="contained" color="primary" sx={{width: "100%"}} startIcon={<ShoppingCartCheckoutIcon />}>
                                                    Buy Now
                                                </Button>
                                            </Box>
                                        </TooltipIf>
                                    </form>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Stack flexDirection="row" flexWrap="wrap" justifyContent="flex-end" useFlexGap spacing={2}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <fetcher.Form action={cartItem ? "/putCart" : "/addToCart"} method={cartItem ? "PATCH" : "POST"}>
                                                {cartItem && <input type="hidden" name="id" value={cartItem.id} />}
                                                <input type="hidden" name="product" value={product.id} />
                                                <input type="hidden" name="quantity" value={quantity} />
                                                <input type="hidden" name="variant" value={actualSelectedVariant.id} />
                                                <TooltipIf placement='top' tooltipText={selectedVariantOutOfStock ? (!is_authenticated ? "This variant is out of stock, and  you need to login": "This variant is out of stock") : "You need to login first"} condition={!is_authenticated || selectedVariantOutOfStock}>
                                                    <Box>
                                                        <Button disabled={selectedVariantOutOfStock} type={is_authenticated ? "sumbit" : "button"} onClick={() => {
                                                            if (!is_authenticated) {
                                                                simpleAddMessage("You cannot add to cart before you login", {severity: "error"})
                                                            }
                                                        }} variant="outlined" color="primary" sx={{width: "100%"}} startIcon={sumbitting ? <Spinner /> : (cartItem ? <EditIcon /> : <AddShoppingCartIcon />)}>
                                                            {(cartItem ? "Update Cart" : "Add to Cart")}
                                                        </Button>
                                                    </Box>
                                                </TooltipIf>
                                            </fetcher.Form>
                                        </Box>
                                        <Box>
                                            <OrderProductCardActions product={{...product, variant: actualSelectedVariant, cartId: (cartItem?.id), quantity: quantity, saveForLater: cartItem?.saveForLater || false}} />
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        <RenderImageRendering />
    </>
}




export default function ProductView({ product=null, products=null }) {
    if (product===null && products===null) {
        ({product, products} = useLoaderData())
    }

    return (
        <Container id="duckkk" maxWidth="xl" sx={{py:"0rem", px: "0 !important", width: "100%", }}>
            <Stack spacing={6}>
                <ProductDetail product={product} />
                <FrequentlyBoughtTogether product={product} products={products} />
                <Reviews product={product} />
                <Box sx={{ width: "100%", boxSizing: "border-box", py: "4rem" }}>
                    <Divider flexItem sx={{ mx:"4rem", }} />
                </Box>
                <RecommendedProducts product={product} products={products} />
            </Stack>
        </Container>
    )
}