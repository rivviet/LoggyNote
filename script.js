// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('open');
        
        // Animate hamburger to X
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (mobileMenuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('.feature-card, .demo-content, .stat-item, .testimonial-card, .section-header');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.85) {
            el.classList.add('visible');
        }
    });
};

// Add reveal class to elements
revealElements.forEach(el => {
    el.classList.add('reveal');
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== Canvas Graph Visualization =====
function initGraphCanvas() {
    const graphPanel = document.querySelector('.mockup-graph-panel');
    if (!graphPanel) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.6';
    
    // Remove CSS nodes
    const cssNodes = graphPanel.querySelectorAll('.graph-node, .graph-line');
    cssNodes.forEach(node => node.remove());
    
    graphPanel.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];
    
    function resize() {
        canvas.width = graphPanel.offsetWidth;
        canvas.height = graphPanel.offsetHeight;
        createNodes();
    }
    
    function createNodes() {
        nodes = [];
        const count = 12;
        const w = canvas.width;
        const h = canvas.height;
        
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * w * 0.8 + w * 0.1,
                y: Math.random() * h * 0.8 + h * 0.1,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: 3 + Math.random() * 3,
                opacity: 0.4 + Math.random() * 0.6
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        nodes.forEach((node, i) => {
            nodes.forEach((other, j) => {
                if (i >= j) return;
                const dist = Math.hypot(node.x - other.x, node.y - other.y);
                if (dist < 80) {
                    const opacity = (1 - dist / 80) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
        
        // Draw and update nodes
        nodes.forEach(node => {
            // Glow
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4);
            gradient.addColorStop(0, `rgba(124, 58, 237, ${node.opacity * 0.3})`);
            gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${node.opacity})`;
            ctx.fill();
            
            // Move
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 10 || node.x > canvas.width - 10) node.vx *= -1;
            if (node.y < 10 || node.y > canvas.height - 10) node.vy *= -1;
        });
        
        animationId = requestAnimationFrame(draw);
    }
    
    resize();
    draw();
    
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        resize();
        draw();
    });
}

// ===== Animated Counter =====
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        if (stat.dataset.animated) return;
        
        const rect = stat.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.85) return;
        
        stat.dataset.animated = 'true';
        const text = stat.textContent;
        const match = text.match(/([\d,]+)/);
        if (!match) return;
        
        const target = parseInt(match[1].replace(/,/g, ''));
        const suffix = text.replace(match[1], '');
        const prefix = text.substring(0, text.indexOf(match[1]));
        let current = 0;
        const duration = 2000;
        const start = performance.now();
        
        function update(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            
            current = Math.floor(eased * target);
            const formatted = current.toLocaleString();
            stat.textContent = text.replace(match[1], formatted) + suffix.replace(/\d/, '');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                stat.textContent = text;
            }
        }
        
        requestAnimationFrame(update);
    });
}

window.addEventListener('scroll', animateCounters);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initGraphCanvas();
    animateCounters();
});

// ===== Smooth Scroll for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Parallax effect for hero glow =====
window.addEventListener('scroll', () => {
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow) {
        const scrolled = window.scrollY;
        heroGlow.style.transform = `translateX(-50%) translateY(${scrolled * 0.3}px)`;
    }
});