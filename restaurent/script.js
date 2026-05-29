document.addEventListener('DOMContentLoaded', () => {
    // === CONFIGURATION ===
    const FRAME_COUNT = 250;
    const FRAME_EXTENSION = '.jpg';
    const FRAME_PREFIX = './frames/ezgif-frame-';
    
    // === ELEMENTS ===
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const loader = document.getElementById('loader');
    const liquidLoader = document.getElementById('liquid-loader');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const textOverlays = document.querySelectorAll('.text-overlay');
    const scrollContainer = document.querySelector('.scroll-container');
    const mainNav = document.getElementById('main-nav');
    
    // === STATE ===
    const images = [];
    let imagesLoaded = 0;
    let currentFrameIndex = 0;
    let isRendering = false;

    // === PRELOAD FRAMES ===
    function preloadImages() {
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            const frameNumber = i.toString().padStart(3, '0');
            const src = `${FRAME_PREFIX}${frameNumber}${FRAME_EXTENSION}`;
            
            img.onload = () => {
                imagesLoaded++;
                updateProgress();
            };
            
            img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
                imagesLoaded++; 
                updateProgress();
            };
            
            img.src = src;
            images.push(img);
        }
    }

    function updateProgress() {
        const percent = Math.floor((imagesLoaded / FRAME_COUNT) * 100);
        progressBar.style.width = `${percent}%`;
        progressText.innerText = `${percent}%`;
        
        if (imagesLoaded === FRAME_COUNT) {
            setTimeout(initApp, 500); // slight delay for visual completion
        }
    }

    // === INITIALIZE APP ===
    function initApp() {
        // Hide standard loader
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Trigger Saffron Liquid Pour animation
            liquidLoader.classList.add('drained');
            
            setTimeout(() => {
                window.addEventListener('scroll', onScroll, { passive: true });
                onScroll(); // initial trigger
            }, 500);
        }, 500);

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        if (images[0] && images[0].complete) {
            drawFrame(0);
        }

        setupMicroInteractions();
    }

    // === CANVAS RESIZE & DRAW ===
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        drawFrame(currentFrameIndex);
    }

    function drawFrame(index) {
        const img = images[index];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasRatio = canvasWidth / canvasHeight;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        } else {
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.fillRect(0, 0, canvasWidth, canvasHeight); 
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // === SCROLL LOGIC ===
    function onScroll() {
        if (!isRendering) {
            isRendering = true;
            requestAnimationFrame(updateOnScroll);
        }
    }

    function updateOnScroll() {
        const scrollTop = window.scrollY;
        
        // --- 3D Canvas Scroll Logic ---
        // Calculate max scroll for the canvas strictly based on the .scroll-container height
        const containerRect = scrollContainer.getBoundingClientRect();
        const containerHeight = scrollContainer.offsetHeight;
        // The scrollable distance within the container is its height minus viewport height
        const maxScrollCanvas = containerHeight - window.innerHeight;
        
        // Prevent division by zero and clamp progress between 0 and 1
        const scrollProgress = maxScrollCanvas > 0 ? Math.max(0, Math.min(1, scrollTop / maxScrollCanvas)) : 0;
        
        scrollProgressBar.style.width = `${scrollProgress * 100}%`;

        const targetFrameIndex = Math.min(FRAME_COUNT - 1, Math.floor(scrollProgress * FRAME_COUNT));
        
        if (targetFrameIndex !== currentFrameIndex) {
            currentFrameIndex = targetFrameIndex;
            drawFrame(currentFrameIndex);
        }

        textOverlays.forEach(overlay => {
            const start = parseFloat(overlay.getAttribute('data-start'));
            const end = parseFloat(overlay.getAttribute('data-end'));
            if (scrollProgress >= start && scrollProgress <= end) {
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
            }
        });

        // --- Sticky Nav Logic ---
        if (scrollTop > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        isRendering = false;
    }

    // === MICRO-INTERACTIONS & NEW FEATURES ===
    function setupMicroInteractions() {
        // Custom Cursor logic
        const customCursor = document.getElementById('custom-cursor');
        const hoverTriggers = document.querySelectorAll('.hover-trigger, a, button, select, input');
        
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });

        hoverTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => customCursor.classList.add('cursor-hover'));
            trigger.addEventListener('mouseleave', () => customCursor.classList.remove('cursor-hover'));
        });

        // Intersection Observer for Ink Bleed reveals
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // only reveal once
                }
            });
        }, observerOptions);

        document.querySelectorAll('.ink-reveal').forEach(el => observer.observe(el));

        // Form Submission Simulation
        const form = document.getElementById('reservation-form');
        const formSuccess = document.querySelector('.form-success');
        
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                form.style.display = 'none';
                formSuccess.style.display = 'block';
            });
        }
    }

    // === START PROCESS ===
    preloadImages();
});
