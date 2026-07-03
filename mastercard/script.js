// Initialize Icons
        lucide.createIcons();

        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Initialize Lenis Smooth Scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Navbar Scroll Effect
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Setup MatchMedia for responsive animations
        let mm = gsap.matchMedia();

        // --- Global Animations (All screen sizes) ---
        
        // Hero Entrance
        gsap.to('.hero-content', { opacity: 1, duration: 1, delay: 0.2 });
        gsap.fromTo('.hero-card-wrapper', 
            { opacity: 0, scale: 0.5, rotation: -15, yPercent: 20 },
            { opacity: 1, scale: 1, rotation: 0, yPercent: 0, duration: 1.5, ease: "power4.out", delay: 0.2 }
        );

        // General Fade Ups
        gsap.utils.toArray('.fade-up').forEach(elem => {
            gsap.fromTo(elem, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Reward Counters
        gsap.utils.toArray('.counter').forEach(counter => {
            let target = parseFloat(counter.getAttribute('data-target'));
            ScrollTrigger.create({
                trigger: counter,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: target % 1 !== 0 ? 0.1 : 1 },
                        ease: "power2.out"
                    });
                },
                once: true
            });
        });

        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-q');
            const answer = item.querySelector('.faq-a');
            const inner = item.querySelector('.faq-a-inner');
            
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    gsap.to(i.querySelector('.faq-a'), { height: 0, duration: 0.3, ease: "power2.inOut" });
                });

                // Open clicked if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    gsap.to(answer, { height: inner.offsetHeight, duration: 0.3, ease: "power2.inOut" });
                }
            });
        });

        // Testimonial Marquee (Infinite loop)
        const track = document.getElementById('testimonial-track');
        if(track) {
            // Clone items to make it seamless
            const cards = track.innerHTML;
            track.innerHTML += cards;
            
            // Simple CSS-like continuous translation
            gsap.to(track, {
                xPercent: -50, // Move by exactly half (since we doubled content)
                ease: "none",
                duration: 20,
                repeat: -1
            });
        }

        // --- Desktop Only Animations (Pinned Sequences) ---
        mm.add("(min-width: 769px)", () => {
            
            // Sequence 1: Rotation
            let tl1 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#rotation-spacer",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1 // smooth scrubbing
                }
            });

            // Phase A: 0 -> 90
            tl1.to("#seq1-card", { rotationY: 90, ease: "none", duration: 1 })
               // Show label 1
               .to(".r-label-1", { opacity: 1, duration: 0.2 }, 0.4)
               .to(".r-label-1", { opacity: 0, duration: 0.2 }, 0.8)
               // Swap z-index/opacity at 90 deg so back shows correctly if needed
               // Note: preserve-3d and backface-visibility usually handle this natively if structure is right.
               // Phase B: 90 -> 180
               .to("#seq1-card", { rotationY: 180, ease: "none", duration: 1 })
               .to(".r-label-2", { opacity: 1, duration: 0.2 }, 1.4)
               .to(".r-label-2", { opacity: 0, duration: 0.2 }, 1.8)
               // Phase C: 180 -> 360 (or 0)
               .to("#seq1-card", { rotationY: 360, ease: "none", duration: 1 })
               .to(".r-label-3", { opacity: 1, duration: 0.2 }, 2.4);

            
            // Sequence 2: Features
            let tl2 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#feature-spacer",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1
                }
            });

            // Card moves left and tilts
            tl2.to("#seq2-card", {
                x: "-25vw",
                scale: 0.9,
                rotationY: 15,
                rotationX: 5,
                ease: "power1.inOut",
                duration: 0.5
            });

            // Stagger feature items
            const features = gsap.utils.toArray('.feature-item');
            features.forEach((item, i) => {
                let startPos = 0.5 + (i * 0.5);
                
                // Animate line
                tl2.to(item.querySelector('.feature-line'), { scaleX: 1, duration: 0.2 }, startPos);
                
                // Animate text block in
                tl2.to(item, { opacity: 1, y: 0, duration: 0.3 }, startPos);
                
                // If not last, animate out when next comes in
                if (i < features.length - 1) {
                    tl2.to(item, { opacity: 0, y: -40, duration: 0.3 }, startPos + 0.4);
                }
            });

            // Sequence 3: Mastercard Reveal
            let tl3 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#mc-reveal-spacer",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1
                }
            });

            tl3.to(".mc-logo-text", { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.out" }, 0)
               .to(".mc-red", { x: "-35vw", ease: "power1.inOut", duration: 1 }, 0)
               .to(".mc-orange", { x: "35vw", ease: "power1.inOut", duration: 1 }, 0)
               .to(".mc-content-wrapper", { opacity: 1, scale: 1, pointerEvents: "auto", ease: "power2.out", duration: 0.7 }, 0.3);

            // Timeline SVG Drawing
            gsap.to(".progress-line", {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".timeline-section",
                    start: "top center",
                    end: "bottom center",
                    scrub: true,
                    onUpdate: (self) => {
                        // Highlight steps based on progress
                        const prog = self.progress;
                        document.querySelector('.step-1').classList.toggle('active', prog > 0.1);
                        document.querySelector('.step-2').classList.toggle('active', prog > 0.5);
                        document.querySelector('.step-3').classList.toggle('active', prog > 0.9);
                    }
                }
            });

        });