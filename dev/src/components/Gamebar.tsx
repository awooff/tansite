import React, { useContext } from 'react'
import SessionContext from '../contexts/session.context'
import { Nav } from 'react-bootstrap'
import { createLinks } from '../lib/links'
export default function Gamebar() {
	const session = useContext(SessionContext)
	
	return (
		<>
			<Nav className="me-auto">
				{createLinks({
					computers: {
						element: Nav.Link,
						to: "/computers",
						className: 'text-white'
					},
					internet: {
						element: Nav.Link,
						to: "/browser",
						className: 'text-white'
					},
					processes: {
						element: Nav.Link,
						to: "/processes",
						className: 'text-white'
					},
					finances: {
						element: Nav.Link,
						to: "/finances",
						className: 'text-white'
					},
				})}
				<Nav.Link className='text-white'>
					connections
				</Nav.Link>
			</Nav>
			<Nav className='ms-auto'>
				<Nav.Link className='text-white'>
					{session.user.name}
				</Nav.Link>
			</Nav>
		</>
	
	)
}
