gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CONFIGURATION
// ==========================================
const TOTAL_FRAMES = 82; // Set your total frame count here
const FRAME_EXT = "jpg"; // e.g. "jpg", "png", "webp"
const FRAME_PREFIX = "frames/ezgif-frame-";

// ==========================================
// STATE & DOM ELEMENTS
// ==========================================
const canvas = document.getElementById("frame-canvas");
const ctx = canvas.getContext("2d", { alpha: false }); // alpha: false optimizes rendering if frames are opaque
const loadingScreen = document.getElementById("loading");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const images = [];
let loadedCount = 0;
let currentFrameIndex = -1;
let animationState = { frame: 1 };
let renderRequested = false;

// Helper to format numbers like 001, 002
const getImagePath = (index) => {
    const paddedNumber = index.toString().padStart(3, '0');
    return `${FRAME_PREFIX}${paddedNumber}.${FRAME_EXT}`;
};

// ==========================================
// PRELOADING
// ==========================================
const preloadImages = () => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const src = getImagePath(i);

        img.onload = () => {
            loadedCount++;
            const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
            progressText.innerText = `Loading ${progress}%`;
            progressBar.style.width = `${progress}%`;

            if (loadedCount === TOTAL_FRAMES) {
                initAnimation();
            }
        };

        img.onerror = () => {
            console.error(`Failed to load frame: ${src}`);
            loadedCount++; // Increment anyway to not block the experience
            if (loadedCount === TOTAL_FRAMES) {
                initAnimation();
            }
        }

        img.src = src;

        // Asynchronously decode the image data for jank-free scrubbing
        if (img.decode) {
            img.decode().catch(() => {
                // ignore errors if decoding fails, it will still draw (just less optimally)
            });
        }

        images[i] = img;
    }
};

// ==========================================
// RENDERING
// ==========================================
const render = () => {
    // Clamp the frame index between 1 and TOTAL_FRAMES
    let index = Math.round(animationState.frame);
    if (index < 1) index = 1;
    if (index > TOTAL_FRAMES) index = TOTAL_FRAMES;

    // Only draw if frame has changed and image is ready
    if (currentFrameIndex !== index && images[index] && images[index].complete) {
        // Wipe canvas and draw new frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[index], 0, 0);
        currentFrameIndex = index;
    }

    renderRequested = false;
};

// RAF Wrapper to prevent layout thrashing
const requestRender = () => {
    if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
    }
};

// ==========================================
// GSAP ANIMATION LOGIC
// ==========================================
const initAnimation = () => {

    // 1. Setup Canvas Internal Dimensions
    // Use CSS 'object-fit: cover' on the canvas element, so we only need to set 
    // the internal resolution to match the first frame's natural resolution once.
    if (images[1]) {
        canvas.width = images[1].width || 1920;
        canvas.height = images[1].height || 1080;
    }

    // 2. Hide Loader and Reveal Canvas
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
        loadingScreen.style.display = "none";
        canvas.style.opacity = "1"; // CSS transition handles fade-in
        requestRender(); // Paint the first frame immediately
    }, 500);

    // Setup initial scale (CSS handles the translate positioning)
    // gsap.set(".overlay", { scale: 0.8 });

    // 3. Master ScrollTrigger Timeline
    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#sticky-container",
            pin: true,
            start: "top top",
            end: "+=400%", // 400% of viewport height creates the scroll duration
            scrub: 0.5, // 0.5 seconds smoothing
            onUpdate: requestRender // Trigger RAF redraw on scroll
        }
    });

    // 4. Scrub Frames (0 to 10 duration in timeline relative time)
    masterTl.to(animationState, {
        frame: TOTAL_FRAMES,
        ease: "none",
        duration: 10
    }, 0);

    // Fade out the massive intro logo early in the scroll
    masterTl.to("#intro-logo", {
        opacity: 0,
        scale: 1.5, // Scale up slightly while fading out
        ease: "power2.out",
        duration: 2
    }, 0);

    // 5. Fade in Hero UI Layer at the very end
    // Starts fading in at 8.5 out of 10 timeline duration (last 15% of scroll)
    masterTl.to("#hero-ui-layer", {
        opacity: 1,
        ease: "power2.out",
        duration: 1.5
    }, 8.5);

    // Stagger in the content elements for a cinematic reveal
    masterTl.from("#hero-ui-layer .hero-content > *, #hero-ui-layer .bottom-bar", {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out",
        duration: 1
    }, 8.5);

    // Initialize subsequent sections to ensure proper ScrollTrigger order
    initBottleSequence(() => {
        initNewSections();
    });
};

