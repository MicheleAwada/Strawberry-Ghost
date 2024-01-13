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

function findErrorMessage(e) {
    console.log("finding error")
    let errorMessage;
    try {
        errorMessage = e.response.data
    } catch {
        errorMessage = e.message
    }
    console.log(errorMessage)
    return errorMessage
}


async function defaultApi({link, data, type="post"}) {
    try {
        const response = await api[type](link, data)
        console.log("api good")
        console.log(response)
        return {succeeded: true, error: null, response: response.data}
    } catch (e) {
        console.log("api bad")
        console.log(e)
        return {succeeded: false, error: findErrorMessage(e), response: null}
    }
}

function getDefaultApiFunction({...props}) {
    return async function(data) {
        return await defaultApi({...props, data})
    }
}
function getDefaultApiFunctionWithoutData({...props}) {
    return async function() {
        return await defaultApi({...props})
    }
}


const createProduct = getDefaultApiFunction({ link: "/api/product/" })

export { api, createProduct };