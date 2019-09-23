import { UPDATE_CART } from "./actionTypes";

export const updateCart = cartProducts => dispatch => {
  const cartTotal = getTotal(cartProducts);

  dispatch({
    type: UPDATE_CART,
    payload: cartTotal
  });
};

export const getTotal = cartProducts => {
  let productQuantity = cartProducts.reduce((sum, p) => {
    sum += p.quantity;
    return sum;
  }, 0);

  let totalPrice = cartProducts.reduce((sum, p) => {
    sum += p.price * p.quantity;
    return sum;
  }, 0);

  let installments = cartProducts.reduce((greater, p) => {
    greater = p.installments > greater ? p.installments : greater;
    return greater;
  }, 0);

  return {
    productQuantity,
    installments,
    totalPrice,
    currencyId: "USD",
    currencyFormat: "$"
  };
};
