import React from 'react'
import { Box } from '@chakra-ui/core'

const Container = (props) => {
  return <Box maxW={1280} w="100%" py={[2, 3]} px={[4, 8]} {...props} />
}

export default Container
