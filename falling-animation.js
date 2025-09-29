// Falling Text Animation with Particle Effects
function initFallingAnimation() {
    const reto = document.getElementById('reto');
    const born = document.getElementById('born');
    const subtitle = document.querySelector('.hero-subtitle');
    const canvas = document.getElementById('smoke-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle system
    const particles = [];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = -(Math.random() * 3 + 1);
            this.size = Math.random() * 3 + 1;
            this.life = 1;
            this.decay = Math.random() * 0.01 + 0.005;
            this.color = Math.random() > 0.5 ? '#999' : '#ddd';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.1; // gravity
            this.vx *= 0.98; // friction
            this.life -= this.decay;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life * 0.3;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create impact particles
    function createImpact(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.bottom;

        // Create many particles for impact effect
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle(x, y));
        }
    }

    // Animate particles
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            particle.draw(ctx);

            if (particle.life <= 0) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            requestAnimationFrame(animateParticles);
        }
    }

    // Create impact sound effect
    function playImpactSound() {
        // Create a simple impact sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create a low frequency thump
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.frequency.value = 40; // Low frequency for impact
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    // Falling animation function
    function animateFall(element, delay) {
        setTimeout(() => {
            // Reset position
            element.style.transition = 'none';
            element.style.opacity = '1';
            element.style.transform = 'translateY(-100vh)';

            // Force reflow
            element.offsetHeight;

            // Animate fall
            element.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.transform = 'translateY(0)';

            // Create impact when landing
            setTimeout(() => {
                createImpact(element);
                animateParticles();
                playImpactSound();

                // Small bounce effect
                element.style.transition = 'transform 0.15s ease-out';
                element.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    element.style.transform = 'translateY(0)';
                }, 150);
            }, 600);
        }, delay);
    }

    // Start animations
    animateFall(reto, 300);  // RETO falls first
    animateFall(born, 900);  // BORN falls after

    // Show subtitle with breathing effect
    setTimeout(() => {
        subtitle.style.transition = 'all 0.8s ease-out';
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'scale(1)';

        // Add breathing class after subtitle appears
        setTimeout(() => {
            subtitle.classList.add('breathing');
        }, 800);
    }, 1800);

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initFallingAnimation();
});