import Navbar from '@components/Navbar'
import React from 'react'

function Layout(props: {children?: React.ReactNode}) {
  return (
	  <div>
		  <Navbar/>
		  {props.children}
	  </div>
  )
}

export default Layout