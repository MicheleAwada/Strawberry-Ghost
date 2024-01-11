import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"

import ProductItem from "./productItem"
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

function Plus({isEquals=false, ...props}) {
    return <Typography {...props} variant="h5">{isEquals ? "=" : "+"}</Typography>
}

export default function FrequentlyBoughtTogether({ product, ...props }) {
    return (
        <Stack {...props}>
            <Typography mb={8} variant="h4" component="h4" color="initial">Frequently Bought Together</Typography>
            <Grid container sx={{width: "100%"}} spacing={8}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Stack flexDirection="row" alignItems="center">
                        <ProductItem product={product} />
                        <Plus sx={{ ml: 8 }} />
                    </Stack>
                </Grid>
                {/* making sure to include current product item ^ */}
                {product.frequentlyBoughtTogether.map((currentProduct, index) => 
            		<Grid key={currentProduct.id} item xs={12} sm={6} md={4} lg={3}>
                        <Stack flexDirection="row" alignItems="center">
                            <ProductItem product={currentProduct} />
                            <Plus sx={{ ml: 8 }} isEquals={product.frequentlyBoughtTogether.length-1===index} />
                        </Stack>
                    </Grid>
                    )}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper variant="outlined" sx={{ height: "100%" }}>
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                            <Button variant="contained">Add All to Cart</Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    )
}