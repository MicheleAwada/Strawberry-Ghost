import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import { getProduct } from "../fakeApi"

import {useLoaderData} from "react-router-dom"
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'



export async function loader({params}) {
    const id = params.id
    const product = await getProduct(id)
    return product
}

export default function ProductView() {
    const product = useLoaderData();

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState(0)

    const [loadAllImages, setLoadAllImages] = useState(false)
    let visibleImagesArray = []
    function checkImagesLoaded() {
        const allLoaded = visibleImagesArray.every((image) => image.complete);
        setLoadAllImages(allLoaded);
      };
    function addImagesEventListeners() {
        visibleImagesArray.forEach((image) => {
            image.addEventListener('load', checkImagesLoaded);
            image.addEventListener('error', checkImagesLoaded);
          });
    }
    function removeImagesEventListeners() {
        visibleImagesArray.forEach((image) => {
            image.removeEventListener('load', checkImagesLoaded);
            image.removeEventListener('error', checkImagesLoaded);
          });
    }
    function setVisibleImages() {
        const images = document.querySelectorAll('.currentColorImages'); // Replace '.your-image-class' with your specific class name
        const imagesArray = Array.from(images);
        visibleImagesArray = imagesArray
    }
    useEffect(() => {
        setVisibleImages()

        checkImagesLoaded();
    
        addImagesEventListeners()
    
        return removeImagesEventListeners;
      }, []);
      useEffect(() => {
        removeImagesEventListeners()
        setVisibleImages()
        addImagesEventListeners()

        return removeImagesEventListeners
      }, [selectedColor])

    function getSelectedColor() {
        return product.colors[selectedColor]
    }
    function getImages() {
        return getSelectedColor().images
    }
    function getSelectedImageSrc() {
        return getImages()[selectedImage]
    }
    function RenderSelectImages({...props}) {
        return (<Stack flexDirection="row" flexWrap="wrap" gap={4} {...props}>
            {getImages().map((imageSrc, index) => (
                <Stack key={[selectedColor, index]} justifyContent="center" alignItems="center" sx={{width: "3.5rem", height: "3.5rem" }}>
                        <Paper  elevation={selectedImage === index ? 12 : 0} sx={{ aspectRatio: "1/1", width: "100%", height: "100%", borderRadius: "0.5rem", p: "0.125rem", boxSizing: "border-box" }}>
                            <button onClick={() => setSelectedImage(index)} style={{ ...transpanretFullSizeBorderlessStyles, cursor: "pointer", p: "0.25rem" }}>
                                <img loading='eager' className='currentColorImages' src={imageSrc} alt={imageAlt} style={{ aspectRatio: "1/1", objectFit: "cover", width: "100%", height: "100%", borderRadius: "0.5rem" }} />
                            </button>
                        </Paper>
                </Stack>
            ))}
        </Stack>)
    }
    function ColorSelectDivider({ ...props }) {
        const colorsLength = product.colors.length
        return (<Divider flexItem variant='fullWidth' {...props}>
            <Typography variant="body1" color="grey.700" sx={{textAlign: "center"}}>{`${colorsLength} color${colorsLength === 1 ? "" : "s"}`}</Typography>
        </Divider>)
    }
    function RenderColorSelect({...props}) {
        return (
        <>
            <Stack flexDirection={{xs: "column", md: "row"}} flexWrap="wrap" gap={4} {...props}>
            
                {product.colors.map((color, index) => (
                        <Paper key={index} variant="elevation" elevation={selectedColor===index ? 8 : 2} sx={{borderRadius: "0.75rem", width: "auto", height: "4rem", overflow: "hidden"}}>
                                <button onClick={() => {
                                    setSelectedColor(index)
                                    const currentColorImageLength = color.images.length
                                    if (currentColorImageLength <= selectedImage) {
                                        setSelectedImage(0)
                                    }
                                }} style={{ ...transpanretFullSizeBorderlessStyles, cursor: "pointer" }}>
                                    <Stack alignItems="center" flexDirection="row" sx={{width: "100%", height: "auto", mx:"1rem"}}>
                                        <Typography component="p" variant='body2'>{color.name}</Typography>
                                        <Divider flexItem orientation="vertical" variant="fullWidth" light sx={{mx: 1}} />
                                        <Box sx={{width: "1rem", height: "1rem", borderRadius: "50%", bgcolor: color.color}}></Box>
                                    </Stack>
                                </button>
                        </Paper>
                ))}
            </Stack>
        </>
        )
    }

    const imageAlt = `${product.title}'s image`
    const transpanretFullSizeBorderlessStyles = {width: "100%", height: "100%", border: "none", backgroundColor: "transparent", padding:0}
    return (
        <Container maxWidth="xl" sx={{py:"1rem"}}>
            <Grid container spacing={8}  flexWrap={{xs:"wrap-reverse", md:"wrap"}}>
                <Grid xs={12} md={6} lg={6} item>
                    <Stack gap={4}>
                        <Box sx={{overflow: "hidden", aspectRatio: "4/3", borderRadius: "1rem", width: "100%"}}>
                            <img src={getSelectedImageSrc()} alt={imageAlt} style={{...transpanretFullSizeBorderlessStyles, objectFit: "cover"}} />
                        </Box>
                        <Box sx={{display: {xs: "block", md: "none"}}}>
                            <ColorSelectDivider sx={{mb: "2rem"}} />
                            <RenderColorSelect />
                        </Box>
                        <RenderSelectImages />
                    </Stack>
                </Grid>
                <Grid xs={12} md={6} lg={6} item>
                    <Box>
                        <Typography variant="h2" component={"h1"} gutterBottom color="initial">{product.title}</Typography>
                        <Typography variant="body1" component={"p"} color="initial">{product.description}</Typography>
                        <Box sx={{display: {xs: "none", md: "block"}}}>
                            <ColorSelectDivider sx={{ my: {md: "1.5rem",lg: "2rem"} }} />
                            <RenderColorSelect />
                        </Box>
                        <Divider sx={{my: {xs:"1.5rem", md: "2rem", lg: "2.5rem"}}} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Button variant="contained" color="primary" sx={{width: "100%"}}>
                                    Buy Now!
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button variant="outlined" color="primary" sx={{width: "100%"}}>
                                    Add to Cart
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

            </Grid>
            {loadAllImages && <Box sx={{display: "none"}}> {/* helps with loading other image colors */}
                {product.colors.map((color,index) => 
                    (<Box key={index}>{color.images.map((imageSrc, index) => <img key={index} style={{width:0,height:0, ...transpanretFullSizeBorderlessStyles}} src={imageSrc} alt={imageAlt} loading='lazy' />)}</Box>)
                )}
            </Box>}
        </Container>
    )
}