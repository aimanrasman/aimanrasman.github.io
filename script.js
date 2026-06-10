

//Navbar scroll effect//

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    window.scrollY > 50 ?
    navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)' :
    navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)' ;
});

// --- MOVING NETWORK BACKGROUND --- //
const canvas = document.getElementById('network-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        // Create 50 floating points
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1, // Speed X
                vy: (Math.random() - 0.5) * 1, // Speed Y
                radius: Math.random() * 2 + 1 // dot size
            });
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        // 1. Reset all dots to "not connected" at the start of every frame
        particles.forEach(p => p.connected = false);

        // 2. Draw lines and figure out WHICH dots are connecting
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // If they are close enough to connect...
                if (distance < 150) {
                    // Tag both dots as connected!
                    particles[i].connected = true;
                    particles[j].connected = true;

                    // Draw the line between them
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(74, 144, 226, ${1 - distance/150})`;
                    ctx.lineWidth = 0.3; /*thicken the line*/
                    ctx.stroke();
                }
            }
        }

        // 3. Update movement and draw the dots
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            
            // THE COLOR LOGIC: If connected, paint it orange. If alone, paint it blue.
            ctx.fillStyle = p.connected ? '#800080' : '#6495ed'; 
            ctx.fill();
        });
    }

    // Handle window resizing
    window.addEventListener('resize', init);
    init();
    animate();
}

// --- SCROLL REVEAL ANIMATION OBSERVER --- //

document.addEventListener("DOMContentLoaded", () => {
    // Set up the observer options
    const observerOptions = {
        root: null, // Use the browser viewport
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the item enters the screen
    };

    // Create the observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the item is on the screen...
            if (entry.isIntersecting) {
                // Add the 'visible' class to trigger the CSS transition
                entry.target.classList.add('visible');
                
                // Optional: Stop observing it so it doesn't animate out and in repeatedly 
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Find all elements with the class 'reveal-on-scroll' and observe them
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));
});

// --- IMAGE SLIDERS --- //
document.addEventListener("DOMContentLoaded", () => {
    // Find all the sliders on the page
    const sliders = document.querySelectorAll('.award-slider');

    sliders.forEach(slider => {
        const slidesContainer = slider.querySelector('.slides');
        const nextBtn = slider.querySelector('.next-arrow');
        const prevBtn = slider.querySelector('.prev-arrow');
        
        // Count how many pictures are in this specific slider
        const slideCount = slider.querySelectorAll('.slide').length;
        let currentIndex = 0;

        // When Next is clicked
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slideCount;
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        });

        // When Previous is clicked
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        });
    });
});

// --- FADING CIRCLE FRAME (HERO SECTION) --- //
document.addEventListener("DOMContentLoaded", () => {
    const fadeSlides = document.querySelectorAll('.fade-slide');
    
    if (fadeSlides.length > 0) {
        let currentSlide = 0;
        
        // This runs the loop every 4 seconds (4000 milliseconds)
        setInterval(() => {
            // Fade out the current photo
            fadeSlides[currentSlide].classList.remove('active');
            
            // Move to the next photo (and loop back to 0 if at the end)
            currentSlide = (currentSlide + 1) % fadeSlides.length;
            
            // Fade in the new photo
            fadeSlides[currentSlide].classList.add('active');
            
        }, 4000); 
    }
});

// --- HIGHLIGHT ACTIVE NAVBAR LINK --- //
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the current URL of the page the user is on
    // We split by '/' and pop() to get just the filename (e.g., "skills.html")
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // 2. Grab all the links inside your navigation menu
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // 3. Loop through each link
    navLinks.forEach(link => {
        // Get the filename the link is pointing to
        const linkPath = link.getAttribute('href');

        // If the link's destination matches the current page...
        if (linkPath === currentPath) {
            // ...add the 'active-link' CSS class to light it up!
            link.classList.add('active-link');
        }
    });
});

// --- MOBILE NAVBAR HAMBURGER TOGGLE --- //
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            // Toggles the slide-down view
            navLinks.classList.toggle('active');
            
            // Swaps the icon between the bars (☰) and an X (✕) close mark
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
});