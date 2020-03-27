import React from 'react'
import { Link as RouterLink } from 'gatsby'
import {
  useColorMode,
  Link,
  IconButton,
  Text,
  Image,
  Box,
} from '@chakra-ui/core'
import Container from './Container'
import fishes from '../data/fishes.json'
import bugs from '../data/bugs.json'

const sample = (arr) => {
  const len = arr == null ? 0 : arr.length
  return len ? arr[Math.floor(Math.random() * len)] : undefined
}

const randomFish = sample(fishes.filter((d) => d.image))
const randomBug = sample(bugs.filter((d) => d.image))

let hasRendered = false
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  // Workaround this bug: https://github.com/chakra-ui/chakra-ui/issues/511
  if (!hasRendered) {
    setTimeout(() => {
      toggleColorMode()
      toggleColorMode()
    })
    hasRendered = true
  }

  return (
    <Box
      as="header"
      display="flex"
      justifyContent="center"
      width="100%"
      bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      borderBottom="1px solid"
      borderBottomColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
    >
      <Container
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text as="h1" fontFamily="mono">
          <Link as={RouterLink} to="/" display="flex" alignItems="center">
            <Image src={randomFish.image} width={8} height={8} mr={2} />
            AC: NH - Surf 'n' turf
            <Image
              display={['none', 'block']}
              src={randomBug.image}
              width={8}
              height={8}
              ml={2}
            />
          </Link>
        </Text>

        <IconButton
          variant="ghost"
          rounded="full"
          icon={colorMode === 'light' ? 'moon' : 'sun'}
          onClick={toggleColorMode}
        />
      </Container>
    </Box>
  )
}

export default Header
