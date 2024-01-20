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
						to: "/computers"
					},
					internet: {
						element: Nav.Link,
						to: "/browser"
					},
					processes: {
						element: Nav.Link,
						to: "/processes"
					},
					finances: {
						element: Nav.Link,
						to: "/finances"
					},
				})}
				<Nav.Link className='text-black'>
					connections
				</Nav.Link>
			</Nav>
			<Nav className='ms-auto'>
				<Nav.Link>
					{session.user.name}
				</Nav.Link>
			</Nav>
		</>
	
	)
}
