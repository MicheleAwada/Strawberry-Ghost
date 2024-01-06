import React from 'react'
import ReactDOM from 'react-dom/client'

import Root from './root'
import './index.scss'

import { ThemeProvider, createTheme } from "@mui/material/styles";
import ProvideAndRenderMessages from "./components/messages";

import { MessagesContext } from "./components/messages";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={THEME}>
      <ProvideAndRenderMessages>
        <Root />
      </ProvideAndRenderMessages>
    </ThemeProvider>
  </React.StrictMode>,
)

const THEME = createTheme({
 });


 export {MessagesContext}