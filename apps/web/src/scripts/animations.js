// Smooth scroll animations and intersection observer
// Adds reveal animations, parallax effects, and smooth scrolling

document.addEventListener('DOMContentLoaded', () => {
  // ==================== SMOOTH SCROLL ====================
  // Add smooth scrolling to all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==================== INTERSECTION OBSERVER ====================
  // Reveal animations on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  // Fade in animation
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        // Optional: Stop observing after animation
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Slide up animation
  const slideUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-up-visible');
        slideUpObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Scale animation
  const scaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scale-visible');
        scaleObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply observers to elements
  document.querySelectorAll('.fade-in-scroll').forEach(el => {
    fadeInObserver.observe(el);
  });

  document.querySelectorAll('.slide-up-scroll').forEach(el => {
    slideUpObserver.observe(el);
  });

  document.querySelectorAll('.scale-scroll').forEach(el => {
    scaleObserver.observe(el);
  });

  // ==================== PARALLAX EFFECT ====================
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);

  // ==================== COUNTER ANIMATION ====================
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };
        
        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.counter').forEach(el => {
    counterObserver.observe(el);
  });

  // ==================== STICKY NAV ====================
  const nav = document.querySelector('.nav-sticky');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      // Hide/show nav on scroll
      if (currentScroll > lastScroll && currentScroll > 500) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      
      lastScroll = currentScroll;
    });
  }

  // ==================== MAGNETIC BUTTONS ====================
  document.querySelectorAll('.btn-magnetic').forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0) scale(1)';
    });
  });

  // ==================== COPY BUTTONS ====================
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Add success state
        button.classList.add('copy-success');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        
        // Reset after animation
        setTimeout(() => {
          button.classList.remove('copy-success');
          button.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });

  // ==================== FLOATING ANIMATION ====================
  const floatingElements = document.querySelectorAll('.float-animation');
  floatingElements.forEach((el, index) => {
    // Add delay to create wave effect
    el.style.animationDelay = `${index * 0.2}s`;
  });

  // ==================== GRADIENT ANIMATION ====================
  // Add gradient shift to elements with gradient-text class
  const gradientElements = document.querySelectorAll('.gradient-text');
  gradientElements.forEach(el => {
    // Already handled by CSS, but we can add interactive effects
    el.addEventListener('mouseenter', () => {
      el.style.animationDuration = '1s';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.animationDuration = '3s';
    });
  });

  // ==================== PERFORMANCE OPTIMIZATIONS ====================
  // Throttle scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
      // Scroll-based animations here
    });
  });

  // ==================== PREFERS REDUCED MOTION ====================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    // Disable all animations
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
    
    // Remove animation classes
    document.querySelectorAll('[class*="animate-"]').forEach(el => {
      el.className = el.className.replace(/animate-[\w-]+/g, '');
    });
  }
});

// ==================== CSS INJECTION ====================
// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
  /* Fade in animation */
  .fade-in-scroll {
    opacity: 0;
    transition: opacity 0.6s ease-out;
  }
  
  .fade-in-visible {
    opacity: 1;
  }
  
  /* Slide up animation */
  .slide-up-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
  }
  
  .slide-up-visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Scale animation */
  .scale-scroll {
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.6s ease-out;
  }
  
  .scale-visible {
    opacity: 1;
    transform: scale(1);
  }
  
  /* Copy success animation */
  .copy-success {
    background-color: #10B981 !important;
    color: white !important;
    transform: scale(1.05);
  }
  
  /* Smooth transitions for nav */
  .nav-sticky {
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  }
  
  /* Counter animation */
  .counter {
    display: inline-block;
    min-width: 60px;
  }
`;

document.head.appendChild(style);