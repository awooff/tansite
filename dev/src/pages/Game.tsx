import React, { useContext } from 'react'
import Layout from '../components/Layout'
import {  Card, Col, Row } from 'react-bootstrap'
import GameContext from '../contexts/game.context'
import Computers from '../components/Computers';
import { Button } from 'react-bootstrap';
import { postRequestHandler } from '../lib/submit';

export default function Game() {
	const game = useContext(GameContext);
	
  	return (
	  	<Layout>
				<Row>
					<Col>
						<p className='display-4'>Your Network</p>
					</Col>
				</Row>
				<Row lg={3} sm={1} className='gy-4'>
					<Computers />
					<Col>
						<Card body>
						<p className='text-center'>
							Purchase A Computer
						</p>
						<div className="d-grid">
							<Button onClick={async () => {
								await postRequestHandler('/computers/create', {}, async () => {
									game.reload()
								}, (error) => {
									console.log(error)
								})
							}}>Purchase</Button>
						</div>
					</Card>
					</Col>
				
				</Row>
		</Layout>
  	)
}
