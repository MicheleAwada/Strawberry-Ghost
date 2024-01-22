import { flattenArray } from "../utils"
import { baseState as baseCropImageState } from "./cropFileInput"

function baseProductChange(newChange, setProduct) {
    setProduct((oldProduct => ({...oldProduct, ...newChange})))
}
function handleChangeTitle(event, setProduct) {
    baseProductChange({title: event.target.value}, setProduct)
}
function handleChangeDescription(event, setProduct) {
    baseProductChange({description: event.target.value}, setProduct)
}

const slugRegex = new RegExp(/^[a-z0-9]+(?:-[a-zA-Z0-9]+)*$/)
function handleVerifySlug(slug) {
    return slugRegex.test(slug)
}
function handleChangeSlug(event, setProduct) {
    baseProductChange({slug: event.target.value}, setProduct)
}


const priceRegex = new RegExp(/^\d*(\.\d{0,2})?$/)
function handleChangePrice(event, product, setProduct) {
    let value = event.target.value
    const valid = priceRegex.test(value)
    if (valid) baseProductChange({price: value}, setProduct)
}
function handleChangeThumbnail(event, setProduct) {
    const [file] = event.target.files
    if (file) {
        const url = URL.createObjectURL(file)
        baseProductChange({thumbnail: url}, setProduct)
    }
}

