/* =====================================================
PYXEL Studios — main.js
===================================================== */

/* ---- Custom Cursor ---- */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, follX = 0, follY = 0;

document.addEventListener('mousemove', e => {
mouseX = e.clientX;
mouseY = e.clientY;
if (cursor) {
cursor.style.left = mouseX + 'px';
cursor.style.top  = mouseY + 'px';
}
});

(function animFollower() {
follX += (mouseX - follX) * 0.1;
follY += (mouseY - follY) * 0.1;
if (cursorFollower) {
cursorFollower.style.left = follX + 'px';
cursorFollower.style.top  = follY + 'px';
}
requestAnimationFrame(animFollower);
})();

document.querySelectorAll('a, button, .service-card, .showcase-card__screen').forEach(el => {
el.addEventListener('mouseenter', () => {
if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
});
el.addEventListener('mouseleave', () => {
if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(1)';
});
});

/* ---- Navbar scroll effect ---- */
const nav = document.getElementById('nav');
function handleScroll() {
if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* ---- Mobile burger menu ---- */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (burger && mobileMenu) {
burger.addEventListener('click', () => {
menuOpen = !menuOpen;
mobileMenu.classList.toggle('open', menuOpen);
burger.setAttribute('aria-expanded', menuOpen);
const spans = burger.querySelectorAll('span');
if (menuOpen) {
spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
spans[1].style.opacity   = '0';
spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
} else {
spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}
});
}

document.querySelectorAll('.mobile-link').forEach(link => {
link.addEventListener('click', () => {
menuOpen = false;
if (mobileMenu) mobileMenu.classList.remove('open');
if (burger) {
burger.setAttribute('aria-expanded', 'false');
burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}
});
});

/* ---- Scroll Reveal ---- */
const revealObserver = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
}
});
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-right').forEach(el => {
revealObserver.observe(el);
});

/* ---- Counter animation ---- */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el, target, duration) {
duration = duration || 1600;
let start = null;
function step(timestamp) {
if (!start) start = timestamp;
const progress = Math.min((timestamp - start) / duration, 1);
el.textContent = Math.floor(easeOutCubic(progress) * target);
if (progress < 1) {
requestAnimationFrame(step);
} else {
el.textContent = target;
}
}
requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const target = parseInt(entry.target.dataset.count, 10);
animateCounter(entry.target, target);
counterObserver.unobserve(entry.target);
}
});
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num').forEach(el => counterObserver.observe(el));

/* ---- Day / Night image toggle ---- */
document.querySelectorAll('.toggle-btn').forEach(btn => {
btn.addEventListener('click', () => {
const project = btn.dataset.project;
const mode    = btn.dataset.mode;

document.querySelectorAll('.toggle-btn[data-project="' + project + '"]').forEach(b => {
b.classList.remove('active');
});
btn.classList.add('active');

const dayImg   = document.getElementById(project + '-day');
const nightImg = document.getElementById(project + '-night');

if (!dayImg || !nightImg) return;

if (mode === 'day') {
dayImg.classList.add('active');
nightImg.classList.remove('active');
} else {
nightImg.classList.add('active');
dayImg.classList.remove('active');
}
});
});

/* ---- SERVICE CARD MODALS ---- */
function openModal(modalId) {
const overlay = document.getElementById(modalId);
if (!overlay) return;
overlay.classList.add('active');
document.body.style.overflow = 'hidden';
// Focus trap: focus close button
const closeBtn = overlay.querySelector('.modal-close');
if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeModal(overlay) {
if (!overlay) return;
overlay.classList.remove('active');
document.body.style.overflow = '';
}

// Open on card click / Enter / Space
document.querySelectorAll('.service-card[data-modal]').forEach(card => {
card.addEventListener('click', () => openModal(card.dataset.modal));
card.addEventListener('keydown', e => {
if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openModal(card.dataset.modal);
}
});
});

// Close on X button
document.querySelectorAll('.modal-close').forEach(btn => {
btn.addEventListener('click', () => {
const overlay = btn.closest('.modal-overlay');
closeModal(overlay);
});
});

// Close on CTA inside modal (navigate to contact then close)
document.querySelectorAll('.modal-cta').forEach(cta => {
cta.addEventListener('click', () => {
const overlay = cta.closest('.modal-overlay');
closeModal(overlay);
});
});

// Close on overlay click (outside box)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
overlay.addEventListener('click', e => {
if (e.target === overlay) closeModal(overlay);
});
});

// Close on Escape key
document.addEventListener('keydown', e => {
if (e.key === 'Escape') {
document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
    closeModal(overlay);
});
}
});

