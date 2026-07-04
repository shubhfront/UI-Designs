// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

function initHeroFlip() {
    // Ensure the initial properties are set
    gsap.set(".card-inner", { rotateY: 0 });
    gsap.set(".card-container", { zIndex: 10 }); // Start in front of text

    // Create a GSAP timeline for the synchronous animation
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top", // Start pinning and animation when hero hits the top of viewport
            end: "+=150%", // Generous scroll distance for a smooth, slow flip
            pin: true, // Pin the section in place while animating
            scrub: 1, // Smooth scrub effect
            markers: false 
        }
    });

    // Animate the card flipping (total duration 1 for easy half-way calculation)
    tl.to(".card-inner", {
        rotateY: 180, // Flip to the back face
        duration: 1,
        ease: "none"
    }, 0);

    // Exactly halfway through the flip (when card is perfectly edge-on at 90deg), swap z-index
    tl.set(".card-container", {
        zIndex: 0 // Drop behind the text (which is z-index 5)
    }, 0.5);
}

function initHorizontalSequence() {
    let track = document.querySelector(".horizontal-track");
    if (!track) return;

    let getScrollAmount = () => track.scrollWidth - window.innerWidth;

    let seqTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".horizontal-sequence",
            start: "top top",
            // Pin duration covers dip, slide 1, tap, slide 2
            end: () => "+=" + (getScrollAmount() + window.innerHeight * 3), 
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    // 1. Panel 1: Text Fade In & Card Dip
    seqTl.fromTo(".panel-machine .machine-text", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.1, ease: "power1.out" }, 0
    );

    seqTl.fromTo(".insert-card", 
        {
            y: () => -window.innerHeight,
            rotateZ: -90,
            scale: 1.3
        },
        {
            y: 0,
            yPercent: 15,
            rotateZ: -90,
            scale: 1,
            duration: 0.2, // Takes 20% of the timeline
            ease: "power2.inOut" 
        }, 0);

    // 2. Horizontal Transition to Panel 2
    seqTl.to(track, {
        x: () => -window.innerWidth, // Slide exactly one viewport width
        ease: "power1.inOut",
        duration: 0.25 // Takes 25% of the timeline
    }, 0.2);

    // 2.5 Card slides in from left of the screen (Panel 2)
    seqTl.fromTo(".tap-card-container", 
        { x: () => -window.innerWidth / 1.5, opacity: 0 }, // Starts off-screen left
        { x: 0, opacity: 1, duration: 0.15, ease: "power2.out" }, 
        0.35 // Triggers right as the panel finishes settling
    );

    // 3. Panel 2: Tap Feedback
    let tapTime = 0.50; // Shift tap time to right after card lands
    let waveDur = 0.04;

    // Card tap pulse
    seqTl.to(".tap-card-container", { scale: 0.95, duration: 0.03, ease: "power1.inOut" }, tapTime)
         .to(".tap-card-container", { scale: 1, duration: 0.03, ease: "power1.inOut" }, tapTime + 0.03);

    // Wave 1
    seqTl.fromTo(".tap-waves .wave:nth-child(1)",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: waveDur }, tapTime)
        .to(".tap-waves .wave:nth-child(1)", { opacity: 0, duration: waveDur }, tapTime + waveDur);

    // Wave 2
    seqTl.fromTo(".tap-waves .wave:nth-child(2)",
        { scale: 0.2, opacity: 0 },
        { scale: 1, opacity: 0.8, duration: waveDur }, tapTime + 0.02)
        .to(".tap-waves .wave:nth-child(2)", { opacity: 0, duration: waveDur }, tapTime + 0.02 + waveDur);

    // Wave 3
    seqTl.fromTo(".tap-waves .wave:nth-child(3)",
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 0.6, duration: waveDur }, tapTime + 0.04)
        .to(".tap-waves .wave:nth-child(3)", { opacity: 0, duration: waveDur }, tapTime + 0.04 + waveDur);

    // 4. Horizontal Transition to Panel 3
    seqTl.to(track, {
        x: () => -getScrollAmount(), // Slide to the very end
        ease: "power1.inOut",
        duration: 0.25
    }, 0.6);

    // 5. Panel 3: Lounge Text Reveal
    seqTl.fromTo(".lounge-text", 
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.1, ease: "power1.out" }, 0.85
    );

    // 6. Plane Takeoff Animation
    seqTl.fromTo(".plane-img",
        { 
            x: () => -window.innerWidth / 1.5, 
            y: () => window.innerHeight / 1.5,
            scale: 0.3,
            opacity: 0
        },
        { 
            x: () => window.innerWidth / 1.5, 
            y: () => -window.innerHeight / 1.5, 
            scale: 1, 
            opacity: 1, 
            duration: 0.5, 
            ease: "none" 
        }, 
        0.65 
    );
}

