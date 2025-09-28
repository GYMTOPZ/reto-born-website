// Apple-style smooth animations

// Fade in animations on load
document.addEventListener('DOMContentLoaded', () => {
    // Animate hero elements
    const heroElements = document.querySelectorAll('.fade-in, .fade-in-delay');
    heroElements.forEach(el => {
        el.classList.add('visible');
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
                // Insert into waitlist table
                const { data, error } = await supabase
                    .from('waitlist')
                    .insert([
                        {
                            email: email,
                            feature: 'nutricion_inteligente',
                            user_agent: navigator.userAgent
                        }
                    ]);

                if (error) {
                    if (error.code === '23505') { // Duplicate email
                        alert('¡Ya estás en la lista de espera! Te avisaremos cuando esté listo.');
                    } else {
                        console.error('Error:', error);
                        alert('Hubo un error. Por favor intenta de nuevo.');
                    }
                } else {
                    alert('¡Gracias! Te avisaremos cuando Nutrición Inteligente esté listo.');
                    form.reset();
                    closeWaitlist();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error. Por favor intenta de nuevo.');
            }
        });
    }
});