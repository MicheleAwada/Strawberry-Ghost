import ProductListView from '../components/productListView'
import { getCart } from '../fakeApi'
import { useLoaderData } from "react-router-dom"

import QuantityInput from '../components/quantityInput'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from "@mui/material/useMediaQuery"
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Chip from '@mui/material/Chip'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Link as ReactRouterLink } from "react-router-dom"
import { useState } from 'react'


export async function loader() {
    return await getCart()
}
export default function Cart() {
    const cart = useLoaderData()
    const productsInCart = cart.map(cartItem => {
        cartItem.product.variant = cartItem.variant
        cartItem.product.quantity = cartItem.quantity
        return cartItem.product
    })


    const isSm = useMediaQuery(theme => theme.breakpoints.up('sm'))


    const ProductCardActions = ({ _product }) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const closeMenu = () => {
            setAnchorEl(null);
        }
        const openMenu = (event) => {
            setAnchorEl(event.currentTarget);
        }
        return <Box sx={{width: "100%"}}>
                <Stack flexDirection="row" justifyContent="end" sx={{ width: "100%" }}>
                    <IconButton color="inherit" onClick={openMenu}>
                        <MoreHorizIcon />
                    </IconButton>
                </Stack>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={closeMenu}
                    >	
                        <MenuItem onClick={closeMenu}>
                            <ListItemIcon>
                                <AccessTimeIcon />
                            </ListItemIcon>
                            Add to Save Later
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={closeMenu}>
                            <ListItemIcon>
                                <RemoveShoppingCartOutlinedIcon />
                            </ListItemIcon>
                            Remove from Cart
                        </MenuItem>
                    </Menu>
            </Box>
    }
    function ProductContentExtra({ children, product }) {
        const variant = product.variant
        return <Stack gap={1}>
            <Stack flexDirection="row" flexWrap="wrap" alignItems="center">
                {children}
                <Chip label={variant.name} color="primary" variant='filled'  />
            </Stack>
            <Typography variant="body1" color="initial">Quantity: {product.quantity}</Typography>
        </Stack>
    }

    const totalPrice = cart.reduce((sum, cartItem) => sum + cartItem.product.price*cartItem.quantity, 0)

    return (
          <Container maxWidth="lg">
                <Typography variant={ isSm ? "h4" : "h5" } component="h5" color="initial" sx={{py: {xs: "2rem", sm: "2.5rem", md: "3rem"}, textAlign: "center"}}>
                    You have {cart.length} items in your cart
                </Typography>
              <Divider
                variant="middle"
                orientation="horizontal"
                light={false}
              />
              <Stack gap={4} flexDirection="row" justifyContent="center" alignItems="center" sx={{ my: 2 }}>
                  <Button variant="contained" size='large' color="primary"  startIcon={<ShoppingCartCheckoutIcon />} disabled={cart.length === 0} LinkComponent={ReactRouterLink} to="/checkout">
                    Checkout
                  </Button>
                  <Button variant="outlined" size='large' color="primary"  startIcon={<AddShoppingCartIcon />} LinkComponent={ReactRouterLink} to="/" >
                    More Shopping
                  </Button>
              </Stack>
              <Divider
                variant="middle"
                orientation="horizontal"
                light={false}
              />
              <ProductListView products={productsInCart} productItemProps={{ ProductCartActions: ProductCardActions, ProductContentExtra: ProductContentExtra  }} />
          </Container>
    )
}