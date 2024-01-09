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
        productsCache = products
    }
    return productsCache
}

export async function getProduct(id) {
    const products = await getProducts()
    id = parseInt(id)
    return products.find((product) => product.id === id)
}


export async function getUser() {
    // if (localStorage.getItem("user") !== null) {
    //     return JSON.parse(localStorage.getItem("user"))
    // }
    localStorage.setItem("user", JSON.stringify(user)) // with backend it wouldnt be here
    return user
}

export async function getCartProducts() {
    const products = await getProducts()
    const user = await getUser()
    const productsInCart = products.filter((product) => {
        return user.cart.includes(product.id)
    })
    return productsInCart
}