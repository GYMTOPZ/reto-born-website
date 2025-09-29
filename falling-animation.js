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

    // Debris/Rock particle class - Realistic concrete chunks
    class Debris {
        constructor(x, y, size = 'medium') {
            this.x = x;
            this.y = y;

            // Slower, heavier movement for realistic concrete
            this.vx = (Math.random() - 0.5) * 12; // Even slower horizontal spread
            this.vy = -(Math.random() * 6 + 3); // Less explosive upward velocity

            // Much more varied sizes for realistic concrete chunks
            const sizeMultiplier = Math.random();
            if (size === 'large') {
                this.width = Math.random() * 20 + 15;
                this.height = Math.random() * 18 + 12;
            } else if (size === 'small') {
                this.width = Math.random() * 8 + 3;
                this.height = Math.random() * 7 + 3;
            } else if (size === 'tiny') {
                this.width = Math.random() * 4 + 1;
                this.height = Math.random() * 3 + 1;
            } else {
                this.width = Math.random() * 14 + 6;
                this.height = Math.random() * 12 + 5;
            }

            // Add depth for 3D appearance
            this.depth = Math.random() * 4 + 2;

            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.15; // Even slower rotation
            this.life = 1;
            this.decay = Math.random() * 0.004 + 0.002; // Slower decay for longer visibility

            // More realistic concrete colors with variation
            const colors = [
                '#f5f5f5', '#e8e8e8', '#dedede', '#d0d0d0',
                '#c5c5c5', '#b8b8b8', '#a8a8a8', '#f0f0f0'
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];

            // Add a darker shade for depth
            const grayValue = parseInt(this.color.substring(1, 3), 16);
            const darkerGray = Math.max(grayValue - 30, 100);
            this.shadowColor = `rgb(${darkerGray}, ${darkerGray}, ${darkerGray})`;

            // Shape type for variety - more options
            this.shapeType = Math.floor(Math.random() * 5);

            // Add irregularity to shapes
            this.irregularity = [];
            for (let i = 0; i < 8; i++) {
                this.irregularity.push(Math.random() * 0.3 + 0.85);
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.8; // Heavier gravity for concrete chunks
            this.vx *= 0.94; // More air resistance
            this.rotation += this.rotationSpeed;
            this.rotationSpeed *= 0.98; // Rotation slows down
            this.life -= this.decay;
        }

        draw(ctx) {
            // Smooth fade for debris too
            const smoothLife = this.life * this.life;
            if (smoothLife < 0.01) return; // Don't render if too faint

            ctx.save();
            ctx.globalAlpha = smoothLife;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            // Draw shadow first for depth
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            this.drawShape(ctx, 3, 3, 1.1);
            ctx.fill();

            // Draw main chunk with gradient for 3D effect
            const gradient = ctx.createLinearGradient(-this.width/2, -this.height/2, this.width/2, this.height/2);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.5, this.shadowColor);
            gradient.addColorStop(1, this.color);
            ctx.fillStyle = gradient;

            ctx.beginPath();
            this.drawShape(ctx, 0, 0, 1);
            ctx.fill();

            // Add cracks and texture
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Add small crack details
            if (this.width > 10) {
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.lineWidth = 0.3;
                ctx.beginPath();
                ctx.moveTo(-this.width/4, 0);
                ctx.lineTo(this.width/4, this.height/4);
                ctx.stroke();
            }

            ctx.restore();
        }

        drawShape(ctx, offsetX, offsetY, scale) {
            const w = this.width * scale;
            const h = this.height * scale;
            const x = offsetX;
            const y = offsetY;

            if (this.shapeType === 0) {
                // Irregular rectangular chunk
                ctx.moveTo(x - w/2 * this.irregularity[0], y - h/2 * this.irregularity[1]);
                ctx.lineTo(x + w/2 * this.irregularity[2], y - h/2 * this.irregularity[3]);
                ctx.lineTo(x + w/2 * this.irregularity[4], y + h/2 * this.irregularity[5]);
                ctx.lineTo(x - w/2 * this.irregularity[6], y + h/2 * this.irregularity[7]);
            } else if (this.shapeType === 1) {
                // Sharp triangular shard
                ctx.moveTo(x - w/2, y + h/2);
                ctx.lineTo(x + w/2 * this.irregularity[0], y + h/2);
                ctx.lineTo(x + w/6 * this.irregularity[1], y - h/2);
            } else if (this.shapeType === 2) {
                // Irregular pentagon
                ctx.moveTo(x - w/2 * this.irregularity[0], y - h/3);
                ctx.lineTo(x - w/3 * this.irregularity[1], y - h/2);
                ctx.lineTo(x + w/3 * this.irregularity[2], y - h/2 * this.irregularity[3]);
                ctx.lineTo(x + w/2, y + h/4);
                ctx.lineTo(x, y + h/2 * this.irregularity[4]);
                ctx.lineTo(x - w/3, y + h/3);
            } else if (this.shapeType === 3) {
                // Jagged chunk
                ctx.moveTo(x - w/2, y);
                ctx.lineTo(x - w/3 * this.irregularity[0], y - h/2);
                ctx.lineTo(x, y - h/3 * this.irregularity[1]);
                ctx.lineTo(x + w/4, y - h/2 * this.irregularity[2]);
                ctx.lineTo(x + w/2 * this.irregularity[3], y);
                ctx.lineTo(x + w/3, y + h/2 * this.irregularity[4]);
                ctx.lineTo(x - w/4, y + h/2);
            } else {
                // Complex irregular polygon
                const points = 6 + Math.floor(Math.random() * 3);
                for (let i = 0; i < points; i++) {
                    const angle = (Math.PI * 2 / points) * i;
                    const radius = (Math.max(w, h) / 2) * this.irregularity[i % this.irregularity.length];
                    const px = x + Math.cos(angle) * radius;
                    const py = y + Math.sin(angle) * radius * 0.8;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
        }
    }

    // Smoke particle class - Expands outward from letter edges
    class Smoke {
        constructor(x, y, directionX = 0, directionY = 0) {
            this.x = x;
            this.y = y;
            // If direction provided, use it for outward expansion
            if (directionX !== 0 || directionY !== 0) {
                // Normalize and apply outward force
                const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
                this.vx = (directionX / magnitude) * (Math.random() * 3 + 2); // Outward expansion
                this.vy = (directionY / magnitude) * (Math.random() * 3 + 2);
            } else {
                // Fallback to radial expansion
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = (Math.random() - 0.5) * 4;
            }

            this.size = Math.random() * 20 + 15; // Smaller smoke clouds
            this.life = 1;
            this.decay = Math.random() * 0.008 + 0.006; // Faster fade
            // Denser smoke colors
            const smokeColors = [
                'rgba(140,140,140,0.7)',
                'rgba(160,160,160,0.6)',
                'rgba(180,180,180,0.55)',
                'rgba(200,200,200,0.5)',
                'rgba(170,170,170,0.65)'
            ];
            this.color = smokeColors[Math.floor(Math.random() * smokeColors.length)];
            this.turbulence = Math.random() * 0.3;
        }

        update() {
            // Smoke expands outward, not upward
            this.x += this.vx;
            this.y += this.vy;

            // Slow down but keep expanding outward
            this.vx *= 0.96;
            this.vy *= 0.96;

            // Add slight turbulence
            this.x += Math.sin(this.life * 2) * this.turbulence;
            this.y += Math.cos(this.life * 2) * this.turbulence * 0.5;

            this.life -= this.decay;
            // Smoke expands as it moves outward
            this.size += 0.15;
        }

        draw(ctx) {
            // Smooth fade curve - ease out the opacity
            const smoothLife = this.life * this.life; // Quadratic easing for smoother fade

            // Don't render if too faint (prevents flicker at the end)
            if (smoothLife < 0.02) return;

            ctx.save();
            ctx.globalAlpha = smoothLife * 0.4; // Use smoothed life value

            // Create multi-layered gradient for dense, realistic smoke
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.3, this.color.replace(/[0-9.]+\)/, '0.3)'));
            gradient.addColorStop(0.6, this.color.replace(/[0-9.]+\)/, '0.15)'));
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Add inner core for denser appearance (also with smooth fade)
            if (smoothLife > 0.1) { // Only draw core if visible enough
                const coreGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 0.5);
                coreGradient.addColorStop(0, this.color.replace(/[0-9.]+\)/, '0.2)'));
                coreGradient.addColorStop(1, 'transparent');
                ctx.fillStyle = coreGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }

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
            // Smooth fade for dust particles
            const smoothLife = this.life * this.life;
            if (smoothLife < 0.01) return; // Don't render if too faint

            ctx.save();
            ctx.globalAlpha = smoothLife;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
            ctx.restore();
        }
    }

    // Create impact effect that follows letter shape
    function createImpact(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const width = rect.width;
        const height = rect.height;

        // Check if mobile
        const isMobile = window.innerWidth <= 768;
        const particleDensity = isMobile ? 0.7 : 1;

        // Create particles around the perimeter of the letters
        // This simulates the letter shape "exploding" outward

        // Top edge particles
        for (let i = 0; i < width; i += 8) { // Less frequent
            const x = rect.left + i;
            const y = rect.top;
            const dirX = (x - centerX) / width;
            const dirY = -1; // Upward from top

            // Smoke expanding from top edge
            if (Math.random() > 0.6) { // Less smoke
                particles.push(new Smoke(x, y, dirX, dirY));
            }

            // Debris from edges
            if (Math.random() > 0.5) {
                const debris = new Debris(x, y, Math.random() > 0.7 ? 'small' : 'tiny');
                debris.vx = dirX * (Math.random() * 8 + 4);
                debris.vy = dirY * (Math.random() * 6 + 3);
                particles.push(debris);
            }
        }

        // Bottom edge particles - MOST INTENSE
        for (let i = 0; i < width; i += 6) { // Reduced frequency
            const x = rect.left + i;
            const y = rect.bottom;
            const dirX = (x - centerX) / width;
            const dirY = 1; // Downward from bottom

            // Dense smoke from bottom impact
            if (Math.random() > 0.2) { // Some randomness
                particles.push(new Smoke(x, y, dirX, dirY));
            }

            // More debris from bottom (main impact)
            if (Math.random() > 0.2) {
                const size = Math.random() > 0.6 ? 'medium' : Math.random() > 0.3 ? 'small' : 'tiny';
                const debris = new Debris(x, y, size);
                debris.vx = dirX * (Math.random() * 10 + 5);
                debris.vy = Math.abs(dirY) * (Math.random() * 8 + 4);
                particles.push(debris);
            }

            // Extra dust from bottom
            if (Math.random() > 0.4) {
                particles.push(new Dust(x + (Math.random() - 0.5) * 5, y));
            }
        }

        // Left edge particles
        for (let i = 0; i < height; i += 8) { // Less frequent
            const x = rect.left;
            const y = rect.top + i;
            const dirX = -1; // Leftward from left edge
            const dirY = (y - centerY) / height;

            // Smoke from left edge
            if (Math.random() > 0.7) { // Much less smoke
                particles.push(new Smoke(x, y, dirX, dirY));
            }

            // Debris from left edge
            if (Math.random() > 0.6) {
                const debris = new Debris(x, y, 'tiny');
                debris.vx = dirX * (Math.random() * 8 + 4);
                debris.vy = dirY * (Math.random() * 6 + 2);
                particles.push(debris);
            }
        }

        // Right edge particles
        for (let i = 0; i < height; i += 8) { // Less frequent
            const x = rect.right;
            const y = rect.top + i;
            const dirX = 1; // Rightward from right edge
            const dirY = (y - centerY) / height;

            // Smoke from right edge
            if (Math.random() > 0.7) { // Much less smoke
                particles.push(new Smoke(x, y, dirX, dirY));
            }

            // Debris from right edge
            if (Math.random() > 0.6) {
                const debris = new Debris(x, y, 'tiny');
                debris.vx = dirX * (Math.random() * 8 + 4);
                debris.vy = dirY * (Math.random() * 6 + 2);
                particles.push(debris);
            }
        }

        // Add corner emphasis - corners explode more dramatically
        const corners = [
            {x: rect.left, y: rect.top, dirX: -1, dirY: -1}, // Top-left
            {x: rect.right, y: rect.top, dirX: 1, dirY: -1}, // Top-right
            {x: rect.left, y: rect.bottom, dirX: -1, dirY: 1}, // Bottom-left
            {x: rect.right, y: rect.bottom, dirX: 1, dirY: 1} // Bottom-right
        ];

        corners.forEach(corner => {
            // Extra smoke at corners
            for (let i = 0; i < 2; i++) { // Much less smoke at corners
                particles.push(new Smoke(
                    corner.x + (Math.random() - 0.5) * 5,
                    corner.y + (Math.random() - 0.5) * 5,
                    corner.dirX,
                    corner.dirY
                ));
            }

            // Extra debris at corners
            for (let i = 0; i < 8; i++) {
                const size = ['small', 'tiny', 'medium'][Math.floor(Math.random() * 3)];
                const debris = new Debris(corner.x, corner.y, size);
                debris.vx = corner.dirX * (Math.random() * 12 + 6);
                debris.vy = corner.dirY * (Math.random() * 10 + 5);
                particles.push(debris);
            }
        });

        // Create a "shockwave" of dust that follows the letter outline
        const outlinePoints = Math.floor((width * 2 + height * 2) / 5);
        for (let i = 0; i < outlinePoints; i++) {
            const progress = i / outlinePoints;
            const perimeter = (width + height) * 2;
            const distance = progress * perimeter;

            let x, y, dirX, dirY;

            if (distance < width) {
                // Top edge
                x = rect.left + distance;
                y = rect.top;
                dirX = (x - centerX) / width;
                dirY = -1;
            } else if (distance < width + height) {
                // Right edge
                x = rect.right;
                y = rect.top + (distance - width);
                dirX = 1;
                dirY = (y - centerY) / height;
            } else if (distance < width * 2 + height) {
                // Bottom edge
                x = rect.right - (distance - width - height);
                y = rect.bottom;
                dirX = (x - centerX) / width;
                dirY = 1;
            } else {
                // Left edge
                x = rect.left;
                y = rect.bottom - (distance - width * 2 - height);
                dirX = -1;
                dirY = (y - centerY) / height;
            }

            // Dust particles following outline
            const dust = new Dust(x, y);
            dust.vx = dirX * (Math.random() * 15 + 10);
            dust.vy = dirY * (Math.random() * 15 + 10);
            particles.push(dust);
        }
    }

    // Animate particles
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            particle.draw(ctx);

            // Remove particles when they're truly invisible
            if (particle.life <= 0.01) {
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