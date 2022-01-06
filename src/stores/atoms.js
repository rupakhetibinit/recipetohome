import { atom } from 'recoil';

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
