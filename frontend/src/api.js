import axios from "axios";
import { sleep } from "./utils";

// const domain_url = `http://127.0.0.1:8000`;
const domain_url = `https://api.strawberryghost.org`;

const api = axios.create({
	baseURL: domain_url,
});

api.interceptors.request.use((config) => {
	if (is_authenticated()) {
		config.headers = {
			...config.headers,
			...get_token_in_headers(),
		};
	}

	return config;
});

function findError(error) {
	let errorValue = {};
	let errorMessage = "Oops, a unknown error occured";
	let type = "internal"
	if (error.message) {
		errorMessage = error.message;
		type = "internal"
	}
	if (error.response && error.response.data) {
		type = "external"
		if (error.response.data) {
			errorMessage = "Oops, check to see a field has a error to fix it";
			errorValue = error.response.data;
		}
		if (error.response.data.detail && typeof error.response.data.detail === "string") {
			errorMessage = error.response.data.detail;
			errorValue = {};
		}
		if (error.response.data.status && typeof error.response.data.status === "string") {
			errorMessage = error.response.data.status;
			errorValue = {};
		}
	}
	return { errorMessage: errorMessage, error: errorValue, errorType: type };
}

async function defaultApi({ link, params={}, data={}, method = "post" }) {
	if (typeof link === "function") {
		link = link(data);
	}
	try {
		let final_data = data;
		if (params) {
			final_data["params"] = params
		}
		const response = await api[method](link, final_data);
		return { succeeded: true, response: response.data };
	} catch (error) {
		return { succeeded: false, ...findError(error) };
	}
}

function getDefaultApiFunction({ ...props }) {
	return async function (data={}, link_data={}, params={}) {
		const response = await defaultApi({ ...props, params, data });
		return response;
	};
}
function getDefaultApiFunctionWithoutData({ ...props }) {
	return async function () {
		return await defaultApi({ ...props });
	};
}

function set_token(token) {
	return localStorage.setItem("token", token);
}

function get_token() {
	return localStorage.getItem("token");
}

function get_token_in_headers() {
	return { Authorization: "Token " + get_token() };
}

function is_authenticated() {
	return localStorage.getItem("token", null) !== null;
}
function logout() {
	return localStorage.removeItem("token");
}


function getFromData(data, name, defaultValue="") {
	const extractedData = data[name] || (typeof data?.get === "function" && data.get(name)) || defaultValue
	return extractedData
}

function clearCacheForAdminChangeProduct(func_to_call, main_func) {
	return async (...args) => {
		const response = await main_func(...args)
		await func_to_call()
		return response
	}
}

const createProduct = clearCacheForAdminChangeProduct(clearProductsCache, getDefaultApiFunction({ link: "/api/product/" }))
const updateProduct = clearCacheForAdminChangeProduct(clearProductsCache, getDefaultApiFunction({ link: data => `/api/product/${getFromData(data, "slug_for_update")}/`, method: "patch" }))
const deleteProduct = clearCacheForAdminChangeProduct(clearProductsCache, getDefaultApiFunction({ link: data => `/api/product/${getFromData(data, "slug_for_delete")}/`, method: "delete" }))



const addCartItem = getDefaultApiFunction({ link: "/api/cart/" });
const changeCartItem = getDefaultApiFunction({
	link: (data) => `/api/cart/${getFromData(data, "id")}/`,
	method: "patch",
});
const deleteCartItem = getDefaultApiFunction({
	link: (data) => (`/api/cart/${getFromData(data, "id")}/`),
	method: "delete",
});

const getProductsAPI = getDefaultApiFunction({
	link: "/api/product/",
	method: "get",
});

const getProductAPI = getDefaultApiFunction({
	link: (data) => `/api/product/${getFromData(data, "slug")}/`,
	method: "get",
});
let products_cache = []

function clearProductsCache() {
	products_cache = []
}

async function returnThanClearProductsCache() {
	const b = [...products_cache]
	clearProductsCache()
	return b
}

async function getProducts() {
	if (products_cache?.length === 0) {
		products_cache = (await getProductsAPI())?.response
	}
	if (products_cache===undefined) {
		throw new Error("Failed to load products, perhaps our server is down")
	}
	return products_cache
}
async function getProduct({ slug }) {
	if (products_cache?.length === 0) {
		products_cache = (await getProductsAPI()).response
	}
	const product = products_cache.find(product => {
		return product.slug === slug
	})
	if (product===undefined) return undefined //wasnt found
	return product
}

function paramsFromDict(dict) {
	if (!dict) return ""
	return "?" + (Object.keys(dict).map(key => `${key}=${dict[key]}`).join("&"))
}

const getUser = getDefaultApiFunction({ link: "/api/user/", method: "get" })


const login = getDefaultApiFunction({ link: "/api/login/" });
const verification = getDefaultApiFunction({ link: "/api/verification/" });
const signup = getDefaultApiFunction({ link: "/api/user/" })
const reset_password = getDefaultApiFunction({ link: "/api/reset_password/", method: "put" })
const change_password = getDefaultApiFunction({ link: "/api/change_password/", method: "put" })
const change_email = getDefaultApiFunction({ link: "/api/change_email/", method: "put" })
const change_account_info = getDefaultApiFunction({ link: data => `/api/user/${getFromData(data, "id")}/`, method: "patch" })
const delete_account = getDefaultApiFunction({ link: `/api/delete_user/`, method: "post" })
const google_login = getDefaultApiFunction({ link: "/api/google_login/" })

const checkout = getDefaultApiFunction({ link: "/checkout/create-checkout-session/", method: "post" })
const create_payment_intent = getDefaultApiFunction({ link: "/api/create-payment-intent/", method: "post" })

const contact = getDefaultApiFunction({ link: "/api/contact/", method: "post" })

const get_orders = getDefaultApiFunction({ link: "/api/orders/", method: "get" })

const search = getDefaultApiFunction({ link: (data) => `/api/search/${getFromData(data, "search_query")}/`, method: "get"})

const simple_get_reviews = getDefaultApiFunction({ link: "/api/reviews/", method: "get" });
const create_review = getDefaultApiFunction({ link: "/api/reviews/", method: "post" });
const change_review = getDefaultApiFunction({ link: data => `/api/reviews/${getFromData(data, "id")}/`, method: "put" });
async function get_reviews(...args) {
	const response = await simple_get_reviews(...args)
	return response
}


export { clearProductsCache, createProduct, updateProduct, deleteProduct, addCartItem, changeCartItem, deleteCartItem };
export { getProducts, getProduct };
export { login, delete_account, getUser, signup, is_authenticated, change_account_info, set_token, logout, reset_password, change_password, change_email, google_login };
export { verification }
export { checkout, create_payment_intent }
export { contact }
export { get_orders }
export { search }
export { get_reviews, create_review, change_review }

export { domain_url, api };