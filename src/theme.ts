import { extendTheme } from '@chakra-ui/react'

// Custom color palette for Atraves
const colors = {
  atraves: {
    // Primary ocean blue
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af', // Main primary
      900: '#1e3a8a',
    },
    // Complementary teal/green tone (harmonious with blue)
    secondary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488', // Main secondary
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    // Vibrant coral accent
    accent: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6', // Main accent
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
    // Neutral grays
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    }
  }
}

// Custom fonts
const fonts = {
  heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'lg',
    },
    variants: {
      solid: {
        bg: 'atraves.primary.800',
        color: 'white',
        _hover: {
          bg: 'atraves.primary.700',
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: 'atraves.primary.900',
          transform: 'translateY(0)',
        },
        transition: 'all 0.2s',
      },
      outline: {
        borderColor: 'atraves.primary.800',
        color: 'atraves.primary.800',
        _hover: {
          bg: 'atraves.primary.50',
          borderColor: 'atraves.primary.700',
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.2s',
      },
      ghost: {
        color: 'atraves.primary.800',
        _hover: {
          bg: 'atraves.primary.50',
        },
      }
    }
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderColor: 'atraves.neutral.300',
          _hover: {
            borderColor: 'atraves.primary.400',
          },
          _focus: {
            borderColor: 'atraves.primary.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-atraves-primary-500)',
          },
        },
      },
    },
  },
  Radio: {
    baseStyle: {
      control: {
        _checked: {
          bg: 'atraves.primary.800',
          borderColor: 'atraves.primary.800',
          _hover: {
            bg: 'atraves.primary.700',
            borderColor: 'atraves.primary.700',
          },
        },
        _focus: {
          boxShadow: '0 0 0 3px var(--chakra-colors-atraves-primary-200)',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        boxShadow: 'lg',
        borderRadius: 'xl',
        bg: 'white',
        border: '1px solid',
        borderColor: 'atraves.neutral.100',
        transition: 'all 0.2s',
        _hover: {
          boxShadow: 'xl',
          transform: 'translateY(-2px)',
        },
      },
    },
  },
}

// Global styles
const styles = {
  global: {
    body: {
      bg: 'atraves.neutral.50',
      color: 'atraves.neutral.800',
      fontFamily: 'body',
    },
    '*': {
      transition: 'colors 0.2s',
    },
  },
}

// Theme configuration
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  colors,
  fonts,
  components,
  styles,
  config,
  shadows: {
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  space: {
    '18': '4.5rem',
    '88': '22rem',
  },
})

export default theme