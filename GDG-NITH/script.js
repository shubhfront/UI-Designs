document.addEventListener("DOMContentLoaded", (event) => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll('.project-card');
    
    // We have 10 cards. The screen is 100vw wide.
    // We space them horizontally by 30vw.
    // Card 0 starts at x = 10vw.
    // Card 9 starts at x = 10 + 9*30 = 280vw (offscreen right).
    
    const spacing = 30; // vw spacing between cards
    const scrollShift = 250; // vw total shift leftwards over the scroll
    
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#projects-section",
            start: "top top",
            end: "+=300%", // 300vh of scroll distance provides a long, smooth scrub
            scrub: 1, // Smooth scrubbing
            pin: true, // Pins the section once for all cards
        }
    });

    cards.forEach((card, index) => {
        let initialX = 10 + (index * spacing);
        let targetX = initialX - scrollShift;
        
        // A dummy object to hold the tweening x coordinate
        let state = { x: initialX };
        
        tl.to(state, {
            x: targetX,
            ease: "none",
            onUpdate: () => {
                // The mathematical curve of the SVG rope: y = -0.016 * (x - 50)^2 + 60
                // This precisely matches the M 0 20 Q 50 100 100 20 quadratic bezier.
                let currentX = state.x;
                let currentY = -0.016 * Math.pow(currentX - 50, 2) + 60;
                
                // Apply exact mathematical coordinates to the DOM element
                card.style.left = `${currentX}vw`;
                card.style.top = `${currentY}vh`;
            }
        }, 0); // Insert all tweens at the start of the timeline so they run simultaneously
        
        // Initial render to prevent stacking at top-left
        let initialY = -0.016 * Math.pow(initialX - 50, 2) + 60;
        card.style.left = `${initialX}vw`;
        card.style.top = `${initialY}vh`;
    });

    // --------------------------------------------------------
    // 3D Diagonal Gallery Scroll Animation
    // --------------------------------------------------------
    const galleryTrack = document.getElementById('gallery-track');
    
    if (galleryTrack) {
        // We calculate how far the track needs to move up to reveal all 15 images.
        // The track translates vertically (Y axis). The CSS rotateZ and rotateX handle the diagonal perspective.
        
        // Wait a tiny bit for layout to settle since images might load
        setTimeout(() => {
            const trackHeight = galleryTrack.scrollHeight;
            const windowHeight = window.innerHeight;
            
            // Calculate the distance to scroll up. We add a little extra padding.
            const scrollDistance = trackHeight - windowHeight + 200; 
            
            // Calculate diagonal vector (15 degrees left of straight up)
            // As the track is rotated -15deg (Z), translating along its visual axis means moving both X and Y.
            const angleInRad = 15 * (Math.PI / 180);
            const moveX = -Math.sin(angleInRad) * scrollDistance;
            const moveY = -Math.cos(angleInRad) * scrollDistance;

            gsap.to(galleryTrack, {
                x: moveX,
                y: moveY,
                ease: "none",
                scrollTrigger: {
                    trigger: "#gallery-section",
                    start: "top top",
                    end: "+=300%", // The 400vh container allows 300vh of scrolling
                    scrub: 1, // Smooth scrub
                    pin: true,
                    invalidateOnRefresh: true
                }
            });
        }, 100); // Small timeout to ensure accurate scrollHeight calculation
    }
});
