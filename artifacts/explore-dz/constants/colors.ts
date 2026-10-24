/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#19372A',
    tint: '#176B4A',

    // Core surfaces
    background: '#F7F5EF',
    foreground: '#19372A',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#19372A',

    // Primary action color (buttons, links, active states)
    primary: '#176B4A',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E8EBDD',
    secondaryForeground: '#19372A',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#EEECE4',
    mutedForeground: '#69766E',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#E4EBDD',
    accentForeground: '#19372A',

    // Destructive actions (delete, error states)
    destructive: '#B3423D',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#E5E2D8',
    input: '#E5E2D8',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