/* ---- Contact form — WhatsApp + Email ---- */
var WA_NUMBER = '595986420754';
var EMAIL_TO  = 'enriquegodoy2003.eg' + '@' + 'gmail.com';

var submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
submitBtn.addEventListener('click', function() {
var nombre   = document.getElementById('inputNombre');
var email    = document.getElementById('inputEmail');
var servicio = document.getElementById('inputServicio');
var mensaje  = document.getElementById('inputMensaje');

var valid = true;
[nombre, email, servicio, mensaje].forEach(function(field) {
if (!field || !field.value.trim()) {
    valid = false;
    if (field) {
    field.style.borderColor = '#ff4d6d';
    field.style.boxShadow   = '0 0 0 3px rgba(255,77,109,.15)';
    setTimeout(function() {
        field.style.borderColor = '';
        field.style.boxShadow   = '';
    }, 2500);
    }
}
});

if (!valid) return;

var n = nombre.value.trim();
var e = email.value.trim();
var s = servicio.value.trim();
var m = mensaje.value.trim();

var waText = encodeURIComponent(
'¡Hola PYXEL Studios! 👋\n\n' +
'*Nombre:* ' + n + '\n' +
'*Email:* ' + e + '\n' +
'*Servicio:* ' + s + '\n\n' +
'*Mensaje:* ' + m
);
window.open('https://wa.me/' + WA_NUMBER + '?text=' + waText, '_blank');

setTimeout(function() {
var subject = encodeURIComponent('[PYXEL Studios] Consulta de ' + n + ' — ' + s);
var body    = encodeURIComponent('Nombre: ' + n + '\nEmail: ' + e + '\nServicio: ' + s + '\n\nMensaje:\n' + m);
window.location.href = 'mailto:' + EMAIL_TO + '?subject=' + subject + '&body=' + body;
}, 500);

submitBtn.innerHTML = '<span>¡Mensaje enviado! ✓</span>';
submitBtn.style.background  = 'linear-gradient(135deg, #22c55e, #16a34a)';
submitBtn.style.boxShadow   = '0 0 30px rgba(34,197,94,.3)';

setTimeout(function() {
[nombre, email, servicio, mensaje].forEach(function(f) { if (f) f.value = ''; });
submitBtn.innerHTML = '<span>Enviar mensaje</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
submitBtn.style.background = '';
submitBtn.style.boxShadow  = '';
}, 4000);
});
}

/* ---- Parallax orbs on mouse move ---- */
document.addEventListener('mousemove', function(e) {
var cx = window.innerWidth  / 2;
var cy = window.innerHeight / 2;
var dx = (e.clientX - cx) / cx;
var dy = (e.clientY - cy) / cy;
document.querySelectorAll('.orb').forEach(function(orb, i) {
var f = (i + 1) * 14;
orb.style.transform = 'translate(' + (dx * f) + 'px, ' + (dy * f) + 'px)';
});
});

/* ---- Service cards 3D tilt ---- */
document.querySelectorAll('.service-card').forEach(function(card) {
card.addEventListener('mousemove', function(e) {
var rect = card.getBoundingClientRect();
var x = (e.clientX - rect.left) / rect.width  - 0.5;
var y = (e.clientY - rect.top)  / rect.height - 0.5;
card.style.transform  = 'translateY(-6px) rotateX(' + (-y * 7) + 'deg) rotateY(' + (x * 7) + 'deg)';
card.style.transition = 'transform .1s';
});
card.addEventListener('mouseleave', function() {
card.style.transform  = '';
card.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1), border-color .3s';
});
});

/* ---- Smooth anchor scrolling ---- */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
a.addEventListener('click', function(e) {
var href   = a.getAttribute('href');
var target = document.querySelector(href);
if (target) {
e.preventDefault();
target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
});
});

/* ---- Active nav link highlight on scroll ---- */
var sections = document.querySelectorAll('section[id]');
var navLinks  = document.querySelectorAll('.nav__links a');

var sectionObserver = new IntersectionObserver(function(entries) {
entries.forEach(function(entry) {
if (entry.isIntersecting) {
var id = entry.target.id;
navLinks.forEach(function(link) {
    link.style.color = (link.getAttribute('href') === '#' + id) ? '#fff' : '';
});
}
});
}, { threshold: 0.45 });

sections.forEach(function(s) { sectionObserver.observe(s); });

/* ---- Fade in on load ---- */
window.addEventListener('load', function() {
document.body.style.opacity    = '0';
document.body.style.transition = 'opacity .45s ease';
requestAnimationFrame(function() {
document.body.style.opacity = '1';
});
});