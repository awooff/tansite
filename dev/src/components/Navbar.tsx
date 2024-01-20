import React, { useContext } from 'react'
import { Navbar, Container, Nav,} from 'react-bootstrap'
import SessionContext from '../contexts/session.context'
import Gamebar from './Gamebar'
import { createLinks } from '../lib/links'
import { Link } from 'react-router-dom'

function NavbarComponent() {
	const session = useContext(SessionContext)

	return (
		<Navbar expand="lg" className="bg-body-tertiary" >
			<Container fluid={true}>
				<Navbar.Brand>
					<Link to={ session.valid ? "/game" : "/"} className='text-black'>
						Syscrack
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					{session.valid ? <Gamebar /> : <>
						<Nav className="me-auto">
							{createLinks({
								login: {
									element: Nav.Link,
									capitalize: true
								},
								register: {
									element: Nav.Link,
									capitalize: true
								}
							})}
						</Nav>
					</>}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default NavbarComponent
