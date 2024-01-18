import axios from "axios";

const domain_name = "http://127.0.0.1:8000";

const api = axios.create({
	baseURL: domain_name,
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
	let errorValue = null;
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
		if (error.response.data.detail) {
			errorMessage = error.response.data.detail;
		}
		if (error.response.data.message !== undefined) {
			errorMessage = error.response.data.message;
		}
	}
	return { errorMessage: errorMessage, error: errorValue, errorType: type };
}

async function defaultApi({ link, data, method = "post" }) {
	if (typeof link === "function") {
		link = link(data);
	}
	try {
		const response = await api[method](link, data);
		return { succeeded: true, response: response.data };
	} catch (error) {
		return { succeeded: false, ...findError(error) };
	}
}

function getDefaultApiFunction({ ...props }) {
	return async function (data) {
		const response = await defaultApi({ ...props, data });
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

const createProduct = getDefaultApiFunction({ link: "/api/product/" });



const addCartItem = getDefaultApiFunction({ link: "/api/cart/" });
const changeCartItem = getDefaultApiFunction({
	link: (data) => `/api/cart/${data.get("id")}`,
	method: "put",
});
const deleteCartItem = getDefaultApiFunction({
	link: (data) => (`/api/cart/${data.get("id")}`),
	method: "delete",
});

const getProductsAPI = getDefaultApiFunction({
	link: "/api/product/",
	method: "get",
});
const getProductAPI = getDefaultApiFunction({
	link: (data) => `/api/product/${data.get("slug")}/`,
	method: "get",
});
let products_cache = []
async function getProducts() {
	if (products_cache.length === 0) {
		products_cache = (await getProductsAPI()).response
	}
	return products_cache
}
async function getProduct({ slug }) {
	if (products_cache.length === 0) {
		products_cache = (await getProductsAPI()).response
	}
	const product = products_cache.find(product => {
		return product.slug === slug
	})
	if (product.length===0) return undefined //wasnt found
	return product
}

const getUser = getDefaultApiFunction({ link: "/api/user/", method: "get" });
const login = getDefaultApiFunction({ link: "/api/login/" });
const verification = getDefaultApiFunction({ link: "/api/verification/" });
const signup = getDefaultApiFunction({ link: "/api/user/" })
const reset_password = getDefaultApiFunction({ link: "/api/reset_password/", method: "put" })
const google_login = getDefaultApiFunction({ link: "/api/google_login/" })



export { createProduct, addCartItem, changeCartItem, deleteCartItem };
export { getProducts, getProduct };
export { login, getUser, signup, is_authenticated, set_token, logout, reset_password, google_login };
export { verification }
export { api };
