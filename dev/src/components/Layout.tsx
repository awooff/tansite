import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Container, Stack } from 'react-bootstrap'
import NavbarComponent from './Navbar'

function Layout({ 
  children,
  fluid,
  gap
}: {
  children: unknown
  fluid?: boolean
  gap?: number
})  {

  return <Container fluid={fluid}>
    <NavbarComponent />
    <Stack gap={gap ? gap : 2} className='pt-2'>
      {children as ReactNode[]}
    </Stack>
  </Container>
}

Layout.propTypes = {
  children: PropTypes.any
}

export default Layout
