import React from 'react'
import { Link as RouterLink } from 'gatsby'
import {
  useColorMode,
  Link,
  IconButton,
  Text,
  Stack,
  Image,
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

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Container
      as="header"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      borderBottom="1px solid"
      borderBottomColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
    >
      <Text as="h1">
        <Link as={RouterLink} to="/">
          AC: NH - Surf 'n' turf
        </Link>
      </Text>

      <Stack as="nav" flex="1" mx={[2, 2, 6]}>
        <Link as={RouterLink} to="/fishes/" display="flex" alignItems="center">
          Fishes <Image src={randomFish.image} alt="random fish" height={8} />
        </Link>
        <Link as={RouterLink} to="/bugs/" display="flex" alignItems="center">
          Bugs <Image src={randomBug.image} alt="random bug" height={8} />
        </Link>
      </Stack>

      <IconButton
        variant="ghost"
        rounded="full"
        icon={colorMode === 'light' ? 'moon' : 'sun'}
        onClick={toggleColorMode}
      />
    </Container>
  )
}

export default Header
