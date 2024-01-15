import { addCartItem } from "../api"

export async function addToCartAction({ request }) {
    const formData = await request.formData
    const response = addCartItem(formData)
    return response
}
export async function putCartAction({ request }) {
    const formData = await request.formData
    const response = addCartItem(formData)
    return response
}
export async function deleteCartAction({ request }) {
    const formData = await request.formData
    const response = addCartItem(formData)
    return response
}