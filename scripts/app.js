

class App {
    constructor() {
        this.container = document.getElementById('webgl-container');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };

        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        this.initLenis();
        this.initThree();

        // Load assets then start
        this.loadAssets().then(() => {
            console.log("Assets Loaded");
            this.createHeroDish();
            this.createSteam();
            this.addEvents();
            this.initIntroAnimation();
            this.initScrollAnimations();
            this.tick();
        }).catch(err => {
            console.error("Critical Asset Failure:", err);
            // Fallback content if needed?
        });
    }

    initLenis() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.1, 100);
        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
    }

    async loadAssets() {
        const loader = new THREE.TextureLoader();
        // CORS Handler: If local file access fails, this will catch it
        const load = (path) => new Promise((resolve, reject) => {
            loader.load(
                path,
                resolve,
                undefined,
                (err) => reject(new Error(`Failed to load ${path}. Use a local server.`))
            );
        });

        this.textures = {
            dishBase: await load('assets/hero plate.png'),
            dishShadow: await load('assets/hero shadow.png'),
            steam: await load('assets/hero steam texture.jpg')
        };

        // Optimize Textures
        Object.values(this.textures).forEach(t => {
            t.minFilter = THREE.LinearFilter;
            t.magFilter = THREE.LinearFilter;
            t.generateMipmaps = false;
        });
    }

    createHeroDish() {
        this.dishGroup = new THREE.Group();
        this.scene.add(this.dishGroup);
        const scale = 3.5;

        // Shadow
        const shadowMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.2 * scale, 1.2 * scale),
            new THREE.MeshBasicMaterial({ map: this.textures.dishShadow, transparent: true, opacity: 0.6, depthWrite: false })
        );
        shadowMesh.position.set(0, -0.2, -0.5);
        this.dishGroup.add(shadowMesh);

        // Plate
        const plateMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1 * scale, 1 * scale),
            new THREE.MeshBasicMaterial({ map: this.textures.dishBase, transparent: true })
        );
        this.dishGroup.add(plateMesh);
    }

    createSteam() {
        const particleCount = 40; // Dense steam
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const randoms = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 3; // Wide x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2; // y spread
            positions[i * 3 + 2] = 2; // z (Above dish)
            randoms[i] = Math.random();
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        const mat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uTex: { value: this.textures.steam } },
            vertexShader: `
                uniform float uTime;
                attribute float aRandom;
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    float time = uTime * (0.2 + aRandom * 0.2); 
                    pos.y += mod(time, 4.0); // Loops up
                    pos.x += sin(time + aRandom * 5.0) * 0.2; // Wiggle
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = (300.0 * aRandom + 100.0) * (1.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D uTex;
                void main() {
                    vec4 color = texture2D(uTex, gl_PointCoord);
                    // Fade out edges of particles based on alpha channel
                    gl_FragColor = vec4(color.rgb, color.r * 0.15); 
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.steamSystem = new THREE.Points(geom, mat);
        this.steamSystem.position.y = 0.5;
        this.scene.add(this.steamSystem);
    }

    addEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / this.width) * 2 - 1;
            this.mouse.y = -(e.clientY / this.height) * 2 + 1;
        });
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        });
    }

    initIntroAnimation() {
        // Elements
        const loader = document.querySelector('.loader');
        const heroTitle = document.querySelector('.hero-title');

        // Remove Loader
        gsap.to(loader, { opacity: 0, duration: 1.2, delay: 0.5, onComplete: () => loader.remove() });

        // Dish Entrance (Drop In)
        gsap.from(this.dishGroup.position, {
            y: -3,
            duration: 2.2,
            ease: "cubic-bezier(0.4, 0, 0.2, 1)"
        });

        // Dish Rotation Entrance
        gsap.from(this.dishGroup.rotation, {
            x: 0.5,
            y: -0.5,
            duration: 2.5,
            ease: "power2.out"
        });

        // Title Reveal
        gsap.to(heroTitle, { opacity: 1, duration: 1.5, delay: 1, ease: "power2.out" });
    }

    initScrollAnimations() {
        // --- 1. HERO EXIT ---
        gsap.to(this.dishGroup.position, {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "1000px top",
                scrub: true
            },
            y: -5,
            z: -5
        });

        // --- 2. EDITORIAL REVEALS ---
        const storyText = document.querySelector('.editorial-text');
        gsap.from(storyText.children, {
            scrollTrigger: { trigger: storyText, start: "top 75%" },
            y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
        });

        gsap.to('.editorial-img', {
            scrollTrigger: { trigger: '.editorial-image-wrapper', start: "top bottom", end: "bottom top", scrub: 1 },
            yPercent: 20, ease: "none"
        });

        // --- 3. MENU 3D TILT ---
        const cards = document.querySelectorAll('.menu-card');
        cards.forEach(card => {
            const inner = card.querySelector('.menu-card-inner');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const xPct = ((e.clientX - rect.left) / rect.width) - 0.5;
                const yPct = ((e.clientY - rect.top) / rect.height) - 0.5;
                gsap.to(inner, { rotationX: yPct * -15, rotationY: xPct * 15, duration: 0.5 });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(inner, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
            });
        });

        // --- 4. HORIZONTAL GALLERY ---
        const gallerySection = document.querySelector('.gallery-section');
        const track = document.querySelector('.gallery-track');
        if (track) {
            const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.2);
            gsap.to(track, {
                x: getScrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: gallerySection,
                    start: "top top",
                    end: () => `+=${Math.abs(getScrollAmount())}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });
        }

        // --- 5. VIRTUAL TOUR ---
        const tourSection = document.querySelector('.virtual-tour-section');
        const scenes = document.querySelectorAll('.tour-scene');
        ScrollTrigger.create({
            trigger: tourSection,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                const idx = Math.min(Math.floor(self.progress * scenes.length), scenes.length - 1);
                scenes.forEach((s, i) => s.style.opacity = (i === idx) ? 1 : 0);
            }
        });
    }

    tick() {
        const time = performance.now() * 0.001;

        // Smooth Mouse Rotation for Hero Dish
        this.targetRotation.x += (this.mouse.y * 0.3 - this.targetRotation.x) * 0.05;
        this.targetRotation.y += (this.mouse.x * 0.3 - this.targetRotation.y) * 0.05;

        if (this.dishGroup) {
            this.dishGroup.rotation.x = this.targetRotation.x;
            this.dishGroup.rotation.y = this.targetRotation.y;
            // Float effect
            this.dishGroup.position.y += Math.sin(time) * 0.0008;
        }

        if (this.steamSystem) {
            this.steamSystem.material.uniforms.uTime.value = time;
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.tick.bind(this));
    }
}

new App();
