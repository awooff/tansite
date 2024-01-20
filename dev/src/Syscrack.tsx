import React from 'react'
import SessionProvider from './providers/session.provider'
import router from './routes'
import { RouterProvider } from 'react-router-dom'

function Syscrack() {

	return (
	  	<SessionProvider>
			<RouterProvider router={router}/>
		</SessionProvider>
  )
}

export default Syscrack
