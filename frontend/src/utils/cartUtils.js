
//
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

//
export const updateCart = (state) => {
    // calculate items price
    const tempItemsPrice = state.cartItems.reduce(
        (accumulator, item) => accumulator + item.price * item.qty,
        0
      );
      state.itemsPrice = addDecimals(tempItemsPrice);

      // calculate: shipping_price = order >= $100 ? 0 : $10
      const tempShippingPrice = state.itemsPrice >= 100 ? 0 : 10;
      state.shippingPrice = addDecimals(tempShippingPrice);

      // calculate: tax_amount = itemsPrice * 0.0825
      const tempTaxAmount = Number(state.itemsPrice * 0.0825).toFixed(2);
      state.taxAmount = addDecimals(tempTaxAmount);

      // calculate: total cost
      state.totalPrice = (
        Number(state.itemsPrice) + 
        Number(state.shippingPrice) + 
        Number(state.taxAmount)
      ).toFixed(2);

      // Finally: save state to localStorage
      localStorage.setItem("cart", JSON.stringify(state));

      //
      return state;
}