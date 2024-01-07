import { products } from "./fakeServerInfo.js";


function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function lag() {
	const randomLagLatency = Math.random * 1000 + 600;
	return sleep(randomLagLatency);
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
    return products.find((product) => product.id === id)
}
