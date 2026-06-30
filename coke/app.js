gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // Set initial rotation to 25 degrees
    gsap.set("#centerpiece-bottle", { rotation: 25 });

    // ==========================================
    // 1. HERO TO DETAILS (Section 1 -> Section 2)
    // ==========================================
    const tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-2",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });

    // Bottle rotates to vertical (0 deg) and scales down slightly
    tl1.to("#centerpiece-bottle", { rotation: 0, scale: 0.9, duration: 1 }, 0)
       // Hero text moves up and fades out
       .to(".hero-title", { y: -200, opacity: 0, duration: 1 }, 0)
       // Details (Left and Right) slide in
       .to(".s2-left", { x: 0, opacity: 1, duration: 1 }, 0.2)
       .to(".s2-right", { x: 0, opacity: 1, duration: 1 }, 0.2);


    // ==========================================
    // 2. DETAILS TO MOUTH FEELS (Section 2 -> Section 3)
    // ==========================================
    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-3",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });

    // Bottle maintains vertical orientation
    tl2.to("#centerpiece-bottle", { scale: 0.85, duration: 1 }, 0)
       // Fade out Section 2
       .to([".s2-left", ".s2-right"], { y: -100, opacity: 0, duration: 0.5 }, 0)
       // Mouth feels background text slides in
       .to(".s3-bg-text", { x: 0, opacity: 1, duration: 1 }, 0)
       // Section 3 Left & Right content slides in
       .to(".s3-left", { x: 0, opacity: 1, duration: 1 }, 0.2)
       .to(".s3-right", { x: 0, opacity: 1, duration: 1 }, 0.2);


    // ==========================================
    // 3. MOUTH FEELS TO SPLATS (Section 3 -> Section 4)
    // ==========================================
    const tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-4",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });

    // Bottle maintains vertical orientation
    tl3.to("#centerpiece-bottle", { scale: 0.85, duration: 1 }, 0)
       // Fade out Section 3
       .to([".s3-left", ".s3-right"], { opacity: 0, y: -50, duration: 0.5 }, 0)
       // Splats pop out with stagger
       .to(".splat", { scale: 1, opacity: 1, duration: 1, stagger: 0.2, ease: "back.out(1.5)" }, 0.3)
       // Beer glass slides in
       .to(".glass-img", { x: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.5);


    // ==========================================
    // 4. SPLATS TO LINEUP (Section 4 -> Section 5 top)
    // ==========================================
    const tl4 = gsap.timeline({
        scrollTrigger: {
            trigger: ".lineup-area",
            start: "top bottom",
            end: "bottom 75%",
            scrub: true
        }
    });

    // Bottle scales down and moves up slightly to fit lineup
    tl4.to("#centerpiece-bottle", { scale: 0.55, y: "-10vh", duration: 1 }, 0)
       // Fade out Splats and Glass
       .to([".splat", ".glass-img"], { opacity: 0, duration: 0.5 }, 0)
       // YEAR ROUND text slides up
       .to(".s5-bg-text", { y: 0, opacity: 1, duration: 1 }, 0.2)
       // Lineup items slide into place
       .to(".lineup-item", { x: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power1.out" }, 0.3);

    
    // ==========================================
    // 5. RECIPES PANEL COVER (Section 5 scrolling)
    // ==========================================
    // As the user continues scrolling through the 150vh of section 5, the recipes panel at bottom-0 will naturally scroll up.
    // We lock the bottle to the document so it scrolls naturally away with the other lineup items.
    ScrollTrigger.create({
        trigger: ".lineup-area",
        start: "bottom 75%",
        onEnter: () => {
            const container = document.getElementById("bottle-container");
            if (container) {
                container.style.position = "absolute";
                container.style.top = window.scrollY + "px";
            }
        },
        onLeaveBack: () => {
            const container = document.getElementById("bottle-container");
            if (container) {
                container.style.position = "fixed";
                container.style.top = "0px";
            }
        }
    });

});

// ==========================================
// YOUTUBE PLAYER API LOGIC
// ==========================================
let ytPlayer;
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-player', {
        videoId: '8xCqmYbXH9w',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'disablekb': 1,
            'loop': 1,
            'playlist': '8xCqmYbXH9w', // required for loop to work
            'mute': 1,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    
    // Mute toggle logic
    const muteBtn = document.getElementById('mute-toggle');
    const iconMuted = document.getElementById('icon-muted');
    const iconUnmuted = document.getElementById('icon-unmuted');
    
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (ytPlayer.isMuted()) {
                ytPlayer.unMute();
                iconMuted.classList.add('hidden');
                iconUnmuted.classList.remove('hidden');
            } else {
                ytPlayer.mute();
                iconMuted.classList.remove('hidden');
                iconUnmuted.classList.add('hidden');
            }
        });
    }
}

// ==========================================
// NAVBAR GLASSMORPHISM ON SCROLL
// ==========================================
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('glass-nav', 'py-4');
            nav.classList.remove('py-6');
        } else {
            nav.classList.remove('glass-nav', 'py-4');
            nav.classList.add('py-6');
        }
    }
});
