/* ============================================
   RapidAid — Emergency Response System
   script.js — All Interactivity & Logic
   ============================================ */


/* ============================================
   SOS MODAL — Open & Close
   ============================================ */

/**
 * triggerSOS()
 * Called when any SOS button is pressed.
 * Opens the emergency modal overlay.
 */
function triggerSOS() {
  const modal = document.getElementById('sosModal');
  modal.classList.add('active');
}

/**
 * closeModal()
 * Dismisses the SOS demo modal.
 */
function closeModal() {
  const modal = document.getElementById('sosModal');
  modal.classList.remove('active');
}

// Close modal when clicking outside the modal box
document.getElementById('sosModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// Also allow Escape key to close the modal
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});


/* ============================================
   SCROLL ANIMATIONS
   Using IntersectionObserver to fade-up cards
   as they enter the viewport.
   ============================================ */

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.flow-step, .feature-card, .remote-item').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  scrollObserver.observe(el);
});


/* ============================================
   STAT COUNTER ANIMATION
   ============================================ */

function animateCounter(el, target, suffix = '') {
  let current = 0;
  const duration = 1500;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.dataset.count;
        const suffix = el.dataset.suffix || '';
        if (raw) animateCounter(el, parseInt(raw), suffix);
        statObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-count]').forEach((el) => {
  statObserver.observe(el);
});


/* ============================================
   ACTIVE NAV LINK HIGHLIGHT
   ============================================ */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = '#F5F5F0';
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((sec) => navObserver.observe(sec));