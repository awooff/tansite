import {

  createBrowserRouter
} from "react-router-dom";
import Index from './pages/Index'
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
	  element: <Index />,
  },
  {
    path: '/register',
    element: <Register/>
  },
   {
    path: '/login',
    element: <Login/>
  }
]);

export default router;