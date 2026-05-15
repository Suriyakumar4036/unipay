# ⚪ Minimalist UI Protocol

The **Minimalist UI** skill is an advanced frontend engineering directive for generating highly refined, "document-style" web interfaces. It focuses on typographic contrast, macro-whitespace, and a warm monochrome palette.

## 🎨 Design Language

- **Palette**: Warm Monochrome (`#F7F6F3`) with desaturated "Spot Pastels" for semantic meaning.
- **Typography**: Bespoke hierarchies using **Geist Sans** (UI), **Instrument Serif** (Editorial), and **Geist Mono** (Meta).
- **Layout**: Bento-grid structures with crisp, 1px borders (`#EAEAEA`) and generous internal padding.
- **Iconography**: Thicker-stroke, technical aesthetics (Phosphor or Radix UI icons).

## 🚫 Absolute Constraints

To maintain an "Anti-Slop" aesthetic, the following are strictly banned:
- No generic fonts (Inter/Roboto).
- No Tailwind default shadows.
- No primary colored backgrounds (no bright blues/reds).
- No gradients, neon, or glassmorphism.
- No emojis (use clean SVG primitives instead).
- No AI clichés ("Elevate", "Seamless", etc.).

## ⚡ Interaction & Motion

Motion is "Quiet Sophistication":
- **Scroll Entry**: Subtle `translateY(12px)` + `opacity: 0` fade-ins over 600ms.
- **Hover States**: Ultra-subtle lift and `scale(0.98)` on press.
- **Depth**: Sections must use subtle textures, low-opacity ambient gradients, or warm grain—never empty flat backgrounds.

---
*Editorial-style software for the modern web.*