// --- BOTTLE SEQUENCE ANIMATION ---
function initBottleSequence(onComplete) {
    const bottleImg = document.querySelector('.bottle-anim-img');
    const greenTrail = document.querySelector('.bottle-roll-bg-green');
    const layBg = document.querySelector('.bottle-lay-bg');

    if (!bottleImg || !greenTrail || !layBg) {
        if (onComplete) onComplete();
        return;
    }

    const setupSequence = () => {
        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Ensure bottle transform origin is at center center for laying down to keep it fully visible
        gsap.set(bottleImg, { transformOrigin: "center center" });

        const seqTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".bottle-sequence-spacer",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                invalidateOnRefresh: true
            }
        });

        if (prefersReducedMotion) {
            // Simplified animation for accessibility
            gsap.set(bottleImg, { x: () => (window.innerWidth - bottleImg.offsetWidth) / 2 });
            seqTl.to(greenTrail, { width: "100%", ease: "none", duration: 1 }, 0);
            seqTl.to(layBg, { y: "0%", ease: "none", duration: 1 }, 1);
            seqTl.to(bottleImg, { rotation: -90, ease: "none", duration: 1 }, 1);
        } else {
            // PHASE 1: Full rolling animation
            seqTl.to(bottleImg, {
                x: () => window.innerWidth - (bottleImg.offsetWidth * 0.4), // move further right to compensate for transparent padding
                ease: "none",
                duration: 1
            }, 0);

            seqTl.to(greenTrail, {
                width: "100%", // Cover the entire right side area
                ease: "none",
                duration: 1
            }, 0);

            // PHASE 2: Sliding Down & Laying Horizontal
            seqTl.to(layBg, {
                y: "0%",
                ease: "none",
                duration: 1
            }, 1);

            seqTl.to(bottleImg, {
                rotation: -80, // Tilted slightly up as in the reference image
                ease: "power1.inOut",
                duration: 1
            }, 1);

            // PHASE 3: UI Reveal
            // This triggers AFTER Phase 2 is complete (at timeline position 2)
            seqTl.to(".lay-ui-element", {
                opacity: 1,
                x: 0,
                stagger: 0.4, // Increased stagger so they appear one by one
                ease: "power2.out",
                duration: 2 // Make it last longer across the scroll
            }, 2);
        }

        if (onComplete) onComplete();
    };

    if (bottleImg.complete) {
        setupSequence();
    } else {
        bottleImg.onload = setupSequence;
    }
}
// Boot
preloadImages();

// --- NEW SECTIONS ANIMATIONS ---
function initNewSections() {
    // 1. Horizontal Showcase Scroll
    const horizontalScrollTrack = document.querySelector('.horizontal-scroll-track');

    if (horizontalScrollTrack) {
        // Calculate how far we need to scroll based on track width and viewport width
        function getScrollAmount() {
            let trackWidth = horizontalScrollTrack.scrollWidth;
            return -(trackWidth - window.innerWidth + 200); // 200px buffer so we don't stop exactly at edge
        }

        const tween = gsap.to(horizontalScrollTrack, {
            x: getScrollAmount,
            ease: "none"
        });

        ScrollTrigger.create({
            trigger: ".horizontal-showcase-container",
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true
        });
    }

    // 2. Parallax Sustainability Section
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        gsap.to(parallaxBg, {
            y: "20%",
            ease: "none",
            scrollTrigger: {
                trigger: ".parallax-sustainability",
                start: "top bottom", // when the top of the trigger hits the bottom of the viewport
                end: "bottom top", // when the bottom of the trigger hits the top of the viewport
                scrub: true
            }
        });
    }
}

// Initialize the new sections dynamically to ensure proper GSAP order
// document.addEventListener("DOMContentLoaded", initNewSections);
