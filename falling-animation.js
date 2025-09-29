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

    // Debris/Rock particle class
    class Debris {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 25;
            this.vy = -(Math.random() * 12 + 8);
            this.width = Math.random() * 8 + 3;
            this.height = Math.random() * 6 + 2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.4;
            this.life = 1;
            this.decay = Math.random() * 0.01 + 0.005;
            // White/gray rocks from the white floor
            this.color = Math.random() > 0.5 ? '#e8e8e8' : '#d0d0d0';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.5; // gravity
            this.vx *= 0.98; // friction
            this.rotation += this.rotationSpeed;
            this.life -= this.decay;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            // Draw irregular rock shape
            ctx.beginPath();
            ctx.moveTo(-this.width/2, -this.height/2);
            ctx.lineTo(this.width/3, -this.height/2);
            ctx.lineTo(this.width/2, this.height/3);
            ctx.lineTo(-this.width/3, this.height/2);
            ctx.closePath();
            ctx.fill();

            // Add shadow for depth
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(-this.width/2 + 1, -this.height/2 + 1, this.width, this.height);

            ctx.restore();
        }
    }

    // Smoke particle class
    class Smoke {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = -(Math.random() * 3 + 1);
            this.size = Math.random() * 15 + 10;
            this.life = 1;
            this.decay = Math.random() * 0.006 + 0.002;
            // Gradient of smoke colors
            const smokeColors = ['rgba(150,150,150,0.4)', 'rgba(180,180,180,0.3)', 'rgba(200,200,200,0.3)', 'rgba(220,220,220,0.2)'];
            this.color = smokeColors[Math.floor(Math.random() * smokeColors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy -= 0.05; // smoke rises
            this.vx *= 0.99; // friction
            this.life -= this.decay;
            // Smoke expands as it rises
            this.size += 0.3;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life * 0.6;

            // Create gradient for more realistic smoke
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.4, this.color.replace('0.4', '0.2').replace('0.3', '0.15').replace('0.2', '0.1'));
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Dust particle class (smaller, lighter particles)
    class Dust {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 30;
            this.vy = -(Math.random() * 6 + 2);
            this.size = Math.random() * 2 + 1;
            this.life = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.color = 'rgba(200,200,200,0.6)';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2; // gravity
            this.vx *= 0.95; // friction
            this.life -= this.decay;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
            ctx.restore();
        }
    }

    // Create massive impact with lots of particles
    function createImpact(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        // Impact from the actual bottom of the letters, not below
        const y = rect.bottom - 5; // Slightly higher impact point

        // Check if mobile
        const isMobile = window.innerWidth <= 768;
        const spread = isMobile ? 30 : 40;
        const smokeSpread = isMobile ? 40 : 60;
        const dustSpread = isMobile ? 50 : 80;

        // Create debris/rocks flying from impact
        for (let i = 0; i < 20; i++) {
            particles.push(new Debris(x + (Math.random() - 0.5) * spread, y));
        }

        // Create dense smoke cloud - positioned at letter base
        for (let i = 0; i < 40; i++) {
            particles.push(new Smoke(x + (Math.random() - 0.5) * smokeSpread, y - Math.random() * 10));
        }

        // Create dust particles for extra detail
        for (let i = 0; i < 60; i++) {
            particles.push(new Dust(x + (Math.random() - 0.5) * dustSpread, y - Math.random() * 5));
        }

        // Create crater-like effect with more particles at impact point
        for (let i = 0; i < 15; i++) {
            particles.push(new Debris(x, y));
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