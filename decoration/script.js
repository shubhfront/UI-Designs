document.addEventListener('DOMContentLoaded', () => {
    const decorateBtn = document.getElementById('decorate-btn');
    const heroSection = document.getElementById('hero');

    decorateBtn.addEventListener('click', () => {
        heroSection.classList.toggle('show-deco');
        
        if (heroSection.classList.contains('show-deco')) {
            decorateBtn.textContent = 'Revert';
        } else {
            decorateBtn.textContent = 'Decorate';
        }
    });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // Check local storage for preference
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-theme');
            themeToggleBtn.textContent = '🌙';
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = '🌙';
            } else {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = '☀️';
            }
        });
    }

    // Navbar Scroll Behavior
    const navbar = document.querySelector('.navbar');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('at-top');
        } else {
            navbar.classList.add('at-top');
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init on load

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Intersection Observer for animations and counters
    const fadeElements = document.querySelectorAll('.fade-up');
    let hasCounted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Check if it's the stats section
                if (entry.target.id === 'stats' && !hasCounted) {
                    startCounters();
                    hasCounted = true;
                }
            }
        });
    }, {
        threshold: 0.15
    });

    fadeElements.forEach(el => observer.observe(el));

    // Stats Counter
    function startCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 100; 

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = Math.max(1, target / speed);

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // Testimonials Carousel
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const cards = document.querySelectorAll('.testimonial-card');
    
    let currentIndex = 0;
    let carouselInterval;

    function updateCarousel() {
        if(cards.length === 0) return;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    }

    if(track && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        function startInterval() {
            carouselInterval = setInterval(nextSlide, 4000);
        }

        function resetInterval() {
            clearInterval(carouselInterval);
            startInterval();
        }

        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
        carouselContainer.addEventListener('mouseleave', startInterval);

        startInterval();
    }

    // Project Modal Logic
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const beforeAfterBtn = document.getElementById('before-after-btn');

    let currentBeforeSrc = '';
    let currentAfterSrc = '';

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            currentBeforeSrc = item.getAttribute('data-before');
            currentAfterSrc = item.getAttribute('data-after');

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            
            // Default to 'After' view
            modalImage.src = currentAfterSrc;
            beforeAfterBtn.textContent = 'Before';

            modal.classList.add('show');
        });
    });

    beforeAfterBtn.addEventListener('click', () => {
        if (beforeAfterBtn.textContent === 'Before') {
            modalImage.src = currentBeforeSrc;
            beforeAfterBtn.textContent = 'After';
        } else {
            modalImage.src = currentAfterSrc;
            beforeAfterBtn.textContent = 'Before';
        }
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    // SPA Routing Logic for Services
    const serviceData = {
        'interior-design': {
            title: 'Interior Design',
            heroBg: 'images/interior_design_hero.jpg',
            detailImg: 'images/interior_design_detail.jpg',
            overview: 'Our comprehensive interior design service transforms your vision into reality. We handle everything from conceptualization to the final styling, ensuring every element in your space is meticulously curated to reflect your unique lifestyle and taste.',
            features: [
                'Initial consultation and concept development',
                'Mood boards and 3D rendering',
                'Custom furniture and fabric selection',
                'Full project management and installation'
            ]
        },
        'space-planning': {
            title: 'Space Planning',
            heroBg: 'images/space_planning_hero.jpg',
            detailImg: 'images/space_planning_detail.jpg',
            overview: 'Maximize the potential of your environment. Our space planning experts analyze your layout to optimize flow, functionality, and spatial harmony, ensuring every square foot is utilized elegantly and efficiently.',
            features: [
                'Detailed floor plan analysis',
                'Traffic flow optimization',
                'Furniture layout and scaling',
                'Architectural modification consulting'
            ]
        },
        'decor-consulting': {
            title: 'Décor Consulting',
            heroBg: 'images/project6.jpg',
            detailImg: 'images/project2.jpg',
            overview: 'Elevate your existing space with expert finishing touches. We provide specialized advice on selecting the perfect artwork, accessories, and accent pieces that bring cohesive luxury and character to your home.',
            features: [
                'Art curation and placement',
                'Accessory and styling recommendations',
                'Color palette refinement',
                'Personal shopping services'
            ]
        }
    };

    const exploreBtns = document.querySelectorAll('.explore-service-btn');
    const homeView = document.getElementById('home-view');
    const serviceView = document.getElementById('service-view');
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    const navHomeLink = document.querySelector('.nav-links a[href="#"]');

    const serviceHeroBg = document.getElementById('service-hero-bg');
    const serviceTitle = document.getElementById('service-title');
    const serviceOverview = document.getElementById('service-overview');
    const serviceFeatures = document.getElementById('service-features');
    const serviceDetailImg = document.getElementById('service-detail-img');

    let savedScrollPosition = 0;

    exploreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceKey = btn.getAttribute('data-service');
            const data = serviceData[serviceKey];
            
            if (data) {
                // Populate data
                serviceHeroBg.style.backgroundImage = `url('${data.heroBg}')`;
                serviceTitle.textContent = data.title;
                serviceOverview.textContent = data.overview;
                serviceDetailImg.src = data.detailImg;
                
                // Populate features
                serviceFeatures.innerHTML = '';
                data.features.forEach(feat => {
                    const li = document.createElement('li');
                    li.textContent = feat;
                    serviceFeatures.appendChild(li);
                });

                // Save scroll position
                savedScrollPosition = window.scrollY || document.documentElement.scrollTop;

                // Transition views
                homeView.style.opacity = '0';
                setTimeout(() => {
                    homeView.style.display = 'none';
                    serviceView.style.display = 'block';
                    
                    // Force scroll to top
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    
                    setTimeout(() => {
                        serviceView.style.opacity = '1';
                    }, 50);
                }, 400);
            }
        });
    });

    function goHome(e) {
        if(e) e.preventDefault();
        serviceView.style.opacity = '0';
        setTimeout(() => {
            serviceView.style.display = 'none';
            homeView.style.display = 'block';
            
            // Restore scroll position
            window.scrollTo({ top: savedScrollPosition, left: 0, behavior: 'instant' });
            
            setTimeout(() => {
                homeView.style.opacity = '1';
            }, 50);
        }, 400);
    }

    backToHomeBtn.addEventListener('click', goHome);
    if(navHomeLink) {
        navHomeLink.addEventListener('click', (e) => {
            if(serviceView.style.display === 'block') {
                goHome(e);
            }
        });
    }
});
