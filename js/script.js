// Helper: ready
document.addEventListener('DOMContentLoaded', function () {
    setupMobileNav();
    setupSmoothScroll();
    setupCounters();
    setupProgressBars();
    setupTestimonials();
    setupManualDonation();
    setupVolunteerForm();
    setupContactForm();
    setupGalleryLightbox();
    setupFooterYear();
    setupNewsletterForms();
  });
  
  /* Mobile navigation toggle */
  
  function setupMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
  
    if (!toggle || !navLinks) return;
  
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
    });
  
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('nav-open');
      }
    });
  }
  
  /* Smooth scrolling for in-page anchors */
  
  function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const targetId = href.slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
  
  /* Animated counters */
  
  function setupCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
  
    const speed = 1000; // duration in ms
  
    const animate = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const startTime = performance.now();
  
      const step = (now) => {
        const progress = Math.min((now - startTime) / speed, 1);
        const current = Math.floor(progress * target);
        counter.textContent = current.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };
  
      requestAnimationFrame(step);
    };
  
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            if (!counter.dataset.animated) {
              counter.dataset.animated = 'true';
              animate(counter);
            }
            obs.unobserve(counter);
          }
        });
      },
      { threshold: 0.4 }
    );
  
    counters.forEach((counter) => observer.observe(counter));
  }
  
  /* Campaign progress bars animation */
  
  function setupProgressBars() {
    const bars = document.querySelectorAll('.campaign-progress-bar');
    if (!bars.length) return;
  
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const progress = parseInt(bar.getAttribute('data-progress') || '0', 10);
            bar.style.width = progress + '%';
            obs.unobserve(bar);
          }
        });
      },
      { threshold: 0.3 }
    );
  
    bars.forEach((bar) => observer.observe(bar));
  }
  
  /* Testimonials slider */
  
  function setupTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (!slides.length) return;
  
    let current = 0;
  
    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };
  
    const next = () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    };
  
    const prev = () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    };
  
    const nextBtn = document.querySelector('.testimonial-nav.next');
    const prevBtn = document.querySelector('.testimonial-nav.prev');
  
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
  
    let auto = setInterval(next, 7000);
  
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => clearInterval(auto));
      slider.addEventListener('mouseleave', () => {
        auto = setInterval(next, 7000);
      });
    }
  }
  
  /* Manual donation (copy + open app) */

  function setupManualDonation() {
    const copyButtons = document.querySelectorAll('.donation-copy-btn');
    const openAppButtons = document.querySelectorAll('.donation-open-app-btn');

    if (!copyButtons.length && !openAppButtons.length) return;

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy') || '';
        if (!text) return;

        const card = btn.closest('.donation-card');
        const feedbackEl = card ? card.querySelector('.copy-feedback') : null;
        await copyText(text, feedbackEl);
      });
    });

    openAppButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const appLink = btn.getAttribute('data-app-link') || '';
        const webLink = btn.getAttribute('data-web-link') || '';
        openAppWithFallback(appLink, webLink);
      });
    });
  }

  function setCopyFeedback(feedbackEl, message) {
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    window.clearTimeout(setCopyFeedback._t);
    setCopyFeedback._t = window.setTimeout(() => {
      feedbackEl.textContent = '';
    }, 2000);
  }

  async function copyText(text, feedbackEl) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', '');
        temp.style.position = 'absolute';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      setCopyFeedback(feedbackEl, 'Copied!');
    } catch (err) {
      setCopyFeedback(feedbackEl, 'Copy failed');
    }
  }

  function openAppWithFallback(appLink, webLink) {
    if (!webLink && !appLink) return;

    // If no app deep link is provided, just open the web link.
    if (!appLink) {
      window.open(webLink, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.href = appLink;
    setTimeout(() => {
      if (webLink) {
        window.open(webLink, '_blank', 'noopener,noreferrer');
      }
    }, 1500);
  }
  
  /* Volunteer form validation */
  
  function setupVolunteerForm() {
    const form = document.getElementById('volunteer-form');
    if (!form) return;
  
    const successMessage = document.getElementById('volunteer-success');
    const whatsappNumber = '923286433907';
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(form);
  
      const name = form.querySelector('#volunteer-name');
      const email = form.querySelector('#volunteer-email');
      const interest = form.querySelector('#volunteer-interest');
      const message = form.querySelector('#volunteer-message');
  
      let valid = true;
  
      if (!name.value.trim()) {
        showError(name, 'Please enter your name.');
        valid = false;
      }
  
      if (!email.value.trim() || !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
      }
  
      if (!interest.value) {
        showError(interest, 'Please select an area of interest.');
        valid = false;
      }
  
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError(message, 'Please provide a brief description (at least 10 characters).');
        valid = false;
      }
  
      if (!valid) return;
  
      const interestText =
        interest.options && interest.selectedIndex >= 0
          ? interest.options[interest.selectedIndex].text
          : interest.value;

      const whatsappText = [
        'New Volunteer Application - Road To Jannat Welfare Foundation',
        '',
        `Name: ${name.value.trim()}`,
        `Email: ${email.value.trim()}`,
        `Interest: ${interestText}`,
        '',
        'Message:',
        message.value.trim(),
      ].join('\n');

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

      form.reset();
      if (successMessage) {
        successMessage.hidden = false;
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // No-backend approach: open WhatsApp chat with prefilled text.
      // The user must press "Send" in WhatsApp to complete the message.
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
  
  /* Contact form validation */
  
  function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
  
    const successMessage = document.getElementById('contact-success');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(form);
  
      const name = form.querySelector('#contact-name');
      const email = form.querySelector('#contact-email');
      const subject = form.querySelector('#contact-subject');
      const message = form.querySelector('#contact-message');
  
      let valid = true;
  
      if (!name.value.trim()) {
        showError(name, 'Please enter your name.');
        valid = false;
      }
  
      if (!email.value.trim() || !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
      }
  
      if (!subject.value.trim()) {
        showError(subject, 'Please enter a subject.');
        valid = false;
      }
  
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError(message, 'Please enter a message (at least 10 characters).');
        valid = false;
      }
  
      if (!valid) return;
  
      form.reset();
      if (successMessage) {
        successMessage.hidden = false;
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
  
  /* Basic email check */
  
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());
  }
  
  /* Error helpers */
  
  function showError(input, message) {
    if (!input) return;
    input.classList.add('error');
  
    let msgEl = input.parentElement.querySelector('.error-message');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'error-message';
      input.parentElement.appendChild(msgEl);
    }
    msgEl.textContent = message;
  }
  
  function clearErrors(form) {
    if (!form) return;
    const fields = form.querySelectorAll('.error');
    fields.forEach((f) => f.classList.remove('error'));
  
    const messages = form.querySelectorAll('.error-message');
    messages.forEach((m) => m.remove());
  }
  
  /* Gallery lightbox */
  
  function setupGalleryLightbox() {
    const items = document.querySelectorAll('.gallery-item img');
    if (!items.length) return;
  
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');
  
    if (!lightbox || !lightboxImage || !closeBtn) return;
  
    items.forEach((img) => {
      img.addEventListener('click', () => {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });
  
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImage.src = '';
    };
  
    closeBtn.addEventListener('click', closeLightbox);
  
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }
  
  /* Footer year */
  
  function setupFooterYear() {
    const yearSpanMain = document.getElementById('current-year');
    const yearSpans = document.querySelectorAll('.current-year');
  
    const year = new Date().getFullYear();
    if (yearSpanMain) yearSpanMain.textContent = year.toString();
    yearSpans.forEach((el) => {
      el.textContent = year.toString();
    });
  }
  
  /* Newsletter forms (demo only) */
  
  function setupNewsletterForms() {
    const forms = document.querySelectorAll('form[id^="footer-newsletter-form"]');
    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        clearErrors(form);
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
          showError(emailInput, 'Please enter a valid email.');
          return;
        }
        emailInput.value = '';
        alert('Thank you for subscribing to Road To Jannat Welfare Foundation updates!');
      });
    });
  }