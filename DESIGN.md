---
name: Arcium Academy
colors:
  background: "#0e0e0f"
  on-background: "#ffffff"
  surface: "#0e0e0f"
  surface-bright: "#2c2c2d"
  surface-container-lowest: "#000000"
  surface-container-low: "#131314"
  surface-container: "#1a191b"
  surface-container-high: "#201f21"
  surface-container-highest: "#262627"
  on-surface: "#ffffff"
  on-surface-variant: "#adaaab"
  outline: "#767576"
  outline-variant: "#484849"
  primary: "#69daff"
  primary-container: "#00cffc"
  on-primary: "#0e0e0f"
  secondary: "#ff7524"
  secondary-container: "#a04100"
  tertiary: "#89a5ff"
  tertiary-container: "#7696fd"
  error: "#ff716c"
  error-container: "#9f0519"
  canvas-black: "#000000"
  body-grid-line: "rgba(72, 72, 73, 0.05)"
  ambient-cyan-glow: "rgba(105, 218, 255, 0.05)"
  ambient-orange-glow: "rgba(255, 117, 36, 0.03)"
  selection-primary-bg: "rgba(105, 218, 255, 0.3)"
  discovery-scrim: "rgba(0, 0, 0, 0.72)"
  discovery-input-bg: "#05070a"
  discovery-gradient-top: "rgba(8, 10, 12, 0.98)"
  discovery-gradient-bottom: "rgba(13, 16, 20, 0.97)"
  academy-flow-base: "#080a0d"
  academy-flow-cyan: "rgba(0, 240, 255, 0.08)"
  academy-flow-mint: "rgba(47, 230, 166, 0.08)"
  academy-flow-gold: "rgba(255, 200, 87, 0.05)"
  scrollbar-thumb: "rgba(132, 148, 149, 0.45)"
  link-muted: "#94a3b8"
  link-muted-disabled: "#475569"
  glitch-magenta: "#ff00ea"
  glitch-cyan: "#00f0ff"
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 96px
    fontWeight: "700"
    lineHeight: 0.85
    letterSpacing: -0.05em
  display-hero-sm:
    fontFamily: Space Grotesk
    fontSize: 60px
    fontWeight: "700"
    lineHeight: 0.85
    letterSpacing: -0.05em
  display-page:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: "900"
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-card:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: "900"
    lineHeight: 1.2
    letterSpacing: -0.02em
  title-section:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: "700"
    lineHeight: 1.2
    letterSpacing: 0.08em
  brand-lockup:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: "900"
    lineHeight: 1.2
    letterSpacing: 0.2em
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "400"
    lineHeight: 1.625
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 1.714
  mono-rail-wide:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: "400"
    lineHeight: 1.4
    letterSpacing: 0.4em
  mono-rail:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: "400"
    lineHeight: 1.4
    letterSpacing: 0.2em
  label-cta:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: "700"
    lineHeight: 1.2
    letterSpacing: 0.2em
  label-nav:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: "700"
    lineHeight: 1.2
    letterSpacing: 0.1em
  caption-micro:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: "400"
    lineHeight: 1.5
    letterSpacing: 0.15em
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-y: 96px
  page-gutter: 24px
  content-max-width: 1440px
  sidebar-width: 288px
  hero-rail-width: 400px
rounded:
  none: 0px
  sm: 2px
  input: 19px
  card-soft: 18px
  card-softer: 22px
  full: 9999px
elevation:
  shadow-hard-card: "4px 4px 0px rgba(0, 0, 0, 0.4)"
  shadow-hard-fab: "4px 4px 0px rgba(0, 0, 0, 1)"
  shadow-hard-panel: "8px 8px 0px rgba(0, 0, 0, 0.5)"
  shadow-modal-deep: "0 40px 120px rgba(0, 0, 0, 0.82)"
  shadow-focus-ring: "0 0 0 1px rgba(0, 240, 255, 0.08)"
  shadow-card-glow: "0 0 20px rgba(0, 255, 163, 0.15)"
  shadow-sidebar: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
