import shinyGirl from "../assets/components/carousel/shiny girl.jpg"
import lunarGirl from "../assets/components/carousel/lunar girl.png"

import React, { useEffect } from 'react';
import Carousel from 'react-material-ui-carousel'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function IndexCarousel(props)
{
    const isMd = useMediaQuery(theme => theme.breakpoints.up("md"))
    const isSm = useMediaQuery(theme => theme.breakpoints.up("sm"))
    var items = [
        {
            image: shinyGirl,
            content: <Button variant="contained" size={isMd ? "large" : isSm ? "small" : "small"} sx={{ position: "absolute", top: '80%', left: "70%", width: "26%", height: "9%", fontSize: {xs: "0.40rem", sm: "0.75rem", lg: "1rem"} }}>Shop Now</Button>
        },
        {
            image: lunarGirl,
            content: <Button variant="contained" size={isMd ? "large" : isSm ? "small" : "small"} sx={{ position: "absolute", top: '10%', left: "8%", width: "26%", height: "9%", fontSize: {xs: "0.40rem", sm: "0.75rem", lg: "1rem"} }}>Shop Now</Button>
        }
    ]

    return (
        <Container sx={{mb: "3rem" }} maxWidth="xl">
            <Carousel
                
            >
                {
                    items.map( (item, i) => <Item key={i} item={item} /> )
                }
            </Carousel>
        </Container>
    )
}

function Item({item})
{
    const isLg = useMediaQuery(theme => theme.breakpoints.up("lg"))
    const height1 = 70
    const width1 = height1 * (16/9)

    const width2 = 70
    const height2 = width2 * (9/16)

    const height = isLg ? height1 + "vh" : height2 + "vw"
    const width = isLg ? width1 + "vh" : width2  + "vw"
    return (
        <Box py="3rem">
            <Paper elevation={10} sx={{ position: "relative", boxSizing: "border-box", px: "0", py:"0", height: `${height}`, width: `${width}`, mx: "auto" }}>
                {item.content}
                <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Paper>
        </Box>

    )
}