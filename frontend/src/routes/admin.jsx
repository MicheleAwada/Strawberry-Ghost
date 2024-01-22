import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import FormControlLabel from "@mui/material/FormControlLabel"
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'

import PlusIcon from "@mui/icons-material/AddCircle"
import RemoveIcon from "@mui/icons-material/RemoveCircle"
import UpIcon from '@mui/icons-material/ArrowCircleUp';

import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';


import { Form as ReactRouterForm, useActionData, useLoaderData, useNavigation } from "react-router-dom"

import ProductView from "./productView"
import ProductListView from "../components/productListView"

import FileInput from "../components/fileInput"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import Divider from '@mui/material/Divider'
import { getProducts } from "../api"

import Spinner from "../components/spinner"
import { createProduct } from "../api"
import { MessagesContext } from "../root"

import { defaultProductWithIds,
    handleVerifySlug,
    handleChangeTitle, handleChangeDescription, handleChangePrice, handleChangeSlug,
    handleVariantAdd, handleVariantRemove, handleVariantToFront, handleVariantName, handleVariantColor, handleVariantIsColor,
    handleVariantImageAdd, handleVariantImageRemove, handleVariantImageToFront, handleVariantImageAlt, getCropInfoInputsNameForVariantImage, setVariantImageForCropComp } from "../components/adminHandlers"

import { getFullError } from "../components/errorMessage"
import ImageCropUploader from "../components/cropFileInput"

import SelectProducts from "../components/selectProducts"




export async function loader() {
    const products = await getProducts()
    return products
}
export async function action({ request }) {
    const formData = await request.formData()



    const slug = formData.get("slug")
    if (!handleVerifySlug(slug)) {
        return {succeeded: false, error: {slug: ["Slug Must Be only Alphanumeric and -"]},errorMessage: "Slug Must Be only Alphanumeric and -", response: null}
    }




    const response = await createProduct(formData)
    return response
}

