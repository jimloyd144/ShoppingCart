import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { loadCart, removeProduct } from "../../services/cart/actions";
import { updateCart, getTotal } from "../../services/total/actions";
import CartProduct from "./CartProduct";
import { formatPrice } from "../../services/util";

import "@reshuffle/code-transform/macro";
import { getCart } from "../../../backend/cart";

import "./style.scss";

class FloatCart extends Component {
  static propTypes = {
    loadCart: PropTypes.func.isRequired,
    updateCart: PropTypes.func.isRequired,
    newProduct: PropTypes.object,
    removeProduct: PropTypes.func,
    productToRemove: PropTypes.object
  };

  state = {
    isOpen: false,
    productsList: []
  };

  componentWillMount() {
    getCart().then(cart => {
      this.setState({
        productsList: cart
      });
      updateCart(cart);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newProduct !== this.props.newProduct) {
      this.addProduct(nextProps.newProduct);
    }

    if (nextProps.productToRemove !== this.props.productToRemove) {
      this.removeProduct(nextProps.productToRemove);
    }
  }

  openFloatCart = () => {
    this.setState({ isOpen: true });
  };

  closeFloatCart = () => {
    this.setState({ isOpen: false });
  };

  addProduct = product => {
    const { updateCart } = this.props;
    let productAlreadyInCart = false;

    this.state.productsList.forEach(cp => {
      if (cp.id === product.id) {
        cp.quantity += product.quantity;
        productAlreadyInCart = true;
      }
    });

    if (!productAlreadyInCart) {
      let list = this.state.productsList;
      list.push(product);
      this.setState({
        productsList: list
      });
    }

    updateCart(this.state.productsList);
    this.openFloatCart();
  };

  removeProduct = product => {
    const { updateCart } = this.props;

    const index = this.state.productsList.findIndex(p => p.id === product.id);
    if (index >= 0) {
      let cartp = this.state.productsList;
      cartp.splice(index, 1);
      this.setState({ productsList: cartp });
      updateCart(cartp);
    }
  };

  proceedToCheckout = () => {
    const {
      totalPrice,
      productQuantity,
      currencyFormat,
      currencyId
    } = getTotal(this.state.productsList);

    if (!productQuantity) {
      alert("Add some product in the cart!");
    } else {
      alert(
        `Checkout - Subtotal: ${currencyFormat} ${formatPrice(
          totalPrice,
          currencyId
        )}`
      );
    }
  };

  render() {
    const { removeProduct } = this.props;

    const totals = getTotal(this.state.productsList);
    const products = this.state.productsList.map(p => {
      return (
        <CartProduct product={p} removeProduct={removeProduct} key={p.id} />
      );
    });

    let classes = ["float-cart"];

    if (!!this.state.isOpen) {
      classes.push("float-cart--open");
    }

    return (
      <div className={classes.join(" ")}>
        {/* If cart open, show close (x) button */}
        {this.state.isOpen && (
          <div
            onClick={() => this.closeFloatCart()}
            className="float-cart__close-btn"
          >
            X
          </div>
        )}

        {/* If cart is closed, show bag with quantity of product and open cart action */}
        {!this.state.isOpen && (
          <span
            onClick={() => this.openFloatCart()}
            className="bag bag--float-cart-closed"
          >
            <span className="bag__quantity">{totals.productQuantity}</span>
          </span>
        )}

        <div className="float-cart__content">
          <div className="float-cart__header">
            <span className="bag">
              <span className="bag__quantity">{totals.productQuantity}</span>
            </span>
            <span className="header-title">Cart</span>
          </div>

          <div className="float-cart__shelf-container">
            {products}
            {!products.length && (
              <p className="shelf-empty">
                Add some products in the cart <br />
                :)
              </p>
            )}
          </div>

          <div className="float-cart__footer">
            <div className="sub">SUBTOTAL</div>
            <div className="sub-price">
              <p className="sub-price__val">
                {`${totals.currencyFormat} ${formatPrice(
                  totals.totalPrice,
                  totals.currencyId
                )}`}
              </p>
              <small className="sub-price__installment">
                {!!totals.installments && (
                  <span>
                    {`OR UP TO ${totals.installments} x ${
                      totals.currencyFormat
                    } ${formatPrice(
                      totals.totalPrice / totals.installments,
                      totals.currencyId
                    )}`}
                  </span>
                )}
              </small>
            </div>
            <div onClick={() => this.proceedToCheckout()} className="buy-btn">
              Checkout
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  newProduct: state.cart.productToAdd,
  productToRemove: state.cart.productToRemove,
  cartTotal: state.total.data
});

export default connect(
  mapStateToProps,
  { loadCart, updateCart, removeProduct }
)(FloatCart);
