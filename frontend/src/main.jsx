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
import Cart, { loader as cartLoader } from './routes/cart';
import Orders, { loader as ordersLoader } from './routes/orders';
import Admin, { loader as adminLoader, action as adminAction } from './routes/admin';
import { addToCartAction, deleteCartAction,putCartAction} from "./routes/cartActions"
import Login, {action as loginAction} from './routes/login';


const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />} loader={rootLoader}>
    <Route index element={<Index />} loader={indexLoader} />
    <Route path='products/:id' element={<ProductView />} loader={productViewLoader} />
    <Route path='cart' element={<Cart />} loader={cartLoader} />
    <Route path='orders' element={<Orders />} loader={ordersLoader} />
    <Route path='admin' element={<Admin />} action={adminAction} loader={adminLoader} />
    <Route path='login' element={<Login />} action={loginAction} />
    <Route path='addToCart' action={addToCartAction} />
    <Route path='deleteCart' action={deleteCartAction} />
    <Route path='putCart' action={putCartAction} />
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
