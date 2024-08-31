import ProductListView from '../components/productListView'
import { Form, useFetcher, useLoaderData, useNavigate } from "react-router-dom"

import { UserContext } from '../components/user'


import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from "@mui/material/useMediaQuery"
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon' 
import ListItemText from '@mui/material/ListItemText' 
import Chip from '@mui/material/Chip'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Link as ReactRouterLink } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from 'react'
import { MessagesContext } from '../root'
import { domain_url, getProducts } from '../api'
import Spinner from '../components/spinner'
import QuantitySelect from '../components/quantitySelect'

export function fetcherUseEffect(fetcher) {
    const { simpleAddMessage } = useContext(MessagesContext)
    const [user, setUser] = useContext(UserContext)


    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.succeeded) {
                setUser({...fetcher.data.response, is_authenticated: true})
            } else {
                simpleAddMessage(fetcher.data.errorMessage, { severity: "error" })
            }
        }
    }, [fetcher.data])
}
export function OrderProductCardActions({ product }) {
    const { simpleAddMessage } = useContext(MessagesContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const closeMenu = () => {
        setAnchorEl(null);
    }
    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }



    
    const isCartItem = Boolean(product?.cartId)

    const fetcherRemoveCart = useFetcher()
    fetcherUseEffect(fetcherRemoveCart)
    const fetcherRemoveCartLoading = fetcherRemoveCart.state === "submitting"
    function handleRemoveCartItem() {
        fetcherRemoveCart.submit({ id: product?.cartId }, { action: "/deleteCart", method: "delete" })
    }
    const fetcherSaveLater = useFetcher()
    fetcherUseEffect(fetcherSaveLater)
    const fetcherSaveLaterLoading = fetcherSaveLater.state === "submitting"
    function handleAddToSaveLaterCartItem(saveForLater=false) {
        if (product.variant.stock <= 0) {
            simpleAddMessage("Out of stock", { severity: "warning" })
            return
        }
        if (!isCartItem) {
            fetcherSaveLater.submit({ saveForLater: true, quantity: product?.quantity, variant: product.variant.id, product: product.id }, { action: "/addToCart", method: "post" })
        } else {
            fetcherSaveLater.submit({ id: product?.cartId, saveForLater: saveForLater }, { action: "/putCart", method: "patch" })
        }
    }

    return <Box sx={{width: "100%"}}>
            <Stack flexDirection="row" justifyContent="end" sx={{ width: "100%" }}>
                <IconButton color="default" onClick={openMenu}>
                    <MoreHorizIcon />
                </IconButton>
            </Stack>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                >	
                    <MenuItem onClick={(() => {
                        handleAddToSaveLaterCartItem(!product.saveForLater)
                    })}>
                        <ListItemIcon>
                            {fetcherSaveLaterLoading ? <Spinner /> : product?.saveForLater ? <AddShoppingCartIcon /> : <AccessTimeIcon />}
                        </ListItemIcon>
                        <ListItemText><Typography>{isCartItem ? product.saveForLater ? "Add Back to Cart" : "Put in Save For Later" : "Add to Save For Later"}</Typography></ListItemText>
                    </MenuItem>
                    {isCartItem && [<Divider key={1} />,
                    <MenuItem key={2} onClick={handleRemoveCartItem}>
                        <ListItemIcon>
                            {fetcherRemoveCartLoading ? <Spinner /> : <RemoveShoppingCartOutlinedIcon />}
                        </ListItemIcon>
                        <ListItemText><Typography>Remove from Cart</Typography></ListItemText>
                    </MenuItem>]}
                </Menu>
        </Box>
}
export function OrderProductCardExtras({ children, product }) {
    const variant = product.variant

    const fetcher = useFetcher()
    const loading = fetcher.state === "submitting"
    fetcherUseEffect(fetcher)

    const quantityState = useState(product.quantity)

    useEffect(() => {
       if (quantityState[0] !== product.quantity) {
           fetcher.submit({ id: product.cartId, quantity: quantityState[0] }, { action: "/putCart", method: "patch" })
       }
    }, [quantityState[0]])

    useEffect(() => {
        quantityState[1](product.quantity)
    }, [product.quantity])


    return <Stack gap={1} mt={2}>
        <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={2}>
            {children}
            <Tooltip title="Variant specified" >
                <Chip label={variant.name} color="primary" variant='filled' sx={{cursor: "pointer"}} />
            </Tooltip>
        </Stack>
        <Stack flexDirection="row" alignItems="center">
            <QuantitySelect quantityState={quantityState} id={`cart-view-${product.cartId}`} />
            {loading && <Spinner color="primary" />}
        </Stack>
    </Stack>
}


export async function loader() {
    return await getProducts()
}
export default function Cart() {
    const products = useLoaderData()
    const [user] = useContext(UserContext)
    const cart = user.cartitem_set || []

    const productsInCartAndSaveForLater = cart.map(cartItem => {
        const quantity = cartItem.quantity
        const saveForLater = cartItem.saveForLater
        const cartId = cartItem.id
        
        // get real product from pk
        const productId = cartItem.product
        const product = products.find(product => product.id === productId)
        // get real variant from pk
        const variantId = cartItem.variant
        const variant = product.variants.find(variant => variant.id === variantId)
        return {...product, variant, quantity, saveForLater, cartId}
    })

    const productsInCart = productsInCartAndSaveForLater.filter(product => !product.saveForLater)
    const productsInSaveForLater = productsInCartAndSaveForLater.filter(product => product.saveForLater)


    const isSm = useMediaQuery(theme => theme.breakpoints.up('sm'))



    const navigate = useNavigate()
    const totalPrice = cart.reduce((sum, cartItem) => sum + cartItem.product.price*cartItem.quantity, 0)

    const checkoutFormRef = useRef()

    return (
          <Container maxWidth="lg">
                <Typography variant={ isSm ? "h4" : "h5" } component="h5" color="initial" gutterBottom sx={{pt: {xs: "1rem", sm: "2rem"}, textAlign: "center"}}>
                    You have {productsInCart.length} items in your cart
                </Typography>
              <Divider
                variant="middle"
                orientation="horizontal"
                light={false}
              />
              <Stack rowGap={2} columnGap={4} flexDirection="row" flexWrap={"wrap"} justifyContent="center" alignItems="center" sx={{ my: 2 }}>
                <form ref={checkoutFormRef} method="POST" onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    navigate("/checkout", {state: {formData: formData}})
                }}>
                    <input type="hidden" name="is_cart_checkout" value={true} />
                    <Button type='submit' variant="contained" size='large' color="primary"  startIcon={<ShoppingCartCheckoutIcon />} disabled={productsInCart.length === 0}>
                        Checkout
                    </Button>
                </form>
                <Button variant="outlined" size='large' color="primary"  startIcon={<AddShoppingCartIcon />} LinkComponent={ReactRouterLink} to="/" >
                    More Shopping
                </Button>
              </Stack>
              <Divider
                variant="middle"
                orientation="horizontal"
                light={false}
              />
              <ProductListView emptyProductsMessage={<Typography color="text.secondary">Their are no items in your cart</Typography>} products={productsInCart} productItemProps={{ ProductCardActions: OrderProductCardActions, ProductCardExtras: OrderProductCardExtras  }} />
              <Divider><Typography color="grey.600">In Your Save For Later</Typography></Divider>
              <ProductListView emptyProductsMessage={<Typography color="text.secondary">Their are no items in your save for later</Typography>} products={productsInSaveForLater} productItemProps={{ ProductCardActions: OrderProductCardActions, ProductCardExtras: OrderProductCardExtras  }} />
          </Container>
    )
}