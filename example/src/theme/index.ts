import { makeTheme } from 'dripsy';
import { CONTAINER_MAX_WIDTH, ROOT_FONT_SIZE } from '../constants';
import { colors } from './colors';

type Theme = typeof themeLight;

declare module 'dripsy' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface -- allow
  interface DripsyCustomTheme extends Theme {}
}

const themeLight = makeTheme({
  colors,
  fontSizes: {
    $default: ROOT_FONT_SIZE, // 16
    $h1: ROOT_FONT_SIZE * 2, // 32
    $h2: ROOT_FONT_SIZE * 1.5, // 24
    $h3: ROOT_FONT_SIZE * 1.25, // 20
    $text: ROOT_FONT_SIZE, // 16
    $button: ROOT_FONT_SIZE * 1.25, // 20
  },
  text: {
    // Default text style
    body: {
      fontSize: ROOT_FONT_SIZE,
    },
    h1: {
      marginVertical: 0,
      fontSize: '$h1',
      fontWeight: 'bold',
    },
    h2: {
      marginVertical: 0,
      fontSize: '$h2',
      fontWeight: 'bold',
    },
    h3: {
      marginVertical: 0,
      fontSize: '$h3',
      fontWeight: 'bold',
    },
    p: {
      marginVertical: 0,
      fontSize: '$text',
    },
    button: {
      color: '$text_primary',
      fontWeight: 500,
    },
    primary: {
      color: '$text_primary',
    },
    secondary: {
      color: '$text_secondary',
    },
    danger: {
      color: '$danger',
      fontWeight: 700,
    },
    highlight: {
      backgroundColor: '$esbuild',
      color: '$black',
      fontWeight: 700,
    },
  },
  space: {
    $00: 0, // 0
    $01: ROOT_FONT_SIZE * 0.25, // 4
    $02: ROOT_FONT_SIZE * 0.5, // 8
    $03: ROOT_FONT_SIZE * 0.75, // 12
    $04: ROOT_FONT_SIZE, // 16
    $05: ROOT_FONT_SIZE * 1.25, // 20
    $06: ROOT_FONT_SIZE * 1.5, // 24
    $07: ROOT_FONT_SIZE * 2, // 32
  },
  radii: {
    $md: 8,
    $full: 9999,
  },
  sizes: {
    container: CONTAINER_MAX_WIDTH,
  },
  layout: {
    // base container style
    container: {
      flex: 1,
      px: '$04',
      backgroundColor: '$white',
      alignSelf: 'center',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  types: {
    strictVariants: true,
    reactNativeTypesOnly: true,
  },
});

// @TODO: Add dark theme
const themeDark: Theme = {
  ...themeLight,
};

export { themeLight, themeDark };
