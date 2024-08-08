import { loader as getUserLoader } from "../root"
export async function action() {
    const user = await getUserLoader()
    return user
}