import { ThemeProvider, createTheme } from "@mui/material/styles";
import ProvideAndRenderMessages from "./components/messages";

import { MessagesContext } from "./components/messages";

export default function Root() {
    return (
        <ThemeProvider theme={THEME}>
            <ProvideAndRenderMessages>

            </ProvideAndRenderMessages>
        </ThemeProvider>
    )
}

const THEME = createTheme({
 });


 export {MessagesContext}