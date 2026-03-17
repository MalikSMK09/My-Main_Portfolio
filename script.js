document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const allLinks = document.querySelectorAll('a[href^="#"]');
    const loadingScreen = document.getElementById('loadingScreen');
    const body = document.body;
    const allSections = document.querySelectorAll('section');

    // Scroll direction tracking
    let lastScrollY = window.pageYOffset;
    let scrollTimeout;

    // Initial state - hide body content
    body.style.overflow = 'hidden';

    // Loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        body.style.overflow = '';
    }, 1800);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 80) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.92)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.style.display === 'flex';
        
        if (!isOpen) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(10, 10, 10, 0.98)';
            navLinks.style.padding = '1.5rem';
            navLinks.style.borderBottom = '1px solid var(--border)';
            navLinks.style.gap = '1rem';
        } else {
            navLinks.style.display = 'none';
        }
    });

    // Smooth scroll with loading effect for navigation links
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                this.classList.add('loading-btn');
                
                setTimeout(() => {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    this.classList.remove('loading-btn');
                    
                    if (window.innerWidth <= 700) {
                        navLinks.style.display = 'none';
                    }
                }, 300);
            }
        });
    });

    // Button loading effect for CTA buttons
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                this.classList.add('loading-btn');
                
                setTimeout(() => {
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        const navHeight = navbar.offsetHeight;
                        const targetPosition = targetSection.offsetTop - navHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                    this.classList.remove('loading-btn');
                }, 400);
            }
        });
    });

    // Scroll fade effect based on direction
    function handleScrollFade() {
        const currentScrollY = window.pageYOffset;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        const windowHeight = window.innerHeight;
        
        allSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distanceFromCenter = Math.abs(sectionCenter - windowHeight / 2);
            const maxDistance = windowHeight / 2;
            
            // More pronounced fade effect
            if (scrollDirection === 'down') {
                // Scrolling down - fade out sections above viewport
                if (rect.bottom < 0) {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(50px) scale(0.95)';
                } else if (rect.bottom < windowHeight * 0.5) {
                    // Sections partially above - fade out
                    const fadeAmount = 1 - (rect.bottom / (windowHeight * 0.5));
                    section.style.opacity = Math.max(0.1, 1 - fadeAmount * 0.7);
                    section.style.transform = `translateY(${fadeAmount * 30}px) scale(${1 - fadeAmount * 0.03})`;
                } else if (rect.top < windowHeight && rect.bottom > 0) {
                    // Current section - full visibility
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0) scale(1)';
                }
            } else {
                // Scrolling up - fade out sections below viewport
                if (rect.top > windowHeight) {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(-50px) scale(0.95)';
                } else if (rect.top > windowHeight * 0.5) {
                    // Sections partially below - fade out
                    const fadeAmount = (rect.top - windowHeight * 0.5) / (windowHeight * 0.5);
                    section.style.opacity = Math.max(0.1, 1 - fadeAmount * 0.7);
                    section.style.transform = `translateY(${-fadeAmount * 30}px) scale(${1 - fadeAmount * 0.03})`;
                } else if (rect.top < windowHeight && rect.bottom > 0) {
                    // Current section - full visibility
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0) scale(1)';
                }
            }
        });
        
        lastScrollY = currentScrollY;
        
        // Reset styles after scrolling stops
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            allSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    section.style.opacity = '1';
                }
                section.style.transform = '';
            });
        }, 200);
    }

    window.addEventListener('scroll', handleScrollFade, { passive: true });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);

    // Observe sections
    allSections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Skill bars animation
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 150);
        });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--accent)';
            } else {
                link.style.color = '';
            }
        });
    });

    // Project cards hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });
});
