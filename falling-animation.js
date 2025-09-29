// Falling Text Animation with Heavy Smoke Particle Effects
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
        constructor(x, y, type = 'smoke') {
            this.x = x;
            this.y = y;

            if (type === 'smoke') {
                // Smoke particles - bigger, slower, more spread
                this.vx = (Math.random() - 0.5) * 15;
                this.vy = -(Math.random() * 5 + 2);
                this.size = Math.random() * 8 + 4;
                this.life = 1;
                this.decay = Math.random() * 0.008 + 0.003;
                this.color = Math.random() > 0.3 ? '#888' : '#bbb';
            } else {
                // Debris particles - smaller, faster
                this.vx = (Math.random() - 0.5) * 20;
                this.vy = -(Math.random() * 8 + 4);
                this.size = Math.random() * 3 + 1;
                this.life = 1;
                this.decay = Math.random() * 0.015 + 0.01;
                this.color = '#666';
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15; // gravity
            this.vx *= 0.96; // friction
            this.life -= this.decay;
            // Smoke expands as it rises
            if (this.size < 15) {
                this.size += 0.1;
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life * 0.4;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create massive impact with lots of particles
    function createImpact(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.bottom;

        // Create LOTS of smoke particles for heavy impact
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle(x, y, 'smoke'));
        }

        // Add some debris particles
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(x, y, 'debris'));
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

    // Falling animation function - coming from viewer towards screen
    function animateFall(element, delay) {
        setTimeout(() => {
            // Reset position - start HUGE (close to viewer) and outside view
            element.style.transition = 'none';
            element.style.opacity = '0';
            element.style.transform = 'scale(10) translateZ(500px)';
            element.style.filter = 'blur(10px)';

            // Force reflow
            element.offsetHeight;

            // Show element
            setTimeout(() => {
                element.style.opacity = '1';

                // Animate falling INTO the screen - scale down to normal size
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.transform = 'scale(1) translateZ(0)';
                element.style.filter = 'blur(0px)';

                // Create massive impact when landing
                setTimeout(() => {
                    createImpact(element);
                    animateParticles();
                    playImpactSound();

                    // Screen shake effect
                    document.body.style.animation = 'screenShake 0.3s';

                    // Small bounce effect after impact
                    element.style.transition = 'transform 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    element.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        element.style.transition = 'transform 0.2s ease-out';
                        element.style.transform = 'scale(1)';
                        document.body.style.animation = '';
                    }, 150);
                }, 800);
            }, 50);
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