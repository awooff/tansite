import React from 'react'
import Layout from '../components/Layout'
import { Card, Col, Row } from 'react-bootstrap'

export default function Index() {
  	return (
	  	<Layout>
			<Row>
				<Col>
					<Card body>	
						<Card.Title>Welcome to Syscrack</Card.Title>
						<Card.Text>
							The virtual online crime simulator!
						</Card.Text>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col>
					<Card body>	
						<Card.Title>Welcome to Syscrack</Card.Title>
						<Card.Text>
							Some quick example text to build on the card title and make up the
							bulk of the card's content.
						</Card.Text>
					</Card>
					</Col>
					<Col>
					<Card body>	
						<Card.Title>Welcome to Syscrack</Card.Title>
						<Card.Text>
							Some quick example text to build on the card title and make up the
							bulk of the card's content.
						</Card.Text>
					</Card>
					</Col>
					<Col>
					<Card body>	
						<Card.Title>Welcome to Syscrack</Card.Title>
						<Card.Text>
							Some quick example text to build on the card title and make up the
							bulk of the card's content.
						</Card.Text>
					</Card>
				</Col>
			</Row>
		</Layout>
  	)
}
