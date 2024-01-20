import React from 'react'
import router from './routes'
import { RouterProvider } from 'react-router-dom'

import SessionProvider from './providers/session.provider'
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
