import {

  createBrowserRouter
} from "react-router-dom";
import Index from './pages/Index'
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Game from "./pages/Game";

const router = createBrowserRouter([
  {
    path: "/",   
    element: <>
   
          <Index />
       
    </>,
  },
  {
    path: '/register',
    element: <>
 
          <Register />
    </>,
  },
   {
    path: '/login',
     element: <>
          <Login />
    </>,
   },
   {
     path: '/game',
 element: <>
          <Game />
    </>,
   }
]);

export default router;