import React, { useContext } from 'react'
import { Nav } from 'react-bootstrap'
import { createLinks } from '../lib/links'
import GameContext from '../contexts/game.context'

export default function Gamebar() {
	const game = useContext(GameContext);

	return (
		<>
			<Nav className="me-auto">
				{createLinks({
					computers: {
						element: Nav.Link,
						className: 'text-white'
					},
					internet: {
						element: Nav.Link,
						className: 'text-white'
					},
					processes: {
						element: Nav.Link,
						className: 'text-white'
					},
					finances: {
						element: Nav.Link,
						className: 'text-white'
					},
					logout: {
						element: Nav.Link,
						className: 'text-white'
					},
				})}
			</Nav>
			<Nav className='ms-auto'>
				<Nav.Link className='text-white'>
					<span className='badge bg-secondary'>0 NOTIFICATIONS</span>
				</Nav.Link>
				<Nav.Link className='text-white'>
					<span className={game?.connections && game?.connections?.length !== 0 ? 'badge bg-success' : 'badge bg-secondary'}>{game?.connections?.length || 0}/3 CONNECTIONS</span>
				</Nav.Link>
				<Nav.Link className='text-white'>
					<span className='badge bg-success' style={{
						fontSize: '1.10rem'
					}}>${game.bankAccounts.length !== 0 ? game.bankAccounts.reduce((previousValue, currentValue) => {
						return {
							...previousValue,
							value: previousValue.value + currentValue.value
						}
					}).value : 0}</span>
				</Nav.Link>
			</Nav>
		</>
	
	)
}
