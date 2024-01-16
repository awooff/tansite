import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './styles/index.css'
import ErrorPage from "./error.page";

const router = createBrowserRouter([
  {
    path: "/",
	element: <Root />,
	errorElement: <ErrorPage/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
			<Theme>
        <RouterProvider router={router} />
			</Theme>
  </React.StrictMode>,
)
