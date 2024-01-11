import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import { getProduct } from "../fakeApi"

import { flattenArray } from '../utils'

import { useEffect, useRef, useState } from 'react'
import {useLoaderData} from "react-router-dom"

import FrequentlyBoughtTogether from "../components/frequentlyBoughtTogether";



export async function loader({params}) {
    const id = params.id
    const product = await getProduct(id)
    return product
}

function ImageRendering( querySelectorAll, imageSrcsIterable ) {
    const [loadAllImages, setLoadAllImages] = useState(false)
    let visibleImagesArray = useRef([])
    function checkImagesLoaded() {
        const allLoaded = visibleImagesArray.current.every((image) => image.complete);
        setLoadAllImages(allLoaded);
      };
    function addImagesEventListeners() {
        visibleImagesArray.current.forEach((image) => {
            image.addEventListener('load', checkImagesLoaded);
            image.addEventListener('error', checkImagesLoaded);
          });
    }
    function removeImagesEventListeners() {
        visibleImagesArray.current.forEach((image) => {
            image.removeEventListener('load', checkImagesLoaded);
            image.removeEventListener('error', checkImagesLoaded);
          });
    }
    function setVisibleImages(querySelectorAll) {
        const images = document.querySelectorAll(querySelectorAll);
        const imagesArray = Array.from(images);
        visibleImagesArray.current = imagesArray
    }
    
    const RenderToLoadImages = () => {
        return loadAllImages ? <div style={{ display: "none", flexDirection: "row", flexWrap: "wrap", gap: "1rem"}}>{imageSrcsIterable.map((imageSrc, index) => <img style={{width: "100px", height: "100px"}} key={imageSrc} className="currentColorImages" src={imageSrc} alt="hidden image for loading"/>)}</div> : null
    }
    const refreshClasses = (newQuerySelectorAll=querySelectorAll) => {
          removeImagesEventListeners()
          setVisibleImages(newQuerySelectorAll)
          addImagesEventListeners()
          return removeImagesEventListeners
        }
    useEffect(refreshClasses, []);
    return [RenderToLoadImages, refreshClasses]
}

export default function ProductView() {
    const product = useLoaderData();

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState(0)

    
    const imageSrcsIterable = flattenArray(product.variants.map((variant) => variant.images.map((imageSrc) => imageSrc)))
    const [RenderImageRendering, refreshClasses] = ImageRendering(".currentColorImages", imageSrcsIterable)
    useEffect(refreshClasses, [selectedVariant])


    function getSelectedColor() {
        return product.variants[selectedVariant]
    }
    function getImages() {
        return getSelectedColor().images
    }
    function getSelectedImageSrc() {
        return getImages()[selectedImage]
    }
    function RenderSelectImages({...props}) {
        return (<Stack flexDirection="row" justifyContent="center" flexWrap="wrap" gap={4} {...props}>
            {getImages().map((imageSrc, index) => {
                const borderColorSpread = {}
                if (index === selectedImage) {borderColorSpread.borderColor = "primary.main"}
                return <Paper component="button" onClick={() => setSelectedImage(index)} key={[selectedVariant, index]} variant='outlined' sx={{ borderRadius: "0.5rem", overflow: "hidden", aspectRatio: "1/1", width:"3rem", height: "3rem",  p: "1rem", boxSizing: "content-box", cursor: "pointer", ...borderColorSpread }}>
                            <img loading='eager' className='currentColorImages' src={imageSrc} alt={imageAlt} style={{ aspectRatio: "1/1", objectFit: "cover", width: "100%", height: "100%", borderRadius: "0.25rem" }} />
                        </Paper>
    })}
        </Stack>)
    }
    function ColorSelectDivider({ ...props }) {
        const colorsLength = product.variants.length
        return (<Divider flexItem variant='fullWidth' {...props}>
            <Typography variant="body1" color="grey.700" sx={{textAlign: "center"}}>{`${colorsLength} color${colorsLength === 1 ? "" : "s"}`}</Typography>
        </Divider>)
    }
    function RenderVariantSelect({...props}) {
        return (
        <>
            <Stack flexDirection={{xs: "column", md: "row"}} flexWrap="wrap" gap={4} {...props}>
            
                {product.variants.map((variant, index) => (
                        <Paper component="button" onClick={() => {
                            setSelectedVariant(index)
                            const currentVariantImageLength = variant.images.length
                            if (currentVariantImageLength <= selectedImage) {
                                setSelectedImage(0)
                            }
                        }} key={variant.id} variant="elevation" elevation={selectedVariant===index ? 6 : 1} sx={{borderRadius: "0.75rem", width: "auto", px:"1rem", py: "0.75rem", overflow: "hidden", cursor: "pointer", boxSizing: "content-box", borderStyle: "none" }}>
                                    <Stack alignItems="center" justifyContent="center" flexDirection="row" sx={{width: "100%", height: "auto", }}>
                                        <Typography component="p" variant='body2'>{variant.name}</Typography>
                                        {variant.isColor && <><Divider flexItem orientation="vertical" variant="fullWidth" light sx={{mx: 1}} />
                                        <Box sx={{width: "1rem", height: "1rem", borderRadius: "50%", bgcolor: variant.color}}></Box></>}
                                    </Stack>
                        </Paper>
                ))}
            </Stack>
        </>
        )
    }

    const imageAlt = `${product.title}'s image`
    return (
        <>
            <Container maxWidth="xl" sx={{py:"1rem"}}>
                <Stack>
                    <Grid container spacing={8}  flexWrap={{xs:"wrap-reverse", md:"wrap"}}>
                        <Grid xs={12} md={6} lg={6} item>
                            <Stack gap={4}>
                                <Box sx={{overflow: "hidden", aspectRatio: "4/3", borderRadius: "1rem", width: "100%", }}>
                                    <img src={getSelectedImageSrc()} alt={imageAlt} style={{ width: "100%", objectFit: "cover"}} />
                                </Box>
                                <RenderSelectImages />
                                <Box sx={{display: {xs: "block", md: "none"}}}>
                                    <ColorSelectDivider sx={{mb: "1.5rem"}} />
                                    <RenderVariantSelect />
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={6} lg={6} item>
                            <Box>
                                <Typography variant="h2" component={"h1"} gutterBottom color="initial">{product.title}</Typography>
                                <Typography variant="body1" component={"p"} color="initial">{product.description}</Typography>
                                <Box sx={{display: {xs: "none", md: "block"}}}>
                                    <ColorSelectDivider sx={{ my: {md: "1.5rem",lg: "2rem"} }} />
                                    <RenderVariantSelect />
                                </Box>
                                <Divider sx={{my: {xs:"1.5rem", md: "2rem", lg: "2.5rem"}}} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} lg={6}>
                                        <Button variant="contained" color="primary" sx={{width: "100%"}} startIcon={<ShoppingCartCheckoutIcon />}>
                                            Buy Now
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} lg={6}>
                                        <Button variant="outlined" color="primary" sx={{width: "100%"}} startIcon={<AddShoppingCartIcon />}>
                                            Add to Cart
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <FrequentlyBoughtTogether sx={{ mt: "5rem" }} product={product} />
                </Stack>
            </Container>
            <RenderImageRendering />
        </>
    )
}