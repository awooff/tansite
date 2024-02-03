import React from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {userStore} from '@/lib/stores';
import {Button} from '@radix-ui/themes';

function LogoutButton() {
	const jwt = userStore(store => store.user.jwt);
	const user = userStore(store => store.user);
	const navigate = useNavigate();

	return (
		<Button onClick={async () => {
			await axios.get('http://localhost:1337/auth/logout', {
				withCredentials: true,
				headers: {
					Authorization: 'Bearer ' + jwt,
				},
			})
				.then(() => {
					userStore().removeUserData(user);
					navigate('/');
				});
		}}>
			Logout
		</Button>
	);
}

export default LogoutButton;
