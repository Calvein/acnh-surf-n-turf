import { theme } from '@chakra-ui/core'

const gray = {
  50: '#F7FAFC',
  100: '#EDF2F7',
  200: '#E2E8F0',
  300: '#CBD5E0',
  400: '#A0AEC0',
  500: '#718096',
  600: '#4A5568',
  700: '#2D3748',
  800: '#1A202C',
  900: '#171923',
}

// Workaround this bug: https://github.com/chakra-ui/chakra-ui/issues/511
export default {
  ...theme,
  mode: {
    light: {
      headerBg: gray[200],
      headerBorder: gray[300],
    },
    dark: {
      headerBg: gray[700],
      headerBorder: gray[600],
    },
  },
}