function initCasingSequence() {
    let section = document.querySelector(".casing-section");
    if (!section) return;

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".casing-section",
            start: "top top",
            end: "+=150%", // Pin for scrolling
            pin: true,
            scrub: 1
        }
    });

    // Fade in text and case image
    tl.fromTo(".casing-text", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.3 }, 0);
    tl.fromTo(".casing-stack", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 }, 0);

    // Card appears and drops into position
    tl.fromTo(".casing-card",
        { yPercent: -150, opacity: 0 }, // Starts high up
        { yPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 0.2
    );

    // Card slides deep into the case slot without falling out
    tl.to(".casing-card", {
        yPercent: 0, 
        duration: 0.4,
        ease: "power1.inOut"
    }, 0.6);
}

// Initialize all animations after all images load so GSAP gets correct heights for scroll restoration
window.addEventListener("load", () => {
    initHeroFlip();
    initHorizontalSequence();
    initCasingSequence();
    initEliteCarousel();
    initOrderSection();
});

function initEliteCarousel() {
    const cards = Array.from(document.querySelectorAll('.elite-card'));
    if (!cards.length) return;

    const positions = [
        { left: "5%", xPercent: 0, z: -100, rotationY: 15, scale: 0.85, zIndex: 1, brightness: 0.6, boxShadow: "0 30px 60px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2)" }, // Left
        { left: "50%", xPercent: -50, z: 0, rotationY: 0, scale: 1.1, zIndex: 3, brightness: 1, boxShadow: "0 40px 80px rgba(198, 163, 96, 0.15), inset 0 1px 1px rgba(255,255,255,0.3)" }, // Center
        { left: "95%", xPercent: -100, z: -100, rotationY: -15, scale: 0.85, zIndex: 1, brightness: 0.6, boxShadow: "0 30px 60px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2)" } // Right
    ];

    // For responsive layout on mobile, the left/right positioning needs to be adjusted in JS too
    // But GSAP will use the values provided. To be robust, we'll use GSAP media queries or just stick to standard
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
        positions[0].left = "0%";
        positions[2].left = "100%";
    }

    // Initialize positions via GSAP
    cards.forEach((card, i) => {
        gsap.set(card, {
            left: positions[i].left,
            xPercent: positions[i].xPercent,
            z: positions[i].z,
            rotationY: positions[i].rotationY,
            scale: positions[i].scale,
            zIndex: positions[i].zIndex,
            filter: `brightness(${positions[i].brightness})`,
            boxShadow: positions[i].boxShadow
        });
    });

    let currentOrder = [0, 1, 2];

    function updateCarousel(direction) {
        if (direction === -1) {
            // Shift left
            currentOrder.push(currentOrder.shift());
        } else {
            // Shift right
            currentOrder.unshift(currentOrder.pop());
        }

        cards.forEach((card, i) => {
            const posIndex = currentOrder.indexOf(i);
            const pos = positions[posIndex];
            
            if (posIndex === 1) card.classList.add('active');
            else card.classList.remove('active');

            gsap.to(card, {
                left: pos.left,
                xPercent: pos.xPercent,
                z: pos.z,
                rotationY: pos.rotationY,
                scale: pos.scale,
                zIndex: pos.zIndex,
                filter: `brightness(${pos.brightness})`,
                boxShadow: pos.boxShadow,
                duration: 0.6,
                ease: "power2.inOut"
            });
        });
    }

    const btnLeft = document.getElementById('eliteBtnLeft');
    const btnRight = document.getElementById('eliteBtnRight');
    
    if(btnLeft) btnLeft.addEventListener('click', () => updateCarousel(-1));
    if(btnRight) btnRight.addEventListener('click', () => updateCarousel(1));
}

function initOrderSection() {
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".order-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    tl.fromTo(".order-visual", 
        { opacity: 0, x: -50 }, 
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
    );

    tl.fromTo(".order-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");
    tl.fromTo(".order-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    tl.fromTo(".input-group", 
        { opacity: 0, x: 50 }, 
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }, 
        "-=0.2"
    );
    tl.fromTo(".order-submit-btn", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.1");
}
