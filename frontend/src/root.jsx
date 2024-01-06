import { ThemeProvider, createTheme } from "@mui/material/styles";

import T from "@mui/material/Typography"
import Button from "@mui/material/Button"

export default function Root() {
    return (
        <ThemeProvider theme={THEME}>
            <Button variant="contained">Make a Message Pop Up (currently unavailable)</Button>
        </ThemeProvider>
    )
}

const THEME = createTheme({
 });