import { products, user } from "./fakeServerInfo.js";


function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function lag() {
	const randomLagLatency = Math.random() * 1000 + 600;
	return await sleep(randomLagLatency);
}



let productsCache = [];

export async function getProducts() {
    if (productsCache.length === 0) {
        await lag()
        productsCache = products.map((product) => {
            const frequentlyBoughtTogether = product.frequentlyBoughtTogether.map((productThatsBoughtTogetherFrequently) => {
                return products.find((productThatsBoughtTogetherFrequentlyToFind) => productThatsBoughtTogetherFrequentlyToFind.id === productThatsBoughtTogetherFrequently)
            })
            return {...product, frequentlyBoughtTogether}
        })
    }
    return productsCache
}

export async function getProduct(id) {
    const products = await getProducts()
    id = parseInt(id)
    return products.find((product) => product.id === id)
}

const baseUser = {
    isAuthenticated: false,
}

export function getUser() {
    // if (localStorage.getItem("user") !== null) {
    //     return JSON.parse(localStorage.getItem("user"))
    // }
    // localStorage.setItem("user", JSON.stringify(user)) // with backend it wouldnt be here
    return user
}

export async function getCart() {
    const products = await getProducts()
    const user = getUser()
    const cart = user.cart.map(cartItem => {
        const product = products.find(product => product.id === cartItem.product)
        const variant = product.variants.find(variant => variant.id === cartItem.variant)
        return {...cartItem, product, variant}
    })
    return cart
}

export async function getOrders() {
    const products = await getProducts()
    const user = getUser()

    const orders = user.orders.map((order) => {
        const newProductsBought = order.productsBought.map((productDetails) => {
            const product = products.find(product => product.id === productDetails.product)
            const variant = product.variants.find(variant => variant.id === productDetails.variant)
            return {...productDetails, product, variant}
        })
        return {...order, productsBought: newProductsBought}
    })
    return orders
}