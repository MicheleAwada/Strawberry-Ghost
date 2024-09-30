import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'

import { GoogleOAuthProvider } from '@react-oauth/google';

import MessagesProvider from "./components/messages";
import UserProvider from "./components/user";
import { SearchQueryProvider } from './routes/searchValue';

import { ThemeProvider, createTheme } from "@mui/material/styles";
import {pink, orange} from '@mui/material/colors';

const THEME = createTheme({
    palette : {
      primary: {main: pink[300], contrastText: '#fff', dark: pink[400], extraDark: pink[500], light: pink[200], extraLight: pink[100]},
      secondary: {main: orange[500]},
      background: {
        dark: "#f7f7f7",
      }
      // background: {paper: "#fafafa"}
    } 
  });

import { HeaderHeightProvider } from './components/header';


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
import AdminPage, { loader as adminPageLoader } from "./routes/admin"
import AdminChangeProduct, { createLoader as adminCreateLoader, createAction as adminCreateAction, updateLoader as adminUpdateLoader, updateAction as adminUpdateAction } from './routes/adminChangeProduct';
import { addToCartAction, deleteCartAction,putCartAction} from "./routes/cartActions"
import Login, {action as loginAction} from './routes/login';
import Signup, {action as signupAction, verificationAction} from './routes/signup';
import Logout from './routes/logout';
import ResetPassword, { action as resetPassword } from './routes/resetPassword';
import { action as getCurrentUser } from './components/getCurrentUser';
import AdminSelect, { loader as adminSelectLoader } from './routes/adminSelect';
import AdminDeleteProduct, { loader as adminDeleteLoader, action as adminDeleteAction } from './routes/adminDeleteProduct';

import {action as checkoutAction} from './routes/checkoutAction';
import StripeCheckoutSuccess from './components/stripe/success';
import ContactUs, { action as contactUsAction } from './routes/contactUs';
import { create_payment_intent } from './api';
import CheckoutRoot from './components/stripe/checkoutRoot';
import CheckoutForm from './components/stripe/CheckoutForm';
import ErrorElement from './routes/errorElement';
import MainLoading from './routes/mainLoading';
import Account from './routes/account';
import ChangeEmail, { action as changeEmailAction } from './routes/changeEmail';
import ChangePassword, { action as changePasswordAction } from './routes/changePassword';
import ChangeAccountInfo, { action as changeAccountInfoAction } from './routes/changeAccountInfo';
import Search, { loader as searchLoader } from './routes/search';
import ReviewsPage, { loader as reviewsPageLoader } from './routes/reviewsPage';
import { createReviewAction, updateReviewAction } from './components/changeReview';
import DeleteUser, { action as deleteUserAction } from './routes/deleteUser';
import TOS from './routes/tos';

const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<MainLoading />}>
    <Route path='/' element={<Root />} loader={rootLoader} errorElement={<ErrorElement />}>
      <Route index element={<Index />} loader={indexLoader} />
      <Route path='products/:slug' element={<ProductView />} loader={productViewLoader} />
      <Route path='cart' element={<Cart />} loader={cartLoader} />
      <Route path='orders' element={<Orders />} loader={ordersLoader} />
      <Route path='admin' element={<AdminPage />} loader={adminPageLoader} />
      <Route path="admin/products/update" element={<AdminSelect isDelete={false} />} loader={adminSelectLoader} />
      <Route path="admin/products/delete" element={<AdminSelect isDelete={true}/>} loader={adminSelectLoader} />
      <Route path='admin/products/create' element={<AdminChangeProduct />} action={adminCreateAction} loader={adminCreateLoader} />
      <Route path='admin/products/update/:slug' element={<AdminChangeProduct />} action={adminUpdateAction} loader={adminUpdateLoader} />
      <Route path='admin/products/delete/:slug' element={<AdminDeleteProduct />} action={adminDeleteAction} loader={adminDeleteLoader} />
      <Route path='account' element={<Account />} />
      <Route path='login' element={<Login />} action={loginAction} />
      <Route path='signup' element={<Signup />} action={signupAction} />
      <Route path='reset_password' element={<ResetPassword />} action={resetPassword} />
      <Route path="account/change_email" element={<ChangeEmail />} action={changeEmailAction} />
      <Route path="account/change_password" element={<ChangePassword />} action={changePasswordAction} />
      <Route path="account/change_account_info" element={<ChangeAccountInfo />} action={changeAccountInfoAction} />
      <Route path="account/delete_account" element={<DeleteUser />} action={deleteUserAction} />
      
      <Route path="terms_of_services" element={<TOS />} />
      
      <Route path='email_verification' action={verificationAction} />
      <Route path='logout' element={<Logout />} />
      <Route path='addToCart' action={addToCartAction} />
      <Route path='deleteCart' action={deleteCartAction} />
      <Route path='putCart' action={putCartAction} />
      <Route path='getCurrentUser' action={getCurrentUser} />
      <Route path='contact' element={<ContactUs />} action={contactUsAction} />
      <Route path='search/:search_query' element={<Search />} loader={searchLoader} />

      <Route path="reviews/:product_slug/:variant_id/:rating_filter_gte/:rating_filter_lte" element={<ReviewsPage />} loader={reviewsPageLoader} />
      <Route path="create_review" action={createReviewAction} />
      <Route path="update_review" action={updateReviewAction} />
      {/* stripe */}
      <Route path='checkout/' element={<CheckoutRoot />}  />
      <Route path='checkout/create-payment-intent' action={create_payment_intent} />
      <Route path='checkout/success' element={<StripeCheckoutSuccess/>} />
      {/* <Route path='checkout' action={checkoutAction} /> */}
    </Route>
  </Route>
));

function Providers({ children }) {
  return <GoogleOAuthProvider clientId="477408785210-546nej1b7m5qc5te6dcb1vdpe2eghbt6.apps.googleusercontent.com">
    <ThemeProvider theme={THEME}>
      <UserProvider>
        <HeaderHeightProvider>
          <MessagesProvider>
            <SearchQueryProvider>
              {children}
            </SearchQueryProvider>
          </MessagesProvider>
        </HeaderHeightProvider>
      </UserProvider>
    </ThemeProvider>
  </GoogleOAuthProvider> 

}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </React.StrictMode>
)
