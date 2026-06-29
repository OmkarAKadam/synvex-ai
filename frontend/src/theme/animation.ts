export const transitionDuration = {
  instant: '0ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const;

export const transitionTiming = {
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const transitions = {
  none: 'none',
  all: `all ${transitionDuration.normal} ${transitionTiming.easeOut}`,
  colors: `color ${transitionDuration.fast} ${transitionTiming.easeOut}, background-color ${transitionDuration.fast} ${transitionTiming.easeOut}, border-color ${transitionDuration.fast} ${transitionTiming.easeOut}`,
  opacity: `opacity ${transitionDuration.fast} ${transitionTiming.easeOut}`,
  shadow: `box-shadow ${transitionDuration.fast} ${transitionTiming.easeOut}`,
  transform: `transform ${transitionDuration.normal} ${transitionTiming.easeOut}`,
} as const;

export const animations = {
  fadeIn: {
    keyframes: {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" },
    },
    duration: transitionDuration.normal,
    timing: transitionTiming.easeOut,
  },

  fadeOut: {
    keyframes: {
      "0%": { opacity: "1" },
      "100%": { opacity: "0" },
    },
    duration: transitionDuration.fast,
    timing: transitionTiming.easeInOut,
  },

  slideInFromTop: {
    keyframes: {
      "0%": { opacity: "0", transform: "translateY(-10px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    duration: transitionDuration.normal,
    timing: transitionTiming.easeOut,
  },

  slideInFromBottom: {
    keyframes: {
      "0%": { opacity: "0", transform: "translateY(10px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    duration: transitionDuration.normal,
    timing: transitionTiming.easeOut,
  },

  scaleIn: {
    keyframes: {
      "0%": { opacity: "0", transform: "scale(0.95)" },
      "100%": { opacity: "1", transform: "scale(1)" },
    },
    duration: transitionDuration.normal,
    timing: transitionTiming.easeOut,
  },

  scaleOut: {
    keyframes: {
      "0%": { opacity: "1", transform: "scale(1)" },
      "100%": { opacity: "0", transform: "scale(0.95)" },
    },
    duration: transitionDuration.fast,
    timing: transitionTiming.easeInOut,
  },

  spin: {
    keyframes: {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
    duration: "1000ms",
    timing: "linear",
  },

  pulse: {
    keyframes: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.5" },
    },
    duration: "2000ms",
    timing: transitionTiming.easeInOut,
  },

  shimmer: {
    keyframes: {
      "0%": { backgroundPosition: "-200% 0" },
      "100%": { backgroundPosition: "200% 0" },
    },
    duration: "1500ms",
    timing: "linear",
  },
} as const;

export const animationPresets = {
  pageEnter: { animation: 'fadeIn', duration: transitionDuration.normal, timing: transitionTiming.easeOut },
  pageExit: { animation: 'fadeOut', duration: transitionDuration.fast, timing: transitionTiming.easeInOut },
  modalEnter: { animation: 'scaleIn', duration: transitionDuration.normal, timing: transitionTiming.easeOut },
  modalExit: { animation: 'scaleOut', duration: transitionDuration.fast, timing: transitionTiming.easeInOut },
  dropdownEnter: { animation: 'slideInFromTop', duration: transitionDuration.normal, timing: transitionTiming.easeOut },
  dropdownExit: { animation: 'fadeOut', duration: transitionDuration.fast, timing: transitionTiming.easeInOut },
  toastEnter: { animation: 'slideInFromBottom', duration: transitionDuration.normal, timing: transitionTiming.easeOut },
  toastExit: { animation: 'fadeOut', duration: transitionDuration.fast, timing: transitionTiming.easeInOut },
  loadingSpinner: { animation: 'spin', duration: '1000ms', timing: 'linear' },
  loadingPulse: { animation: 'pulse', duration: '2000ms', timing: transitionTiming.easeInOut },
  loadingShimmer: { animation: 'shimmer', duration: '1500ms', timing: 'linear' },
} as const;

export type TransitionDuration = typeof transitionDuration;
export type TransitionTiming = typeof transitionTiming;
export type Transitions = typeof transitions;
export type Animations = typeof animations;
export type AnimationPresets = typeof animationPresets;