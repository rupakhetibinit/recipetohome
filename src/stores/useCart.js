import create from 'zustand';
import produce from 'immer';

const useCart = create((set) => ({
	cart: [],
	setCart: (cart) =>
		set((state) =>
			produce(state, (draft) => {
				draft.cart = cart;
			})
		),
	// using immer to add to cart
	addToCart: (item) =>
		set((state) =>
			produce(state, (draft) => {
				return { ...draft.cart, item };
			})
		),
	// using immer to remove from cart
	removeFromCart: (orderId, ingredientId) =>
		set((state) =>
			produce(state, (draft) => {
				const index = draft.cart.findIndex((item) => item.id === orderId);
				// Remove the ingredient that was unchecked
				let ingredients = draft.cart[index].ingredients.filter(
					(item) => item.id !== ingredientId
				);
				// Calculate the reduced total
				let newTotal =
					draft.cart[index].total -
					draft.cart[index].ingredients.find((item) => item.id === ingredientId)
						.price;
				// Remove the item from the array if it is the last ingredient
				ingredients.length === 0 && draft.cart.splice(index, 1);
				ingredients.length > 0 &&
					draft.cart.splice(index, 1, {
						...draft.cart[index],
						ingredients: ingredients,
						total: newTotal,
					});
			})
		),
}));

export default useCart;
