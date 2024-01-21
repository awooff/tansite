import React, { ReactNode, useContext } from 'react'
import { Col, Card, ListGroup } from 'react-bootstrap'
import { Computer } from '../lib/types/computer.type';
import { Hardware, HardwareType } from '../lib/types/hardware.type';
import GameContext, { GameType } from '../contexts/game.context';
import SessionContext, { SessionType } from '../contexts/session.context';


export default function ComputerThumbnail({ computer, connections, children, render, className}: {
	computer: Computer,
	connections?: Computer[],
	className?: string,
	render?: (game: GameType, session: SessionType, computer: Computer, connections?: Computer[]) => ReactNode | ReactNode[],
	children?: ReactNode[]
}) {
	const game = useContext(GameContext)
	const session = useContext(SessionContext)
	const connected = connections && connections?.filter((that) => that.id === computer.id).length !== 0 
	const rendered = render ? render(game, session, computer, connections) : <></>
	return (
		<Col>
			<Card body className={!className ? (!connected ? 'bg-transparent border border-success' : 'bg-transparent border border-danger') : className}>
				<p>
					<span className='badge bg-secondary me-2'>{computer.type}</span>
					{computer.data.title}
					{session.user.id === computer.userId ? <span className='ms-2'>✏️</span>: ""}
					<span className='badge bg-secondary' style={{
						float: 'right'
					}}>{computer.ip}</span>
				
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
								{hardware.type} <span className='badge bg-primary' style={{
									float: 'right'
								}}>{hardware.strength}</span>
							</ListGroup.Item>
						})
					})()}
				</ListGroup>
				{children}
				{rendered}
			</Card>
		</Col>
	)
}