# LUXORA — Digital Experience Master Plan

## 1. Asset List (Required Files)

To achieve the "Fake 3D" cinematic look and Adachi-inspired aesthetic, the following assets are required. Ideally, place these in `luxora/assets/`.

### Hero Section (The 3D Dish Composition)
*   **`img/hero/dish-shadow.png`**: Soft contact shadow (Layer 0). High transparency.
*   **`img/hero/dish-base.png`**: The main plate/food cutout (Layer 1).
*   **`img/hero/dish-garnish.png`**: Top elements (herbs/decoration) for parallax depth (Layer 2).
*   **`img/hero/steam-cloud.png`**: Soft white texture for the steam animation.
*   **`img/hero/chrome-sweep.png`**: Angled light gradient for the "sheen" effect.

### Global Visuals
*   **`img/global/film-grain.png`**: Seamless noise texture for the "Cinematic Grain" overlay.
*   **`img/global/luxora-logo.svg`**: Vector logo (Serif style).

### Editorial Content (Adachi Style)
*   **`img/story/interior-dark.jpg`**: Moody, high-end restaurant interior.
*   **`img/chef/portrait-cinematic.jpg`**: B&W or desaturated chef portrait.
*   **`img/menu/plate-01.jpg`** to **`plate-03.jpg`**: Top-down food shots.
*   **`img/gallery/slide-01.jpg`** to **`slide-05.jpg`**: Lifestyle/Atmosphere images.

### Typography
*   **Primary (Headings)**: *Cinzel Decorative*, *Playfair Display*, or *Cormorant Garamond* (Google Fonts).
*   **Secondary (Body)**: *Inter*, *Outfit*, or *Manrope* (Accessory text).

---

## 2. Implementation Walkthrough

### Phase 1: Foundation & Design System (`styles/global.css`)
*   **Setup**: Initialize CSS variables for the color palette (Deep Navy `#0D1B21`, Soft Gold `#D4C4A8`) and the strict easing `cubic-bezier(0.4, 0, 0.2, 1)`.
*   **Typography**: Establish the "Adachi" hierarchy (Big Serif Headings).
*   **Motion**: Add global "Film Grain" and custom cursor styles.

### Phase 2: The "Fake 3D" Hero
*   **Structure**: Container with `perspective: 1000px`.
*   **Logic**: Bind `mousemove` to GSAP tweens.
    *   *Shadow*: Moves slightly (`x: 5`).
    *   *Base Dish*: Moves moderately (`x: 10`).
    *   *Garnish*: Moves most (`x: 20`) to create depth.
*   **Steam**: Continuous rising loop with opacity fade.

### Phase 3: Cinematic Navigation
*   **Nav**: Fixed top bar with `backdrop-filter: blur(10px)`.
*   **Behavior**:
    *   *Entrance*: Slide down on load (delay 200ms).
    *   *Scroll*: Fade background from transparent to solid Navy.
    *   *Hover*: "Ice Teal" glow + Magnetic pull.

### Phase 4: Scroll Sections (Editorial)
*   **Brand Story**: Text staggered reveal (`autoAlpha: 0` -> `1`, `y: 30` -> `0`).
*   **Signature Menu**: Cards that tilt 3D on hover (`transform: rotateX(...)`).
*   **Horizontal Gallery**: `gsap.to(container, {xPercent: -100})` triggered by vertical scroll.

### Phase 5: Cinematic Transitions
*   **Intro**: Dark screen -> Grain -> Dish Fade In -> Text Reveal.
*   **Page Transitions**: Smooth fades/zooms (no hard cuts).
