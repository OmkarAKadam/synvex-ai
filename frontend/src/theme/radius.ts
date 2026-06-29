export const radius = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "1.25rem",
  full: "9999px",
} as const;

export const componentRadius = {
  button: "0.75rem",
  input: "0.75rem",
  card: radius.lg,
  table: radius.md,
  dropdown: radius.md,

  dialog: radius.xl,
  modal: radius.xl,

  avatar: radius.full,
  badge: radius.full,
} as const;

export type RadiusScale = typeof radius;
export type ComponentRadius = typeof componentRadius;