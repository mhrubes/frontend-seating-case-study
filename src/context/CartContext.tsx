import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to Cart
  const addToCart = (item: any, price: number, row: number, isInCart: boolean) => {
    setCartItems((prevItems) => [...prevItems, { ...item, price, row, isInCart }]);
  };

  // Remove from Cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.seatId !== itemId));
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart, removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
