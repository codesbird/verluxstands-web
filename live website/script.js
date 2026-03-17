
function safeQuerySelector(selector) {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`Element not found: ${selector}`);
    return null;
  }
}

// Testimonials data and functionality
const testimonials = [
  {
    quote: "We were impressed with the creativity and attention to detail. The booth design perfectly reflected our brand and attracted a lot of visitors at the event.",
    name: "Marketing Manager",
    designation: "Mangalam Ornaments",
    src: "./assets/brands/IMG-20250928-WA0003.jpg",
  },
  {
    quote: "The team delivered exactly what we wanted — modern, functional, and eye-catching. Our booth stood out among competitors and brought us great leads.",
    name: "Director",
    designation: "Forever Forest",
    src: "./assets/brands/IMG-20250928-WA0002.jpg",
  },
  {
    quote: "From design to execution, everything was smooth and professional. The booth was not only beautiful but also practical for our team’s needs.",
    name: "CEO",
    designation: "DD Jewellers",
    src: "./assets/brands/IMG-20250928-WA0007.jpg",
  },
  {
    quote: "Excellent service and great communication throughout the project. They understood our vision and brought it to life beyond expectations.",
    name: "Event Coordinator",
    designation: "The Indian Essence",
    src: "./assets/brands/IMG-20250928-WA0004.jpg",
  },
  {
    quote: "We received so many compliments on our booth! It truly made an impact and gave us the professional presence we were aiming for.",
    name: "Sales Head",
    designation: "DYNA",
    src: "./assets/brands/dyna.png",
  },
];


// Global testimonial variables
let activeIndex = 0;
let autoplayInterval = null;

// Initialize testimonials functionality
function initializeTestimonials() {
  try {
    const imageContainer = safeQuerySelector('#image-container');
    const nameElement = safeQuerySelector('#name');
    const designationElement = safeQuerySelector('#designation');
    const quoteElement = safeQuerySelector('#quote');
    const prevButton = safeQuerySelector('#prev-button');
    const nextButton = safeQuerySelector('#next-button');

    // Check if testimonial elements exist
    if (!imageContainer || !nameElement || !designationElement || !quoteElement) {
      console.log("Testimonial elements not found on this page");
      return;
    }

    function updateTestimonial(direction) {
      try {
        const oldIndex = activeIndex;
        activeIndex = (activeIndex + direction + testimonials.length) % testimonials.length;

        testimonials.forEach((testimonial, index) => {
          let img = imageContainer.querySelector(`[data-index="${index}"]`);
          if (!img) {
            img = document.createElement('img');
            img.src = testimonial.src;
            img.alt = testimonial.name;
            img.classList.add('testimonial-image');
            img.dataset.index = index;
            imageContainer.appendChild(img);
          }

          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const zIndex = testimonials.length - absOffset;
          const opacity = index === activeIndex ? 1 : 0.7;
          const scale = 1 - (absOffset * 0.15);
          const translateY = offset === -1 ? '-20%' : offset === 1 ? '20%' : '0%';
          const rotateY = offset === -1 ? '15deg' : offset === 1 ? '-15deg' : '0deg';

          img.style.zIndex = zIndex;
          img.style.opacity = opacity;
          img.style.transform = `translateY(${translateY}) scale(${scale}) rotateY(${rotateY})`;
        });

        nameElement.textContent = testimonials[activeIndex].name;
        designationElement.textContent = testimonials[activeIndex].designation;
        quoteElement.innerHTML = testimonials[activeIndex].quote
          .split(' ')
          .map(word => `<span class="word">${word}</span>`)
          .join(' ');

        animateWords();
      } catch (error) {
        console.error("Error updating testimonial:", error);
      }
    }

    function animateWords() {
      try {
        const words = quoteElement.querySelectorAll('.word');
        words.forEach((word, index) => {
          word.style.opacity = '0';
          word.style.transform = 'translateY(10px)';
          word.style.filter = 'blur(10px)';
          setTimeout(() => {
            word.style.transition = 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out, filter 0.2s ease-in-out';
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
            word.style.filter = 'blur(0)';
          }, index * 20);
        });
      } catch (error) {
        console.error("Error animating words:", error);
      }
    }

    function handleNext() {
      updateTestimonial(1);
    }

    function handlePrev() {
      updateTestimonial(-1);
    }

    // Add event listeners for buttons if they exist
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        try {
          handlePrev();
          if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
          }
        } catch (error) {
          console.error("Error in prev button handler:", error);
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        try {
          handleNext();
          if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
          }
        } catch (error) {
          console.error("Error in next button handler:", error);
        }
      });
    }

    // Initial setup
    updateTestimonial(0);

    // Autoplay functionality
    autoplayInterval = setInterval(handleNext, 5000);

    console.log("Testimonials functionality initialized successfully");
  } catch (error) {
    console.error("Error initializing testimonials:", error);
  }
}

