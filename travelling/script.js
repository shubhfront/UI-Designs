document.addEventListener("DOMContentLoaded", () => {
    // --- 0. PAGE LOAD OVERLAY ---
    const pageOverlay = document.getElementById('page-overlay');
    if (pageOverlay) {
        setTimeout(() => {
            pageOverlay.style.opacity = '0';
            pageOverlay.style.visibility = 'hidden';
        }, 2000);
    }

    // --- 1. CANVAS SCROLL ANIMATION ---
    const canvas = document.getElementById("scroll-canvas");
    const ctx = canvas.getContext("2d", { alpha: false }); 
    
    const loader = document.getElementById("loader");
    const loaderProgress = document.getElementById("loader-progress");
    const loaderText = document.getElementById("loader-text");
    const scrollProgressBar = document.getElementById("scroll-progress");
    const textSections = document.querySelectorAll(".text-section");

    const frameCount = 250;
    const frames = [];
    let loadedFrames = 0;
    const frameExtension = ".jpg"; 
    
    const currentFrame = index => (
        `./frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}${frameExtension}`
    );

    const preloadImages = () => {
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            
            img.onload = () => {
                loadedFrames++;
                const progress = (loadedFrames / frameCount) * 100;
                
                loaderProgress.style.width = `${progress}%`;
                loaderText.innerText = `${Math.floor(progress)}%`;
                
                if (loadedFrames === frameCount) initApp();
            };
            
            img.onerror = () => {
                loadedFrames++; 
                if (loadedFrames === frameCount) initApp();
            }
            
            frames.push(img);
        }
    };

    const initApp = () => {
        if(loader) loader.style.opacity = 0;
        setTimeout(() => {
            if(loader) loader.style.display = "none";
            resizeCanvas();
        }, 1000); 
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            renderFrame(currentFrameIndex);
        });
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(currentFrameIndex);
    };

    let currentFrameIndex = 0;

    const renderFrame = (index) => {
        const img = frames[index];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollState();
                ticking = false;
            });
            ticking = true;
        }
    };

    const updateScrollState = () => {
        const scrollTop = window.scrollY;
        const scrollContainer = document.querySelector('.scroll-container');
        
        // Fade out static hero title
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            const fadePoint = 300; 
            if (scrollTop > fadePoint) {
                heroTitle.style.opacity = '0';
            } else {
                heroTitle.style.opacity = `${1 - (scrollTop / fadePoint)}`;
            }
        }
        
        // Canvas scroll finishes exactly at the end of scroll container
        const maxScroll = scrollContainer.clientHeight - window.innerHeight;
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));

        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrollFraction * 100}%`;
        }

        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );
        
        if (frameIndex !== currentFrameIndex) {
            currentFrameIndex = frameIndex;
            renderFrame(currentFrameIndex);
        }
        
        // Change cursor color when over the orange desert background in the video
        const customCursor = document.getElementById('custom-cursor');
        if (customCursor) {
            if (scrollFraction > 0.25 && scrollFraction < 0.65) {
                customCursor.classList.add('on-orange');
            } else if (scrollFraction <= 1.0) {
                // Only remove it if we are still in the scroll container area, 
                // so it doesn't fight with the footer/brand hover states later on
                customCursor.classList.remove('on-orange');
            }
        }

        textSections.forEach(section => {
            const start = parseFloat(section.getAttribute('data-start'));
            const end = parseFloat(section.getAttribute('data-end'));

            if (scrollFraction >= start && scrollFraction <= end) {
                if (!section.classList.contains('active')) section.classList.add('active');
            } else {
                if (section.classList.contains('active')) section.classList.remove('active');
            }
        });

        // Path drawing for Process SVG based on page scroll
        const compassPath = document.querySelector('.compass-path');
        if (compassPath) {
            const processSection = document.getElementById('process');
            const rect = processSection.getBoundingClientRect();
            // Calculate how far we are into the process section
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrollPercentage = 1 - Math.max(0, Math.min(1, rect.bottom / (window.innerHeight + rect.height)));
                const drawLength = 400 * scrollPercentage; 
                compassPath.style.strokeDashoffset = 400 - drawLength;
            }
        }
    };

    preloadImages();

    // --- 2. CUSTOM AIRPLANE CURSOR ---
    const customCursor = document.getElementById('custom-cursor');
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let currentAngle = -45; // Default SVG angle

    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            customCursor.style.left = `${cursorX}px`;
            customCursor.style.top = `${cursorY}px`;

            // Calculate rotation based on movement direction
            if (Math.abs(e.movementX) > 2 || Math.abs(e.movementY) > 2) {
                const angle = Math.atan2(e.movementY, e.movementX) * (180 / Math.PI);
                // The SVG is naturally pointing top-right (-45 deg). We offset it.
                // Wait, if it points right naturally it's 0. Let's assume natural right is 0.
                // In HTML we rotated it -45 in base CSS. We'll overwrite transform here.
                
                // Keep angle smooth
                currentAngle = angle;
                const planeSvg = customCursor.querySelector('svg');
                if (planeSvg) {
                    // +45 offset because the SVG path is angled 45deg up-right
                    planeSvg.style.transform = `rotate(${currentAngle + 45}deg)`;
                }
            }
        });

        const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .ed-card, .n-hero, .n-small, .n-strip');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
        });

        // Add class to change cursor color on orange backgrounds
        const orangeSections = document.querySelectorAll('.wl-brand, .f-b-left, .btn-orange, .btn-signup');
        orangeSections.forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('on-orange'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('on-orange'));
        });
    }

    // --- 3. INTERSECTION OBSERVERS ---
    
    // A. Word Reveal (Clip-Path)
    // First, split target text into wrapped spans
    const revealTargets = document.querySelectorAll('.word-reveal-target');
    revealTargets.forEach(target => {
        const html = target.innerHTML;
        // Split by <br> or words, this is a simplified wrap
        // We will just wrap the entire innerHTML in a span to keep it simple, 
        // or wrap words. Let's wrap lines split by <br>
        const lines = html.split('<br>');
        target.innerHTML = lines.map(line => `<span>${line}</span>`).join('<br>');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.2 });

    revealTargets.forEach(el => revealObserver.observe(el));

    // B. Image Desaturation to Color
    const desaturateImages = document.querySelectorAll('.desaturate');
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.3 });
    desaturateImages.forEach(img => imgObserver.observe(img));

    // C. Animated Counters
    const counterElements = document.querySelectorAll('.counter');
    let countersAnimated = false;
    const animateCounters = () => {
        counterElements.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = counter.getAttribute('data-decimal') === 'true';
            const duration = 2500;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                // Elastic easing out
                const easeOutElastic = (x) => {
                    const c4 = (2 * Math.PI) / 3;
                    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
                }
                const currentVal = easeOutElastic(progress) * target;
                
                if (isDecimal) {
                    counter.innerText = currentVal.toFixed(1);
                } else {
                    counter.innerText = Math.floor(currentVal);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + (isDecimal && target % 1 === 0 ? '.0' : '');
                }
            };
            requestAnimationFrame(updateCounter);
        });
    };

    const statsSection = document.getElementById('brand');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // --- 4. FORM MOCK ---
    const bookingForm = document.getElementById('bookingForm');
    const formSuccess = document.getElementById('formSuccess');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formSuccess.style.display = 'block';
            bookingForm.reset();
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 6000);
        });
    }

    // --- 5. DARK MODE TOGGLE ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                darkModeToggle.innerText = '☀️';
            } else {
                darkModeToggle.innerText = '🌙';
            }
        });
    }
});
