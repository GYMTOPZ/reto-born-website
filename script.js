// Apple-style smooth animations

// Typewriter effect for "Emilio siempre contigo"
function initTypewriter() {
    const containerElement = document.querySelector('.typewriter-container');
    const typewriterElement = document.querySelector('.typewriter-text');
    const cursorElement = document.querySelector('.typewriter-cursor');
    if (!typewriterElement || !cursorElement) return;

    const phrases = [
        "Emilio siempre contigo",
        "\"Hola Emilio! necesito ayuda con...\"",
        "\"La rutina de hoy estuvo brutal 🔥\"",
        "\"Emilio ya se me están marcando los abs!\""
    ];

    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    // Update text while keeping cursor visible
    function updateDisplay(text) {
        typewriterElement.textContent = text;
    }

    function type() {
        const currentPhrase = phrases[currentPhraseIndex];

        if (!isDeleting) {
            // Typing
            const displayText = currentPhrase.substring(0, currentCharIndex + 1);
            updateDisplay(displayText);
            currentCharIndex++;

            if (currentCharIndex === currentPhrase.length) {
                // Finished typing, pause then start deleting
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    type();
                }, currentPhraseIndex === 0 ? 2000 : 1500); // Longer pause for main title
                return;
            }
        } else {
            // Deleting
            const displayText = currentPhrase.substring(0, currentCharIndex - 1);
            updateDisplay(displayText);
            currentCharIndex--;

            if (currentCharIndex === 0) {
                // Finished deleting, move to next phrase
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;

                // Small pause before typing next phrase
                setTimeout(() => {
                    type();
                }, 200);
                return;
            }
        }

        // Continue typing/deleting
        const typingSpeed = isDeleting ? 30 : 50; // Faster when deleting
        setTimeout(type, typingSpeed);
    }

    // Start the animation when element is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(type, 500); // Start after a small delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const titleElement = document.querySelector('.typewriter-title');
    if (titleElement) {
        observer.observe(titleElement);
    }
}

// Fade in animations on load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typewriter effect
    initTypewriter();
    // Animate hero elements
    const heroElements = document.querySelectorAll('.fade-in, .fade-in-delay');
    heroElements.forEach(el => {
        el.classList.add('visible');
    });

    // Hero CTA button animation on scroll back
    let hasScrolledPastHero = false;
    let shimmerTimeout = null;
    const heroCTA = document.getElementById('heroCTA');
    const heroSection = document.querySelector('.hero');
    const retoWord = document.getElementById('reto');
    const bornWord = document.getElementById('born');

    // Create observer for hero section
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && hasScrolledPastHero) {
                // User scrolled back to hero
                if (heroCTA) {
                    heroCTA.classList.add('visible');
                    heroCTA.classList.remove('hidden');
                }

                // Add shimmer effect when scrolling back
                if (retoWord && bornWord) {
                    // Clear any existing timeout
                    if (shimmerTimeout) {
                        clearTimeout(shimmerTimeout);
                    }

                    // Add shimmer class
                    retoWord.classList.add('shimmer');
                    bornWord.classList.add('shimmer');

                    // Remove shimmer after animation
                    shimmerTimeout = setTimeout(() => {
                        retoWord.classList.remove('shimmer');
                        bornWord.classList.remove('shimmer');
                    }, 1500);
                }
            }
        });
    }, {
        threshold: 0.5
    });

    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Track when user scrolls past hero
    window.addEventListener('scroll', () => {
        const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 0;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition > heroBottom + 100) {
            hasScrolledPastHero = true;
        }
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all scroll-fade elements
    document.querySelectorAll('.scroll-fade').forEach(element => {
        scrollObserver.observe(element);
    });

    // Interactive carousel controls
    initInteractiveCarousel();
});

// Interactive carousel with touch/mouse controls
function initInteractiveCarousel() {
    const carousel = document.querySelector('.carousel-track');
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let currentX = 0;
    let animationPaused = false;
    let autoScrollSpeed = 1; // pixels per frame
    let rafId;

    // Get current transform value
    function getCurrentTransform() {
        const style = window.getComputedStyle(carousel);
        const matrix = style.transform;
        if (matrix === 'none') return 0;
        const values = matrix.split('(')[1].split(')')[0].split(',');
        return parseFloat(values[4]) || 0;
    }

    // Auto-scroll function
    function autoScroll() {
        if (!isDown && !animationPaused) {
            currentX -= autoScrollSpeed;
            carousel.style.transform = `translateX(${currentX}px)`;

            // Reset when reaching half (for infinite loop)
            const carouselWidth = carousel.scrollWidth / 2;
            if (Math.abs(currentX) >= carouselWidth) {
                currentX = 0;
            }
        }
        rafId = requestAnimationFrame(autoScroll);
    }

    // Start auto-scroll
    currentX = getCurrentTransform();
    carousel.style.animation = 'none'; // Disable CSS animation
    autoScroll();

    // Mouse events
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX;
        scrollLeft = currentX;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX) * 2; // Multiply for faster scroll
        currentX = scrollLeft + walk;
        carousel.style.transform = `translateX(${currentX}px)`;
    });

    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX;
        scrollLeft = currentX;
    });

    carousel.addEventListener('touchend', () => {
        isDown = false;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        currentX = scrollLeft + walk;
        carousel.style.transform = `translateX(${currentX}px)`;
    });

    // Add cursor style
    carousel.style.cursor = 'grab';
}

// Smooth scrolling for any anchor links
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

// Waitlist modal functions
function openWaitlist() {
    const modal = document.getElementById('waitlistModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeWaitlist() {
    const modal = document.getElementById('waitlistModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('waitlistModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeWaitlist();
            }
        });
    }

    // Handle form submission with Supabase
    const form = document.getElementById('waitlistForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Initialize Supabase client
            const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

            // Get email from form
            const formData = new FormData(form);
            const email = formData.get('email');

            try {
                console.log('Attempting to insert email:', email);

                // Insert into waitlist table
                const { data, error } = await supabase
                    .from('waitlist')
                    .insert([
                        {
                            email: email,
                            feature: 'nutricion_inteligente',
                            user_agent: navigator.userAgent
                        }
                    ])
                    .select();

                console.log('Supabase response:', { data, error });

                if (error) {
                    if (error.code === '23505') { // Duplicate email
                        alert('¡Ya estás en la lista de espera! Te avisaremos cuando esté listo.');
                    } else {
                        console.error('Supabase error details:', error);
                        // Mostrar el error completo en el alert
                        alert('Error detallado:\n\n' + JSON.stringify(error, null, 2));
                    }
                } else {
                    console.log('Success! Data inserted:', data);
                    alert('¡Gracias! Te avisaremos cuando Nutrición Inteligente esté listo.');
                    form.reset();
                    closeWaitlist();
                }
            } catch (error) {
                console.error('Catch error:', error);
                alert('Error: ' + error.message);
            }
        });
    }
});