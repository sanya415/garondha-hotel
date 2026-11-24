document.addEventListener('DOMContentLoaded', () => {
  // --- Header Sticky on Scroll ---
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page loaded already scrolled

  // --- Mobile Menu Navigation ---
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- Active Nav Link Highlight based on Scroll Section ---
  const sections = document.querySelectorAll('section[id]');
  const handleActiveNav = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', handleActiveNav);

  // --- Scroll Fade In Animation ---
  const fadeElements = document.querySelectorAll('.fade-in-scroll');
  const elementObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(el => elementObserver.observe(el));

  // --- Testimonial Slider / Carousel ---
  const track = document.getElementById('testimonialTrack');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotContainer = document.getElementById('sliderDots');
  let currentSlideIndex = 0;
  let autoplayInterval;

  if (track && slides.length > 0) {
    // Generate dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.slider-dot'));

    const updateSlidePosition = () => {
      track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      slides.forEach((slide, idx) => {
        if (idx === currentSlideIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const goToSlide = (index) => {
      currentSlideIndex = index;
      updateSlidePosition();
      resetAutoplay();
    };

    const nextSlide = () => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlidePosition();
    };

    const prevSlide = () => {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    // Autoplay
    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      startAutoplay();
    };

    // Initialize
    updateSlidePosition();
    startAutoplay();
  }

  // --- Modal Popup Handling ---
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (bookingModal && openModalBtns) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close on click outside modal content
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Toast Notifications ---
  const toast = document.getElementById('toast');
  const showToast = (message) => {
    if (toast) {
      toast.querySelector('.toast-message').innerText = message;
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 4000);
    }
  };

  // --- Booking Form Validation & Submission Simulation ---
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic fields extraction
      const name = document.getElementById('formName').value.trim();
      const contact = document.getElementById('formContact').value.trim();
      const checkin = document.getElementById('formCheckIn').value;
      const checkout = document.getElementById('formCheckOut').value;
      const guests = document.getElementById('formGuests').value;

      if (!name || !contact || !checkin || !checkout) {
        showToast('Please fill all required fields.');
        return;
      }

      // Simulate sending inquiry
      const submitBtn = bookingForm.querySelector('.submit-btn');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Sending Inquiry...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        bookingForm.reset();
        
        // Hide modal if open
        if (bookingModal) {
          bookingModal.classList.remove('active');
          document.body.style.overflow = '';
        }
        
        showToast(`Hare Krishna! Request received, ${name}. We will contact you shortly.`);
      }, 1500);
    });
  }
});
