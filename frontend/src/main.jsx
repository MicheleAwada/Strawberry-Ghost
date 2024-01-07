import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'

import MessagesProvider from "./components/messages";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import {pink, orange} from '@mui/material/colors';

const THEME = createTheme({
    palette : {
      primary: {'main': pink[300]},
      secondary: {'main': orange[500]},
    } 
  });


import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Root from './root'
import Index, { loader as indexLoader} from './routes/index';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>
    <Route index element={<Index />} loader={indexLoader} />
  </Route>
));



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={THEME}>
      <MessagesProvider>
        <RouterProvider router={router} />
      </MessagesProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
