# 🎨 Emil Design Engineering Skill

This skill encodes the design engineering philosophy of **Emil Kowalski**, focusing on UI polish, animation physics, and the invisible details that make software feel "right."

## 🚀 Key Philosophies

- **Taste is Trained**: Good taste is a trained instinct for recognizing what elevates an interface.
- **Unseen Details Compound**: Stunning interfaces are built from a thousand "barely audible voices" singing in tune.
- **Beauty is Leverage**: Premium aesthetics and smooth interactions are true differentiators in a competitive market.

## 🛠️ Design Frameworks

### Animation Decision Framework
1.  **Frequency**: Animate only what users see occasionally. Never animate keyboard actions.
2.  **Purpose**: Ensure every animation has a functional reason (Spatial consistency, Feedback, etc.).
3.  **Easing**: Use custom `ease-out` curves. Never use `ease-in` for UI.
4.  **Speed**: Keep UI animations under 300ms.

### Spring Physics
Use springs for drag interactions, momentum-based dismissal, and interruptible gestures. Tie visual changes to mouse position using momentum, not linear updates.

## 📐 Implementation Best Practices

- **Responsive Buttons**: Always include `scale(0.97)` on `:active`.
- **Natural Entrances**: Animate from `scale(0.95)` and `opacity: 0`. Never from `scale(0)`.
- **Origin Awareness**: Popovers should scale from their trigger, not the center.
- **Clip-Path Reveals**: Use `clip-path` for sophisticated reveals and comparison sliders.

---
*Building interfaces that feel right.*
