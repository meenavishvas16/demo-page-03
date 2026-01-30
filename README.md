# LUXORA - Architecture of Taste

![Luxora Banner](assets/hero%20plate.png)

**Luxora** is an ultra-premium, cinematic dining experience website built with **Three.js**, **GSAP**, and **Lenis Scroll**. 

## 🌟 Key Features

- **3D Hero Dish**: A fully interactive 3D composition using `Three.js`. The dish floats, reacts to the mouse, and emits procedural steam particles.
- **Cinematic Scrolling**: Powered by `GSAP ScrollTrigger` and `Lenis`, the site features:
  - Parallax imagery.
  - Text reveals.
  - Horizontal gallery pinning.
  - "Stroll" virtual tour transitions.
- **Atmosphere**: A custom "Ice Teal" and "Bone Gold" palette, complete with film grain and magnetic cursors.

## 🛠️ Technology Stack

- **Three.js**: WebGL rendering for the hero section (Textures, Shaders, Particles).
- **GSAP (GreenSock)**: Advanced animation sequencing and scroll triggers.
- **Lenis**: Smooth, momentum-based scrolling.
- **Vanilla JS**: No frameworks, just pure performance.

## 🚀 How to Run

Because this project uses **WebGL Textures**, browser security (CORS) will block local file access (`file://`).

### Option 1: GitHub Pages (Recommended)
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Select `main` branch and save.
4. Your site will be live at `https://your-username.github.io/luxora/`.

### Option 2: Local Server
If running locally, use a simple server:

```bash
# Node.js
npx serve .

# Python
python -m http.server
```

Then open `http://localhost:3000`.

## 📂 Project Structure

```
luxora/
├── index.html       # Main structure
├── styles/
│   └── global.css   # Luxora Design System
├── scripts/
│   └── app.js       # Three.js + GSAP Logic
└── assets/          # Images and textures
```

## 🎨 Asset Credits
*   Fonts: Cinzel & Inter (Google Fonts)
*   Icons: FontAwesome (if applicable)

---
*Crafted for Luxora Dining Group.*