export default function Admin() {
    const products = useLoaderData();


    const actionData = useActionData();
    const navigation = useNavigation();
    const isLoading = navigation.state === "submitting"
    const { simpleAddMessage } = useContext(MessagesContext)
    const [error, setError] = useState({});
    useEffect(() => {
        if (actionData!== undefined) {
            if (actionData.succeeded) {
                simpleAddMessage("WOHOO", {severity: "success"})
            } else {
                setError({...actionData.error})
                simpleAddMessage(actionData.errorMessage, {severity: "error"})
            }
        }
    }, [actionData])


    const [product, setProduct] = useState(defaultProductWithIds(products))


    const [lookingAtDemo, setLookingAtDemo] = useState(false)
    const [productDemo, setProductDemo] = useState({...product})
    const productDemoRef = useRef();
    useEffect(() => {
        isElementInView(productDemoRef.current)}
    , [])
    useEffect(() => {
        if (lookingAtDemo===true) {
            setProductDemo({...product})
        }
    }, [product, lookingAtDemo])

    function isElementInView(element) {
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: 0,
        };
      
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setLookingAtDemo(true)
            } else {
                setLookingAtDemo(false)
            }
          });
        }, options);
      
        observer.observe(element);
      }


    function addFromName(name) {
        const fullError = getFullError(error, name)
        return {name: name, helperText: fullError.error, error: fullError.isError}
    }
    const inputVariant = "outlined"



    

    const [showFrequentlyBoughtTogetherModal, setShowFrequentlyBoughtTogetherModal] = useState(false)
    function handleToggleFBTModal() {
        setShowFrequentlyBoughtTogetherModal(old => !old)
    }
    function handleCloseFBTModal() {
        setShowFrequentlyBoughtTogetherModal(false)
    }
    function handleOpenFBTModal() {
        setShowFrequentlyBoughtTogetherModal(true)
    }
    function setFrequentlyBoughtTogether(val) {
        if (typeof val === "function") {
            val = val(product.frequentlyBoughtTogether)
        }
        setProduct(product => {console.log({...product, frequentlyBoughtTogether: val});return {...product, frequentlyBoughtTogether: val}})
    }

    return (
        <Container maxWidth="lg" sx={{ pt: "4rem" }}>
            <ReactRouterForm encType="multipart/form-data" method="POST">
                <Stack gap="2rem" mb="6rem">
                    <TextField {...addFromName("title")} id="form-admin-product-title" value={product.title} onChange={e => handleChangeTitle(e, setProduct)} label="Title" variant={inputVariant} required />
                    <TextField {...addFromName("description")} id="form-admin-product-description" multiline minRows={4} maxRows={14} value={product.description} onChange={e => handleChangeDescription(e, setProduct)} label="Description" variant={inputVariant} required />
                    <TextField {...addFromName("price")} id="form-admin-product-price" value={product.price} onChange={e => handleChangePrice(e, product, setProduct)} label="Price" variant={inputVariant} required />
                    <TextField {...addFromName("slug")} id="form-admin-product-slug" value={product.slug} onChange={e => handleChangeSlug(e, setProduct)} label="Slug" variant={inputVariant} required />
                    <Button fullWidth color="primary" variant="outlined" onClick={handleOpenFBTModal} >Add Frequently handle Together</Button>
                    {product.frequentlyBoughtTogether.map((productId, index) => <input type="hidden" key={productId} value={productId} name={`frequentlyBoughtTogether[${index}]`} />)}
                    <ImageCropUploader cropInfoInputsName={{ x: "thumbnail_crop_x", y: "thumbnail_crop_y", width: "thumbnail_crop_width", height: "thumbnail_crop_height" }} croppedData={product} setCroppedData={setProduct} imageDisplayName="thumbnail" fileInputProps={{ buttonText: "Upload Main Thumbnail *", inputProps: { name: "thumbnail", required: true }}} />
                    <Divider
                    variant="fullWidth"
                    orientation="horizontal"
                    
                    ><Typography>Variants</Typography></Divider>
                    {product.variants.map((variant, variantIndex) => (
                        <Stack gap="2rem" sx={{pl: {xs: "2rem", sm: "3rem", md: "4rem", lg: "6rem"}}} key={variantIndex}>
                            <Stack flexDirection="row">
                                <IconButton  aria-label="add variant" onClick={e => handleVariantAdd(e, variantIndex, setProduct)}>
                                    <PlusIcon />
                                </IconButton>
                                {product.variants.length!==1 && <><IconButton aria-label="delete" onClick={e => handleVariantRemove(e, variantIndex, setProduct)}>
                                    <RemoveIcon />
                                </IconButton>
                                <IconButton aria-label="move to front" onClick={e => handleVariantToFront(e, variantIndex, setProduct)}>
                                    <UpIcon />
                                </IconButton>
                                </>}
                            </Stack>
                            <TextField {...addFromName(`variants[${variantIndex}][name]`)} value={variant.name} label="Variant's Name" onChange={e => handleVariantName(e, variantIndex, setProduct)} variant={inputVariant} required />
                            <Stack>
                                <FormControlLabel
                                    control={
                                        <Switch checked={variant.isColor} onChange={e => handleVariantIsColor(e, variantIndex, product, setProduct)} />
                                    }
                                    label="Is a color variant?"
                                />
                                {
                                    variant.isColor &&
                                    <TextField {...addFromName(`variants[${variantIndex}][color]`)} label="choose variant color" type="color" onChange={e => handleVariantColor(e, variantIndex, setProduct)} value={variant.color} variant={inputVariant} />
                                }
                            </Stack>
                            {variant.images.map((image, imageIndex) => (
                                <Stack gap="2rem" key={imageIndex} sx={{ pl: {xs: "2rem", sm: "3rem", md: "4rem", lg: "6rem"} }} flexWrap="wrap" flexDirection="row" alignItems="center">
                                    <TextField {...addFromName(`variants[${variantIndex}][images][${imageIndex}][alt]`)} onChange={e => handleVariantImageAlt(e, variantIndex, imageIndex, setProduct)} value={image.alt} label="Name for Image" id="form-admin-product-variants-images-image-alt" variant={inputVariant} />
                                    <ImageCropUploader cropInfoInputsName={getCropInfoInputsNameForVariantImage(variantIndex, imageIndex)} setCroppedData={(value) => setVariantImageForCropComp(value, variantIndex, imageIndex, setProduct)} croppedData={image} fileInputProps={{ buttonText: "Upload Image For Variant *", inputProps: { name: `variants[${variantIndex}][images][${imageIndex}][image]`, required: true }}} />
                                    <Stack flexDirection="row" alignItems="center">
                                        <IconButton sx={{aspectRatio: "1/1"}} aria-label="add image to variant" onClick={e => handleVariantImageAdd(e, variantIndex, imageIndex, setProduct)}>
                                          <PlusIcon />
                                        </IconButton>
                                        {variant.images.length!==1 && <><IconButton aria-label="delete image to variant" onClick={e => handleVariantImageRemove(e, variantIndex, imageIndex, setProduct)}>
                                          <RemoveIcon />
                                        </IconButton>
                                        <IconButton aria-label="move this variant's image to front" onClick={e => handleVariantImageToFront(e, variantIndex, imageIndex, setProduct)}>
                                          <UpIcon />
                                        </IconButton>
                                        </>}
                                    </Stack>
                                </Stack>
                            ))}
                            {variantIndex!==product.variants.length-1 && <Divider />}
                        </Stack>
                    ))}
                </Stack>
                <Button type="sumbit" fullWidth variant="contained" startIcon={isLoading ? <Spinner /> : undefined}>SUBMIT</Button>
            </ReactRouterForm>
            <Button type="button" sx={{ mt: "2rem" }} onClick={e => setDemo(true)} fullWidth variant="contained">VIEW DEMO!!</Button>
            <Box ref={productDemoRef}><Divider
                      variant="inset"
                      orientation="horizontal"
                      sx={{ my: "4rem" }}
                    ><Typography>How this Product will look like</Typography></Divider>
            <ProductView product={productDemo} />
                <Divider
                      variant="inset"
                        orientation="horizontal"
                      sx={{ my: "4rem" }}
                    ><Typography>How this Product will look like In the HomePage with The other products (current product is the first)</Typography></Divider>
            <ProductListView products={[productDemo, ...products]} /></Box>
        </Container>
    )
}