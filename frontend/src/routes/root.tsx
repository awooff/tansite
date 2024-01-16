import React, { useState } from 'react'
import Login from '../components/Login'
import Profile from '../components/Profile'
import { Text, Heading } from '@radix-ui/themes'
function RootPage() {
	const [user, setUser] = useState(undefined)
  return (
	  <div className=''>
		  <Heading>Hi</Heading>
		  <Text>Welcome to Syscrack :)</Text>
	</div>
  )
}

export default RootPage