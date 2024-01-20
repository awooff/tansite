import React, { useContext } from 'react'
import GameContext from '../contexts/game.context'
import { Col, Card, ListGroup, Button } from 'react-bootstrap'
import { postRequestHandler } from '../lib/submit'

export default function Computers() {
	const game = useContext(GameContext)

	return (
		<>	
			{game.computers.map((computer) => {
				const connected = game.connections && game.connections?.filter((that) => that.id === computer.id).length !== 0 
				return (
					<Col>
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
							{connected ? <Button onClick={async () => {
								await postRequestHandler('/computers/disconnect', {
									computerId: computer.id
								}, () => {
									game.reload()
								}, (error) => {
									console.log(error)
								})
							}} variant='danger'>Disconnect</Button> :
								<Button onClick={async () => {
									await postRequestHandler('/computers/connect', {
										computerId: computer.id
									}, () => {
										game.reload()
									}, (error) => {
										console.log(error)
									})
								}} variant='success'>Connect</Button>}
						</div>
					</Card>
					</Col>
				)
			}
		)}
	</>)
}
