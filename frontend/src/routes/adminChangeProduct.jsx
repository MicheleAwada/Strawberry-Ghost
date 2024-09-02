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
import { getProducts, updateProduct } from "../api"

import Spinner from "../components/spinner"
import { createProduct } from "../api"
import { MessagesContext } from "../root"

import { defaultProductWithIds,
    handleVerifySlug,
    handleChangeTitle, handleChangeDescription, handleChangePrice, handleChangeSlug, handleChangeThumbnailAlt,
    handleVariantAdd, handleVariantRemove, handleVariantToFront, handleVariantName, handleVariantStock, handleVariantColor, handleVariantIsColor,
    handleVariantImageAdd, handleVariantImageRemove, handleVariantImageToFront, handleVariantImageAlt, getCropInfoInputsNameForVariantImage, setVariantImageForCropComp, 
    } from "../components/adminHandlers"

import { getFullError } from "../components/errorMessage"
import ImageCropUploader from "../components/cropFileInput"

import SelectProducts from "../components/selectProducts"




export async function createLoader() {
    const products = await getProducts()
    return [products]
}

export async function updateLoader({ request, params }) {
    const products = await getProducts()
    const slug = params.slug
    const product = products.find(product => product.slug===slug)
    return [products, product]
}

export async function createAction({ request }) {
    const formData = await request.formData()

    const slug = formData.get("slug")
    if (!handleVerifySlug(slug)) {
        return {succeeded: false, error: {slug: ["Slug Must Be only Alphanumeric and -"]},errorMessage: "Slug Must Be only Alphanumeric and -", response: null}
    }

    const response = await createProduct(formData)
    return response
}

export async function updateAction({ request, params }) {
    const formData = await request.formData()

    const slug_for_update = params.slug
    const slug = formData.get("slug")
    if (!handleVerifySlug(slug)) {
        return {succeeded: false, error: {slug: ["Slug Must Be only Alphanumeric and -"]},errorMessage: "Slug Must Be only Alphanumeric and -", response: null}
    }
    formData.append("slug_for_update", slug_for_update)

    const response = await updateProduct(formData)
    return response
}

