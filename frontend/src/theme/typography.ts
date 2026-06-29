export const fontFamily = {
  sans: ['Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  display: ['Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
} as const;

export const fontSize = {
  '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.01em' }],
  xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
  sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
  base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
  lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
  xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
  '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
  '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
  '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
  '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
  '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
  '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
} as const;

export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

export const typography = {
  display: {
    '2xl': { fontSize: fontSize['5xl'][0], fontWeight: fontWeight.bold, lineHeight: fontSize['5xl'][1].lineHeight, letterSpacing: fontSize['5xl'][1].letterSpacing },
    xl: { fontSize: fontSize['4xl'][0], fontWeight: fontWeight.bold, lineHeight: fontSize['4xl'][1].lineHeight, letterSpacing: fontSize['4xl'][1].letterSpacing },
    lg: { fontSize: fontSize['3xl'][0], fontWeight: fontWeight.bold, lineHeight: fontSize['3xl'][1].lineHeight, letterSpacing: fontSize['3xl'][1].letterSpacing },
    md: { fontSize: fontSize['2xl'][0], fontWeight: fontWeight.semibold, lineHeight: fontSize['2xl'][1].lineHeight, letterSpacing: fontSize['2xl'][1].letterSpacing },
    sm: { fontSize: fontSize.xl[0], fontWeight: fontWeight.semibold, lineHeight: fontSize.xl[1].lineHeight, letterSpacing: fontSize.xl[1].letterSpacing },
    xs: { fontSize: fontSize.lg[0], fontWeight: fontWeight.semibold, lineHeight: fontSize.lg[1].lineHeight, letterSpacing: fontSize.lg[1].letterSpacing },
  },
  heading: {
    h1: { fontSize: fontSize['4xl'][0], fontWeight: fontWeight.bold, lineHeight: fontSize['4xl'][1].lineHeight, letterSpacing: fontSize['4xl'][1].letterSpacing },
    h2: { fontSize: fontSize['3xl'][0], fontWeight: fontWeight.bold, lineHeight: fontSize['3xl'][1].lineHeight, letterSpacing: fontSize['3xl'][1].letterSpacing },
    h3: { fontSize: fontSize['2xl'][0], fontWeight: fontWeight.semibold, lineHeight: fontSize['2xl'][1].lineHeight, letterSpacing: fontSize['2xl'][1].letterSpacing },
    h4: { fontSize: fontSize.xl[0], fontWeight: fontWeight.semibold, lineHeight: fontSize.xl[1].lineHeight, letterSpacing: fontSize.xl[1].letterSpacing },
    h5: { fontSize: fontSize.lg[0], fontWeight: fontWeight.semibold, lineHeight: fontSize.lg[1].lineHeight, letterSpacing: fontSize.lg[1].letterSpacing },
    h6: { fontSize: fontSize.base[0], fontWeight: fontWeight.semibold, lineHeight: fontSize.base[1].lineHeight, letterSpacing: fontSize.base[1].letterSpacing },
  },
  body: {
    lg: { fontSize: fontSize.lg[0], fontWeight: fontWeight.normal, lineHeight: fontSize.lg[1].lineHeight, letterSpacing: fontSize.lg[1].letterSpacing },
    md: { fontSize: fontSize.base[0], fontWeight: fontWeight.normal, lineHeight: fontSize.base[1].lineHeight, letterSpacing: fontSize.base[1].letterSpacing },
    sm: { fontSize: fontSize.sm[0], fontWeight: fontWeight.normal, lineHeight: fontSize.sm[1].lineHeight, letterSpacing: fontSize.sm[1].letterSpacing },
    xs: { fontSize: fontSize.xs[0], fontWeight: fontWeight.normal, lineHeight: fontSize.xs[1].lineHeight, letterSpacing: fontSize.xs[1].letterSpacing },
    '2xs': { fontSize: fontSize['2xs'][0], fontWeight: fontWeight.normal, lineHeight: fontSize['2xs'][1].lineHeight, letterSpacing: fontSize['2xs'][1].letterSpacing },
  },
  label: {
    lg: { fontSize: fontSize.base[0], fontWeight: fontWeight.medium, lineHeight: fontSize.base[1].lineHeight, letterSpacing: fontSize.base[1].letterSpacing },
    md: { fontSize: fontSize.sm[0], fontWeight: fontWeight.medium, lineHeight: fontSize.sm[1].lineHeight, letterSpacing: fontSize.sm[1].letterSpacing },
    sm: { fontSize: fontSize.xs[0], fontWeight: fontWeight.medium, lineHeight: fontSize.xs[1].lineHeight, letterSpacing: fontSize.xs[1].letterSpacing },
    xs: { fontSize: fontSize['2xs'][0], fontWeight: fontWeight.medium, lineHeight: fontSize['2xs'][1].lineHeight, letterSpacing: fontSize['2xs'][1].letterSpacing },
  },
  code: {
    lg: { fontSize: fontSize.lg[0], fontWeight: fontWeight.normal, lineHeight: fontSize.lg[1].lineHeight, letterSpacing: fontSize.lg[1].letterSpacing, fontFamily: fontFamily.mono.join(', ') },
    md: { fontSize: fontSize.base[0], fontWeight: fontWeight.normal, lineHeight: fontSize.base[1].lineHeight, letterSpacing: fontSize.base[1].letterSpacing, fontFamily: fontFamily.mono.join(', ') },
    sm: { fontSize: fontSize.sm[0], fontWeight: fontWeight.normal, lineHeight: fontSize.sm[1].lineHeight, letterSpacing: fontSize.sm[1].letterSpacing, fontFamily: fontFamily.mono.join(', ') },
    xs: { fontSize: fontSize.xs[0], fontWeight: fontWeight.normal, lineHeight: fontSize.xs[1].lineHeight, letterSpacing: fontSize.xs[1].letterSpacing, fontFamily: fontFamily.mono.join(', ') },
  },
  link: {
    lg: { fontSize: fontSize.lg[0], fontWeight: fontWeight.medium, lineHeight: fontSize.lg[1].lineHeight, letterSpacing: fontSize.lg[1].letterSpacing },
    md: { fontSize: fontSize.base[0], fontWeight: fontWeight.medium, lineHeight: fontSize.base[1].lineHeight, letterSpacing: fontSize.base[1].letterSpacing },
    sm: { fontSize: fontSize.sm[0], fontWeight: fontWeight.medium, lineHeight: fontSize.sm[1].lineHeight, letterSpacing: fontSize.sm[1].letterSpacing },
    xs: { fontSize: fontSize.xs[0], fontWeight: fontWeight.medium, lineHeight: fontSize.xs[1].lineHeight, letterSpacing: fontSize.xs[1].letterSpacing },
  },
} as const;

