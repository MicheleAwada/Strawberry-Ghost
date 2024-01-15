import axios from "axios";

const domain_name = "http://127.0.0.1:8000";

const api = axios.create({
	baseURL: domain_name,
});



api.interceptors.request.use((config) => {
	config.headers = {
		...config.headers,
	};
	return config;
});

function findError(error) {
    let errorValue = null;
    let errorMessage = "Oops, a unknown error occured";
    if (error.message) {
        errorMessage = error.message
    }
    if (error.response.message) {
        errorMessage = error.response.message
    }
    if (error.response.data) {
        errorMessage = "Oops, check to see a field has a error to fix it"
        errorValue = error.response.data
    }
    return {errorMessage: errorMessage, error: errorValue}
}



async function defaultApi({link, data, type="post"}) {
    if (typeof link === "function") {
        link = link(data)
    }
    try {
        const response = await api[type](link, data)
        return {succeeded: true, response: response.data}
    } catch (error) {
        return {succeeded: false, ...findError(error), response: null}
    }
}

function getDefaultApiFunction({...props}) {
    return async function(data) {
        const response = await defaultApi({...props, data})
        return response
    }
}
function getDefaultApiFunctionWithoutData({...props}) {
    return async function() {
        return await defaultApi({...props})
    }
}


const createProduct = getDefaultApiFunction({ link: "/api/product/" })

const login = getDefaultApiFunction({ link: "/api/login/" })

const addCartItem = getDefaultApiFunction({ link: "/api/cart/" })
const changeCartItem = getDefaultApiFunction({ link: data => `/api/cart/${data.id}`, type: "put" })
const deleteCartItem = getDefaultApiFunction({ link: data => `/api/cart/${data.id}`, type: "delete" })

export { createProduct, addCartItem, changeCartItem, deleteCartItem }
export { login }
export { api };