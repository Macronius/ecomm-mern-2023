import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

// establish an initial state for each particular store "transaction"
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : // : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };
    {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "PayPal",
    };

// helper functions

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // extract incomming payload data as item
      const item = action.payload;
      // compare item from payload to the cartItems of "previous state", then assign the match to existItem
      const existItem = state.cartItems.find((x) => x._id === item._id);
      // update the quantity value
      if (existItem) {
        // update the state cart items array: if array item matches, enter item from payload, else enter array item
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // if no existItem, then simply add new item to existing array
        state.cartItems = [...state.cartItems, item];
        // remember that state is immutable, so we do not use .push, we instead make a copy, spread old and add new
      }
      // update cart in localStorage
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      // QUESTION: what exactly is the action being passed here?
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      //
      return updateCart(state); // NOTE: this is what stores value to the client localStorage
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

// export all functions as actions
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;
// Q-11

export default cartSlice.reducer;

/** NOTES:
 * the reducer object contains any functions that have to do with the cart
 *
 * reducer functions take two parameters: state and action
 *      state - current state of the cart
 *          each mutation of the cart, the state is saved to localStorage
 *          if local storage does not contain a cart state, a new empty is created
 *      action - which action to take, and contains any data inside of action.payload
 *
 *      aka
 *
 *      state - the state of the active app prior to change
 *      action - how the state will mutate with data to do so
 *
 *
 */
