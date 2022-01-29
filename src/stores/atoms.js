import { atom, atomFamily, selector } from 'recoil';

export const AuthAtom = atom({
	key: 'auth',
	default: {
		isAdmin: false,
		email: '',
		token: '',
		name: '',
		id: null,
		location: null,
		phone: null,
		wallet: 0,
	},
});

export const nameInitials = selector({
	key: 'initials',
	get: ({ get }) => {
		const { name } = get(AuthAtom);
		const initials = name
			.match(/(^\S\S?|\b\S)?/g)
			.join('')
			.match(/(^\S|\S$)?/g)
			.join('')
			.toUpperCase();

		return initials;
	},
});

export const config = selector({
	key: 'config',
	get: ({ get }) => {
		const { token } = get(AuthAtom);
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		};
		return config;
	},
});

export const Cart = atom({
	key: 'cart',
	default: [],
});

export const ingredientListFamily = atomFamily({
	key: 'ingredientList',
	default: [],
});
