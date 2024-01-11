import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"

import ProductItem from "./productItem"
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { ProductPrice } from "./productItem"
import { Fragment, useEffect, useMemo } from "react"

function Plus({isEquals=false, ...props}) {
    return <Stack justifyContent="center" alignItems="center" sx={{ width: "100%", height: "100%" }}>
        <Typography {...props} variant="h5">{isEquals ? "=" : "+"}</Typography>
    </Stack>
}

export default function FrequentlyBoughtTogether({ product, ...props }) {
    console.log(product)
    const [allFrequentlyBoughtTogether, totalCost] = useMemo(() => {
        console.log(product)
        return  [
            [product, ...product.frequentlyBoughtTogether],
            product.price + product.frequentlyBoughtTogether.reduce((acc, product) => acc+product.price,0)
        ]
    }, [product])

    const sumGridProps = { xs: 12, sm: 6, md: 12, lg:3, }
    const productGridProps = { xs: 12, sm: 4.5, md: 3.25, lg:2, }
    const plusGridProps = { xs: 12, sm: 1, md: 1, lg:1, sx: { height: {xs: "2rem", sm: "initial"} } }
    const equalsGridProps = { xs: 12, sm: 1, md: 12, lg:1, sx: { height: {xs: "2rem", sm: "initial"} } }
    return (
        <Stack {...props}  justifyContent="center" alignItems="center">
            <Typography mb={8} variant="h4" component="h4" color="initial" textAlign="center">Frequently Bought Together</Typography>
            <Grid container sx={{width: "100%"}} spacing={8}>
                {allFrequentlyBoughtTogether.map((currentProduct, index) => {
                    const isEquals = allFrequentlyBoughtTogether.length-1===index
                    return <Fragment key={currentProduct.id}>
                        <Grid item {...productGridProps}>
                            <ProductItem product={currentProduct} />
                        </Grid>
                        <Grid item {...(isEquals ? equalsGridProps : plusGridProps)}>
                            <Plus isEquals={isEquals} />
                        </Grid>
                    </Fragment>
                    }
                    )}
                <Grid item {...sumGridProps}>
                    <Stack justifyContent="center" sx={{ height: "100%" }}>
                        <Paper variant="outlined" sx={{ py: "4rem" }}>
                            <Stack alignItems="center" justifyContent="center" gap="1rem">
                                <ProductPrice price={totalCost} textColor="primary" />
                                <Button variant="contained" startIcon={<AddShoppingCartIcon />}>Add to Cart</Button>
                            </Stack>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    )
}