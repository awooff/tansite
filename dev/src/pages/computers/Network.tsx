import React from 'react'
import Layout from '../../components/Layout'
import {  Card, Col, Row } from 'react-bootstrap'
import Computers from '../../components/Computers';
import { Button } from 'react-bootstrap';
import { postRequestHandler } from '../../lib/submit';
import { useNavigate } from 'react-router-dom';

export default function Network() {
	const navigate = useNavigate()

  	return (
	  	<Layout>
				<Row>
					<Col>
						<p className='display-4'>~/network</p>
					</Col>
				</Row>
				<Row lg={3} sm={1} className='gy-4'>
					<Computers thumbnail render={(game, session, computer, connections) => {
						const connected = connections && connections?.filter((that) => computer.id === that.id ).length !== 0
						return <Row>
							<Col>
								<div className="d-grid mt-2">
									{connected ? <Button variant='danger' onClick={async () => {
										await postRequestHandler('/computers/disconnect', {
											computerId: computer.id
										}, () => {
											game.load()
										});
									}}>Disconnect</Button> : <Button variant='success'  onClick={async () => {
										await postRequestHandler('/computers/connect', {
											computerId: computer.id
										}, () => {
											game.load()
										});
									}}>Connect</Button>}
								</div>	
							</Col>
						</Row>
					}}/>
					<Col>
						<Card body>
							<p className='text-center'>
								Purchase A Computer
							</p>
							<div className="d-grid">
								<Button onClick={async () => {
									await postRequestHandler('/computers/create', {}, async () => {
										navigate(0)
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
