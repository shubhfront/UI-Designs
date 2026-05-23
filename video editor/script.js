    // Configuration
    const frameCount = 220;
    const currentFrame = index => (
        `./frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
    );

    const canvas = document.getElementById("hero-lightpass");
    const context = canvas.getContext("2d");
    
    // Set internal resolution of canvas (assumes standard 16:9 timelapse footage)
    // object-fit: cover handles screen scaling perfectly
    canvas.width = 1920;
    canvas.height = 1080;

    const images = [];
    let loadedImages = 0;

    // Loading Elements
    const loadingScreen = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    const loadingBar = document.getElementById('loading-bar');

    // Preload loop
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);

        img.onload = () => {
            loadedImages++;
            const percent = Math.floor((loadedImages / frameCount) * 100);
            loadingText.innerText = `${percent}%`;
            loadingBar.style.width = `${percent}%`;
            
            // Initial draw when first image loads to prevent black flash
            if (loadedImages === 1) {
                context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
            }

            // Once all loaded, hide loading screen
            if (loadedImages === frameCount) {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        update(); // Initial update trigger
                    }, 800);
                }, 500);
            }
        };
        img.onerror = () => {
            // Failsafe increment so it doesn't get stuck if an image is missing
            loadedImages++;
        };
    }

    // Scroll Logic
    const html = document.documentElement;
    const progressBar = document.getElementById('progress-bar');
    const aboutSection = document.getElementById('about-section');
    const texts = [
        document.getElementById('text-1'),
        document.getElementById('text-2'),
        document.getElementById('text-3'),
        document.getElementById('text-4')
    ];
    const heroTimeline = document.getElementById('hero-timeline');

    function update() {
        // Calculate max scrollable area based on the hero-timeline height, not the whole body
        const maxScroll = heroTimeline.scrollHeight - window.innerHeight;
        
        // Safety bound: if not scrollable, default to 0
        const rawScrollFraction = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        
        // Clamp fraction between 0 and 1
        const scrollFraction = Math.max(0, Math.min(1, rawScrollFraction));
        
        // Calculate the corresponding frame
        const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
        
        requestAnimationFrame(() => {
            // Draw current frame
            if (images[frameIndex] && images[frameIndex].complete) {
                // Clear and draw (clear not strictly necessary for opaque jpgs, but good practice)
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
            }
            
            // --- Pseudo-3D Parallax Depth Illusion & End Transition ---
            // Scale goes from 1.0 to 1.1 across the entire scroll
            const scale = 1 + (scrollFraction * 0.1);
            // Translate Y creates a slight downward pan as if camera is rising
            const translateY = -50 + (scrollFraction * 5);
            
            // End Transition Logic: over the last 10 frames (approx scrollFraction > 0.95)
            // Fade panel in
            if (scrollFraction >= 0.95) {
                aboutSection.classList.add('visible');
                aboutSection.style.pointerEvents = 'auto';
            } else {
                aboutSection.classList.remove('visible');
                aboutSection.style.pointerEvents = 'none';
            }

            // Canvas stays centered on X, translating normally on Y
            canvas.style.transform = `translate(-50%, ${translateY}%) scale(${scale})`;
            
            // Update Top Progress Bar
            progressBar.style.width = `${scrollFraction * 100}%`;
            
            // Text Overlays Visibility Logic
            texts.forEach(t => t.style.opacity = '0');

            if (scrollFraction >= 0 && scrollFraction <= 0.15) {
                texts[0].style.opacity = '1';
            } else if (scrollFraction >= 0.25 && scrollFraction <= 0.40) {
                texts[1].style.opacity = '1';
            } else if (scrollFraction >= 0.50 && scrollFraction <= 0.65) {
                texts[2].style.opacity = '1';
            } else if (scrollFraction >= 0.70 && scrollFraction <= 0.85) {
                texts[3].style.opacity = '1';
            }
        });
    }

    // Event Listeners
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // --- Intersection Observer for Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
