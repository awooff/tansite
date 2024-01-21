import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import { Carousel, Col, Row, Card, Button} from 'react-bootstrap'
import GameContext from '../../contexts/game.context'
import { useNavigate } from 'react-router-dom'
import ComputerThumbnail from '../../components/Computer'

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
		  <Row className='mt-3'>
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
									<Button variant='primary' onClick={() => {
									  navigate('/processes')
									}}>
										Computer Processes
									</Button>
							</div>
							</Card>
					  </Col>
					  	<Col>
						<Card body className='bg-transparent border border-primary'>
							<div className="d-grid">
								  <Button variant='primary' onClick={() => {
									  navigate('/computers/network')
									}}>
										Your Network
									</Button>
							</div>
							</Card>
					</Col>
		  		</Row>
			</Col>
				<Col>
				<Row lg={2} className='gy-4'>
					{game.computers.map((computer, index) => {

						if (index === 16)
							return <Col>
								<Card body className='bg-transparent border border-primary'>
										<div className='d-grid'>		
									<Button variant='primary' onClick={() => {
										navigate('/computers/network')
									}}>										    
										View Entire Network		
									</Button>
								</div>
								</Card>
						
							</Col>
						
						if (index > 16)
						return <></>
						
					return <ComputerThumbnail computer={computer} connections={game.connections} className='bg-transparent border border-primary'/>
				})}
				</Row>  
					
			</Col>
		  </Row>
		
		</Layout>
  )
}
