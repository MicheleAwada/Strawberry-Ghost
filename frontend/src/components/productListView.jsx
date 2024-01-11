import ProductItem from "./productItem";

import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"


export default function ProductListView({products, productItemProps}) {
    return (
        <Container maxWidth="lg" sx={{paddingY: 4}}>
            <Grid container spacing={2} sx={{ width: "100%" }}>
                {products.map((product) => <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
                    <ProductItem {...productItemProps}  product={product} />
                    </Grid>)}
            </Grid>
        </Container>
    )
}