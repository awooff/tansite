import Taskbar from '@components/Taskbar'
import React from 'react'

function Layout(props: {children?: React.ReactNode}) {
  return (
	  <div>
		  {props.children}
		  <Taskbar/>

	  </div>
  )
}

export default Layout