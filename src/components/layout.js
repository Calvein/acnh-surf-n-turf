import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from '@chakra-ui/core'

import Header from './header'
import Container from './Container'

const Layout = ({ children }) => {
  return (
    <Flex flexDirection="column" alignItems="center" minH="100vh">
      <Header />
      <Container as="main">{children}</Container>
    </Flex>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
