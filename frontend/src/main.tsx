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
import './styles/index.css';
import ErrorPage from './error.page';
import Layout from './routes/layout';
import RegisterPage from './routes/register/register.page';

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
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Theme>
			<RouterProvider router={router} />
		</Theme>
	</React.StrictMode>,
);
