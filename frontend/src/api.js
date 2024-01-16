import axios from "axios";

const domain_name = "http://127.0.0.1:8000";

const api = axios.create({
	baseURL: domain_name,
});



api.interceptors.request.use((config) => {
    if (is_authenticated()) {
        config.headers ={
            ...config.headers,
            ...get_token_in_headers(),
        }
    }
    
	return config;
});

function findError(error) {
    let errorValue = null;
    let errorMessage = "Oops, a unknown error occured";
    if (error.message !== undefined) {
        errorMessage = error.message
    }
    if (error.response.message !== undefined) {
        errorMessage = error.response.message
    }
    if (error.response.data !== undefined) {
        errorMessage = "Oops, check to see a field has a error to fix it"
        errorValue = error.response.data
    }
    return {errorMessage: errorMessage, error: errorValue}
}



async function defaultApi({link, data, method="post"}) {
    if (typeof link === "function") {
        link = link(data)
    }
    try {
        const response = await api[method](link, data)
        return {succeeded: true, response: response.data}
    } catch (error) {
        return {succeeded: false, ...findError(error)}
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


function set_token(token) {
    return localStorage.setItem("token", token)
}

function get_token() {
    return localStorage.getItem("token")
}

function get_token_in_headers() {
    return {'Authorization': 'Token ' + get_token()}
}

function is_authenticated() {
    return localStorage.getItem("token", null)!==null
}
function logout() {
    return localStorage.removeItem("token");
}


const createProduct = getDefaultApiFunction({ link: "/api/product/" })

const getUser = getDefaultApiFunction({ link: "/api/user/", method: "get" })
const login = getDefaultApiFunction({ link: "/api/login/" })

const addCartItem = getDefaultApiFunction({ link: "/api/cart/" })
const changeCartItem = getDefaultApiFunction({ link: data => `/api/cart/${data.id}`, method: "put" })
const deleteCartItem = getDefaultApiFunction({ link: data => `/api/cart/${data.id}`, method: "delete" })



export { createProduct, addCartItem, changeCartItem, deleteCartItem }
export { login, getUser, is_authenticated, set_token, logout }
export { api };