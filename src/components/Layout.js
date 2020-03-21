import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Link, Icon, Box } from '@chakra-ui/core'

import Header from './Header'
import Container from './Container'

const Layout = ({ children }) => {
  return (
    <Flex flexDirection="column" alignItems="center" minH="100vh">
      <Header />
      <Container as="main">{children}</Container>
      <Box as="footer" pb={[2, 3]} px={4} textAlign="center" fontSize="sm">
        Made by{' '}
        <Link href="https://twitter.com/calvein" isExternal>
          @calvein
        </Link>
        , data from{' '}
        <Link
          isExternal
          href="https://animalcrossing.fandom.com"
          target="_blank"
        >
          https://animalcrossing.fandom.com <Icon name="external-link" />
        </Link>
      </Box>
    </Flex>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
