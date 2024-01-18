import { addCartItem, changeCartItem, deleteCartItem } from "../api"

export async function addToCartAction({ request }) {
    const formData = await request.formData()
    const response = addCartItem(formData)
    return response
}
export async function putCartAction({ request }) {
    const formData = await request.formData()
    const response = changeCartItem(formData)
    return response
}
export async function deleteCartAction({ request }) {
    const formData = await request.formData()
    const response = deleteCartItem(formData)
    return response
}