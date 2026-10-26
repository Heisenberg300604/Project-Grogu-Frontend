/**
 * Shared chart palette. Fills use the brand colours, which are the same in the
 * light and dark themes. Lines and text use CSS variables so they follow the
 * active theme; Recharts passes them straight through to SVG attributes.
 */
export const CHART_COLORS = {
  primary: "#5b3ff0",
  secondary: "#34b6ff",
  success: "#19c58d",
  warning: "#ffc933",
  destructive: "#ff5a7a",
  info: "#34b6ff",
  grid: "var(--border)",
  axis: "var(--muted-foreground)",
  label: "var(--foreground)",
  outline: "var(--line)",
} as const;

export const SENTIMENT_COLORS = {
  positive: CHART_COLORS.success,
  neutral: CHART_COLORS.warning,
  negative: CHART_COLORS.destructive,
} as const;
