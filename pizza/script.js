gsap.registerPlugin(ScrollTrigger);

let masterTl;
let textTriggers = [];

function buildAnimations() {
    // 1. Clean up existing timelines and triggers
    if (masterTl) {
        masterTl.scrollTrigger && masterTl.scrollTrigger.kill();
        masterTl.kill();
    }
    textTriggers.forEach(st => st.kill());
    textTriggers = [];
    
    // Reset properties to capture clean CSS baseline measurements
    gsap.set('.pizza-container', { clearProps: "all" });
    gsap.set('.content-left h2, .content-left p, .cta-button, .pizza-card, .chef-image-wrapper, .chef-content, .chef-container > div, .content-left', { clearProps: "all" });

    // 2. Select Elements
    const pizza = document.querySelector('.pizza-container');
    const craftSection = document.querySelector('.craft-section');
    const gallerySection = document.querySelector('.gallery-section');
    const chefSection = document.querySelector('.chef-section');
    
    const craftTarget = document.querySelector('.pizza-target-craft');
    const galleryTarget = document.querySelector('.empty-slot');
    const chefTarget = document.querySelector('.chef-pizza-target');
    
    if (!pizza || !craftTarget || !galleryTarget || !chefTarget) return;

    // 3. Baseline metrics
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pizzaRect = pizza.getBoundingClientRect(); 
    const pizzaCenter = { 
        x: pizzaRect.left + pizzaRect.width / 2, 
        y: pizzaRect.top + pizzaRect.height / 2 
    }; 
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Calculate the necessary GSAP x/y transforms to map the fixed pizza to a moving target
    function calcTargetOffset(targetEl, sectionY) {
        const rect = targetEl.getBoundingClientRect();
        
        // Document coordinates of the target
        const docX = rect.left;
        const docY = rect.top + scrollTop;
        
        // Viewport coordinates of the target WHEN its section is at the top of the viewport (scrollY = sectionY)
        const targetVPX = docX;
        const targetVPY = docY - sectionY;
        
        const targetCenterX = targetVPX + rect.width / 2;
        const targetCenterY = targetVPY + rect.height / 2;
        
        // GSAP translates from the pizza's fixed center (which is 50vw, 50vh due to CSS)
        const xOffset = targetCenterX - pizzaCenter.x;
        const yOffset = targetCenterY - pizzaCenter.y;
        
        let scale = rect.width / pizzaRect.width;
        
        return { x: xOffset, y: yOffset, scale: scale };
    }
    
    // 4. Calculate Keyframe Checkpoints (Scroll pixel depths)
    const Y1 = craftSection.getBoundingClientRect().top + scrollTop;
    const Y2 = gallerySection.getBoundingClientRect().top + scrollTop;
    const Y3 = chefSection.getBoundingClientRect().top + scrollTop;
    
    const pos1 = calcTargetOffset(craftTarget, Y1);
    const pos2 = calcTargetOffset(galleryTarget, Y2);
    const pos3 = calcTargetOffset(chefTarget, Y3);
    
    // Fine-tune Gallery scale to match the 95% static pizza sizing
    pos2.scale *= 0.95;
    
    // Calculate total possible scroll on the page
    const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);

    // 5. Build Master Timeline mapped to total absolute scroll
    masterTl = gsap.timeline({
        scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: 1
        }
    });
    
    // [Section 1 -> 2] Home to Craft
    masterTl.to(pizza, {
        x: pos1.x,
        y: pos1.y,
        scale: pos1.scale,
        rotation: 60,
        ease: "none",
        duration: Y1 // GSAP timeline duration scales automatically; absolute time mappings equal absolute scroll depths
    }, 0);
    
    // [Section 2 -> 3] Craft to Gallery
    masterTl.to(pizza, {
        x: pos2.x,
        y: pos2.y,
        scale: pos2.scale,
        rotation: 360,
        ease: "none",
        duration: Y2 - Y1
    }, Y1);
    
    // [Section 3 -> 4] Gallery to Chef
    masterTl.to(pizza, {
        x: pos3.x,
        y: pos3.y,
        scale: pos3.scale,
        rotation: 720,
        ease: "none",
        duration: Y3 - Y2
    }, Y2);
    
    // [Section 4 Hold] If user scrolls past Y3, move pizza up synchronously so it stays pinned to the chef's hands
    if (maxScroll > Y3) {
        masterTl.to(pizza, {
            y: pos3.y - (maxScroll - Y3),
            ease: "none",
            duration: maxScroll - Y3
        }, Y3);
    }
    
    // 6. Build Text and Content Animations
    function createAnim(target, vars) {
        let elements = document.querySelectorAll(target);
        if(elements.length === 0) return;
        let tween = gsap.from(target, vars);
        if(tween.scrollTrigger) textTriggers.push(tween.scrollTrigger);
    }
    
    let isMobile = window.innerWidth <= 768;

    if (isMobile) {
        createAnim('.content-left', {
            scrollTrigger: { trigger: '.craft-section', start: 'top 50%', end: 'top top', scrub: 1 },
            y: 30, opacity: 0, ease: "power1.out"
        });
        createAnim('.pizza-card', {
            scrollTrigger: { trigger: '.gallery-section', start: 'top 80%', end: 'top 30%', scrub: 1 },
            y: 40, opacity: 0, stagger: 0.15, ease: "power2.out"
        });
        createAnim('.chef-container > div', {
            scrollTrigger: { trigger: '.chef-section', start: 'top 80%', end: 'top 30%', scrub: 1 },
            y: 40, opacity: 0, stagger: 0.2, ease: "power2.out"
        });
    } else {
        createAnim('.content-left h2', {
            scrollTrigger: { trigger: '.craft-section', start: 'top 75%', end: 'top 25%', scrub: 1 },
            y: 50, opacity: 0, ease: "power2.out"
        });
        createAnim('.content-left p', {
            scrollTrigger: { trigger: '.craft-section', start: 'top 70%', end: 'top 20%', scrub: 1 },
            y: 30, opacity: 0, ease: "power2.out"
        });
        createAnim('.cta-button', {
            scrollTrigger: { trigger: '.craft-section', start: 'top 65%', end: 'top 15%', scrub: 1 },
            y: 20, opacity: 0, scale: 0.9, ease: "back.out(1.7)"
        });
        createAnim('.pizza-card', {
            scrollTrigger: { trigger: '.gallery-section', start: 'top 60%', end: 'top 20%', scrub: 1 },
            y: 60, opacity: 0, stagger: 0.2, ease: "power2.out"
        });
        createAnim('.chef-image-wrapper', {
            scrollTrigger: { trigger: '.chef-section', start: 'top 70%', end: 'top 30%', scrub: 1 },
            y: 50, opacity: 0, ease: "power2.out"
        });
        createAnim('.chef-content', {
            scrollTrigger: { trigger: '.chef-section', start: 'top 60%', end: 'top 20%', scrub: 1 },
            x: 50, opacity: 0, ease: "power2.out"
        });
    }
    
    // Refresh ScrollTrigger to ensure all calculations are applied
    ScrollTrigger.refresh();
}

// Ensure DOM and all assets (images) are loaded so heights are correct
window.addEventListener('load', buildAnimations);

// Handle window resizing to recalibrate coordinates
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildAnimations, 150);
});
