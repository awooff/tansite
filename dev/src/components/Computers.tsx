import React, { useContext } from 'react'
import GameContext from '../contexts/game.context'
import { Col, Card, ListGroup, Button } from 'react-bootstrap'
import { postRequestHandler } from '../lib/submit'
import { Hardware, HardwareType } from '../lib/types/hardware.type'

export default function Computers() {
	const game = useContext(GameContext)


	return (
		<>	
			{game.computers.map((computer) => {
				const connected = game?.connections && game?.connections?.filter((that) => that.id === computer.id).length !== 0 
				return (
					<Col>
						<Card body className={!connected ? 'bg-transparent border border-success' : 'bg-transparent border border-danger'}>
							<p>
								{computer.data.title}
								<span className='badge bg-secondary' style={{
								float: 'right'
							}}>{computer.ip}</span>
								<span className='badge bg-secondary me-2' style={{
								float: 'right'
							}}>{computer.type}</span>
						</p>
						<ListGroup className='mb-2 mt-4'>
								{(() => {
									const hardwares = {} as Record<HardwareType, Hardware>;
									const counts = {} as Record<HardwareType, number>;
									
									computer.hardware.forEach((hardware) => {
										counts[hardware.type] = counts[hardware.type] || 0
										if (hardwares[hardware.type]) {
											hardwares[hardware.type].strength += hardware.strength
										} else
											hardwares[hardware.type] = hardware
										
										counts[hardware.type] += 1
									})

									return Object.values(hardwares).map((hardware) => {
										return <ListGroup.Item>
											<span className='badge bg-secondary me-4'>{counts[hardware.type]} / {computer.data?.hardwareLimits?.[hardware.type] || -1}</span>
											{hardware.type} <span className='badge bg-info' style={{
												float: 'right'
											}}>{hardware.strength}</span>
										</ListGroup.Item>
									})
								})()}
						</ListGroup>
						<div className="d-grid">
							{connected ? <Button onClick={async () => {
								await postRequestHandler('/computers/disconnect', {
									computerId: computer.id
								}, () => {
									game.load()
								}, (error) => {
									console.log(error)
								})
							}} variant='danger'>Disconnect</Button> :
								<Button onClick={async () => {
									await postRequestHandler('/computers/connect', {
										computerId: computer.id
									}, () => {
										game.load()
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
