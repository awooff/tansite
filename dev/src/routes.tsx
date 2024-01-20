import {

  createBrowserRouter
} from "react-router-dom";
import Index from './pages/Index'
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Game from "./pages/Game";
import SessionProvider from './providers/session.provider'
import GameProvider from './providers/game.provider'

const router = createBrowserRouter([
  {
    path: "/",   
    element: <>
      <SessionProvider>
        <GameProvider>
          <Index />
        </GameProvider>
      </SessionProvider>
    </>,
  },
  {
    path: '/register',
    element: <>
      <SessionProvider>
        <GameProvider>
          <Register />
        </GameProvider>
      </SessionProvider>
    </>,
  },
   {
    path: '/login',
     element: <>
      <SessionProvider>
        <GameProvider>
          <Login />
        </GameProvider>
      </SessionProvider>
    </>,
   },
   {
     path: '/game',
 element: <>
      <SessionProvider>
        <GameProvider>
          <Game />
        </GameProvider>
      </SessionProvider>
    </>,
   }
]);

export default router;