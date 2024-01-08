import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import { getProduct } from "../fakeApi"

import {useLoaderData} from "react-router-dom"
import Typography from '@mui/material/Typography'
import { useState } from 'react'


export async function loader({params}) {
    const id = params.id
    const product = await getProduct(id)
    return product
}

export default function ProductView() {
    const product = useLoaderData();

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState(0)

    function getSelectedColor() {
        return product.colors[selectedColor]
    }
    function getImages() {
        return getSelectedColor().images
    }
    function getSelectedImageSrc() {
        return getImages()[selectedImage]
    }
    const imageAlt = `${product.title}'s image`
    const transpanretFullSizeBorderlessStyles = {width: "100%", height: "100%", border: "none", backgroundColor: "transparent", padding:0}
    return (
        <Container maxWidth="xl" sx={{pb:"8rem"}}>
            <Grid container spacing={8}>
                <Grid xs={6} item>
                    <Stack gap={4}>
                        <Box sx={{overflow: "hidden", aspectRatio: "4/3", borderRadius: "1rem", width: "100%"}}>
                            <img src={getSelectedImageSrc()} alt={imageAlt} style={{...transpanretFullSizeBorderlessStyles, objectFit: "cover"}} />
                        </Box>
                        <Stack flexDirection={{xs: "column", md: "row"}} flexWrap="wrap" gap={4}>
                            {product.colors.map((color, index) => (
                                    <Paper key={index} variant="elevation" elevation={selectedColor===index ? 8 : 2} sx={{borderRadius: "0.75rem", width: "auto", height: "4rem", overflow: "hidden"}}>
                                            <button onClick={() => {
                                                setSelectedColor(index)
                                                const currentColorImageLength = color.images.length
                                                if (currentColorImageLength <= selectedImage) {
                                                    setSelectedImage(0)
                                                }
                                            }} style={{...transpanretFullSizeBorderlessStyles}}>
                                                <Stack alignItems="center" flexDirection="row" sx={{width: "100%", height: "auto", mx:"1rem"}}>
                                                    <Typography component="p" variant='body2'>{color.name}</Typography>
                                                    <Divider flexItem orientation="vertical" variant="fullWidth" light sx={{mx: 1}} />
                                                    <Box sx={{width: "1rem", height: "1rem", borderRadius: "50%", bgcolor: color.color}}></Box>
                                                </Stack>
                                            </button>
                                    </Paper>
                            ))}
                        </Stack>
                        <Stack flexDirection="row" flexWrap="wrap" gap={2}>
                            {getImages().map((imageSrc, index) => (
                                <Paper key={[selectedColor, index]} elevation={selectedImage === index ? 12 : 0} sx={{borderRadius: "0.75rem", width: "3rem", height: "3rem", overflow: "hidden", borderColor: "white", borderStyle: "none", borderWidth: selectedImage === index ? `${0+0.125}rem` : "0.125rem", boxSizing: "border-box"}}>
                                    <button onClick={() => setSelectedImage(index)} style={{...transpanretFullSizeBorderlessStyles}}>
                                        <img loading='eager' src={imageSrc} alt={imageAlt} style={{objectFit: "cover", width: "100%", height: "100%"}} />
                                    </button>
                                </Paper>
                            ))}
                        </Stack>
                    </Stack>
                </Grid>
                <Grid xs={6} item>
                    <Box>
                        <Typography variant="h2" component={"h1"} gutterBottom color="initial">{product.title}</Typography>
                        <Typography variant="body1" component={"p"} color="initial">{product.description}</Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{visibility: "hidden"}}> {/* helps with loading other image colors */}
                {product.colors.map((color,index) => 
                    (<Box>{color.images.map((imageSrc, index) => <img style={{width:0,height:0, ...transpanretFullSizeBorderlessStyles}} src={imageSrc} alt={imageAlt} loading='lazy' />)}</Box>)
                )}
            </Box>
        </Container>
    )
}