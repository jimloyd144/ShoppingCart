import { LOAD_CART, ADD_PRODUCT, REMOVE_PRODUCT } from "./actionTypes";
import "@reshuffle/code-transform/macro";
import { addProductToCart, removeProductFromCart } from "../../../backend/cart";

export const loadCart = products => {
  return dispatch =>
    dispatch({
      type: LOAD_CART,
      payload: products
    });
};

export const addProduct = product => {
  addProductToCart(product).then(result => console.log(result));
  return dispatch =>
    dispatch({
      type: ADD_PRODUCT,
      payload: product
    });
};

export const removeProduct = product => {
  removeProductFromCart(product.id).then(result => console.log(result));
  return dispatch =>
    dispatch({
      type: REMOVE_PRODUCT,
      payload: product
    });
};
