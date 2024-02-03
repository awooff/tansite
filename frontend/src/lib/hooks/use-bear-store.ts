import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

type State = {
	bears: number;
};

type Actions = {
	increasePopulation: (bears: State['bears']) => void;
	decreasePopulation: (bears: State['bears']) => void;
	removeAllBears: (bears: State['bears']) => void;
};

export const useBearStore = create<State & Actions>()(persist(set => ({
	bears: 0,
	increasePopulation() {
		set(state => ({bears: state.bears + 1}));
	},
	decreasePopulation() {
		set(state => ({bears: state.bears - 1}));
	},
	removeAllBears() {
		set({bears: 0});
	},
}), {
	name: 'syscrack__bear-store',
	storage: createJSONStorage(() => localStorage),
}));
