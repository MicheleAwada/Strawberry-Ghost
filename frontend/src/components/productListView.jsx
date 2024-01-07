import ProductItem, {ProductItemStretch} from "./productItem";

import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
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
            <Stack flexWrap="wrap" flexDirection="row" sx={{ display: { xs: 'none', md: 'flex' }, gap:2, justifyContent: "space-around"}}>
                {products.map((info) => <ProductItem key={info.id} info={info} />)}
            </Stack>
            <Stack id="batata" flexWrap="wrap" flexDirection="column" sx={{display: { xs: 'flex', md: 'none' }, gap:2, justifyContent: "space-around"}}>
                {products.map((info) => <ProductItemStretch key={info.id} info={info} />)}
            </Stack>
        </Container>
    )
}