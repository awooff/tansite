import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Game from "./pages/Game";
import Connections from "./pages/computers/Connections";
import Logout from "./pages/auth/Logout";
import Dashboard from "./pages/computers/Dashboard";
import Files from "./pages/computers/Files";
import Logs from "./pages/computers/Logs";
import Browser from "./pages/internet/Browser";

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
    path: "/computers/connections",
    element: (
      <>
        <Connections />
      </>
    ),
  },
  {
    path: "/computers/files/:computerId",
    element: <Files />,
  },
  {
    path: "/computers/logs/:computerId",
    element: <Logs />,
  },
  {
    path: "/internet/browser/:ip",
    element: <Browser />,
  },
  {
    path: "/internet/browser/",
    element: <Browser />,
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