motion:
  duration-short: 300ms
  duration-medium: 500ms
  easing-standard: ease-out
  easing-layout: ease-in-out
  keyframe-fade-in-up-duration: 500ms
  keyframe-fade-in-up-distance: 16px
  keyframe-flow-primary: 1600ms
  keyframe-flow-secondary: 2800ms
  keyframe-flow-easing: linear
borders:
  width-hairline: 1px
  width-accent: 2px
  width-chunky: 4px
  opacity-subtle: 0.1
  opacity-medium: 0.2
  opacity-strong: 0.3
effects:
  body-grid-size: 32px
  fine-grid-opacity: 0.02
  scanline-layer-opacity: 0.2
  backdrop-overlay-blur: 12px
  console-header-border: 2px
components:
  shell-body:
    backgroundColor: "{colors.canvas-black}"
    textColor: "{colors.on-background}"
    typographyBody: "{typography.body-md}"
  console-window:
    backgroundColor: "{colors.surface-container-low}"
    motionDuration: "{motion.duration-short}"
    motionEasing: "{motion.easing-layout}"
  console-header:
    borderBottomWidth: "{effects.console-header-border}"
    borderBottomColor: "rgba(72, 72, 73, 0.3)"
    backgroundColor: "{colors.surface-container-high}"
    typography: "{typography.mono-rail}"
    paddingX: 12px
    paddingY: 4px
  hero-primary-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-cta}"
    paddingX: 40px
    paddingY: 20px
  hero-secondary-cta:
    borderColor: "rgba(118, 117, 118, 0.2)"
    backgroundColor: "rgba(32, 31, 33, 0.4)"
    typography: "{typography.label-cta}"
    backdropBlur: 4px
  project-card:
    borderColor: "rgba(72, 72, 73, 0.3)"
    backgroundColor: "rgba(32, 31, 33, 0.4)"
    shadowRest: "{elevation.shadow-hard-card}"
    shadowHover: "{elevation.shadow-card-glow}"
    motionDuration: "{motion.duration-short}"
  discovery-fab:
    backgroundColor: "{colors.primary}"
    borderWidth: "{borders.width-chunky}"
    borderColor: "{colors.surface-container-lowest}"
    shadowRest: "{elevation.shadow-hard-fab}"
    size: 56px
  codex-sidebar:
    width: "{spacing.sidebar-width}"
    backgroundColor: "{colors.surface-container-low}"
    borderRightOpacity: 0.1
---

## Brand and style

Arcium Academy reads as a **dark instructional console**: a place to learn confidential compute and ecosystem structure without softening into generic SaaS chrome. The voice is **technical, confident, and slightly theatrical**—uppercase rails, monospace status lines, and cyan “signal” color imply live systems more than marketing polish.

Personality balances **precision** (tight grids, stepped gray surfaces, sharp default corners) with **energy** (orange kicker lines, optional glitch hover, per-card accent glows on the ecosystem map). The product should feel like **operating a codex**, not browsing a blog theme.

## Colors

The palette is **near-black first**. White is the default foreground; hierarchy uses **value steps** through surface-container ramps and **muted outline** neutrals rather than heavy borders everywhere.

- **Primary cyan** is the system heartbeat: selection tint, live emphasis, sidebar beacon, primary actions, and focus rings on inputs. It should read as **instrumentation**, not decoration.
- **Secondary orange** is a **high-attention accent** for kickers, gradient hairlines, and secondary semantic heat—use sparingly so cyan stays dominant.
- **Tertiary periwinkle** adds cool variety for accents and data differentiation without competing with the main signal pair.
- **Borders and dividers** usually appear at **low opacity** on outline tokens so structure reads as **etched** rather than boxed.
- **Error** is a vivid coral reserved for failure or destructive semantics on dark surfaces.

## Typography

**Space Grotesk** carries display, navigation chrome, and uppercase CTAs. **Inter** carries explanatory paragraphs and card summaries for calm reading on busy backgrounds. **JetBrains Mono** is the voice of **indices, coordinates, module IDs, and telemetry**—wide tracking on micro labels reinforces the “fixed-width console” metaphor without forcing entire layouts into monospace.

