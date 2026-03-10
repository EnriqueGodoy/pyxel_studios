/* =====================================================
PYXEL Studios — main.js
===================================================== */

/* ---- Custom Cursor ---- */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, follX = 0, follY = 0;

document.addEventListener('mousemove', e => {
mouseX = e.clientX; mouseY = e.clientY;
cursor.style.left = mouseX + 'px';
cursor.style.top  = mouseY + 'px';
});

// Smooth follower
(function animFollower() {
follX += (mouseX - follX) * 0.1;
follY += (mouseY - follY) * 0.1;
follower.style.left = follX + 'px';
follower.style.top  = follY + 'px';
requestAnimationFrame(animFollower);
})();

// Cursor scale on interactive elements
document.querySelectorAll('a, button, .service-card, .project-card, .filter-btn').forEach(el => {
el.addEventListener('mouseenter', () => {
cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
cursor.style.background = 'var(--purple-neon)';
});
el.addEventListener('mouseleave', () => {
cursor.style.transform = 'translate(-50%,-50%) scale(1)';
cursor.style.background = 'var(--purple-neon)';
});
});

/* ---- Navbar: scroll effect ---- */
const nav = document.getElementById('nav');
const onScroll = () => {
nav.classList.toggle('scrolled', window.scrollY > 30);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Mobile burger menu ---- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

burger.addEventListener('click', () => {
menuOpen = !menuOpen;
mobileMenu.classList.toggle('open', menuOpen);
// Animate spans
const spans = burger.querySelectorAll('span');
if (menuOpen) {
spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
spans[1].style.opacity = '0';
spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
} else {
spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}
});

document.querySelectorAll('.mobile-link').forEach(link => {
link.addEventListener('click', () => {
menuOpen = false;
mobileMenu.classList.remove('open');
const spans = burger.querySelectorAll('span');
spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
});
});

/* ---- Scroll Reveal ---- */
const revealEls = document.querySelectorAll('.reveal, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
    entry.target.classList.add('visible');
}
});
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Counter animation ---- */
function animateCounter(el, target, duration = 1800) {
let start = null;
const step = (timestamp) => {
if (!start) start = timestamp;
const progress = Math.min((timestamp - start) / duration, 1);
// ease-out
const val = Math.floor(easeOut(progress) * target);
el.textContent = val;
if (progress < 1) requestAnimationFrame(step);
else el.textContent = target;
};
requestAnimationFrame(step);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

const statNums = document.querySelectorAll('.stat__num');
const counterObserver = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
    const target = +entry.target.dataset.count;
    animateCounter(entry.target, target);
    counterObserver.unobserve(entry.target);
}
});
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

/* ---- Project filter ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
btn.addEventListener('click', () => {
// Update active button
filterBtns.forEach(b => b.classList.remove('active'));
btn.classList.add('active');

const filter = btn.dataset.filter;

projectCards.forEach((card, i) => {
    const cat = card.dataset.cat;
    const show = filter === 'all' || cat === filter;

    if (show) {
    card.style.display = '';
    card.style.animationDelay = (i * 0.08) + 's';
    card.style.animation = 'none';
    // Force reflow
    card.offsetHeight;
    card.style.animation = '';
    } else {
    card.style.display = 'none';
    }
});
});
});

/* ---- Contact form ---- */
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
submitBtn.addEventListener('click', () => {
const inputs = document.querySelectorAll('.form-input');
let valid = true;

inputs.forEach(input => {
    if (!input.value.trim()) {
    input.style.borderColor = '#ff4d6d';
    valid = false;
    setTimeout(() => { input.style.borderColor = ''; }, 2000);
    }
});

if (valid) {
    submitBtn.innerHTML = '<span>¡Mensaje enviado! ✓</span>';
    submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    submitBtn.style.boxShadow = '0 0 30px rgba(34,197,94,.3)';
    setTimeout(() => {
    submitBtn.innerHTML = '<span>Enviar mensaje</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    submitBtn.style.background = '';
    submitBtn.style.boxShadow = '';
    }, 3500);
}
});
}

/* ---- Parallax orbs on mouse move ---- */
const orbs = document.querySelectorAll('.orb');
document.addEventListener('mousemove', e => {
const cx = window.innerWidth  / 2;
const cy = window.innerHeight / 2;
const dx = (e.clientX - cx) / cx;
const dy = (e.clientY - cy) / cy;

orbs.forEach((orb, i) => {
const factor = (i + 1) * 12;
orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
});
});

/* ---- Smooth anchor scrolling ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
a.addEventListener('click', e => {
const target = document.querySelector(a.getAttribute('href'));
if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
});
});

/* ---- Service cards stagger on reveal ---- */
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, i) => {
card.style.setProperty('--delay', (i * 0.08) + 's');
});

/* ---- Active nav link highlight ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
    const id = entry.target.id;
    navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + id
        ? 'var(--white)'
        : '';
    });
}
});
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ---- Tilt effect on service cards ---- */
serviceCards.forEach(card => {
card.addEventListener('mousemove', e => {
const rect = card.getBoundingClientRect();
const x = (e.clientX - rect.left) / rect.width  - 0.5;
const y = (e.clientY - rect.top)  / rect.height - 0.5;
card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
card.style.transition = 'transform .1s';
});
card.addEventListener('mouseleave', () => {
card.style.transform = '';
card.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1)';
});
});

/* ---- Page load entrance ---- */
window.addEventListener('load', () => {
document.body.style.opacity = '0';
document.body.style.transition = 'opacity .5s ease';
requestAnimationFrame(() => {
document.body.style.opacity = '1';
});
});