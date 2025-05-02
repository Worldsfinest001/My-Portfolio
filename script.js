// DOM Elements
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');
const loader = document.querySelector('.loader');
const form = document.getElementById('contactForm');
const messageBox = document.getElementById('message-box');
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
});

// Enhanced Text Animation
function initTextAnimation() {
    const textElement = document.querySelector('.text-animate h3');
    if (!textElement) return;

    const fullText = textElement.textContent;
    let currentText = '';
    let isDeleting = false;
    let typingSpeed = 150;
    let pauseDuration = 3000; // 3 seconds pause

    function typeWriter() {
        if (isDeleting) {
            // Deleting text
            currentText = fullText.substring(0, currentText.length - 1);
        } else {
            // Typing text
            currentText = fullText.substring(0, currentText.length + 1);
        }

        textElement.textContent = currentText;
        textElement.style.width = 'fit-content';

        if (!isDeleting && currentText === fullText) {
            // Pause at full text
            typingSpeed = pauseDuration;
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            // Pause at empty text
            typingSpeed = 500;
            isDeleting = false;
        } else {
            typingSpeed = isDeleting ? 50 : 150;
        }

        setTimeout(typeWriter, typingSpeed);
    }

    // Start the animation
    setTimeout(typeWriter, 1000);
}

// Mobile Menu Toggle with Enhanced Touch Handling
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    if (navbar.classList.contains('active')) {
        const handleOutsideClick = (e) => {
            if (!navbar.contains(e.target) && e.target !== menuIcon) {
                menuIcon.classList.remove('bx-x');
                navbar.classList.remove('active');
                document.body.classList.remove('no-scroll');
                document.removeEventListener('click', handleOutsideClick);
            }
        };
        document.addEventListener('click', handleOutsideClick);
    }
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);
});

// Active Section Highlight
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 300) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Initialize ScrollReveal if it exists
if (typeof ScrollReveal !== 'undefined') {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const origin = isMobile ? 'bottom' : 'top';
    
    ScrollReveal({
        reset: false,
        distance: isMobile ? '30px' : '80px',
        duration: 1500,
        delay: 200,
        mobile: true
    });

    ScrollReveal().reveal('.home-content, .heading', { origin });
    ScrollReveal().reveal('.home-sci, .btn-box', { origin: 'bottom' });
    ScrollReveal().reveal('.about-img, .education-box, .skills-box, .project-card', {
        origin: isMobile ? 'bottom' : 'left',
        interval: 200
    });
    ScrollReveal().reveal('.about-content, .education-content, .skills-content, .contact-info', {
        origin: isMobile ? 'bottom' : 'right',
        interval: 200
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission
if (form) {
    form.addEventListener('submit', function(e) {
        // Validate form fields
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Simple validation
        if (!name || !email || !subject || !message) {
            e.preventDefault(); // Stop submission
            showMessage('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault(); // Stop submission
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Show success message before redirect
        showMessage('Your message has been sent successfully!', 'success');
        form.reset();

        // Allow Netlify to handle the submission and redirect
        setTimeout(() => {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }, 3000); // Reset button state after 3 seconds
    });
}

function showMessage(message, type) {
    if (!messageBox) return;
    
    messageBox.style.display = 'block';
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;

    // Hide message after 5 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 5000);
}

// Animate skill bars on scroll
const animateSkills = () => {
    const skillsSection = document.querySelector('.skills');
    if (!skillsSection) return;
    
    const skillBars = document.querySelectorAll('.bar span');
    if (skillBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.parentElement.previousElementSibling.querySelector('span').textContent;
                    bar.style.width = width;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(skillsSection);
};

// Project Modal Functionality
const projectCards = document.querySelectorAll('.project-card');
const projectModal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close-modal');

function handleProjectClick(e) {
    // Prevent triggering on scroll or when clicking links
    if (e.type === 'touchstart' && (e.touches.length > 1 || e.target.tagName === 'A')) return;
    if (e.target.closest('a')) return;
    
    const card = e.currentTarget;
    const title = card.querySelector('h3').textContent;
    const imageSrc = card.querySelector('img').src;
    const description = card.querySelector('p').textContent;
    const techStack = card.querySelector('.project-tech').innerHTML;
    const link = card.querySelector('.btn-small').href;
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalImage').alt = title;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalTech').innerHTML = techStack;
    document.getElementById('modalLink').href = link;
    
    projectModal.style.display = 'block';
    document.body.classList.add('no-scroll');
}

if (projectCards.length > 0 && projectModal && closeModal) {
    projectCards.forEach(card => {
        card.addEventListener('click', handleProjectClick);
        card.addEventListener('touchstart', handleProjectClick, { passive: true });
    });

    closeModal.addEventListener('click', () => {
        projectModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });

    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });
}

// Theme Toggle
// Check for saved theme preference or use preferred color scheme
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light' || (!currentTheme && !prefersDarkScheme.matches)) {
    document.body.classList.add('light-theme');
    icon.classList.replace('bxs-moon', 'bxs-sun');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        if (isLight) {
            icon.classList.replace('bxs-moon', 'bxs-sun');
        } else {
            icon.classList.replace('bxs-sun', 'bxs-moon');
        }
    });
}

// Back to top button
const backToTopBtn = document.querySelector('.footer-iconTop a');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
}

// Image Loading
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if (lazyImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTextAnimation();
    animateSkills();

    // Enhanced mobile touch handling
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
    }
});

// Image fade on scroll
// window.onscroll = function() {
  //   const imageContainer = document.querySelector('.home-image');
    // if (!imageContainer) return;
    
    // const scrollY = window.scrollY;
    // const opacity = Math.max(1 - scrollY / 200, 0);
    // imageContainer.style.opacity = opacity;
// };
