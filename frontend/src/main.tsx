import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
} from 'react-router-dom';
import Root from './routes/root';
import {Theme} from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './styles/fonts.css';
import './styles/index.css';
import './styles/theme-config.css';
import ErrorPage from './error.page';
import Layout from './routes/layout';
import RegisterPage from './routes/register/register.page';
import LoginPage from './routes/login/login.page';

const router = createBrowserRouter([
	{
		element: <Layout> <Outlet /> </Layout>,
		path: '/',
		errorElement: <ErrorPage/>,
		children: [
			{
				index: true,
				element: <Root />,
			},
			{
				path: '/user/register',
				element: <RegisterPage/>,
			},
			{
				path: '/user/login',
				element: <LoginPage/>,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
