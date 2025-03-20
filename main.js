   // Mobile Menu Toggle
   const mobileMenu = document.querySelector('.mobile-menu');
   const nav = document.querySelector('nav');
   
   mobileMenu.addEventListener('click', () => {
       mobileMenu.classList.toggle('active');
       nav.classList.toggle('active');
   });
   
   // Smooth Scrolling
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
       anchor.addEventListener('click', function(e) {
           e.preventDefault();
           
           if (nav.classList.contains('active')) {
               mobileMenu.classList.remove('active');
               nav.classList.remove('active');
           }
           
           const target = document.querySelector(this.getAttribute('href'));
           
           if (target) {
               window.scrollTo({
                   top: target.offsetTop - 80,
                   behavior: 'smooth'
               });
           }
       });
   });
   
   // Header Scroll Effect
   const header = document.querySelector('header');
   
   window.addEventListener('scroll', () => {
       if (window.scrollY > 50) {
           header.classList.add('scrolled');
       } else {
           header.classList.remove('scrolled');
       }
   });
   
   // ThreeJS Animation
   const setupThreeJS = () => {
       const canvas = document.getElementById('hero-canvas');
       const scene = new THREE.Scene();
       const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
       
       const renderer = new THREE.WebGLRenderer({
           canvas: canvas,
           antialias: true,
           alpha: true
       });
       renderer.setSize(window.innerWidth, window.innerHeight);
       renderer.setPixelRatio(window.devicePixelRatio);
       
       // Lighting
       const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
       scene.add(ambientLight);
       
       const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
       directionalLight.position.set(10, 10, 10);
       scene.add(directionalLight);
       
       // Create Skateboards
        const skateboards = [];
        const createSkateboard = (x, y, z) => {
            // Deck
            const shape = new THREE.Shape();
            const width = 2.6;
            const height = 0.7;
            const radius = 0.2;
        
            shape.moveTo(-width / 2 + radius, -height / 2);
            shape.lineTo(width / 2 - radius, -height / 2);
            shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
            shape.lineTo(width / 2, height / 2 - radius);
            shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
            shape.lineTo(-width / 2 + radius, height / 2);
            shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
            shape.lineTo(-width / 2, -height / 2 + radius);
            shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
        
            const extrudeSettings = {
                depth: 0.1,
                bevelEnabled: false
            };
        
            const deckGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const deckMaterial = new THREE.MeshStandardMaterial({ 
                color: Math.random() < 0.5 ? 0x2ecc71 : 0x3498db,
                roughness: 0.5
            });
            const deck = new THREE.Mesh(deckGeometry, deckMaterial);
            deck.rotation.x = Math.PI / 2; // Rotate to make it horizontal
            deck.rotation.z = Math.PI / 2; // Rotate to make it vertical
            
            // Trucks
            const truckGeometry = new THREE.BoxGeometry(1, 0.15, 0.25);
            const truckMaterial = new THREE.MeshStandardMaterial({ color: 0xbdc3c7 });
            
            const frontTruck = new THREE.Mesh(truckGeometry, truckMaterial);
            frontTruck.position.z = 0.9;
            frontTruck.position.y = -0.125;
            
            const backTruck = new THREE.Mesh(truckGeometry, truckMaterial);
            backTruck.position.z = -0.9;
            backTruck.position.y = -0.125;
            
            // Wheels
            const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 32);
            const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0xf39c12 });
            
            const wheels = [];
            
            // Front left wheel
            const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            frontLeftWheel.rotation.z = Math.PI / 2; // Rotate so it rolls forward
            frontLeftWheel.position.set(0.5, -0.25, 0.9);
            wheels.push(frontLeftWheel);
            
            // Front right wheel
            const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            frontRightWheel.rotation.z = Math.PI / 2;
            frontRightWheel.position.set(-0.5, -0.25, 0.9);
            wheels.push(frontRightWheel);
            
            // Back left wheel
            const backLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            backLeftWheel.rotation.z = Math.PI / 2;
            backLeftWheel.position.set(0.5, -0.25, -0.9);
            wheels.push(backLeftWheel);
            
            // Back right wheel
            const backRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            backRightWheel.rotation.z = Math.PI / 2;
            backRightWheel.position.set(-0.5, -0.25, -0.9);
            wheels.push(backRightWheel);
            
            // Create skateboard group
            const skateboard = new THREE.Group();
            skateboard.add(deck);
            skateboard.add(frontTruck);
            skateboard.add(backTruck);
            
            wheels.forEach(wheel => {
                skateboard.add(wheel);
            });
            
            skateboard.position.set(x, y, z);
            skateboard.rotation.y = Math.random() * Math.PI * 2;
            skateboard.userData = {
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                moveSpeed: Math.random() * 0.03 + 0.01,
                moveDirection: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.05
                )
            };
        
            scene.add(skateboard);
            return skateboard;
        };
        
        // Store skateboards

        for (let i = 0; i < 5; i++) {
            skateboards.push(createSkateboard(Math.random() * 10 - 5, 1, Math.random() * 10 - 5));
        }
        
        // Animation loop
        const animateSkateboard = () => {
            requestAnimationFrame(animateSkateboard);
        
            skateboards.forEach(skateboard => {
                // Move skateboard
                skateboard.rotation.y += skateboard.userData.rotationSpeed;
                skateboard.position.x += skateboard.userData.moveDirection.x;
                skateboard.position.y += skateboard.userData.moveDirection.y;
                skateboard.position.z += skateboard.userData.moveDirection.z;
        
                // Rotate wheels
                skateboard.children.forEach((child, index) => {
                    if (index > 2) { // Wheels are after the deck and trucks
                        child.rotation.z -= 0.1; // Spin in the correct direction
                    }
                });
            });
        
            renderer.render(scene, camera);
        };
        
        // Start animation
        animateSkateboard();
        
       
       // Create multiple skateboards
       for (let i = 0; i < 5; i++) {
           const x = (Math.random() - 0.5) * 20;
           const y = (Math.random() - 0.5) * 10 - 5;
           const z = (Math.random() - 0.5) * 20 - 15;
           
           const skateboard = createSkateboard(x, y, z);
           skateboards.push(skateboard);
       }
       
       // Create simple figure jumping on skateboard
       const createSkater = () => {
           const skater = new THREE.Group();
           
           // Body
           const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3);
           const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
           const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
           body.position.y = 0.4;
           
           // Head
           const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
           const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
           const head = new THREE.Mesh(headGeometry, headMaterial);
           head.position.y = 1;
           
           // Arms
           const armGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
           const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
           
           const leftArm = new THREE.Mesh(armGeometry, armMaterial);
           leftArm.position.set(0.45, 0.4, 0);
           
           const rightArm = new THREE.Mesh(armGeometry, armMaterial);
           rightArm.position.set(-0.45, 0.4, 0);
           
           // Legs
           const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
           const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
           
           const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
           leftLeg.position.set(0.2, -0.3, 0);
           
           const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
           rightLeg.position.set(-0.2, -0.3, 0);
           
           // Skateboard
           const skateboard = createSkateboard(0, -0.65, 0);
           skateboard.scale.set(0.8, 0.8, 0.8);
           
           skater.add(body);
           skater.add(head);
           skater.add(leftArm);
           skater.add(rightArm);
           skater.add(leftLeg);
           skater.add(rightLeg);
           skater.add(skateboard);
           
           skater.position.set(0, 0, -10);
           skater.rotation.y = Math.PI;
           
           scene.add(skater);
           return skater;
       };
       
       const skater = createSkater();
       
       // Position camera
       camera.position.z = 5;
       camera.position.y = 1;
       
       // Animation
       let jumpDirection = 2;
       let jumpHeight = 5;
       
       const animate = () => {
           requestAnimationFrame(animate);
           
           // Animate skateboards
           skateboards.forEach(skateboard => {
               skateboard.rotation.y += skateboard.userData.rotationSpeed;
               
               // Move skateboard
               skateboard.position.x += skateboard.userData.moveDirection.x;
               skateboard.position.y += skateboard.userData.moveDirection.y;
               skateboard.position.z += skateboard.userData.moveDirection.z;
               
               // Boundary check and reverse direction
               if (Math.abs(skateboard.position.x) > 15) {
                   skateboard.userData.moveDirection.x *= -1;
               }
               
               if (Math.abs(skateboard.position.y) > 10) {
                   skateboard.userData.moveDirection.y *= -1;
               }
               
               if (skateboard.position.z > 5 || skateboard.position.z < -25) {
                   skateboard.userData.moveDirection.z *= -1;
               }
               
               // Spin wheels
               skateboard.children.forEach((child, index) => {
                   if (index > 2) { // Only rotate wheels (indices 3-6)
                       child.rotation.z += 0.1;
                   }
               });
           });
           
           // Animate skater jumping
           jumpHeight += 0.05 * jumpDirection;
           if (jumpHeight > 1) {
               jumpDirection = -1;
           } else if (jumpHeight < 0) {
               jumpDirection = 1;
           }
           
           skater.position.y = jumpHeight * 0.2;
           skater.rotation.z = jumpHeight * 0.2;
           skater.position.x = Math.sin(Date.now() * 0.001) * 5;
           
           renderer.render(scene, camera);
       };
       
       // Handle window resize
       window.addEventListener('resize', () => {
           camera.aspect = window.innerWidth / window.innerHeight;
           camera.updateProjectionMatrix();
           renderer.setSize(window.innerWidth, window.innerHeight);
       });
       
       animate();
   };
   
   // Initialize ThreeJS scene
   window.addEventListener('load', setupThreeJS);
   
   // Animation on Scroll
   const animateOnScroll = () => {
       const elements = document.querySelectorAll('.section-title, .mission-content, .program-card, .event-card, .gallery-item, .donation-form, .contact-container');
       
       const observer = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   entry.target.style.animation = 'fadeInUp 1s forwards';
                   observer.unobserve(entry.target);
               }
           });
       }, {
           threshold: 0.1
       });
       
       elements.forEach(element => {
           element.style.opacity = '0';
           observer.observe(element);
       });
   };
   
   window.addEventListener('load', animateOnScroll);
   
   // Add animation keyframes to the document
   const style = document.createElement('style');
   style.textContent = `
       @keyframes fadeInUp {
           from {
               opacity: 0;
               transform: translateY(30px);
           }
           to {
               opacity: 1;
               transform: translateY(0);
           }
       }
   `;
   document.head.appendChild(style);
   
   // Form Submission Handlers
   const donationForm = document.getElementById('donationForm');
   const contactForm = document.getElementById('contactForm');
   
   if (donationForm) {
       donationForm.addEventListener('submit', (e) => {
           e.preventDefault();
           alert('Thank you for your donation! We appreciate your support.');
       });
   }
   
   if (contactForm) {
       contactForm.addEventListener('submit', (e) => {
           e.preventDefault();
           alert('Thank you for your message! We will get back to you soon.');
           contactForm.reset();
       });
   }
   
   // Custom Donation Amount Handler
   const customAmount = document.getElementById('customAmount');
   const amountOptions = document.querySelectorAll('input[name="amount"]');
   
   if (customAmount && amountOptions) {
       customAmount.addEventListener('focus', () => {
           amountOptions.forEach(option => {
               option.checked = false;
           });
       });
       
       amountOptions.forEach(option => {
           option.addEventListener('change', () => {
               if (option.checked) {
                   customAmount.value = '';
               }
           });
       });
   }