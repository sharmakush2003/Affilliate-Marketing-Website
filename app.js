/*
 * Reward Club Showcase Website - Javascript Interactivity
 * Author: Antigravity AI Pair Programmer
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- STICKY HEADER & ACTIVE NAVIGATION LINK ---
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Scroll state header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // --- MOBILE HAMBURGER MENU ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // --- SAVINGS CALCULATOR REMOVED ---

  // --- BRAND GRID SEARCH & CATEGORY FILTERS ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('#brand-search');
  const brandCards = document.querySelectorAll('.brand-card');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterBrands() {
    brandCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardName = card.querySelector('.brand-name').textContent.toLowerCase();
      const cardOffer = card.querySelector('.brand-offer-text').textContent.toLowerCase();

      const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
      const searchMatch = cardName.includes(searchQuery) || cardOffer.includes(searchQuery);

      if (categoryMatch && searchMatch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Bind category button clicks
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      filterBrands();
    });
  });

  // Bind search key inputs
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterBrands();
    });
  }

  // --- ONE-CLICK COUPON COPIER WITH TOASTS ---
  const copyButtons = document.querySelectorAll('.coupon-copy-btn');
  const body = document.body;

  // Add toast container to body
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  body.appendChild(toastContainer);

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Auto remove toast
    setTimeout(() => {
      toast.style.animation = 'none'; // reset anim
      toast.offsetHeight; // trigger reflow
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 2500);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const couponCode = btn.getAttribute('data-code');
      if (couponCode) {
        navigator.clipboard.writeText(couponCode).then(() => {
          showToast(`Coupon "${couponCode}" copied to clipboard!`);
          
          // Visual change in button
          const originalText = btn.textContent;
          btn.textContent = 'COPIED!';
          btn.style.background = '#10b981'; // Green accent
          btn.disabled = true;

          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = ''; // restore CSS style
            btn.disabled = false;
          }, 2000);
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
      }
    });
  });

  // --- FAQ ACCORDION EXPANSION ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all active items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- COUPONS CAROUSEL SCROLLING ---
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const track = document.querySelector('.coupons-track');
  
  if (track && prevBtn && nextBtn) {
    let scrollPosition = 0;
    
    function getCardWidth() {
      const card = track.querySelector('.coupon-card');
      return card ? card.getBoundingClientRect().width + 24 : 300; // width + gap
    }

    nextBtn.addEventListener('click', () => {
      const cardWidth = getCardWidth();
      const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
      scrollPosition = Math.min(scrollPosition + cardWidth, maxScroll);
      track.style.transform = `translateX(-${scrollPosition}px)`;
    });

    prevBtn.addEventListener('click', () => {
      const cardWidth = getCardWidth();
      scrollPosition = Math.max(scrollPosition - cardWidth, 0);
      track.style.transform = `translateX(-${scrollPosition}px)`;
    });

    // Handle window resize adjustments
    window.addEventListener('resize', () => {
      scrollPosition = 0;
      track.style.transform = `translateX(0px)`;
    });
  }

  // --- STATS TICKER INCREMENT ON SCROLL ---
  const stats = document.querySelectorAll('.stat-val');
  let animated = false;

  function checkScrollStats() {
    if (animated || stats.length === 0) return;
    
    const triggerBottom = window.innerHeight * 0.9;
    const statsTop = stats[0].getBoundingClientRect().top;

    if (statsTop < triggerBottom) {
      stats.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const isDecimal = stat.getAttribute('data-decimal') === 'true';
        const suffix = stat.getAttribute('data-suffix') || '';
        
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const currentVal = progress * target;

          if (isDecimal) {
            stat.textContent = `${currentVal.toFixed(1)}${suffix}`;
          } else {
            stat.textContent = `${Math.floor(currentVal)}${suffix}`;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = `${target}${suffix}`;
          }
        }
        requestAnimationFrame(updateCounter);
      });
      animated = true;
    }
  }

  window.addEventListener('scroll', checkScrollStats);
  setTimeout(checkScrollStats, 500);

  // --- SCROLL REVEAL EFFECT ---
  const revealElements = document.querySelectorAll('section:not(#home)');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: '0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- FLOATING COINS BACKGROUND ---
  const heroSection = document.getElementById('home');
  if (heroSection) {
    const coinContainer = document.createElement('div');
    coinContainer.style.position = 'absolute';
    coinContainer.style.top = '0';
    coinContainer.style.left = '0';
    coinContainer.style.width = '100%';
    coinContainer.style.height = '100%';
    coinContainer.style.overflow = 'hidden';
    coinContainer.style.pointerEvents = 'none';
    coinContainer.style.zIndex = '0';
    heroSection.appendChild(coinContainer);

    function createCoin() {
      const coin = document.createElement('div');
      coin.className = 'floating-coin';
      coin.innerHTML = '<i class="fas fa-coins"></i>';
      
      const startX = Math.random() * 100;
      const size = Math.random() * 12 + 10;
      const duration = Math.random() * 6 + 6;
      const delay = Math.random() * 5;
      
      coin.style.position = 'absolute';
      coin.style.bottom = '-40px';
      coin.style.left = `${startX}%`;
      coin.style.fontSize = `${size}px`;
      coin.style.color = 'var(--accent)';
      coin.style.opacity = '0';
      coin.style.animation = `floatUp ${duration}s linear ${delay}s infinite`;
      
      coinContainer.appendChild(coin);
    }

    for (let i = 0; i < 12; i++) {
      createCoin();
    }
  }
});
