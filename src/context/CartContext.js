import React, { createContext, useState } from 'react';

export const CartContext = createContext({});

export const CartProvider = (props) => {
	const [cart, setCart] = useState([]);
	const [total, setTotal] = useState(0);
	return (
		<CartContext.Provider value={{ cart, setCart, total, setTotal }}>
			{props.children}
		</CartContext.Provider>
	);
};
