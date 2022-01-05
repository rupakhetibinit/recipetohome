import create from 'zustand';
import produce from 'immer';
const useAuthStore = create((set) => ({
	// setting the global auth state in zustand
	auth: {
		isAdmin: false,
		email: '',
		token: '',
		name: '',
		id: null,
		location: null,
		phone: null,
		wallet: 0,
	},
	setAuth: (auth) =>
		set((state) => {
			state.auth = { ...state.auth, ...auth };
		}),
}));

export default useAuthStore;
