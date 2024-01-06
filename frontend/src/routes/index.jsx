import { useContext } from "react";
import { MessagesContext } from "../main"
import Button from "@mui/material/Button"
export default function Index() {
    const simpleAddMessage = useContext(MessagesContext);
    return (
        <Button variant="contained" onClick={() => simpleAddMessage("HII")}>Make a Message Pop Up</Button>
    )
}