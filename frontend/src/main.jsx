import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'

import MessagesProvider from "./components/messages";
import UserProvider from "./components/user";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import {pink, orange} from '@mui/material/colors';

const THEME = createTheme({
    palette : {
      primary: {'main': pink[300], contrastText: '#fff', dark: pink[400], extraDark: pink[500], light: pink[200], extraLight: pink[100]},
      secondary: {'main': orange[500]},
    } 
  });


import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Root, {loader as rootLoader} from './root'
import Index, { loader as indexLoader} from './routes/index';
import ProductView, { loader as productViewLoader } from './routes/productView';
import Cart, { loader as CartLoader } from './routes/cart';
import Orders, { loader as OrdersLoader } from './routes/orders';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />} loader={rootLoader}>
    <Route index element={<Index />} loader={indexLoader} />
    <Route path='products/:id' element={<ProductView />} loader={productViewLoader} />
    <Route path='cart' element={<Cart />} loader={CartLoader} />
    <Route path='orders' element={<Orders />} loader={OrdersLoader} />
  </Route>
));



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={THEME}>
      <UserProvider>
        <MessagesProvider>
          <RouterProvider router={router} />
        </MessagesProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
