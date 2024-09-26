function flattenArray(array) {
    return array.reduce((acc, val) => {
        if (Array.isArray(val)) {
            return flattenArray([...acc, ...val])
        }
        else {
            return [...acc, val]
        }
    }, [])
}

function equalSplitArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

function getVariant(products, variantId) {
    let variant;
    products.some((product) => {
        return product.variants.some((products_variant) => {
            if (products_variant.id == variantId) {
                variant = products_variant
                return true
            }
            return false 
        })
    })
    if (variant === undefined) {
        throw new Error("Sorry something went wrong, the variant wasn't found, try refreshing and going back to home")
    }
    return variant
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export { flattenArray, getVariant, sleep, equalSplitArray }