function baseChangeVariant(variantIndex, newVariant, setProduct) {
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



function handleVariantName(event, variantIndex, setProduct) {
    baseChangeVariant(variantIndex, {name: event.target.value}, setProduct)
}
function handleVariantColor(event, variantIndex, setProduct) {
    baseChangeVariant(variantIndex, {color: event.target.value}, setProduct)
}
function handleVariantIsColor(event, variantIndex, product, setProduct) {
    baseChangeVariant(variantIndex, {isColor: !product.variants[variantIndex].isColor}, setProduct)
}

function insertItemAt(array, item, index) {
    array.splice(index, 0, item);
    }
function removeItemAt(array, index) {
    array.splice(index, 1);
    }
function moveToFront(array, index) {
    if (index >= 0 && index < array.length) {
        const element = array.splice(index, 1)[0];
        array.unshift(element);
    } else {
        console.error("Invalid index provided.");
    }
}
      

function handleVariantAdd(event, variantIndex, setProduct) {
    setProduct((product) => {
        insertItemAt(product.variants, defaultVariant, variantIndex+1)
        return {...product}
    })
}
function handleVariantRemove(event, variantIndex, setProduct) {
    setProduct((product) => {
        removeItemAt(product.variants, variantIndex)
        return {...product}
    })
}
function handleVariantToFront(event, variantIndex, setProduct) {
    setProduct((product) => {
        moveToFront(product.variants, variantIndex)
        return {...product}
    })
}

function baseVariantImageAffect(variantIndex, changeFunction, setProduct) {
    setProduct((oldProduct) => {
        return {
            ...oldProduct,
            variants: [
            ...oldProduct.variants.slice(0, variantIndex),
            {
                ...oldProduct.variants[variantIndex],
                images: changeFunction(oldProduct),
            },
            ...oldProduct.variants.slice(variantIndex + 1)
            ]
      }
    })
}

function handleVariantImageAdd(event, variantIndex, imageIndex, setProduct) {
    const changeFunction = (oldProduct) => {
        insertItemAt(oldProduct.variants[variantIndex].images, defaultImage, imageIndex+1)
        return oldProduct.variants[variantIndex].images
    }
    baseVariantImageAffect(variantIndex, changeFunction, setProduct)
}
function handleVariantImageRemove(event, variantIndex, imageIndex, setProduct) {
    const changeFunction = (oldProduct) => {
        removeItemAt(oldProduct.variants[variantIndex].images, imageIndex)
        return oldProduct.variants[variantIndex].images
    }
    baseVariantImageAffect(variantIndex, changeFunction, setProduct)
}
function handleVariantImageToFront(event, variantIndex, imageIndex, setProduct) {
    const changeFunction = (oldProduct) => {
        moveToFront(oldProduct.variants[variantIndex].images, imageIndex)
        return oldProduct.variants[variantIndex].images
    }
    baseVariantImageAffect(variantIndex, changeFunction, setProduct)
}

function variantImageBaseChange(newChange, variantIndex, imageIndex, setProduct) {
    const changeFunction = (oldProduct) => ([
        ...oldProduct.variants[variantIndex].images.slice(0,imageIndex),
        {...oldProduct.variants[variantIndex].images[imageIndex], ...newChange},
        ...oldProduct.variants[variantIndex].images.slice(imageIndex+1),
      ])
    baseVariantImageAffect(variantIndex, changeFunction, setProduct)
}
function variantImageBaseFunctionChange(newChange, variantIndex, imageIndex, setProduct) {
    const changeFunction = (oldProduct) => ([
        ...oldProduct.variants[variantIndex].images.slice(0,imageIndex),
        {...oldProduct.variants[variantIndex].images[imageIndex], ...newChange(oldProduct.variants[variantIndex].images[imageIndex])},
        ...oldProduct.variants[variantIndex].images.slice(imageIndex+1),
      ])
    baseVariantImageAffect(variantIndex, changeFunction, setProduct)
}




function handleVariantChangeImage(event, variantIndex, imageIndex, setProduct) {
    const [file] = event.target.files
    if (file) {
        const url = URL.createObjectURL(file)
        variantImageBaseChange({image: url}, variantIndex, imageIndex, setProduct)
    }
}
function handleVariantImageAlt(event, variantIndex, imageIndex, setProduct) {
    variantImageBaseChange({alt: event.target.value}, variantIndex, imageIndex, setProduct)
}

function getCropInfoInputsNameForVariantImage(variantIndex, imageIndex) {
    return { x: `variants[${variantIndex}][images][${imageIndex}][image_crop_x]`, y: `variants[${variantIndex}][images][${imageIndex}][image_crop_y]`, width: `variants[${variantIndex}][images][${imageIndex}][image_crop_width]`, height: `variants[${variantIndex}][images][${imageIndex}][image_crop_height]` }
}

function setVariantImageForCropComp(value, variantIndex, imageIndex, setProduct) {
    if (typeof value === "function") {
        return variantImageBaseFunctionChange(value, variantIndex, imageIndex, setProduct)
    }
    return variantImageBaseChange(value, variantIndex, imageIndex, setProduct)
}



const defaultImage = {
    ...baseCropImageState,
    alt: "",
}
const defaultVariant = {
        images: [
            defaultImage,
        ],
        isColor: false,
        default: false,
        color: "",
        name: ""
}

const defaultProduct = {
    title: "",
    description: "",
    price: "",
    slug: "",
    frequentlyBoughtTogether: [],
    variants: [
        defaultVariant,
    ],
    ...baseCropImageState,
    thumbnail: "https://creativelittlewomen.com/wp-content/uploads/2021/11/IMG_2439.jpg"
}

function defaultImageWithIds(products) {
    const highestId = Math.max(...flattenArray(products.map(product => product.variants.map(variant => variant.images.map(image => image.id)))))

    return { ...defaultImage, id: (highestId+1), }

}

function defaultVariantWithIds(products) {
    const highestId = Math.max(...flattenArray(products.map(product => product.variants.map(variant => variant.id))))

    return { ...defaultVariant, id: (highestId+1), images: [defaultImageWithIds(products)] }
}


function defaultProductWithIds(products) {
    const highestId = Math.max(...products.map(product => product.id))


    return { ...defaultProduct, id: (highestId+1), variants: [defaultVariantWithIds(products)] } 

}


export { defaultProductWithIds,
    handleVerifySlug,
    handleChangeTitle, handleChangeDescription, handleChangePrice, handleChangeSlug,
    handleVariantAdd, handleVariantRemove, handleVariantToFront, handleVariantName, handleVariantColor, handleVariantIsColor,
    handleVariantImageAdd, handleVariantImageRemove, handleVariantImageToFront, handleVariantImageAlt, getCropInfoInputsNameForVariantImage, setVariantImageForCropComp }