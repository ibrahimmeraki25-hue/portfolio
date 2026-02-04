// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const contactForm = document.getElementById('contactForm');
const heroPhoto = document.querySelector('.hero-photo');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(15, 15, 35, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.backgroundColor = 'rgba(15, 15, 35, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
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

// Hero Photo Animation Enhancement
if (heroPhoto) {
    heroPhoto.addEventListener('mouseenter', () => {
        heroPhoto.style.animationPlayState = 'paused';
        heroPhoto.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    heroPhoto.addEventListener('mouseleave', () => {
        heroPhoto.style.animationPlayState = 'running';
        heroPhoto.style.transform = 'scale(1) rotate(0deg)';
    });
}

// Scroll to Projects function
function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Search functionality
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm.length > 0) {
        // Search in projects
        const projectCards = document.querySelectorAll('.project-card');
        let found = false;
        
        projectCards.forEach(card => {
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const tech = Array.from(card.querySelectorAll('.project-tech span')).map(span => span.textContent.toLowerCase()).join(' ');
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || tech.includes(searchTerm)) {
                if (!found) {
                    // Scroll to first found project
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    found = true;
                    
                    // Highlight the found project
                    card.style.border = '2px solid var(--primary-color)';
                    card.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.5)';
                    
                    setTimeout(() => {
                        card.style.border = '';
                        card.style.boxShadow = '';
                    }, 3000);
                }
            }
        });
        
        // Search in sections
        if (!found) {
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const title = section.querySelector('.section-title');
                if (title && title.textContent.toLowerCase().includes(searchTerm)) {
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    found = true;
                }
            });
        }
        
        // Clear search after searching
        searchInput.value = '';
        
        // Show notification if nothing found
        if (!found) {
            showNotification(`No results found for "${searchTerm}"`, 'info');
        }
    }
}

// Add Enter key support for search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.6';
        submitBtn.style.pointerEvents ='none';
        
        // Send data to Google Sheets
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxUxNmVTIjRAcHsUfsgjJyPdr2DsfQVmD6M1HCDy79-80I_jwUjL8HxbYX8h9PKQvfa3Q/exec';
        
        console.log('Sending to:', scriptURL);
        console.log('Data:', { name, email, message });
        
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'name': name,
                'email': email,
                'message': message
            }).toString()
        })
        .then(() => {
            console.log('Request sent successfully');
            showNotification('Message sent successfully!', 'success');
            this.reset();
        })
        .catch((error) => {
            console.error('Request failed:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
        });
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Minimal notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add minimal styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 0.95rem;
        background: ${type === 'success' ? '#8B5CF6' : type === 'error' ? '#EC4899' : '#06B6D4'};
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Enhanced About Section Reveal Animation
function revealAboutSection() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    const sectionTitle = aboutSection.querySelector('.section-title');
    const aboutText = aboutSection.querySelector('.about-text');
    const skills = aboutSection.querySelector('.skills');
    
    const sectionTop = aboutSection.offsetTop;
    const sectionHeight = aboutSection.clientHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Trigger when section is 40% visible for better UX
    const triggerPoint = sectionTop - (windowHeight * 0.4);
    
    if (scrollTop >= triggerPoint) {
        // Reveal section title with bounce effect
        if (sectionTitle && !sectionTitle.classList.contains('revealed')) {
            sectionTitle.classList.add('revealed');
        }
        
        // Reveal about text with 3D effect
        if (aboutText && !aboutText.classList.contains('revealed')) {
            setTimeout(() => {
                aboutText.classList.add('revealed');
            }, 150);
        }
        
        // Reveal skills with 3D effect
        if (skills && !skills.classList.contains('revealed')) {
            setTimeout(() => {
                skills.classList.add('revealed');
            }, 350);
        }
    }
}

// Add to scroll event listener with throttling for performance
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    revealAboutSection();
    revealOnScroll();
    ticking = false;
}

window.addEventListener('scroll', requestTick);

// Check on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(revealAboutSection, 200);
});

// Subtle scroll reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Add reveal class to elements
function addRevealClasses() {
    const elementsToReveal = [
        '.section-title',
        '.about-text p',
        '.skill-item',
        '.project-card',
        '.contact-info',
        '.contact-form',
        '.hero-photo'
    ];
    
    elementsToReveal.forEach(selector => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add('reveal');
            element.style.transitionDelay = `${index * 0.05}s`;
        });
    });
}

// Initialize reveal animations
addRevealClasses();
window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Check on load

// Subtle project card hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Skill item animation
document.querySelectorAll('.skill-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.05}s`;
    item.classList.add('reveal');
});

// Subtle typing effect for hero title
function typeWriter(element, text, speed = 120) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Subtle parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const waves = document.querySelectorAll('.wave');
    
    if (hero && heroContent && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        heroContent.style.opacity = 1 - (scrolled / 800);
        
        // Parallax for waves
        waves.forEach((wave, index) => {
            const speed = 0.5 + (index * 0.1);
            wave.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
        });
    }
});

// Lazy loading for images (if real images are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    revealOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Add loading state removal
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Press Escape to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Enhanced search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Simple search implementation (can be enhanced)
        if (searchTerm.length > 2) {
            console.log(`Searching for: ${searchTerm}`);
            // Implement actual search functionality here
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchTerm = e.target.value;
            if (searchTerm) {
                console.log(`Execute search for: ${searchTerm}`);
                // Implement search execution
            }
        }
    });
}

// Console welcome message
console.log('%c Ibrahim ALjboor AL Majali Portfolio ', 'background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; font-size: 16px; padding: 10px; border-radius: 8px;');
console.log('%c Dark, futuristic, and premium design ', 'color: #9CA3AF; font-size: 12px;');

// Analytics tracking (placeholder - replace with actual implementation)
function trackEvent(eventName, properties = {}) {
    // Replace with your analytics service
    console.log('Event tracked:', eventName, properties);
}

// Track page view
trackEvent('page_view', {
    page: window.location.pathname,
    title: document.title
});

// Track project clicks
document.querySelectorAll('.project-links a').forEach(link => {
    link.addEventListener('click', function() {
        const projectTitle = this.closest('.project-card').querySelector('.project-title').textContent;
        const linkType = this.textContent.trim();
        
        trackEvent('project_click', {
            project: projectTitle,
            link_type: linkType
        });
    });
});

// Track social media clicks
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function() {
        const platform = this.querySelector('i').className.split('-')[1];
        trackEvent('social_click', {
            platform: platform
        });
    });
});

// Floating CV Button - Show after scrolling
const cvButton = document.querySelector('.cv-button');
if (cvButton) {
    // Show button after scrolling 300px
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            cvButton.classList.add('show');
        } else {
            cvButton.classList.remove('show');
        }
    });
    
    // Track CV download clicks
    cvButton.addEventListener('click', function() {
        trackEvent('cv_download', {
            source: 'floating_button'
        });
    });
}

// Export functions for potential use by other scripts
window.PortfolioApp = {
    showNotification,
    trackEvent,
    revealOnScroll
};
