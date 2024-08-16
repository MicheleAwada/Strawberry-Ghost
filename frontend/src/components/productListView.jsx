import ProductItem from "./productItem";

import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Pagination from "@mui/material/Pagination"
import { equalSplitArray } from "../utils";
import { useState } from "react";

const defaultEmptyProductsMessage = <Typography variant="h5" sx={{ textAlign: "center" }}>Whops, looks like their isnt any products here</Typography>
export default function ProductListView({ emptyProductsMessage=defaultEmptyProductsMessage, products, productItemProps, paginated=false }) {
    const isEmptyProducts = products.length <= 0
    const paginated_products = equalSplitArray(products, 28)
    const [page, setPage] = useState(0)
    const currentProducts = paginated_products[page]
    return (
        <Container maxWidth="lg" sx={{paddingY: 4}}>
            <Grid container spacing={2} sx={{ width: "100%" }}>
                {isEmptyProducts ? emptyProductsMessage : (paginated ? currentProducts : products).map((product) => <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
                    <ProductItem {...productItemProps}  product={product} />
                    </Grid>)}
            </Grid>
            {paginated && <Pagination color="primary" sx={{ display: "flex", justifyContent: "center", marginTop: 4 }} count={paginated_products.length}  onChange={(event, value) => setPage(value - 1)} />}
        </Container>
    )
}
