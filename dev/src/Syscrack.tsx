import React from 'react'
import SessionProvider from './providers/session.provider'
import Index from './pages/Index'

function Syscrack() {
	return (
	  	<SessionProvider>
			<Index/>
		</SessionProvider>
  )
}

export default Syscrack