export default function AdminChangeProduct() {
    const loaderData = useLoaderData();
    const products = loaderData[0]
    const productToUpdate = loaderData[1]
    const update = productToUpdate !== undefined

    
    const defaultProduct = useMemo(() => defaultProductWithIds(products, productToUpdate), [])

    const actionData = useActionData();
    const navigation = useNavigation();
    const isLoading = navigation.state === "submitting"
    const { simpleAddMessage } = useContext(MessagesContext)
    const [error, setError] = useState({});
    useEffect(() => {
        if (actionData!== undefined) {
            if (actionData.succeeded) {
                simpleAddMessage("WOHOO", {severity: "success"})
                setError({})
            } else {
                setError({...actionData.error})
                simpleAddMessage(actionData.errorMessage, {severity: "error"})
            }
        }
    }, [actionData])


    const [product, setProduct] = useState(defaultProduct)


    const [productDemo, setProductDemo] = useState(true)
    useEffect(() => {
        setProductDemo(false)
    }, [product])

    function addFromName(name) {
        const fullError = getFullError(error, name)
        return {name: name, helperText: fullError.error, error: fullError.isError}
    }
    const inputVariant = "outlined"



    

    const [showFrequentlyBoughtTogetherModal, setShowFrequentlyBoughtTogetherModal] = useState(false)
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
        setProduct(product => ({...product, frequentlyBoughtTogether: val}))
    }


    const [formCoolDown, setFormCoolDown] = useState(false)
    function sumbittedForm(e) {
        if (formCoolDown) {
            e.preventDefault()
            simpleAddMessage("Please Wait on sumbitting to prevent duplicates", {severity: "warning"})
        } else {
            setFormCoolDown(true)
            setTimeout(() => setFormCoolDown(false), 3000)
        }
    }

    return (
        <Container maxWidth="lg" sx={{ pt: "4rem" }}>
            <ReactRouterForm encType="multipart/form-data" method="POST" onSubmit={sumbittedForm}>
                <Stack gap="2rem" mb="6rem">
                    <TextField {...addFromName("title")} id="form-admin-product-title" value={product.title} onChange={e => handleChangeTitle(e, setProduct)} label="Title" variant={inputVariant} required={!update} />
                    <TextField {...addFromName("description")} id="form-admin-product-description" multiline minRows={4} maxRows={14} value={product.description} onChange={e => handleChangeDescription(e, setProduct)} label="Description" variant={inputVariant} required={!update} />
                    <TextField {...addFromName("price")} id="form-admin-product-price" value={product.price} onChange={e => handleChangePrice(e, product, setProduct)} label="Price" variant={inputVariant} required={!update} />
                    <TextField {...addFromName("slug")} id="form-admin-product-slug" value={product.slug} onChange={e => handleChangeSlug(e, setProduct)} label="Slug" variant={inputVariant} required={!update} />
                    <Button fullWidth color="primary" variant="outlined" onClick={handleOpenFBTModal} >Add Frequently Bought Together</Button>
                    {product.frequentlyBoughtTogether.map((productId, index) => <input type="hidden" key={productId} value={productId} name={`frequentlyBoughtTogether[${index}]`} />)}
                    <Stack flexDirection="row" alignItems="center" gap={2}>
                        <TextField label="Thumbnail Alt" variant={inputVariant} {...addFromName("thumbnail_alt")} value={product.thumbnail_alt} onChange={e => handleChangeThumbnailAlt(e,setProduct)} />
                        <ImageCropUploader cropInfoInputsName={{ x: "thumbnail_crop_x", y: "thumbnail_crop_y", width: "thumbnail_crop_width", height: "thumbnail_crop_height" }} croppedData={product} setCroppedData={setProduct} imageDisplayName="thumbnail" fileInputProps={{ ...addFromName("thumbnail"), buttonText: "Upload Main Thumbnail *", emptyNameIfNull: update, inputProps: { required: !update }}} />
                    </Stack>
                    <Divider
                    variant="fullWidth"
                    orientation="horizontal"
                    ><Typography>Variants</Typography></Divider>
                    {product.variants.map((variant, variantIndex) => {
                        const hasExisted = Boolean(update && variant?.for_update_id)
                        const isRequired = !hasExisted
                        return <Stack gap="2rem" sx={{pl: {xs: "2rem", sm: "3rem", md: "4rem", lg: "6rem"}}} key={variantIndex}>
                            <Stack flexDirection="row" alignItems="center">
                                <IconButton  aria-label="add variant" onClick={e => handleVariantAdd(e, variantIndex, products, setProduct)}>
                                    <PlusIcon />
                                </IconButton>
                                {product.variants.length!==1 && <><IconButton aria-label="delete" onClick={e => handleVariantRemove(e, variantIndex, setProduct)}>
                                    <RemoveIcon />
                                </IconButton>
                                <IconButton aria-label="move to front" onClick={e => handleVariantToFront(e, variantIndex, setProduct)}>
                                    <UpIcon />
                                </IconButton>
                                </>}
                                {hasExisted && <>
                                    <Typography>Old Variant</Typography>
                                    <input type="hidden" name={`variants[${variantIndex}][for_update_id]`} value={variant.for_update_id} />
                                </>}
                            </Stack>
                            <TextField {...addFromName(`variants[${variantIndex}][name]`)} value={variant.name} label="Variant's Name" onChange={e => handleVariantName(e, variantIndex, setProduct)} variant={inputVariant} required={isRequired} />
                            <TextField {...addFromName(`variants[${variantIndex}][stock]`)} value={variant.stock} label="Variant's Stock" onChange={e => handleVariantStock(e, variantIndex, setProduct)} variant={inputVariant} required={isRequired} />
                            <Stack gap={2}>
                                <FormControlLabel
                                    control={
                                        <Switch checked={variant.isColor} onChange={e => handleVariantIsColor(e, variantIndex, product, setProduct)} />
                                    }
                                    label="Is the variant a color?"
                                />
                                {
                                    variant.isColor &&
                                    <TextField {...addFromName(`variants[${variantIndex}][color]`)} label="choose variant color" type="color" onChange={e => handleVariantColor(e, variantIndex, setProduct)} value={variant.color} variant={inputVariant} />
                                }
                            </Stack>
                            {variant.images.map((image, imageIndex) => {
                                const hasExistedVariantImage = Boolean(update && image?.for_update_id)
                                const isRequiredVariantImage = !hasExistedVariantImage
                                return <Stack gap="2rem" key={imageIndex} sx={{ pl: {xs: "2rem", sm: "3rem", md: "4rem", lg: "6rem"} }} flexWrap="wrap" flexDirection="row" alignItems="center">
                                    {hasExistedVariantImage && <>
                                            <Typography>Old Image</Typography>
                                            <input type="hidden" name={`variants[${variantIndex}][images][${imageIndex}][for_update_id]`} value={image.for_update_id} />
                                        </>
                                    }
                                    <TextField {...addFromName(`variants[${variantIndex}][images][${imageIndex}][alt]`)} onChange={e => handleVariantImageAlt(e, variantIndex, imageIndex, setProduct)} value={image.alt} label="Name for Image" id="form-admin-product-variants-images-image-alt" variant={inputVariant} />
                                    <ImageCropUploader cropInfoInputsName={getCropInfoInputsNameForVariantImage(variantIndex, imageIndex)} setCroppedData={(value) => setVariantImageForCropComp(value, variantIndex, imageIndex, setProduct)} croppedData={image} fileInputProps={{ ...addFromName(`variants[${variantIndex}][images][${imageIndex}][image]`), buttonText: "Upload Image For Variant *", emptyNameIfNull: !isRequiredVariantImage, inputProps: { required: isRequiredVariantImage }}} />
                                    <Stack flexDirection="row" alignItems="center">
                                        <IconButton sx={{aspectRatio: "1/1"}} aria-label="add image to variant" onClick={e => handleVariantImageAdd(e, variantIndex, imageIndex, products, setProduct)}>
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
                            })}
                            {variantIndex!==product.variants.length-1 && <Divider />}
                        </Stack>
                    })}
                </Stack>
                <Stack gap="4rem">
                    <Button type="sumbit" fullWidth variant="contained" startIcon={isLoading ? <Spinner /> : undefined}>SUBMIT</Button>
                    <Button type="button" onClick={() => setProductDemo(true)} fullWidth variant="contained">Show DEMO</Button>
                </Stack>
            </ReactRouterForm>
            {productDemo && <Stack alignItems="center">
                <Divider
                      variant="middle"
                      flexItem
                      orientation="horizontal"
                      sx={{ my: "1.5rem" }}
                    />
                <Typography variant="h6" color="primary" sx={{textAlign: "center"}}>How this Product will look like</Typography>
                <ProductView product={product} products={products} />
                <Divider
                        variant="middle"
                        flexItem
                        orientation="horizontal"
                        sx={{ my: "1.5rem" }}
                        />
                <Typography variant="h6" color="primary" sx={{textAlign: "center"}}>How this Product will look like In the HomePage with The other products (current product is the first)</Typography>
                <ProductListView products={[product, ...products]} />
            </Stack>}
            <Modal open={showFrequentlyBoughtTogetherModal}>
                <Paper elevation={6} sx={{ height: {xs: "95vh", md: "90vh"}, width: {xs: "95vw", md: "90vw"}, position: "absolute", overflow: "scroll", top: "50%", left: "50%", transform: "translate(-50%, -50%)", py: "2rem", px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem" }, boxSizing: "border-box" }}>
                    <Stack>
                        <Stack flexDirection="row" gap={4} justifyContent="end" alignItems="center" >
                            <Typography>We recommend you always chose 2 products</Typography>
                            <IconButton onClick={handleCloseFBTModal}><HighlightOffOutlinedIcon /></IconButton>
                        </Stack>
                        <SelectProducts products={products} selectedProductIdState={[product.frequentlyBoughtTogether, setFrequentlyBoughtTogether]} />
                    </Stack>
                </Paper>
            </Modal>
        </Container>
    )
}