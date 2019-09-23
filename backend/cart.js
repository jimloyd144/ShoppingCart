import { update, get } from "@reshuffle/db";

/**
 *
 * @param {Object} newProduct 
 *
 * @return {Array} - updated version of Cart State
 */
// @expose
export async function addProductToCart(newProduct) {
  return update("Cart", savedProducts => {
    const allProducts = { ...savedProducts };
    allProducts[newProduct.id] = newProduct;
    return allProducts;
  });
}

/**
 * @return {Array} of Objects - updated version of Cart State
 */
// @expose
export async function getCart() {
  const carts = await get("Cart");
  let result = [];
  for (let cart in carts) result.push(carts[cart]);
  return result.reverse();
}
/**
 * Given the ProductId that we want to delete, This function removes that
 * Product from the document and returns the updated document
 *
 * @param {String} productId -
 *
 * @return {Array} - updated version of Cart State
 */
// @expose
export async function removeProductFromCart(productId) {
  return update("Cart", savedProducts => {
    let allProducts = { ...savedProducts };
    delete allProducts[productId];
    return allProducts;
  });
}
