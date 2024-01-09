import productListView from '../components/productListView'
import ProductListView from '../components/productListView'
import { getCartProducts } from '../fakeApi'
import { useLoaderData } from "react-router-dom"

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from "@mui/material/useMediaQuery"
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import { Link as ReactRouterLink } from "react-router-dom"

export async function loader() {
    return await getCartProducts()
}
export default function Cart() {
    const productsInCart = useLoaderData()
    const isSm = useMediaQuery(theme => theme.breakpoints.up('sm'))
    return (
          <Container maxWidth="lg">
                <Typography variant={ isSm ? "h4" : "h5" } component="h5" color="initial" sx={{py: {xs: "2rem", sm: "2.5rem", md: "3rem"}, textAlign: "center"}}>
                    You have {productsInCart.length} items in your cart
                </Typography>
              <Divider
                variant="middle"
                orientation="horizontal"
                light={false}
              />
              <Stack gap={4} flexDirection="row" justifyContent="center" alignItems="center" sx={{ my: 2 }}>
                  <Button variant="contained" size='large' color="primary"  startIcon={<ShoppingCartCheckoutIcon />}>
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
              <ProductListView products={productsInCart} />
          </Container>
    )
}