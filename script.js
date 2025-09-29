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
    const heroCTA = document.getElementById('heroCTA');
    const heroSection = document.querySelector('.hero');

    // Create observer for hero section
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && hasScrolledPastHero) {
                // User scrolled back to hero
                if (heroCTA) {
                    heroCTA.classList.add('visible');
                    heroCTA.classList.remove('hidden');
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

    // Start carousel animation when community section is in view
    const communitySection = document.querySelector('.community-section');
    if (communitySection) {
        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const carousel = entry.target.querySelector('.before-after-carousel');
                    const subtitle = entry.target.querySelector('.slide-out-left');
                    if (carousel) {
                        carousel.style.opacity = '1';
                    }
                    if (subtitle) {
                        subtitle.classList.add('animate');
                    }
                }
            });
        }, { threshold: 0.3 });

        carouselObserver.observe(communitySection);
    }
});

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