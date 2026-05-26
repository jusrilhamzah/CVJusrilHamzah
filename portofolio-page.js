/* ================================================================
   PORTOFOLIO CV — JUSRIL HAMZAH
   script.js — All Interactions & Animations
================================================================ */

/* ================================================================
   1. NAVBAR — Scrolled class + Active link
================================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Update active nav link berdasarkan section yang terlihat
  updateActiveNavLink();

  // Back to top visibility
  updateBackToTop();
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let currentSection = '';
  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}


/* ================================================================
   2. HAMBURGER MENU (Mobile)
================================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Tutup menu saat link diklik
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});


/* ================================================================
   3. TYPING ANIMATION — Hero tagline
================================================================ */
const typingTexts = [
  'Information Student',
  'UI/UX Designer',
  'Video Editor',
  'Web Development',
  'Writing',
];

const typingEl    = document.querySelector('.hero-tagline');
const cursor      = document.createElement('span');
cursor.classList.add('typing-cursor');
cursor.textContent = '';
typingEl.appendChild(cursor);

let textIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
  const currentText = typingTexts[textIndex];

  if (isDeleting) {
    // Hapus karakter
    typingEl.firstChild.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;
  } else {
    // Tulis karakter
    typingEl.firstChild.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 100;
  }

  // Selesai menulis → tunggu lalu hapus
  if (!isDeleting && charIndex === currentText.length) {
    typingSpeed = 1800;
    isDeleting  = true;
  }

  // Selesai menghapus → pindah ke teks berikutnya
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex  = (textIndex + 1) % typingTexts.length;
    typingSpeed = 400;
  }

  setTimeout(typeEffect, typingSpeed);
}

// Pastikan elemen ada sebelum jalankan
if (typingEl) {
  // Kosongkan dulu isi teks (tapi pertahankan cursor)
  const originalText = typingEl.firstChild;
  if (originalText && originalText.nodeType === Node.TEXT_NODE) {
    originalText.textContent = '';
  } else {
    typingEl.insertBefore(document.createTextNode(''), cursor);
  }
  setTimeout(typeEffect, 800);
}


/* ================================================================
   4. SCROLL REVEAL — Fade in up saat elemen masuk viewport
================================================================ */
// Tambahkan class .reveal ke semua elemen yang ingin dianimasikan
const revealTargets = [
  '.section-header',
  '.about-text',
  '.about-stats .stat-card',
  '.skills-column',
  '.timeline-item',
  '.project-card',
  '.contact-card',
  '.social-link',
  '.footer-brand',
  '.footer-nav',
  '.footer-contact-quick',
  '.timeline-intro',
  '.timeline-group-label',
  '.portfolio-filters',
  '.portfolio-more',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Animasi hanya sekali
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


/* ================================================================
   5. STAGGER ANIMATION — Kartu muncul bergantian
================================================================ */
// Stat cards
document.querySelectorAll('.about-stats .stat-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});

// Project cards
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.12}s`;
});

// Contact cards
document.querySelectorAll('.contact-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});

// Timeline items
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.1}s`;
});

// Tool chips
document.querySelectorAll('.tool-chip').forEach((chip, i) => {
  chip.classList.add('reveal');
  chip.style.transitionDelay = `${i * 0.06}s`;
  revealObserver.observe(chip);
});

// Social links
document.querySelectorAll('.social-link').forEach((link, i) => {
  link.style.transitionDelay = `${i * 0.08}s`;
});


/* ================================================================
   6. PROGRESS BAR ANIMATION + COUNTER
================================================================ */
const skillSection = document.querySelector('.section-skills');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkills();
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (skillSection) skillObserver.observe(skillSection);

function animateSkills() {
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const targetWidth = parseInt(bar.getAttribute('data-width'));

    // Animasi progress bar melebar
    setTimeout(() => {
      bar.style.width = targetWidth + '%';
    }, 200);

    // Animasi counter angka persen
    const percentEl = bar.closest('.skill-item').querySelector('.skill-percent');
    if (percentEl) {
      animateCounter(percentEl, 0, targetWidth, 1200, '%');
    }
  });
}

function animateCounter(el, start, end, duration, suffix = '') {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Easing: ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * (end - start) + start);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end + suffix;
  }

  requestAnimationFrame(step);
}

// Counter untuk stat cards di section About
const aboutSection = document.querySelector('.section-about');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStatCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

if (aboutSection) counterObserver.observe(aboutSection);

function animateStatCounters() {
  document.querySelectorAll('.stat-card').forEach(card => {
    const numEl = card.querySelector('.stat-number');
    if (!numEl) return;

    const raw    = numEl.textContent.trim();       // "2+", "5+", "3", "1"
    const suffix = raw.replace(/[0-9]/g, '');      // "+" atau ""
    const target = parseInt(raw.replace(/\D/g, '')); // angkanya saja

    animateCounter(numEl, 0, target, 1500, suffix);
  });
}


/* ================================================================
   7. TAB SWITCHING — Pendidikan / Pengalaman
================================================================ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');

    // Update tombol
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', false);
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', true);

    // Update panel
    document.querySelectorAll('.timeline').forEach(panel => {
      panel.classList.add('hidden');
    });
    const targetPanel = document.getElementById(`tab-${targetTab}`);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');

      // Re-trigger reveal untuk item di dalam tab yang baru dibuka
      targetPanel.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => {
          revealObserver.observe(el);
        }, 50);
      });
    }
  });
});


/* ================================================================
   8. PORTFOLIO FILTER
================================================================ */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Cegah klik ganda saat animasi sedang berjalan
    if (btn.classList.contains('active')) return;

    // Update tombol aktif
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    // Fase 1: Fade OUT semua kartu yang sedang tampil
    const visibleCards = [...projectCards].filter(c => c.style.display !== 'none');

    visibleCards.forEach(card => {
      card.style.transition  = 'opacity 0.25s ease, transform 0.25s ease';
      card.style.opacity     = '0';
      card.style.transform   = 'translateY(16px) scale(0.97)';
    });

    // Fase 2: Setelah fade out selesai → tampilkan kartu yang cocok dengan fade IN
    setTimeout(() => {
      projectCards.forEach(card => {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px) scale(0.97)';
      });

      const matchedCards = [...projectCards].filter(card => {
        const category = card.getAttribute('data-category');
        return filter === 'all' || category === filter;
      });

      matchedCards.forEach((card, i) => {
        card.style.display         = '';
        card.style.transition      = 'none';
        card.style.opacity         = '0';
        card.style.transform       = 'translateY(16px) scale(0.97)';
        card.style.transitionDelay = '0s';

        // Trigger reflow agar transition berjalan
        card.offsetHeight;

        card.style.transition      = `opacity 0.35s ease ${i * 0.1}s, transform 0.35s ease ${i * 0.1}s`;
        card.style.opacity         = '1';
        card.style.transform       = 'translateY(0) scale(1)';
      });

    }, 280);
  });
});


/* ================================================================
   9. BACK TO TOP
================================================================ */
const backToTopBtn = document.getElementById('backToTop');

function updateBackToTop() {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ================================================================
   10. FOOTER — Tahun copyright otomatis
================================================================ */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ================================================================
   11. SMOOTH SCROLL — Untuk semua anchor link
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.offsetTop - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});