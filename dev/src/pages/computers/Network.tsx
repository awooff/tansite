import React from 'react'
import Layout from '../../components/Layout'
import {  Col, Row } from 'react-bootstrap'
import Computers from '../../components/Computers';
import { Button } from 'react-bootstrap';
import { postRequestHandler } from '../../lib/submit';
import { Link } from 'react-router-dom';

export default function Network() {
  	return (
	  	<Layout>
				<Row>
					<Col>
						<p className='display-4'>~/<Link to='/computers/'>computers</Link>/network</p>
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
				</Row>
		</Layout>
  	)
}
