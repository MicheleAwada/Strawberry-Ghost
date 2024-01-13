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
import { useContext, useEffect, useState } from "react"
import Divider from '@mui/material/Divider'
import { getProducts } from "../fakeApi"

import Spinner from "../components/spinner"
import { createProduct } from "../api"
import { MessagesContext } from "../root"

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


    const highestId = products.reduce((max, product) => {
        const id = product.id
        if (id>max) {
            return id
        }
        return max
    }, 0)

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
        id: (highestId+1),
        title: "",
        description: "",
        price: "",
        frequentlyBoughtTogether: [],
        variants: [
            defaultVariant,
        ],
        thumbnail: "https://creativelittlewomen.com/wp-content/uploads/2021/11/IMG_2439.jpg"
    })

    function handleChangeBase(newChange) {
        setProduct((oldProduct => ({...oldProduct, ...newChange})))
    }
    function handleChangeTitle(event) {
        handleChangeBase({title: event.target.value})
    }
    function handleChangeDescription(event) {
        handleChangeBase({description: event.target.value})
    }

    function handleChangePrice(event) {
        let value = `${event.target.value}`
        const oldValue = `${product.price}`
        function getLastAddedLetter(str1, str2) {
            if (str1.length === str2.length - 1 && str2.slice(0, -1) === str1) {
              return str2.slice(-1);
            } else {
              return null;
            }
          }
        if (getLastAddedLetter(oldValue, value)===".") {
            value += "00"
        }
        handleChangeBase({price: value})
    }
    function handleChangeThumbnail(event) {
        const [file] = event.target.files
        if (file) {
            const url = URL.createObjectURL(file)
            handleChangeBase({thumbnail: url})
        }
    }
    function handleAddVariant() {
        setProduct((product) => ({...product, variants: [
            ...product.variants,
            defaultVariant
        ]}))
    }
    function changeVariant(variantIndex, newVariant) {
            setProduct(oldProduct => {
                return {
                    ...oldProduct,
                    variants: [
                      ...oldProduct.variants.slice(0, variantIndex),
                      {
                        ...oldProduct.variants[variantIndex],
                        ...newVariant
                      },
                      ...oldProduct.variants.slice(variantIndex + 1)
                    ]
                  }
            }) 
        }
    function handleVariantAddImage(event, variantIndex) {
        setProduct((oldProduct) => {
            return {
                ...oldProduct,
                variants: [
                ...oldProduct.variants.slice(0, variantIndex),
                {
                    ...oldProduct.variants[variantIndex],
                    images: [
                        ...oldProduct.variants[variantIndex].images,
                        defaultImage
                      ]
                },
                ...oldProduct.variants.slice(variantIndex + 1)
                ]
          }
        })
    }
    function handleVariantChangeImage(event, variantIndex, imageIndex) {
        const [file] = event.target.files
        let url = product.variants[variantIndex].images[imageIndex].image
        if (file) {
            url = URL.createObjectURL(file)
        }
        setProduct((oldProduct) => {
            return {
                ...oldProduct,
                variants: [
                ...oldProduct.variants.slice(0, variantIndex),
                {
                    ...oldProduct.variants[variantIndex],
                    images: [
                        ...oldProduct.variants[variantIndex].images.slice(0,imageIndex),
                        {...oldProduct.variants[variantIndex].images[imageIndex], image: url},
                        ...oldProduct.variants[variantIndex].images.slice(imageIndex+1),
                      ]
                },
                ...oldProduct.variants.slice(variantIndex + 1)
                ]
          }
        })
    }
    function handleVariantImageAlt(event, variantIndex, imageIndex) {
        setProduct((oldProduct) => {
            return {
                ...oldProduct,
                variants: [
                ...oldProduct.variants.slice(0, variantIndex),
                {
                    ...oldProduct.variants[variantIndex],
                    images: [
                        ...oldProduct.variants[variantIndex].images.slice(0,imageIndex),
                        {...oldProduct.variants[variantIndex].images[imageIndex], alt: event.target.value},
                        ...oldProduct.variants[variantIndex].images.slice(imageIndex+1),
                      ]
                },
                ...oldProduct.variants.slice(variantIndex + 1)
                ]
          }
        })
    }

    function handleVariantName(event, variantIndex) {
        changeVariant(variantIndex, {name: event.target.value})
    }
    function handleVariantColor(event, variantIndex) {
        changeVariant(variantIndex, {color: event.target.value})
    }
    function handleVariantIsColor(event, variantIndex) {
        changeVariant(variantIndex, {isColor: !product.variants[variantIndex].isColor})
    }



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
                <Button type="sumbit" fullWidth variant="contained" startIcon={isLoading ? <Spinner /> : undefined}>SUBMIT</Button>
            </ReactRouterForm>
            <Divider
                      variant="inset"
                      orientation="horizontal"
                      sx={{ my: "4rem" }}
                    ><Typography>How this Product will look like</Typography></Divider>
            <ProductView product={product} />
            <Divider
                      variant="inset"
                      orientation="horizontal"
                      sx={{ my: "4rem" }}
                    >How this Product will look like In the HomePage with The other products (current product is the first)</Divider>
            <ProductListView products={[product, ...products]} />
        </Container>
    )
}