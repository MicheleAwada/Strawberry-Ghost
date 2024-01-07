import ProductItem from "./productItem";

import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"

const products = [
    {
        title: "Johny Earings",
        price: 24,
        inCart: false,
        categories: ["Cute", "Earings", "Kawaii"],
        colors: ["red", "blue", "green"],
        thumbnail: "https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
        id: 1,
    },
    {
        title: "Johny Earings",
        price: 24,
        inCart: false,
        categories: ["Cute", "Earings", "Kawaii"],
        colors: ["red", "blue", "green"],
        thumbnail: "https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
        id: 2,
    },
    {
        title: "Johny Earings",
        price: 24,
        inCart: false,
        categories: ["Cute", "Earings", "Kawaii"],
        colors: ["red", "blue", "green"],
        thumbnail: "https://static.vecteezy.com/system/resources/previews/008/550/662/original/strawberry-fruit-transparent-png.png",
        id: 3,
    },
    {
        title: "Johny Earings",
        price: 24,
        inCart: false,
        categories: ["Cute", "Earings", "Kawaii"],
        colors: ["red", "blue", "green"],
        thumbnail: "https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
        id: 4,
    },
    {
        title: "Johny Earings",
        price: 24,
        inCart: false,
        categories: ["Cute", "Earings", "Kawaii"],
        colors: ["red", "blue", "green"],
        thumbnail: "https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
        id: 5,
    },
    {
        title: "Johny Earings",
        price: 24,
        inCart: false,
        categories: ["Cute", "Earings", "Kawaii"],
        colors: ["red", "blue", "green"],
        thumbnail: "https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
        id: 6,
    },
    {
        title: "Johny Earings",
        price: 24,
        inCart: false,
        categories: ["Cute", "Earings", "Kawaii"],
        colors: ["red", "blue", "green"],
        thumbnail: "https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
        id: 7,
    },
]

export default function ProductListView() {
    return (
        <Container maxWidth="lg" sx={{paddingY: 4}}>
            <Grid container spacing={2} sx={{ width: "100%" }}>
                {products.map((info) => <ProductItem key={info.id} info={info} />)}
            </Grid>
        </Container>
    )
}