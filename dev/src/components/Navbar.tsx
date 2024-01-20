import React, { useContext } from 'react'
import { Navbar, Container, Nav,} from 'react-bootstrap'
import SessionContext from '../contexts/session.context'
import Gamebar from './Gamebar'

function NavbarComponent() {
	const provider = useContext(SessionContext)

	return (
		<Navbar expand="lg" className="bg-body-tertiary" >
			<Container fluid={true}>
				<Navbar.Brand href="#home">Syscrack</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					{provider.valid ? <Gamebar /> : <>
						<Nav className="me-auto">
							<Nav.Link>
								Login
							</Nav.Link>
							<Nav.Link>
								Register
							</Nav.Link>
						</Nav>
					</>}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default NavbarComponent