export const textStyles = {
  displayLarge: typography.display['2xl'],
  displayMedium: typography.display.xl,
  displaySmall: typography.display.lg,
  headlineLarge: typography.heading.h1,
  headlineMedium: typography.heading.h2,
  headlineSmall: typography.heading.h3,
  titleLarge: typography.heading.h4,
  titleMedium: typography.heading.h5,
  titleSmall: typography.heading.h6,
  bodyLarge: typography.body.lg,
  bodyMedium: typography.body.md,
  bodySmall: typography.body.sm,
  bodyXSmall: typography.body.xs,
  labelLarge: typography.label.lg,
  labelMedium: typography.label.md,
  labelSmall: typography.label.sm,
  labelXSmall: typography.label.xs,
  codeLarge: typography.code.lg,
  codeMedium: typography.code.md,
  codeSmall: typography.code.sm,
  codeXSmall: typography.code.xs,
  linkLarge: typography.link.lg,
  linkMedium: typography.link.md,
  linkSmall: typography.link.sm,
  linkXSmall: typography.link.xs,
} as const;

export type FontFamily = typeof fontFamily;
export type FontSize = typeof fontSize;
export type FontWeight = typeof fontWeight;
export type LineHeight = typeof lineHeight;
export type LetterSpacing = typeof letterSpacing;
export type Typography = typeof typography;
export type TextStyles = typeof textStyles;