/**
 * NYLUND - Grunnarbeid Drammen
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const scrollTopBtn = document.getElementById('scrollTop');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const header = document.querySelector('.header');

    // ============================================
    // Mobile Navigation
    // ============================================
    function initMobileNav() {
        if (!navToggle || !nav) return;

        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = nav.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Scroll to Top Button
    // ============================================
    function initScrollTop() {
        if (!scrollTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top on click
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Header Scroll Effect
    // ============================================
    function initHeaderScroll() {
        if (!header) return;

        let lastScrollY = window.pageYOffset;

        window.addEventListener('scroll', function() {
            const currentScrollY = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScrollY > 10) {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
            }

            lastScrollY = currentScrollY;
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Contact Form Handling
    // ============================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form elements
            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            // Validate form
            if (!validateForm(this)) {
                return;
            }

            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;

            // Collect form data
            const formData = {
                name: this.name.value.trim(),
                email: this.email.value.trim(),
                phone: this.phone.value.trim(),
                address: this.address.value.trim(),
                projectType: this.projectType.value,
                description: this.description.value.trim(),
                preferredStart: this.preferredStart.value.trim(),
                wantSiteVisit: this.siteVisit.checked
            };

            try {
                // Simulate form submission (replace with actual API call)
                await simulateFormSubmission(formData);

                // Show success message
                showFormMessage('success', 'Takk for din henvendelse! Jeg vil kontakte deg så snart som mulig, vanligvis innen én arbeidsdag.');

                // Reset form
                this.reset();

                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                // Show error message
                showFormMessage('error', 'Beklager, noe gikk galt. Vennligst prøv igjen eller ring meg direkte.');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                // Remove error state on input
                this.classList.remove('error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Check if required and empty
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Dette feltet er påkrevd';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Vennligst oppgi en gyldig e-postadresse';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Vennligst oppgi et gyldig telefonnummer';
            }
        }

        // Show error if invalid
        if (!isValid) {
            field.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = errorMessage;
            errorEl.style.cssText = 'color: #E53E3E; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
            field.parentNode.appendChild(errorEl);
        } else {
            field.classList.remove('error');
        }

        return isValid;
    }

    function showFormMessage(type, message) {
        if (!formMessage) return;

        formMessage.className = 'form-message';
        formMessage.classList.add(`form-message--${type}`);
        formMessage.textContent = message;
        formMessage.style.display = 'block';

        // Auto-hide after 10 seconds for success
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 10000);
        }
    }

    async function simulateFormSubmission(data) {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Log form data for debugging
                console.log('Form submitted:', data);

                // Simulate success (in production, this would be an API call)
                // For example, using Resend API:
                // const response = await fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });

                resolve({ success: true });
            }, 1500);
        });
    }

    // ============================================
    // Lazy Loading Images
    // ============================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');

            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ============================================
    // Animate on Scroll (Simple Implementation)
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .value-card, .why-us__item, .project-card');

        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                animationObserver.observe(el);
            });
        }
    }

    // ============================================
    // Phone Click Tracking (Analytics Ready)
    // ============================================
    function initPhoneTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Track phone click (for future analytics integration)
                console.log('Phone link clicked:', this.href);

                // Example: Google Analytics tracking
                // if (typeof gtag !== 'undefined') {
                //     gtag('event', 'click', {
                //         event_category: 'Contact',
                //         event_label: 'Phone Click'
                //     });
                // }
            });
        });
    }

    // ============================================
    // Initialize All Functions
    // ============================================
    function init() {
        initMobileNav();
        initScrollTop();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initLazyLoading();
        initScrollAnimations();
        initPhoneTracking();
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
