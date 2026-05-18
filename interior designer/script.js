console.clear();

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("frame-canvas");
const context = canvas.getContext("2d");

// Ensure canvas is sized correctly to window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render(); // Re-render the current frame on resize
}
window.addEventListener("resize", resizeCanvas);

// Frame Setup
const TOTAL_FRAMES = 200;
const frames = [];
const frameData = {
    currentIndex: 0
};

// Generate image paths and load them
for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const indexStr = i.toString().padStart(3, '0');
    const img = new Image();
    // Path matches the ezgif-frame-001.jpg format found in the frames directory
    img.src = `./frames/ezgif-frame-${indexStr}.jpg`;
    frames.push(img);
}

// Draw image covering the canvas (object-fit: cover equivalent)
function render() {
    const img = frames[Math.round(frameData.currentIndex)];
    if (img && img.complete) {
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
}

// Ensure the first frame renders when it loads
frames[0].onload = render;
// Initial resize
resizeCanvas();

// Set up the main ScrollTrigger timeline
// Recommend: frames * 8px scroll per frame for smooth scrubbing
const scrollDistance = TOTAL_FRAMES * 8; 

const masterTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#main-container",
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 1, // Add slight smoothing to the scrub
        pin: true,
    }
});

// 1. Animate the frame sequence
masterTl.to(frameData, {
    currentIndex: TOTAL_FRAMES - 1,
    snap: "currentIndex", // snap to integer
    ease: "none",
    onUpdate: render,
    duration: 1 // Master timeline duration is 1 (normalized)
}, 0); 

// 2. Animate the scroll indicator (fade out in first 10% of scroll)
masterTl.to(".scroll-indicator", {
    autoAlpha: 0,
    ease: "power1.inOut",
    duration: 0.1
}, 0);

// 3. Animate Text 1 (Living Room)
// Fades out and slides up as scroll reaches 45-50%
masterTl.to("#text-1", {
    y: -100,
    autoAlpha: 0,
    ease: "power2.inOut",
    duration: 0.05
}, 0.45); // Starts at 45% of the total scroll

// 4. Animate Text 2 (Kitchen)
// Fades in and slides up from below as scroll passes 50%
masterTl.fromTo("#text-2", {
    y: 100,
    autoAlpha: 0
}, {
    y: 0,
    autoAlpha: 1,
    ease: "power2.out",
    duration: 0.05
}, 0.5); // Starts at 50% of the total scroll

// =========================================
// GALLERY FILTERING LOGIC
// =========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                // Show item with animation
                item.style.display = 'block';
                gsap.to(item, {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            } else {
                // Hide item with animation
                gsap.to(item, {
                    autoAlpha: 0,
                    scale: 0.95,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
});

// =========================================
// FORM SUBMISSION HANDLING
// =========================================
const bookingForm = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message without hiding the form
        formSuccess.style.display = 'block';
        gsap.fromTo(formSuccess, 
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
        
        // Optionally reset the form
        bookingForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            gsap.to(formSuccess, {
                autoAlpha: 0,
                duration: 0.5,
                onComplete: () => {
                    formSuccess.style.display = 'none';
                }
            });
        }, 5000);
    });
}

// =========================================
// SCROLL REVEAL ANIMATIONS FOR ALL SECTIONS
// =========================================
// Select all major elements that need a fade-in animation
const revealElements = document.querySelectorAll('.section-header, .stat-card, .founder-card, .pricing-card, .gallery-item, .timeline-step, .testimonial-card, .info-block, .booking-form-wrapper, .footer-col');

revealElements.forEach(el => {
    gsap.fromTo(el, 
        { 
            y: 40, 
            autoAlpha: 0 
        },
        {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%', // Trigger when the top of the element is 85% down the viewport
                toggleActions: 'play none none none' // Play once
            }
        }
    );
});

// Animate the about quote specifically
const aboutQuote = document.querySelector('.about-quote');
if (aboutQuote) {
    gsap.fromTo(aboutQuote,
        { x: -40, autoAlpha: 0 },
        {
            x: 0,
            autoAlpha: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: aboutQuote,
                start: 'top 80%'
            }
        }
    );
}