Hierarchy leans on **extreme scale contrast**: 9–10px uppercase rails against 60–96px display lines. **Tight tracking** on headlines keeps stacked hero words feeling like a **single machined block**.

## Layout and spacing

An **8px rhythm** underpins spacing. Major vertical bands often use **large gaps** (for example 96px) between homepage sections. Main content sits in a **centered max-width rail** on large screens while a **fixed left index** (wide sidebar) holds primary navigation on viewports where it fits; smaller viewports collapse that story into the main column.

Section headers frequently pair a **bold title** with a **thin gradient rule** (cyan or orange fading to transparent) to imply horizon or scan line rather than a plain divider.

## Elevation and depth

Default surfaces favor **flat layering** and **tonal separation**. Cards and auth-style panels often use **hard offset shadows** (pure black, 4–8px shift, minimal blur) for a **neo-brutalist slab** that feels tactile and deliberate.

Transient UI (command search, overlays) flips the model: a **dark blurred scrim** and a **deep diffuse shadow** on the dialog stack create one focal plane above the app. Selected rows use a **thin cyan-tinted outer ring** instead of heavy inner glow.

## Shapes

The default theme radius is **square (0)** for structural panels—sharpness reads as **precision and tooling**.

**Softer radii** appear where ergonomics demand it: search fields, palette rows, and empty-state cards use roughly **18–22px** corners; pills and the floating command trigger use **full rounding**. Treat rounding as **human accommodation on inputs and overlays**, not the default language of permanent chrome.

## Motion and interaction

- **Color and background transitions** commonly sit around **300ms**; some panels stretch to **500ms** for a slower, heavier feel.
- **Entry motion** for cards: short **fade-up** (opacity plus a small vertical offset) so content feels like it **locks into the stack**.
- **Decorative path motion**: dashed strokes can loop with **linear** timing at distinct speeds to imply **data flow** without implying loading spinners.
- **Primary CTA**: subtle **scale up on hover** and **press down** on active for physical key feedback.
- **Optional glitch hover** on text uses **split cyan and magenta shadows**—reserve for playful elements so dense educational pages stay trustworthy.

## Components

### Console frame

The **console window** pattern stacks a **dense header strip** (module path, status label) above calmer body padding. The header uses a **stronger bottom border** and lifted background to read as a **title bar**. Body regions rely on **background tier shifts** more than boxing every block in outlines.

### Fixed codex index

The left rail presents **grouped navigation** with micro uppercase section titles and **icon plus condensed label** rows. Active routes flip icon and label to **primary** and may show a **tiny pulsing dot**—navigation should feel like **flipping sections in a technical manual**.

### Hero

The hero pairs **massive stacked uppercase display** with a **mono kicker** and a thin **orange gradient hairline**. Primary action is **flat cyan with dark label**; secondary is **outline plus translucent surface with light blur** for exploratory tone.

### Discovery command surface

Full-viewport **dark scrim with blur** focuses attention. The dialog uses a **vertical near-black gradient**, generous keyboard navigation, and result rows that **soften corners** when selected. The floating trigger is **high-contrast cyan**, **thick black border**, and **hard shadow** so it reads as the **primary interrupt control**.

### Knowledge and ecosystem cards

Cards use **left-edge accent growth on hover**, **primary-tinted meta chips**, and **reveal-on-hover** action rows (opacity and slight vertical motion). Ecosystem project tiles add **hard shadow at rest**, optional **accent-driven border tint and hover glow**, and a **small colored cap** on the top edge for “instrument panel” personality.

### Auth surfaces

Auth screens favor **pure black canvas**, **mono-forward typography**, optional **full-screen scanline veil**, and **offset-shadow panels** for a **boot-sequence** tone distinct from the main shell.

---

This specification describes the implemented visual language as observed in the running product’s theme, global canvas treatment, and recurring UI patterns. If implementation drifts, reconcile token literals and narrative here so the document remains the single source of truth for look and feel.
