import React from 'react'
import Layout from '../components/Layout'
import {  Card, Col, Row } from 'react-bootstrap'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Game() {
	const navigate = useNavigate()
  	return (
	  	<Layout>
				<Row lg={3} sm={1} className='gy-4'>
					<Col>
						<Card>
							<Card.Img src='https://placekitten.com/800/600' />
							<Card.Body className='text-center'>
								Browse The Internet
								<div className="d-grid mt-4">
									<Button variant="success" onClick={() => {
										navigate('/browser')
									}}>
										View Browser
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Img src='https://placekitten.com/800/600' />
							<Card.Body className='text-center'>
								View Your Network
								<div className="d-grid mt-4">
									<Button variant="success" onClick={() => {
										navigate('/computers/network')
									}}>
										View Computers
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Img src='https://placekitten.com/800/600' />
							<Card.Body className='text-center'>
								View Your Finances
								<div className="d-grid mt-4">
									<Button variant="success" onClick={() => {
										navigate('/browser')
									}}>
										Finances
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
		</Layout>
  	)
}
