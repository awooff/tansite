import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import { Carousel, Col, Row, Card, Button, ListGroup} from 'react-bootstrap'
import GameContext from '../../contexts/game.context'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
	const game = useContext(GameContext)
	const navigate = useNavigate();
  return (
	  <Layout>

			<Row>
				<Col>
				  <Carousel>
					  <Carousel.Item style={{
						maxHeight: 400
					}}>
						<img
						className="d-block w-full mx-auto"
						src="https://placekitten.com/900/600"
							  alt="First slide"
						/>
						  <Carousel.Caption style={{
							backgroundColor: 'black'
						}}>
							  <h3>You own {game.computers?.length || 0} computers</h3>
								<p>You can purchase more at the networks page</p>
						</Carousel.Caption>
					  </Carousel.Item>
					  	<Carousel.Item style={{
						maxHeight: 400
					}}>
						<img
							className="d-block w-full mx-auto"
							src="https://placekitten.com/900/500"
							alt="First slide"
						/>
						<Carousel.Caption  style={{
							  backgroundColor: 'black',
							
						}}>
							  <h3>0 Active Processes</h3>
							<p>You are doing a lot or not a lot</p>
						</Carousel.Caption>
					  </Carousel.Item>
					</Carousel>
				</Col>
		  </Row>
		  	  	<Row>
				<Col>
					<p className='display-4'>~/dashboard</p>
				</Col>
			</Row>
		  <Row>
			  <Col lg={4}>
				  <Row lg={1} className='gy-4'>
					<Col>
						<Card body className='bg-transparent border border-primary'>
							<div className="d-grid">
									<Button variant='primary'>
										Purchase A Computer
									</Button>
							</div>
							</Card>
					</Col>
					<Col>
						<Card body className='bg-transparent border border-primary'>
							<div className="d-grid">
									<Button variant='primary'>
										Computer Processes
									</Button>
							</div>
							</Card>
					</Col>
		  		</Row>
			  </Col>
			  <Col>
				  <Card body>
					  <ListGroup>
						  {game.computers.map((computer, index) => {

							  if (index === 16)
								  return <div className='d-grid mt-4'>
									
									  <Button variant='success' onClick={() => {
										  navigate('/computers/network')
									  }}>
										    
										  View Entire Network
										
										</Button>
								  </div>
							  
							  if (index > 16)
								  return <></>
							  
							  return <ListGroup.Item>
								  {computer.data.title} <span className='badge bg-secondary ms-2' style={{
									  float: 'right'
								  }}>{computer.ip}</span> <span className='badge bg-success' style={{
									  float: 'right'
								  }}>{computer.type}</span>
							  </ListGroup.Item>
						})}
					  </ListGroup>  
					</Card>
			  </Col>
		  </Row>
		
		</Layout>
  )
}
