import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Game from "./pages/Game";
import Network from "./pages/computers/Network";
import Logout from "./pages/auth/Logout";
import Dashboard from "./pages/computers/Dashboard";
import Files from "./pages/computers/Files";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Index />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <Register />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/game",
    element: (
      <>
        <Game />
      </>
    ),
  },
  {
    path: "/computers/network",
    element: (
      <>
        <Network />
      </>
    ),
  },
  {
    path: "/computers/files/:computerId",
    element: <Files />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/computers",
    element: <Dashboard />,
  },
]);

export default router;
