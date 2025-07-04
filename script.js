// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

// Auto-play settings
let autoPlayInterval;
const autoPlayDelay = 5000; // 5 seconds

function showSlide(n) {
    // Reset if out of bounds
    if (n >= totalSlides) currentSlide = 0;
    if (n < 0) currentSlide = totalSlides - 1;
    
    // Update carousel position
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Add animation class to current slide content
    if (slides[currentSlide]) {
        const currentSlideElement = slides[currentSlide];
        const slideContent = currentSlideElement.querySelector('.slide-content');
        if (slideContent) {
            slideContent.style.animation = 'none';
            setTimeout(() => {
                slideContent.style.animation = '';
            }, 10);
        }
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
    resetAutoPlay();
}

function currentSlideIndicator(n) {
    currentSlide = n - 1;
    showSlide(currentSlide);
    resetAutoPlay();
}

// Auto-play functionality
function startAutoPlay() {
    if (totalSlides > 0) {
        autoPlayInterval = setInterval(() => {
            currentSlide++;
            showSlide(currentSlide);
        }, autoPlayDelay);
    }
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Handle main navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Check if it's an external link (like cras.html)
            if (href && !href.startsWith('#')) {
                // Let the browser handle the navigation normally
                return;
            }
            
            e.preventDefault();
            const targetId = href;
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Handle sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Check if it's an external link (like cras.html)
            if (href && !href.startsWith('#')) {
                // Let the browser handle the navigation normally
                return;
            }
            
            e.preventDefault();
            
            // Update active sidebar link
            sidebarLinks.forEach(l => l.classList.remove('active-unit'));
            link.classList.add('active-unit');
            
            // You can add specific functionality for each unit here
            const unitName = link.querySelector('.unit-name').textContent;
            showUnitInfo(unitName);
        });
    });
}

function showUnitInfo(unitName) {
    // This function can be expanded to show specific information for each unit
    console.log(`Showing information for: ${unitName}`);
    
    // Example: You could show a modal or update a section with unit-specific content
    // For now, we'll just update the hero section title temporarily
    const heroTitle = document.querySelector('.slide-title');
    if (heroTitle) {
        const originalTitle = heroTitle.textContent;
        
        heroTitle.textContent = `Informações sobre ${unitName}`;
        
        // Reset after 3 seconds
        setTimeout(() => {
            heroTitle.textContent = originalTitle;
        }, 3000);
    }
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Simulate form submission
                showFormSuccess();
                contactForm.reset();
            }
        });
    }
}

function validateForm(data) {
    const requiredFields = ['name', 'email', 'subject', 'message'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showFormError(`Por favor, preencha o campo ${getFieldLabel(field)}.`);
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormError('Por favor, insira um e-mail válido.');
        return false;
    }
    
    return true;
}

function getFieldLabel(field) {
    const labels = {
        'name': 'Nome',
        'email': 'E-mail',
        'subject': 'Assunto',
        'message': 'Mensagem'
    };
    return labels[field] || field;
}

function showFormSuccess() {
    const notification = createNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function showFormError(message) {
    const notification = createNotification(message, 'error');
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; margin-left: 10px; cursor: pointer;">✕</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        animation: 'slideInFromRight 0.3s ease-out',
        maxWidth: '400px'
    });
    
    return notification;
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe sections and cards
    const elementsToAnimate = document.querySelectorAll('.service-card, .stat-item, .program-card, .gallery-item');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Gallery lightbox functionality
function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
        img.style.cursor = 'pointer';
    });
}

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay" onclick="closeLightbox()">
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <button class="lightbox-close" onclick="closeLightbox()">✕</button>
            </div>
        </div>
    `;
    
    // Add lightbox styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        }
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .lightbox img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0.5rem;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel only if elements exist
    if (slides.length > 0) {
        showSlide(currentSlide);
        startAutoPlay();
        
        // Pause auto-play when user hovers over carousel
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }
    }
    
    // Initialize other features
    setupNavigation();
    setupContactForm();
    setupMobileMenu();
    setupScrollAnimations();
    setupSmoothScrolling();
    setupGalleryLightbox();
    
    // Add mobile menu styles
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        @media (max-width: 768px) {
            .nav-menu.mobile-active {
                display: flex;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--primary-blue);
                flex-direction: column;
                padding: 1rem;
                box-shadow: var(--shadow-lg);
            }
            
            .nav-menu.mobile-active .nav-list {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .mobile-menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes slideInFromRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(mobileStyles);
});

// Handle window resize
window.addEventListener('resize', function() {
    // Reset carousel position on resize
    if (slides.length > 0) {
        showSlide(currentSlide);
    }
    
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (navMenu && mobileMenuToggle) {
            navMenu.classList.remove('mobile-active');
            mobileMenuToggle.classList.remove('active');
        }
    }
});

// Keyboard navigation for carousel
document.addEventListener('keydown', function(e) {
    if (slides.length > 0) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    }
    
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Add touch/swipe support for mobile carousel
let touchStartX = 0;
let touchEndX = 0;

const carousel = document.querySelector('.carousel-container');

if (carousel) {
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            changeSlide(1);
        } else {
            // Swipe right - previous slide
            changeSlide(-1);
        }
    }
}

// Performance optimization: Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading setup if needed
// setupLazyLoading();

// Export functions for global access
window.changeSlide = changeSlide;
window.currentSlide = currentSlideIndicator;
window.closeLightbox = closeLightbox;