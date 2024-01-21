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
					<Computers/>
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
