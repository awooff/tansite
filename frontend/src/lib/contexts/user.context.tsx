import {createContext} from 'react';
import axios from 'axios';
import {postRequestHandler} from '../utils';

async function fetchUserSession() {
	const user = await axios.get('/auth/valid');

	if (!user) {
		return {};
	}
}

export const UserContext = createContext({});
