import React, { useContext } from 'react'
import Layout from '../components/Layout'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import GameContext from '../contexts/game.context'
import SessionContext from '../contexts/session.context';
import { postRequestHandler } from '../lib/submit';

export default function Game() {
	const game = useContext(GameContext);
	const session = useContext(SessionContext);

  	return (
	  	<Layout>
			<Row>
				<Col>
					<Card body>	
							<Card.Title>{game.title}</Card.Title>
							<Card.Text>
								Welcome {session.user.name}
							</Card.Text>
					</Card>
				</Col>
				</Row>
				<Row lg={3}>
					{game.computers.map((computer) => {
						return <Col>
							<Card body>
								<Card.Title>
									{computer.ip} <span className='badge bg-primary'>{computer.type}</span>
								</Card.Title>
								<ListGroup className='mb-2'>
									{computer.hardware.map((hardware) => {
										return <ListGroup.Item>
											{hardware.type} <span className='badge bg-primary'>{hardware.strength}</span>
										</ListGroup.Item>
									})}
								</ListGroup>
								<div className="d-grid">
									<Button onClick={async () => {
										await postRequestHandler('/computers/connect', {
											computerId: computer.id
										}, () => {
											session.load(() => {
												game.load()
											})
										}, (error) => {
											console.log(error)
										})
									}} disabled = { game.connections?.filter((that) => that.id === computer.id).length !== 0 } >Switch</Button>
								</div>
							</Card>
						</Col>
					})}
				</Row>
		</Layout>
  	)
}
