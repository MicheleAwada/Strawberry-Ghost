import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import FormControlLabel from "@mui/material/FormControlLabel"

import { Form as ReactRouterForm, useActionData, useLoaderData, useNavigation } from "react-router-dom"

import ProductView from "./productView"
import ProductListView from "../components/productListView"

import FileInput from "../components/fileInput"
import { useContext, useEffect, useMemo, useState } from "react"
import Divider from '@mui/material/Divider'
import { getProducts } from "../fakeApi"

import Spinner from "../components/spinner"
import { createProduct } from "../api"
import { MessagesContext } from "../root"

import { defaultProduct,
    handleChangeTitle, handleChangeDescription, handleChangePrice, handleChangeThumbnail,
    handleAddVariant, handleVariantName, handleVariantColor, handleVariantIsColor,
    handleVariantAddImage, handleVariantChangeImage, handleVariantImageAlt } from "../components/adminHandlers"


export async function loader() {
    const products = await getProducts()
    return products
}
export async function action({ request }) {
    const formData = await request.formData()

    // const isColor = formData.get("isColor")
    // formData.delete("isColor")
    // if (!isColor) formData.set("color", "")
    console.log(formData)
    try {
        const stringPrice = formData.get("price")
        const price = parseFloat(stringPrice)
        formData.set("price", price)
    } catch (e) {
        return {succeeded: false, error: "Price Must Be a Decimal", response: null}
    }
    console.log(formData)

    const response = await createProduct(formData)
    return response
}

export default function Admin() {
    const products = useLoaderData();


    const actionData = useActionData();
    const navigation = useNavigation();
    const isLoading = navigation.state === "submitting"
    const { simpleAddMessage } = useContext(MessagesContext)
    useEffect(() => {
        if (actionData!== undefined) {
            if (actionData.succeeded) {
                simpleAddMessage("WOHOO", {severity: "success"})
            } else {
                simpleAddMessage("NOOO", {severity: "error"})
            }
        }
    }, [actionData])


    const [product, setProduct] = useState(defaultProduct(products))
    const [demo, setDemo] = useState(false)
    useEffect(() => {
        if (demo===true) setDemo(false)
    }, [product])

    return (
        <Container maxWidth="lg" sx={{ pt: "4rem" }}>
            <ReactRouterForm encType="multipart/form-data" method="POST">
                <Stack gap="2rem" mb="4rem">
                    <TextField name="title" id="form-admin-product-title" value={product.title} onChange={e => handleChangeTitle(e, setProduct)} label="Title" variant="outlined" required />
                    <TextField name="description" id="form-admin-product-description" multiline minRows={4} maxRows={14} value={product.description} onChange={e => handleChangeDescription(e, setProduct)} label="Description" variant="outlined" required />
                    <TextField name="price" id="form-admin-product-price" value={product.price} onChange={e => handleChangePrice(e, product, setProduct)} label="Price" variant="outlined" required />
                    <Stack justifyContent="center" alignItems="center">
                        <FileInput name="thumbnail" text="Upload Main Thumbnail *" id="form-admin-product-thumbnail" inputProps={{onChange: e => handleChangeThumbnail(e, setProduct), required: true, accept: "image/*"}} />
                    </Stack>
                    <Divider
                    variant="fullWidth"
                    orientation="horizontal"
                    
                    ><Typography>Variants</Typography></Divider>
                    {product.variants.map((variant, variantIndex) => (
                        <Stack gap="2rem" sx={{pl: {xs: "2rem", sm: "3rem", md: "4rem", lg: "6rem"}}} key={variantIndex}>
                            <TextField name={`variants[${variantIndex}][name]`} value={variant.name} label="Variant's Name" onChange={e => handleVariantName(e, variantIndex, setProduct)} required />
                            <FormControlLabel
                                control={
                                    <Switch name="isColor" checked={variant.isColor} onChange={e => handleVariantIsColor(e, variantIndex, product, setProduct)} />
                                }
                                label="Is a color variant?"
                            />
                            {/* "isColor" name for isColor but we remove it since its not a actual backend field */}
                            {
                                variant.isColor &&
                                    <TextField name={`variants[${variantIndex}][color]`} label="choose variant color" type="color" onChange={e => handleVariantColor(e, variantIndex, setProduct)} value={variant.color} />
                            }
                            <Divider
                                variant="fullWidth"
                                orientation="horizontal"
                                
                            ><Typography>This Variants Images</Typography></Divider>
                            {variant.images.map((image, imageIndex) => (
                                <Stack gap="2rem" key={imageIndex} sx={{ pl: {xs: "2rem", sm: "3rem", md: "4rem", lg: "6rem"} }} flexWrap="wrap" flexDirection="row">
                                    <TextField name={`variants[${variantIndex}][images][${imageIndex}][alt]`} onChange={e => handleVariantImageAlt(e, variantIndex, imageIndex, setProduct)} value={image.alt} label="Name for Image" id="form-admin-product-variants-images-image-alt" />
                                    <FileInput text="Upload Image for Variant *" name={`variants[${variantIndex}][images][${imageIndex}][image]`} inputProps={{onChange: e => handleVariantChangeImage(e, variantIndex, imageIndex, setProduct), required: true, accept: "image/*" }} id={`variant image ${variantIndex} ${imageIndex}`} />
                                </Stack>
                            ))}
                            <Stack alignItems="center">
                                <Button variant="contained" onClick={e => {handleVariantAddImage(e, variantIndex, variant.images.length, setProduct)}}>Add Image For Variant</Button>
                            </Stack>
                        </Stack>
                    ))}

                    <Stack alignItems="center">
                        <Button variant="contained" onClick={e => handleAddVariant(e, setProduct)}>Add Variant</Button>
                    </Stack>
                </Stack>
                {/* <Box sx={{bgcolor: "#000000"}}>
                    <Spinner />
                </Box> */}
                <Button type="sumbit" fullWidth variant="contained" startIcon={isLoading ? <Spinner /> : undefined}>SUBMIT</Button>
            </ReactRouterForm>
            <Button type="button" sx={{ mt: "4rem" }} onClick={e => setDemo(true)} fullWidth variant="contained">VIEW DEMO!!</Button>
            {demo && <><Divider
                      variant="inset"
                      orientation="horizontal"
                      sx={{ my: "4rem" }}
                    ><Typography>How this Product will look like</Typography></Divider>
            <ProductView product={product} />
            <Divider
                      variant="inset"
                      orientation="horizontal"
                      sx={{ my: "4rem" }}
                    ><Typography>How this Product will look like In the HomePage with The other products (current product is the first)</Typography></Divider>
            <ProductListView products={[product, ...products]} /></>}
        </Container>
    )
}