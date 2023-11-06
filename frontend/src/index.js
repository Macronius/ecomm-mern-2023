import React from "react";
import ReactDOM from "react-dom/client";
// routing
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
// global state management
import store from "./store";
import { Provider as ReduxProvider } from "react-redux";
// payment - paypal
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// style
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
// components
import App from "./App";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
// screens
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen"; // protected
import PaymentScreen from "./screens/PaymentScreen"; // protected
import PlaceOrderScreen from "./screens/PlaceOrderScreen"; // protected
import OrderScreen from "./screens/OrderScreen"; // protected
import ProfileScreen from "./screens/ProfileScreen"; // protected
import OrderListScreen from "./screens/admin/OrderListScreen"; // admin protected
import ProductListScreen from "./screens/admin/ProductListScreen"; // admin protected
import ProductEditScreen from "./screens/admin/ProductEditScreen"; // admin protected
import UserListScreen from "./screens/admin/UserListScreen"; // admin protected
import UserEditScreen from "./screens/admin/UserEditScreen"; // admin protected
// other dependencies
import { HelmetProvider } from "react-helmet-async";
//
import reportWebVitals from "./reportWebVitals";

//
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>

      {/* Admin Routes */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route
          path="/admin/productlist/:pageNumber"
          element={<ProductListScreen />}
        />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="admin/user/:id/edit" element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

//
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <HelmetProvider>  {/*Q-31*/}
    <ReduxProvider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </ReduxProvider>
  </HelmetProvider>
  /* </React.StrictMode> */
);

reportWebVitals();
