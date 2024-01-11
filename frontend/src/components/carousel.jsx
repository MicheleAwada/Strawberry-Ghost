import shinyGirl from "../assets/components/carousel/shiny girl.jpg"
import lunarGirl from "../assets/components/carousel/lunar girl.png"
import whiteGirl from "../assets/components/carousel/white girl.jpg"
import clayGirl from "../assets/components/carousel/clay girl.png"

import React, { useEffect } from 'react';
import Carousel from 'react-material-ui-carousel'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'



export default function IndexCarousel(props)
{
    const isMd = useMediaQuery(theme => theme.breakpoints.up("md"))
    const isSm = useMediaQuery(theme => theme.breakpoints.up("sm"))
    function DefaultContent({ textColor="primary.main", textAlign="right", text="The Best Earings for The Best People", justifyContent="end", alignItems="end", sx={}, px={xs: "0.33rem", sm: "0.66rem", md: "1.5rem", lg: "2rem"}, py={xs: "0.25rem", sm: "0.5", md: "1rem", lg: "1.5rem"}, gap={xs: "0.25rem", sm: "0.75rem", md: "1.25rem", lg: "1.25rem"}, height="100%", children=null, pr, pl, ...props}) {
        if (children===null) {
            children = <>
                <Typography color={textColor} textAlign={textAlign} width={"30%"} sx={{ fontSize: { xs: "0.75rem", sm: "1.5rem", md: "2rem", lg: "2.5rem" }, lineHeight: {xs: "1rem", sm: "1.75rem", md: "2.25rem", lg: "2.75rem"} }}>{text}</Typography>
                <Button variant="contained" size={isMd ? "large" : isSm ? "medium" : "small"}>Shop Now</Button>
            </>;
        }
        return <Stack gap={gap} justifyContent={justifyContent} alignItems={alignItems} py={py} px={px} height={height} sx={{boxSizing: "border-box", ...sx}} pr={pr} pl={pl} {...props}>
            {children}
        </Stack>
    }
    var items = [
        {
            image: shinyGirl,
            content: <DefaultContent />
        },
        {
            image: whiteGirl,
            content: <DefaultContent alignItems="start" justifyContent="end" textAlign="left" textColor="#fff" />
        },
        {
            image: clayGirl,
            content: <DefaultContent />
        },
        {
            image: lunarGirl,
            content: <DefaultContent alignItems="start" textAlign="left" />
        },
    ]

    return (
        <Container sx={{py: "1rem" }} maxWidth="md">
            <Carousel
                animation="slide"
                duration={750}
                autoPlay={false}
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

    return (

            <Paper  sx={{ position: "relative", boxSizing: "border-box", aspectRatio: "16/9",width: `100%`, p: 0, overflow: "hidden" }}>
                <Box sx={{ zIndex: 3, position: "absolute", top:0, left:0, width: "100%", height: "100%",  }}>{item.content}</Box>
                <Box component="img" src={item.image} style={{ position: "absolute", top:0, left:0, width: "100%", height: "100%", objectFit: "cover" }} />
            </Paper>


    )
}