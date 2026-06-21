# WanderLux Travels — 3D Scroll Travel Website

WanderLux Travels is a cinematic travel landing page that combines a frame-by-frame 3D-style scroll animation with an editorial luxury travel website. The page opens with a branded loading experience, transitions into a full-screen canvas journey, and then reveals destination, package, gallery, blog, and booking sections for a premium travel brand.

## Live Website

🔗 **Website link:** [https://ui-designs-giuy.vercel.app/](https://ui-designs-giuy.vercel.app/)

## Preview

The experience is designed around a fixed full-screen canvas. As the visitor scrolls, JavaScript maps scroll progress to 250 preloaded image frames from the `frames/` directory, creating a smooth 3D travel-film effect before the main WanderLux content begins.

## Key Features

- **Cinematic 3D scroll animation** using a fixed `<canvas>` and 250 sequential JPG frames.
- **Frame preloader with progress UI** so the animation is ready before the interactive experience starts.
- **Scroll progress indicator** pinned to the top of the viewport.
- **Hero title overlay** that fades as the user scrolls into the animation.
- **Timed story captions** that appear at different scroll ranges during the canvas sequence.
- **Custom airplane cursor** that rotates with mouse movement and changes state on hover or orange sections.
- **Luxury editorial travel layout** with destination cards, brand statistics, package strips, scrapbook gallery, testimonials, blog cards, and contact form.
- **Word reveal and image desaturation effects** powered by `IntersectionObserver`.
- **Animated counters** for travel statistics when the brand section enters view.
- **Dark mode toggle** that switches the site theme between warm cream and dark luxury palettes.
- **Mock booking form submission** with a success message for itinerary requests.
- **Responsive styling** for tablets and mobile screens, including a mobile sticky call-to-action.

## Project Structure

```text
travelling/
├── index.html        # Page markup, navigation, canvas, content sections, and form
├── style.css         # Theme variables, layout, animation styles, responsive rules, dark mode
├── script.js         # Canvas frame animation, preload logic, scroll behavior, observers, form, dark mode
├── frames/           # 250 JPG frames used by the scroll-driven canvas animation
├── nistha.ttf        # Custom display font used for the cinematic WanderLux hero title
└── readme.md         # Project documentation
```

## How the 3D Scroll Animation Works

1. `index.html` defines the fixed `#scroll-canvas`, the loader, the scroll progress bar, the hero overlay, and a tall `.scroll-container` that creates enough vertical space for the animation.
2. `script.js` preloads 250 images named in the format `ezgif-frame-001.jpg` through `ezgif-frame-250.jpg` from `./frames/`.
3. When all frames are loaded, the loader fades out and the app begins listening for resize and scroll events.
4. On each scroll update, the script calculates the user’s progress through `.scroll-container` and converts that percentage into a frame index.
5. The selected frame is drawn onto the canvas using cover-style scaling so the sequence fills the viewport without distortion.
6. Text sections use `data-start` and `data-end` attributes to appear only during specific scroll ranges, giving the animation a guided story feel.
7. After the 500vh animation sequence, the visitor continues into the full WanderLux landing page content.

## Page Sections

- **Navigation:** fixed top navbar with destination, package, gallery, blog, login, signup, and dark mode controls.
- **Canvas Experience:** full-screen 3D-style travel scroll with cinematic captions and grain overlay.
- **Destinations:** editorial mosaic featuring Santorini, Kyoto, Serengeti, and Patagonia.
- **Brand Statement:** bold orange section with animated stats for years, travellers, countries, and rating.
- **Travel Categories:** horizontal mood-based category pills with adventure package cards.
- **Process:** diagonal dark section explaining the planning journey with a compass line animation.
- **Pricing:** tiered travel packages for Explorer, Signature, and Ultra Luxe journeys.
- **Gallery:** scrapbook-inspired polaroid layout for travel memories.
- **Testimonials:** traveller quote cards for social proof.
- **Blog:** editorial travel dispatch cards.
- **Contact & Booking:** glass-style itinerary request form with mock success feedback.
- **Footer:** destination marquee, brand links, support links, and policy links.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas API
- Intersection Observer API
- Google Fonts
- Custom local font (`nistha.ttf`)

## Running Locally

Because the project uses local image frames and browser APIs, run it through a local static server instead of opening the HTML file directly.

```bash
cd travelling
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Notes for Future Improvements

- Add real booking-form backend integration.
- Persist dark mode preference with `localStorage`.
- Add keyboard-visible focus states for better accessibility.
- Optimize the frame sequence with compressed images or video fallback for faster loading.
- Add alternate text/content refinements for production SEO.
