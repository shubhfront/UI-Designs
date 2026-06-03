import { init3D, initEarth } from './main.js';

init3D();
initEarth();

const initAnimations = () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    gsap.from('.navbar', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('.hero-text-container', { x: -50, opacity: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
    gsap.from('.hero-line-container', { scaleY: 0, opacity: 0, duration: 1, delay: 0.5, transformOrigin: 'top center', ease: 'power3.out' });
    gsap.from('.scroll-indicator', { opacity: 0, y: 20, duration: 1, delay: 1, ease: 'power3.out' });

    // Scroll Animation for Overview Section
    gsap.from('.about-section .about-header', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Scroll Animation for Experience Section Header
    gsap.from('.experience-section .about-header', {
        scrollTrigger: {
            trigger: '.experience-section',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.role-card', {
        scrollTrigger: {
            trigger: '.cards-container',
            start: 'top 85%',
        },
        x: -50, // Smoother, shorter slide
        opacity: 0,
        duration: 1, // Increased duration
        stagger: 0.15, // Smoother stagger
        ease: 'power3.out'
    });

    // Scroll Animation for Timeline Items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => {
        const isLeft = item.classList.contains('left');
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
            },
            x: isLeft ? -50 : 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Scroll Animation for Tech Balls
    gsap.from('.tech-ball', {
        scrollTrigger: {
            trigger: '.tech-section',
            start: 'top 95%',
        },
        scale: 0,
        opacity: 0,
        duration: 0.5, // Faster pop
        stagger: 0.05, // Faster stagger
        ease: 'back.out(1.7)',
        clearProps: 'all',
        onComplete: function () {
            // Adds transition class to ALL balls after GSAP animation finishes
            this.targets().forEach(el => el.classList.add('ready'));
        }
    });

    // Scroll Animation for Projects Header
    gsap.from('.projects-section .about-header', {
        scrollTrigger: {
            trigger: '.projects-section .about-header',
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Scroll Animation for Project Cards
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-container',
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Scroll Animation for Testimonials Box
    gsap.from('.testimonials-box', {
        scrollTrigger: {
            trigger: '.testimonials-section',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Scroll Animation for Testimonial Cards
    gsap.from('.testimonial-card', {
        scrollTrigger: {
            trigger: '.testimonials-container',
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Scroll Animation for Contact Form
    gsap.from('.contact-form-card', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Scroll Animation for Contact Earth
    gsap.from('.contact-earth-container', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}
