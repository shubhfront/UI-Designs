# UI Designs

A collection of standalone, front-end UI concepts focused on premium landing pages, portfolio experiences, and scroll-driven visual storytelling. Each design lives in its own folder and is built primarily with HTML, CSS, JavaScript, image sequences, canvas rendering, and animation libraries where needed.

## Repository Overview

This repository is organized as a gallery of independent UI prototypes rather than a single shared application. Most folders contain their own `index.html`, stylesheet, JavaScript file, image assets, and a short project-specific readme.

| Design | Folder | Summary | Notable UI/animation ideas |
| --- | --- | --- | --- |
| Mercedes Scroll Animation | `Mercedese/` | Automotive hero experience that reveals motion as the user scrolls. | Canvas image-sequence rendering, 208-frame scroll animation, sticky cinematic layout. |
| Construction / Luxury Real Estate | `construction/` | Premium construction and real-estate landing page. | GSAP + ScrollTrigger, frame-based hero sequence, project, pricing, gallery, testimonial, brand, and contact sections. |
| Décor Studio | `decoration/` | Interior decoration and curated interiors website. | Dark/light theme toggle, before/after decoration interaction, portfolio grid, services, stats, process, testimonials, and CTA sections. |
| Developer Portfolio | `developer portfolio/` | 3D developer portfolio centered around a desktop PC model and animated sections. | Three.js, GLTF model loading, OrbitControls, GSAP reveal animations, projects, tech stack, testimonials, and contact sections. |
| Interior Designer | `interior designer/` | Luxury interior design landing page with a scroll-based 3D feel. | GSAP + ScrollTrigger, 200-frame canvas sequence, premium editorial sections. |
| Restaurant | `restaurent/` | Modern Indian restaurant landing page. | Canvas-based food/hero sequence, loader, menu, chef, gallery, review, reservation, and social sections. |
| Travelling | `travelling/` | Luxury travel landing page for WanderLux Travels. | Page-load overlay, 250-frame scroll canvas animation, editorial travel sections, categories, process, and pricing. |
| Video Editor | `video editor/` | Cinematic photographer/video editor portfolio. | 220-frame canvas hero sequence, loading screen, progress bar, reveal sections, services, work, and contact-oriented content. |

## Common Design Patterns

- **Scroll-driven storytelling:** Several projects use canvas image sequences to create smooth, video-like transitions tied to scroll progress.
- **Premium visual direction:** The designs lean on large typography, cinematic imagery, dark themes, polished spacing, and editorial-style section layouts.
- **Standalone project structure:** Each UI can be opened independently from its folder using its own `index.html` file.
- **Vanilla front-end stack:** The repository mostly uses plain HTML, CSS, and JavaScript, with selective use of GSAP, ScrollTrigger, and Three.js.
- **Asset-heavy experiences:** Many prototypes depend on local image or frame folders, so designs should be run from a local/static server rather than opened directly when browser asset loading rules interfere.

## Folder Structure

```text
UI-Designs/
├── Mercedese/
├── construction/
├── decoration/
├── developer portfolio/
├── interior designer/
├── restaurent/
├── travelling/
└── video editor/
```

## How to View a Design Locally

Because these are static front-end prototypes, you can serve the repository with any simple static server.

### Option 1: Python static server

```bash
python3 -m http.server 8000
```

Then open one of the project pages in your browser, for example:

- `http://localhost:8000/Mercedese/`
- `http://localhost:8000/construction/`
- `http://localhost:8000/decoration/`
- `http://localhost:8000/developer%20portfolio/`
- `http://localhost:8000/interior%20designer/`
- `http://localhost:8000/restaurent/`
- `http://localhost:8000/travelling/`
- `http://localhost:8000/video%20editor/`

### Option 2: VS Code Live Server

Open the repository in VS Code, start Live Server from the repository root, and navigate to the folder for the design you want to preview.

## Notes for Future Work

- Standardize folder names and spelling, such as `Mercedese` and `restaurent`, if URLs or deployment paths do not depend on the current names.
- Add preview screenshots or GIFs for each UI concept.
- Consider a root gallery page that links to all designs from one landing screen.
- Add consistent project metadata, including live demo links, asset requirements, and browser support notes.
- Optimize large image-sequence projects with compressed frames, lazy loading, or video fallbacks where appropriate.

## Existing Demo Links

Some subproject readmes include deployment links:

- Construction: `https://ui-designs-eta.vercel.app/`
- Decoration: `https://decoration-six.vercel.app/`
- Interior Designer: `https://interior-pi-six.vercel.app/`
- Restaurant: `https://ui-designs-vv22.vercel.app/`
- Travelling: `https://ui-designs-giuy.vercel.app/`
- Video Editor: `https://mayank-suryavanshi-portfolio.vercel.app/`

## Tech Used Across the Repository

- HTML5
- CSS3
- JavaScript
- Canvas API
- GSAP
- ScrollTrigger
- Three.js
- Local image/frame sequences
