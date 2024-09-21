import { create_payment_intent } from "../api";

export async function action({ request, }) {
    const formData = await request.formData()
    return await create_payment_intent(formData)
}