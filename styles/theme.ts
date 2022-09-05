const palette = {
  blue: '#2196F3',
  darkBlue: '#1976D2',
  lightBlue: '#BBDEFB',
  tranparentBlue: 'rgba(187, 222, 251, 0.8)',
  white: '#FFFFFF',
  transparentWhite: 'rgba(255, 255, 255, 0.8)',
  black: '#212121',
  yellow: '#FFEB3B',
  lightYellow: '#fff6bc',
  transparentYellow: 'rgba(255, 246, 188, 0.9)',
  gray: '#757575',
  lightGray: '#BDBDBD',
  veryLightGray: '#eaeaea',
  transparentGray: 'rgba(189, 189, 189, 0.8)',
  red: '#F44336',
  dullOrange: '#fcb064',
  green: '#689F38',
  transparentBlack: 'rgba(0,0,0,0.4)',
}

export const theme = {
  colors: {
    blue: '#2196F3',
    darkBlue: '#1976D2',
    lightBlue: '#BBDEFB',
    tranparentBlue: 'rgba(187, 222, 251, 0.8)',
    white: '#FFFFFF',
    transparentWhite: 'rgba(255, 255, 255, 0.8)',
    black: '#212121',
    yellow: '#FFEB3B',
    lightYellow: '#fff6bc',
    transparentYellow: 'rgba(255, 246, 188, 0.9)',
    gray: '#757575',
    lightGray: '#BDBDBD',
    veryLightGray: '#eaeaea',
    transparentGray: 'rgba(189, 189, 189, 0.8)',
    error: '#F44336',
    warning: '#fcb064',
    approve: '#689F38',
    transparentBlack: 'rgba(0,0,0,0.4)',
    backgroundGray: '#f7f7f7',
    // primary: palette.blue,
    // darkPrimary: palette.darkBlue,
    // lightPrimary: palette.lightBlue,
    // primaryText: palette.black,
    // secondaryText: palette.gray,
    // accent: palette.yellow,
    // divider: palette.lightGray,
    // secondaryDivider: palette.veryLightGray,
    // background: palette.white,
    // buttonPrimaryBackground: palette.blue,
    // buttonDarkPrimaryBackground: palette.blue,
    // buttonLightPrimaryBackground: palette.lightBlue,
    // buttonWhiteBackground: palette.white,
    // buttonBlackBackground: palette.black,
    // buttonYellowBackground: palette.yellow,
    // buttonGrayBackground: palette.gray,
    // overlayBackground: palette.transparentYellow,
    // approve: palette.green,
    // error: palette.red,
    // warning: palette.dullOrange,
    // inputBackground: palette.lightGray,
    // inputBorder: palette.lightGray,
    // backdrop: palette.transparentBlack,
  },
  breakpoints: {
    phone: 0,
    longPhone: {
      width: 0,
      height: 812,
    },
    tablet: 768,
    largeTablet: 1024,
  },
  fonts: {
    light: 'Rubik_300Light',
    ligthItalic: 'Rubik_300Light_Italic',
    base: 'Rubik_400Regular',
    baseItalic: 'Rubik_400Regular_Italic',
    medium: 'Rubik_500Medium',
    semiBold: 'Rubik_600SemiBold',
    bold: 'Rubik_800ExtraBold',
  },
  fontSize: {
    xxs: 10,
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 48,
    '5xl': 60,
    '6xl': 72,
  },
  spacing: {
    default: 1,
    xxxs: 2,
    xxs: 3,
    xs: 5,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  radius: {
    xs: 2,
    base: 4,
    md: 8,
    lg: 12,
    xl: 20,
  },
} as const
