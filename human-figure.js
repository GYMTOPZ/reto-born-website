// Figura humana abstracta emergiendo - Animación 3D
let scene, camera, renderer;
let particles = [];
let humanPoints = [];
let animationPhase = 0;
let clock = new THREE.Clock();

function init3DFigure() {
    const container = document.getElementById('canvas-container');

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(200, 200);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Crear puntos de la silueta humana
    createHumanSilhouette();

    // Crear partículas dispersas iniciales
    createInitialParticles();

    // Iniciar animación
    animate();
}

function createHumanSilhouette() {
    // Puntos que forman una silueta humana minimalista
    const points = [
        // Cabeza
        [0, 1.4, 0],
        [0.15, 1.35, 0],
        [0.2, 1.2, 0],
        [0.15, 1.05, 0],
        [-0.15, 1.05, 0],
        [-0.2, 1.2, 0],
        [-0.15, 1.35, 0],

        // Cuello y hombros
        [0, 1.0, 0],
        [0.4, 0.9, 0],
        [-0.4, 0.9, 0],

        // Brazos
        [0.6, 0.3, 0],
        [0.5, -0.2, 0],
        [-0.6, 0.3, 0],
        [-0.5, -0.2, 0],

        // Torso
        [0.3, 0.5, 0],
        [-0.3, 0.5, 0],
        [0.25, 0, 0],
        [-0.25, 0, 0],

        // Piernas
        [0.2, -0.5, 0],
        [0.25, -1.0, 0],
        [0.3, -1.4, 0],
        [-0.2, -0.5, 0],
        [-0.25, -1.0, 0],
        [-0.3, -1.4, 0],

        // Puntos de conexión adicionales
        [0, 0.7, 0],
        [0, 0.3, 0],
        [0, -0.2, 0],
        [0, -0.7, 0],
    ];

    humanPoints = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
}

function createInitialParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < particleCount; i++) {
        // Posiciones aleatorias dispersas
        positions.push(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2
        );

        // Color azul con variación
        const intensity = 0.5 + Math.random() * 0.5;
        colors.push(0, intensity * 0.44, intensity * 0.89);

        sizes.push(Math.random() * 3 + 1);
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Shader material para partículas luminosas
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            phase: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float phase;

            void main() {
                vColor = color;

                vec3 pos = position;

                // Durante la formación, mover hacia puntos humanos
                if (phase > 0.0) {
                    int index = int(mod(float(gl_VertexID), 28.0));
                    vec3 targetPos = vec3(0.0);

                    // Aproximación a la silueta humana
                    float angle = float(gl_VertexID) * 0.1;
                    float heightRatio = float(gl_VertexID) / 500.0;

                    if (heightRatio < 0.1) {
                        // Cabeza
                        targetPos = vec3(sin(angle) * 0.15, 1.3 + cos(angle) * 0.1, 0.0);
                    } else if (heightRatio < 0.4) {
                        // Torso
                        targetPos = vec3(sin(angle) * 0.3 * (1.0 - heightRatio), 0.9 - heightRatio * 2.0, 0.0);
                    } else {
                        // Piernas
                        float legSide = mod(float(gl_VertexID), 2.0) * 2.0 - 1.0;
                        targetPos = vec3(legSide * 0.2, -0.5 - heightRatio * 1.5, 0.0);
                    }

                    pos = mix(position, targetPos, phase);
                }

                // Añadir movimiento flotante
                pos.y += sin(time + float(gl_VertexID) * 0.01) * 0.02;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            uniform float phase;

            void main() {
                float dist = distance(gl_PointCoord, vec2(0.5));
                if (dist > 0.5) discard;

                float opacity = 1.0 - dist * 2.0;
                opacity *= 0.3 + phase * 0.5;

                gl_FragColor = vec4(vColor, opacity);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particles.push({ system: particleSystem, material: particleMaterial });
}

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Actualizar fase de animación (0 a 1 en 3 segundos)
    animationPhase = Math.min(elapsedTime / 3, 1);

    // Actualizar uniforms de las partículas
    particles.forEach(p => {
        p.material.uniforms.time.value = elapsedTime;
        p.material.uniforms.phase.value = animationPhase;

        // Rotación suave
        p.system.rotation.y = elapsedTime * 0.1;
    });

    // Después de formarse, mantener rotación continua
    if (animationPhase >= 1) {
        particles.forEach(p => {
            p.system.rotation.y = elapsedTime * 0.2;
        });
    }

    renderer.render(scene, camera);
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(init3DFigure, 100);
});

// Responsive
window.addEventListener('resize', function() {
    if (camera && renderer) {
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        renderer.setSize(200, 200);
    }
});