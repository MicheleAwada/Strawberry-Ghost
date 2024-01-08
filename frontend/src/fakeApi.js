import { products } from "./fakeServerInfo.js";


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