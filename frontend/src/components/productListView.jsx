import ProductItem from "./productItem";

import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"



export default function ProductListView() {
    return (
        <Container maxWidth="lg" sx={{paddingY: 4}}>
            <Grid container spacing={2} sx={{ width: "100%" }}>
                {products.map((info) => <ProductItem key={info.id} info={info} />)}
            </Grid>
        </Container>
    )
}