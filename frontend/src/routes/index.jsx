import { useContext } from "react";
import { MessagesContext } from "../main"

import Button from "@mui/material/Button"
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography'


export default function Index() {
    const simpleAddMessage = useContext(MessagesContext);
    return (
        <Box>
            {/* <AppBar position="fixed" color="primary">
              <Toolbar>
                <Typography variant="h6">
                    Hello
                </Typography>
                <Button color="primary" onClick={() => simpleAddMessage("Hello")}>Say Hello</Button>
              </Toolbar>
            </AppBar> */}
            <Button variant="contained" onClick={() => simpleAddMessage("HI")}>Say HI</Button>
            <Button variant="contained" onClick={() => simpleAddMessage("HELLO")}>Say HELLO</Button>
            <Button variant="contained" onClick={() => simpleAddMessage("BONJOUR")}>Say BONJOUR</Button>
            
        </Box>
    )
}