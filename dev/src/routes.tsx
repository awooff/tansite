import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Game from "./pages/Game";
import Network from "./pages/computers/Network";
import Logout from "./pages/auth/Logout";
import Dashboard from "./pages/computers/Dashboard";
import Files from "./pages/computers/Files";
import Logs from "./pages/computers/Logs";
import Browser from "./pages/internet/Browser";
import ProtectedLayout from "./components/ProtectedLayout";
import Processes from "./pages/computers/Processes";

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
      <ProtectedLayout>
        <Game />
      </ProtectedLayout>
    ),
  },
  {
    path: "/computers/network",
    element: (
      <ProtectedLayout>
        <Network />
      </ProtectedLayout>
    ),
  },
  {
    path: "/computers/files/:computerId",
    element: (
      <ProtectedLayout>
        <Files />
      </ProtectedLayout>
    ),
  },
  {
    path: "/computers/logs/:computerId",
    element: (
      <ProtectedLayout>
        <Logs />
      </ProtectedLayout>
    ),
  },
  {
    path: "/computers/processes/:computerId",
    element: (
      <ProtectedLayout>
        <Processes />
      </ProtectedLayout>
    ),
  },
  {
    path: "/internet/browser/:ip",
    element: (
      <ProtectedLayout>
        <Browser />
      </ProtectedLayout>
    ),
  },
  {
    path: "/internet/browser/",
    element: (
      <ProtectedLayout>
        <Browser />
      </ProtectedLayout>
    ),
  },
  {
    path: "/logout",
    element: (
      <ProtectedLayout>
        <Logout />
      </ProtectedLayout>
    ),
  },
  {
    path: "/computers",
    element: (
      <ProtectedLayout>
        <Dashboard />
      </ProtectedLayout>
    ),
  },
]);

export default router;
