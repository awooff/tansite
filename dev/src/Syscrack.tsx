import React from 'react'
import SessionProvider from './providers/session.provider'
import router from './routes'
import { RouterProvider } from 'react-router-dom'
import GameProvider from './providers/game.provider'

function Syscrack() {

	return (
		<SessionProvider>
			<GameProvider>
					<RouterProvider router={router}/>
			</GameProvider>
		</SessionProvider>
  )
}

export default Syscrack
