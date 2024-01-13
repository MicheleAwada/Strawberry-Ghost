import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import FormControlLabel from "@mui/material/FormControlLabel"

import { Form as ReactRouterForm, useLoaderData, useNavigation } from "react-router-dom"

import ProductView from "./productView"
import ProductListView from "../components/productListView"

import FileInput from "../components/fileInput"
import { useState } from "react"
import Divider from '@mui/material/Divider'
import { getProducts } from "../fakeApi"



export async function loader() {
    const products = await getProducts()
    return products
}
export async function action({ request }) {
    const formData = await request.formData()
    const isColor = formData.get("isColor")
    formData.delete("isColor")
    if (!isColor) formData.set("color", "")
    console.log(formData)
    const response = await createProduct(formData)
    return response
}

export default function Admin() {
    const products = useLoaderData();






    const defaultImage = {
        image: "https://creativelittlewomen.com/wp-content/uploads/2021/11/IMG_2439.jpg",
        alt: "",
    }
    const defaultVariant = {
            images: [
                defaultImage,
            ],
            default: false,
            isColor: false,
            color: "",
            name: ""
    }
    const [product, setProduct] = useState({
        id: 1000000,
        title: "",
        description: "",
        price: "",
        frequentlyBoughtTogether: [],
        variants: [
            defaultVariant,
        ],
        thumbnail: "https://creativelittlewomen.com/wp-content/uploads/2021/11/IMG_2439.jpg"
    })



    return (
        <Container maxWidth="lg" sx={{ pt: "4rem" }}>
            <ReactRouterForm encType="multipart/form-data" method="POST">
                <Stack gap="2rem" mb="4rem">
                    <TextField name="title" id="form-admin-product-title" value={product.title} onChange={handleChangeTitle} label="Title" variant="outlined" required />
                    <TextField name="description" id="form-admin-product-description" multiline minRows={4} maxRows={14} value={product.description} onChange={handleChangeDescription} label="Description" variant="outlined" required />
                    <TextField name="price" id="form-admin-product-price" value={product.price} onChange={handleChangePrice} label="Price" variant="outlined" required />
                    <Stack justifyContent="center" alignItems="center">
                        <FileInput name="thumbnail" text="Upload Main Thumbnail *" id="form-admin-product-thumbnail" inputProps={{onChange: handleChangeThumbnail, required: true, accept: "image/*"}} />
                    </Stack>
                    <Divider
                      variant="fullWidth"
                      orientation="horizontal"
                      
                    ><Typography>Variants</Typography></Divider>
                    {product.variants.map((variant, variantIndex) => (
                        <Stack gap="2rem" sx={{pl: "6rem"}} key={variantIndex}>
                            <TextField name={`variants[${variantIndex}][name]`} value={variant.name} label="Variant's Name" onChange={(e) => handleVariantName(e, variantIndex)} required />
                            <FormControlLabel
                                control={
                                    <Switch name="isColor" checked={variant.isColor} onChange={(e) => handleVariantIsColor(e, variantIndex)} />
                                }
                                label="Is a color variant?"
                            />
                            {/* "isColor" name for isColor above since its not a actual backend field */}
                            {
                                variant.isColor ?
                                    <TextField name={`variants[${variantIndex}][color]`} label="choose variant color" type="color" onChange={e => handleVariantColor(e, variantIndex)} value={variant.color} />
                                    : <TextField name={`variants[${variantIndex}][color]`} type="hidden" sx={{display: "none"}} value={"null"}  />
                            }
                            <Divider
                                variant="fullWidth"
                                orientation="horizontal"
                                
                            ><Typography>This Variants Images</Typography></Divider>
                            {variant.images.map((image, imageIndex) => (
                                <Stack gap="2rem" key={imageIndex} sx={{ pl: "6rem" }} flexWrap="wrap" flexDirection="row">
                                    <TextField name={`variants[${variantIndex}][images][${imageIndex}][alt]`} onChange={e => handleVariantImageAlt(e, variantIndex, imageIndex)} value={image.alt} label="Name for Image" id="form-admin-product-variants-images-image-alt" />
                                    <FileInput text="Upload Image for Variant *" name={`variants[${variantIndex}][images][${imageIndex}][image]`} inputProps={{onChange: e => handleVariantChangeImage(e, variantIndex, imageIndex), required: true, accept: "image/*" }} id={`variant image ${variantIndex} ${imageIndex}`} />
                                </Stack>
                            ))}
                            <Stack alignItems="center">
                                <Button variant="contained" onClick={e => {handleVariantAddImage(e, variantIndex)}}>Add Image</Button>
                            </Stack>
                        </Stack>
                    ))}

                    <Stack alignItems="center">
                        <Button variant="contained" onClick={handleAddVariant}>Add Variant</Button>
                    </Stack>
                </Stack>
                {/* <Box sx={{bgcolor: "#000000"}}>
                    <Spinner />
                </Box> */}
                <Button type="sumbit" fullWidth variant="contained">SUBMIT</Button>
            </ReactRouterForm>
        </Container>
    )
}