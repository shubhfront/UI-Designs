window.addEventListener('load', () => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const flyingTooth = document.getElementById("flying-tooth");

    const tl = gsap.timeline();

    if (prefersReducedMotion) {
        gsap.set('.hero-wordmark', { opacity: 0.12, scale: 1 });
        gsap.set(flyingTooth, { opacity: 1, rotation: -4, xPercent: -50, yPercent: -50 });
    } else {
        gsap.set('.hero-wordmark', { opacity: 0, scale: 0.9 });
        gsap.set(flyingTooth, { opacity: 0, rotation: -8, xPercent: -50, yPercent: -50 });
        
        tl.to('.hero-wordmark', { opacity: 0.12, scale: 1, duration: 1.2, ease: "power2.out" }, 0)
          .to(flyingTooth, { opacity: 1, rotation: -4, duration: 1.2, ease: "power2.out" }, 0.3);

        if (!isMobile) {
            // Initial position is absolute center of Hero
            gsap.set(flyingTooth, { position: "absolute", top: "50vh", left: "50vw" });



            let masterSt;
            function initMasterScroll() {
                if (masterSt) {
                    masterSt.animation.kill();
                    masterSt.kill();
                }
                
                const masterTl = buildMasterTimeline();

                masterSt = ScrollTrigger.create({
                    trigger: document.body,
                    start: "top top",
                    end: () => {
                        const secRect = document.querySelector(".implants-section").getBoundingClientRect();
                        // Ends when bottom of implants section hits bottom of viewport
                        return "+=" + (secRect.bottom + window.scrollY - window.innerHeight);
                    },
                    animation: masterTl,
                    scrub: true,
                    invalidateOnRefresh: true
                });
            }

            function buildMasterTimeline() {
                const endMarker = document.getElementById("tooth-end-marker");
                const implantsMarker = document.getElementById("tooth-implants-marker");
                const implantsSection = document.querySelector(".implants-section");

                // Get absolute page coordinates
                const endRect = endMarker.getBoundingClientRect();
                const impRect = implantsMarker.getBoundingClientRect();
                const secRect = implantsSection.getBoundingClientRect();

                const endMarkerY = endRect.top + window.scrollY;
                const impMarkerY = impRect.top + window.scrollY;
                const secY = secRect.top + window.scrollY;
                
                const vh = window.innerHeight;

                // Scroll positions for each event
                const scroll1 = endMarkerY - (vh * 0.6); // When Phase 1 ends
                const scroll2Start = secY - vh; // When Phase 2 starts
                const scroll2End = impMarkerY - (vh * 0.45); // When Phase 2 ends
                
                // Phase 3 lasts from top top to bottom bottom of implants-section
                // The scroll distance for Phase 3 is the height of the section minus the viewport height
                const scroll3 = secRect.height - vh;

                // Durations based on pixel scroll distance
                const duration1 = Math.max(0, scroll1);
                const pauseDuration = Math.max(0, scroll2Start - scroll1);
                const duration2 = Math.max(0, scroll2End - scroll2Start);
                const duration3 = Math.max(0, scroll3);

                const master = gsap.timeline();
                
                // PHASE 1: Hero to Doctor's Hand
                master.to(flyingTooth, {
                    top: endMarkerY + "px",
                    left: endRect.left + window.scrollX + (endRect.width / 2) + "px",
                    scale: 0.15,
                    rotation: 0,
                    ease: "none",
                    duration: duration1
                })
                // PAUSE: Sticky Lock in Doctor's Hand (Tooth naturally scrolls with the page)
                .to(flyingTooth, {
                    duration: pauseDuration
                })
                // PHASE 2: Doctor's Hand to Implant Assembly
                .to(flyingTooth, {
                    top: impMarkerY + "px",
                    left: impRect.left + window.scrollX + (impRect.width / 2) + "px",
                    scale: 0.8,
                    rotation: 25,
                    ease: "none",
                    duration: duration2
                })
                // PHASE 3: Mimic Pinning by scrolling down with the viewport
                .to(flyingTooth, {
                    top: "+=" + duration3 + "px",
                    ease: "none",
                    duration: duration3
                });

                return master;
            }

            initMasterScroll();
            
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(initMasterScroll, 250);
            });


            // PHASE 3: Section 3 Pinned Exploded Sequence
            const tlImplants = gsap.timeline({
                scrollTrigger: {
                    trigger: ".implants-section",
                    start: "top top",
                    end: "bottom bottom",
                    pin: ".implants-stage",
                    scrub: true,
                }
            });

            tlImplants.addLabel("explode")
                // Crown (flyingTooth) moves up and right
                .to(flyingTooth, { y: "-=180", x: "+=84", duration: 1.5 }, "explode")
                // Abutment stays mostly fixed
                .to("#implant-abutment", { y: "+=10", x: "-=5", duration: 1.5 }, "explode+=0.1")
                // Fixture moves down and left
                .to("#implant-fixture", { y: "+=200", x: "-=93", duration: 1.5 }, "explode+=0.2")
                
                .addLabel("labels")
                .to(".implant-label", { opacity: 1, stagger: 0.1, duration: 0.8 }, "labels")
                .to(".implant-info-block", { opacity: 1, duration: 0.8 }, "labels+=0.2");
        }
    }
});
