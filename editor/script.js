gsap.registerPlugin(ScrollTrigger);

// Initial reveals
const slideIns = document.querySelectorAll('.slide-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

slideIns.forEach(el => observer.observe(el));

// Hero Scroll effect
gsap.to('.hero h1', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 150,
    opacity: 0,
    scale: 0.9
});

// Antigravity Software Skills Animation
const softwareSection = document.querySelector('.software-skills');
const orbitalRing = document.querySelector('.orbital-ring');
const skillItems = document.querySelectorAll('.skill-item');
const activeLabel = document.querySelector('.active-skill-label');
const textWrapper = document.querySelector('.text-wrapper');
const numItems = skillItems.length;

if (softwareSection && orbitalRing) {
    // Position items along the left edge of the ring
    const startAngle = 130; // degrees
    const endAngle = 230;
    const angleStep = (endAngle - startAngle) / (numItems - 1);
    
    // We use a fixed radius for consistency, matching the CSS 120vh container
    const setRingPositions = () => {
        const ringRadius = window.innerHeight * 0.6; // 60vh
        skillItems.forEach((item, i) => {
            const angleDeg = startAngle + i * angleStep;
            const angleRad = angleDeg * (Math.PI / 180);
            gsap.set(item, {
                x: Math.cos(angleRad) * ringRadius,
                y: Math.sin(angleRad) * ringRadius,
                rotation: angleDeg - 180 // Tangential tilt
            });
        });
    };
    
    setRingPositions();
    window.addEventListener('resize', setRingPositions);

    // Create scroll animation
    const orbitTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.software-skills',
            start: 'top top',
            end: '+=200%', // Scroll for 2 screen heights
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const currentRot = gsap.getProperty(orbitalRing, "rotation");
                let closestItem = null;
                let minDist = Infinity;
                
                skillItems.forEach((item, i) => {
                    const itemBaseAngle = startAngle + i * angleStep;
                    const absoluteAngle = itemBaseAngle + currentRot;
                    // We want the item closest to 180 degrees (left-most edge)
                    const dist = Math.abs(absoluteAngle - 180);
                    if (dist < minDist) {
                        minDist = dist;
                        closestItem = item;
                    }
                });
                
                if (closestItem) {
                    // Update focus
                    skillItems.forEach(el => el.classList.remove('focused'));
                    closestItem.classList.add('focused');
                    
                    // Update label
                    const name = closestItem.getAttribute('data-name');
                    if (activeLabel.innerText !== name) {
                        activeLabel.innerText = name;
                        gsap.fromTo(activeLabel, {opacity: 0, x: -20}, {opacity: 1, x: 0, duration: 0.3, ease: "power2.out"});
                    }
                }
            }
        }
    });

    // Rotate the ring upward (negative rotation)
    orbitTl.fromTo(orbitalRing, { rotation: 50 }, { rotation: -50, ease: "none" }, 0);
    // Removed downward text scroll as per user request

    // Particle System for Nebula
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 60; i++) {
            const p = document.createElement('div');
            p.style.position = 'absolute';
            const size = Math.random() * 5 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.background = 'rgba(0, 243, 255, 0.8)';
            p.style.borderRadius = '50%';
            p.style.top = Math.random() * 100 + '%';
            p.style.left = Math.random() * 100 + '%';
            p.style.boxShadow = `0 0 ${Math.random()*15+5}px rgba(0, 243, 255, 1)`;
            particlesContainer.appendChild(p);
            
            gsap.to(p, {
                y: `-=${Math.random() * 400 + 100}`,
                x: `+=${(Math.random() - 0.5) * 150}`,
                opacity: 0,
                duration: Math.random() * 6 + 4,
                repeat: -1,
                ease: "none",
                delay: -Math.random() * 10
            });
        }
    }
}

// Card Stack Animation
const cards = gsap.utils.toArray('.card');

// Set initial states
cards.forEach((card, i) => {
    if (i !== 0) {
        gsap.set(card, { y: window.innerHeight, scale: 0.9 });
    }
});

const timeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.project-showcase',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
    }
});

cards.forEach((card, i) => {
    if (i === 0) return;
    
    // Previous card shrinks and fades slightly
    timeline.to(cards[i-1], {
        scale: 0.95 - (i * 0.02),
        y: -30 * i,
        filter: "brightness(0.3)",
        ease: "none"
    }, "step" + i);

    // Current card slides up
    timeline.to(card, {
        y: i * 30, // Stack slightly offset
        scale: 1,
        ease: "none"
    }, "step" + i);
});

// Aura Video Speed Control
const auraVid = document.getElementById('aura-vid');
if (auraVid) {
    auraVid.playbackRate = 0.5;
}

// Google Search Effect Typewriter
const typewriterText = document.getElementById('typewriter-text');
const fullText = "need pro video editor";
if (typewriterText) {
    let typeObj = { length: 0 };
    gsap.to(typeObj, {
        length: fullText.length,
        duration: 2,
        ease: "steps(" + fullText.length + ")",
        scrollTrigger: {
            trigger: '.search-effect-section',
            start: 'top 50%',
            once: true
        },
        onUpdate: () => {
            typewriterText.innerText = fullText.substring(0, Math.floor(typeObj.length));
        }
    });
}
