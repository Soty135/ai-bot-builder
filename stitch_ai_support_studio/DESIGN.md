---
name: Synthetic Intelligence Interface
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#7bd0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#19aee8'
  on-tertiary-container: '#003e55'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  gutter: 24px
  margin-safe: 32px
---

## Brand & Style

This design system is engineered for a sophisticated, developer-centric AI builder environment. The aesthetic merges **Modern Corporate** reliability with **Glassmorphism** accents to create a sense of depth and technical precision. The UI should evoke a feeling of "controlled power"—highly capable yet quiet and unobtrusive.

The target audience consists of product managers and developers who require a workspace that minimizes eye strain during long sessions. The emotional response is one of calm efficiency, utilizing heavy whitespace (within a dark context) and high-quality typography to organize complex logic flows. Visual interest is generated through subtle light-refraction effects on the chat interface and crisp, vibrant accents against a matte charcoal foundation.

## Colors

The palette is anchored in deep, cool tones to establish a professional workspace.
- **Primary (Emerald):** Reserved for high-intent actions, "Live" status indicators, and successful AI deployments.
- **Secondary (Indigo):** Used for user-centric elements, such as "User Message" bubbles or highlighting active nodes in a logic tree.
- **Backgrounds:** The foundation uses `#0f172a` (Deep Slate) for the primary application canvas, while `#1e293b` (Charcoal) defines nested surfaces like sidebars and property panels.
- **Semantic Colors:** Emerald handles success, while a muted Red (#ef4444) and Amber (#f59e0b) should be used sparingly for errors and warnings to maintain the calm atmosphere.

## Typography

This design system utilizes **Inter** for all primary interface elements due to its exceptional legibility in dark environments. For technical labels, data points, and code snippets, **Geist** is introduced to provide a "developer-first" monospaced feel that aligns with the AI builder's technical nature.

Hierarchy is established primarily through font weight and subtle color shifts (e.g., using a 70% opacity for secondary body text) rather than dramatic size changes. On mobile devices, display type scales down aggressively to maintain focus on the chat and logic inputs.

## Layout & Spacing

The layout follows a **Fluid Grid** model for the main workspace, allowing the logic canvas to expand infinitely. Side panels for properties and bot configuration are fixed at 320px to ensure the primary focus remains on the builder content.

Spacing relies on an **8pt grid system** to maintain mathematical harmony. 
- **Desktop:** A 12-column grid with 24px gutters.
- **Mobile:** A single column layout with 16px side margins.
- **Layout Logic:** Elements like cards and input groups should use `md` (1.5rem) padding internally to allow the UI to "breathe" despite the density of information required for AI configuration.

## Elevation & Depth

Visual hierarchy is managed through **Tonal Layering** and **Glassmorphism**.
1. **Level 0 (Base):** Deep Slate (#0f172a). Used for the main application background.
2. **Level 1 (Panels):** Charcoal (#1e293b). Used for sidebars and header navigation.
3. **Level 2 (Cards):** Slightly lighter slate with a 1px border (#334155). 
4. **Level 3 (Overlays/Chat):** This design system uses a glassmorphism effect for the chat preview panel. This includes a `backdrop-filter: blur(12px)` and a semi-transparent background (`rgba(30, 41, 59, 0.7)`).

**Shadows:** Use extremely soft, large-radius ambient shadows (`0 20px 25px -5px rgba(0, 0, 0, 0.4)`) only for floating modals and dropdowns to distinguish them from the fixed UI.

## Shapes

The design system adopts a **Rounded** aesthetic with an emphasis on oversized corner radii for the core components.
- **Standard Elements:** Buttons and inputs use the base 0.5rem (8px) radius.
- **Large Containers:** Cards and the chat panel utilize a `2xl` (1.5rem / 24px) radius to create a friendly, approachable shell around technical content.
- **Status Indicators:** Use fully circular (pill-shaped) borders to denote active states or tags.

## Components

### Buttons
- **Primary:** Emerald background, dark slate text. High contrast for "Publish" or "Save."
- **Secondary:** Ghost style with an Indigo border and text. On hover, a 10% Indigo background fill appears.
- **Icon Buttons:** Circular background with #334155 fill for utility actions.

### Chat Panel (Glassmorphism)
The preview chat panel must use a translucent background and a subtle `1px` inner border (stroke) using `#ffffff10` to simulate a glass edge. Message bubbles from the AI should be Charcoal, while User messages are Indigo.

### Inputs
Fields should have a background of `#0f172a` to provide contrast against the `#1e293b` panels. The focus state must transition the border color to Emerald with a 2px outer glow (0 0 0 4px rgba(16, 185, 129, 0.2)).

### Nodes & Chips
Logic nodes in the builder should use a header-body card structure. Chips (for tags like "LLM Model" or "Intent") use a small font-size and muted Indigo backgrounds to stay secondary to the main text.

### Progress Indicators
Use thin, high-contrast Emerald lines for loading states, emphasizing the "speed" of the AI processing.