// Audio toggle functionality with error handling
function initializeAudioToggle() {
  try {
    // Make toggleAudio function available globally
    window.toggleAudio = function (e) {
      try {
        if (!e || !e.firstElementChild) {
          return;
        }

        const icons = e.firstElementChild;
        const video = safeQuerySelector('#video_');

        if (!video) {
          return;
        }

        if (icons.classList.contains('fa-volume-mute')) {
          icons.classList.replace('fa-volume-mute', 'fa-volume-up');
          video.muted = !video.muted;
        } else if (icons.classList.contains('fa-volume-up')) {
          icons.classList.replace('fa-volume-up', 'fa-volume-mute');
          video.muted = !video.muted;
        }
      } catch (error) {
        console.error("Error in toggleAudio:", error);
      }
    };

  } catch (error) {
    console.error("Error initializing audio toggle:", error);
  }
}

// ----------------------------------------------------------------------------
// scroll to top button functionality 
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    scrollToTopBtn.classList.add('active');
  } else {
    scrollToTopBtn.classList.remove('active');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

function scrollToElement(targetId, top = 0) {
  let target = document.getElementById(targetId);
  if (target) {
    const offset = top; // offset in px
    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}


// Brochure modal functionality
document.addEventListener("DOMContentLoaded", function () {
  function toggleModal(show) {
    const modal = document.getElementById('downloadModal');
    const brochureForm = document.getElementById('brochureForm');
    if (show) {
      if (modal && brochureForm) {
        brochureForm.classList.toggle('active');
        modal.classList.toggle('active');
      }
    } else {
      if (modal && brochureForm) {
        brochureForm.classList.remove('active');
        modal.classList.remove('active');
      }
    }
  }
  window.toggleModal = toggleModal;
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      toggleModal(false);
    }
  });
});

// ------------------------------------------------------------------
// whatsapp button functionality
// Chat box functionality with error handling
function initializeChatBox() {
  try {
    const chatBox = safeQuerySelector('#chatBox');
    const contactButton = safeQuerySelector('#contacti_button');

    if (!chatBox || !contactButton) {
      console.log("Chat box elements not found on this page");
      return;
    }

    // Make toggleChatBox function available globally
    window.toggleChatBox = function (type = 'b') {
      try {
        if (type === 'e') {
          chatBox.classList.remove('active');
          contactButton.classList.remove('active');
          return;
        }
        chatBox.classList.toggle('active');
        contactButton.classList.toggle('active');
      } catch (error) {
        console.error("Error in toggleChatBox:", error);
      }
    };

    // Close on outside click
    document.addEventListener('click', (event) => {
      try {
        if (!chatBox.contains(event.target) && !contactButton.contains(event.target)) {
          window.toggleChatBox("e");
        }
      } catch (error) {
        console.error("Error in outside click handler:", error);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      try {
        if (event.key === 'Escape') {
          const dropdownMenu = safeQuerySelector('.dropdown-menu');
          if (dropdownMenu) {
            dropdownMenu.classList.add('hidden');
          }
          window.toggleChatBox("e");
        }
      } catch (error) {
        console.error("Error in escape key handler:", error);
      }
    });

    console.log("Chat box functionality initialized successfully");
  } catch (error) {
    console.error("Error initializing chat box:", error);
  }
}



// Main initialization function
function initializeAll() {
  console.log("Starting JavaScript initialization...");
  // Initialize all components
  // initializeTabs();
  initializeAudioToggle();
  initializeTestimonials();
  initializeChatBox();

  console.log("JavaScript initialization completed");
}

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAll);
} else {
  // DOM is already loaded
  initializeAll();
}

// -------------------------------------------------------
// add policy year
policy_year = new Date().getFullYear();
document.getElementById("policy_year").innerText = policy_year;