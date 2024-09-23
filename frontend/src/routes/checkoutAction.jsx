import { checkout } from "../api";
import {redirect} from "react-router-dom";

export async function action({ request }) {
    const data = await request.formData();
    const response = await checkout(data)
    return redirect(response.response.link)
}