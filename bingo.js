  // Consolidated tricks data structure
const tricksData = {
  "gazelle": [
    {"name": "Open Gazelle", "completed": false, "frontLink": "https://billyarlew021217.wordpress.com/fog", "backLink": "https://billyarlew021217.wordpress.com/bog"},
    {"name": "Closed Gazelle", "completed": false, "frontLink": "https://billyarlew021217.wordpress.com/fcg", "backLink": "https://billyarlew021217.wordpress.com/bcg"}
  ],
  "lion": [
    {"name": "Open Lion", "completed": false, "frontLink": "https://billyarlew021217.wordpress.com/fol", "backLink": "https://billyarlew021217.wordpress.com/bol"},
    {"name": "Closed Lion", "completed": false, "frontLink": "https://eccentricinline.com/fcl/", "backLink": "https://billyarlew021217.wordpress.com/bcl"}
  ]
};

const bingoData = {
    "title": "Wizard Basics Bingo!",
    "legs": {
        "right": {
            "front": tricksData,
            "back": tricksData
        },
        "left": {
            "front": tricksData,
            "back": tricksData
        }
    }
};

function generateTricksHTML(tricksArray, className = '', legType = '', position = '') {
    let htmlOutput = `<div class="row tricks ${className}">`;
    tricksArray.forEach((trick, index) => {
        const completedClass = trick.completed ? 'completed' : '';
        const trickId = `${legType}-${position}-${className}-${index}`;
        htmlOutput += `
    <div class="col-6 trick ${completedClass}" data-trick-id="${trickId}">
        <div class="box">${trick.name}</div>
    </div>`;
    });
    htmlOutput += '\n</div>';
    return htmlOutput;
}

// Render tricks to specific container elements
function renderTricksToElement(selector, tricksArray, className, legType, position) {
    const container = document.querySelector(selector);
    if (container) {
        container.innerHTML += generateTricksHTML(tricksArray, className, legType, position);
    }
}

// Save game state to localStorage with debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

let completedTricksCache = null;

function saveGameState() {
    const completedTricks = Array.from(document.querySelectorAll('.trick.completed'))
        .map(el => el.dataset.trickId)
        .filter(Boolean);
    
    try {
        localStorage.setItem('billyBingoState', JSON.stringify(completedTricks));
        completedTricksCache = completedTricks;
    } catch (error) {
        console.warn('Failed to save game state:', error);
    }
}

// Debounced save function
const debouncedSave = debounce(saveGameState, 300);

// Load game state from localStorage
function loadGameState() {
  try {
    const savedState = localStorage.getItem('billyBingoState');
    if (savedState) {
      const completedTricks = JSON.parse(savedState);
      completedTricksCache = completedTricks;
      
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        completedTricks.forEach(trickId => {
          const trickElement = document.querySelector(`[data-trick-id="${trickId}"]`);
          if (trickElement) {
            trickElement.classList.add('completed');
          }
        });
      });
    }
  } catch (error) {
    console.warn('Failed to load game state:', error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Render tricks to containers
  renderTricksToElement('.front-right-tricks', bingoData.legs.right.front.gazelle, 'top', 'right', 'front');
  renderTricksToElement('.front-right-tricks', bingoData.legs.right.front.lion, 'bottom', 'right', 'front');
  renderTricksToElement('.back-right-tricks', bingoData.legs.right.back.gazelle, 'top', 'right', 'back');
  renderTricksToElement('.back-right-tricks', bingoData.legs.right.back.lion, 'bottom', 'right', 'back');
  renderTricksToElement('.front-left-tricks', bingoData.legs.left.front.gazelle, 'top', 'left', 'front');
  renderTricksToElement('.front-left-tricks', bingoData.legs.left.front.lion, 'bottom', 'left', 'front');
  renderTricksToElement('.back-left-tricks', bingoData.legs.left.back.gazelle, 'top', 'left', 'back');
  renderTricksToElement('.back-left-tricks', bingoData.legs.left.back.lion, 'bottom', 'left', 'back');

  const swipeContainer = document.querySelector('.swipe-container');
  if (!swipeContainer) return;

  const slides = swipeContainer.querySelectorAll('.swipe-slide');
  let currentSlide = 0;
  const totalSlides = slides.length;

  // URL pagination - map slide numbers to URL fragments
  const slideUrls = ['home', 'right', 'left'];
  
  // Initialize slide from URL hash on page load
  function initializeFromUrl() {
    const hash = window.location.hash.substring(1); // Remove the #
    const slideIndex = slideUrls.indexOf(hash);
    if (slideIndex !== -1) {
      currentSlide = slideIndex;
    }
  }

  // Update URL when slide changes
  function updateUrl() {
    const newHash = slideUrls[currentSlide];
    if (window.location.hash !== `#${newHash}`) {
      window.history.replaceState(null, null, `#${newHash}`);
    }
  }

  document.querySelector('.app-header').textContent = bingoData.title;

  function updateSlidePosition() {
    const x = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    swipeContainer.style.transform = x;
    updateUrl(); // Update URL when slide changes
  }

  // Expose functions globally for jQuery event handlers
  window.goToSlide = function(slideNumber) {
    if (slideNumber >= 0 && slideNumber < totalSlides) {
      currentSlide = slideNumber;
      updateSlidePosition();
    }
  };

  window.goToSide = function(side) {
    currentSlide = (side === 'right') ? 1 : 2;
    updateSlidePosition();
  };

  // Handle browser back/forward buttons
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    const slideIndex = slideUrls.indexOf(hash);
    if (slideIndex !== -1 && slideIndex !== currentSlide) {
      currentSlide = slideIndex;
      const x = `translate3d(-${currentSlide * 100}%, 0, 0)`;
      swipeContainer.style.transform = x;
    }
  });

  // Initialize slide position from URL
  initializeFromUrl();

  // Optimized Touch Swipe Functionality
  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;
  let isSwipeGesture = false;
  const swipeThreshold = 30; // Reduced threshold for faster response
  const verticalThreshold = 100; // Prevent accidental horizontal swipes during scroll

  swipeContainer.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].clientX;
      touchstartY = event.changedTouches[0].clientY;
      isSwipeGesture = false;
  }, { passive: true });

  swipeContainer.addEventListener('touchmove', function(event) {
      if (isSwipeGesture) return;
      
      const touchX = event.changedTouches[0].clientX;
      const touchY = event.changedTouches[0].clientY;
      const deltaX = Math.abs(touchX - touchstartX);
      const deltaY = Math.abs(touchY - touchstartY);
      
      // If horizontal movement is greater than vertical, it's likely a swipe
      if (deltaX > deltaY && deltaX > 10) {
          isSwipeGesture = true;
          // Prevent scrolling during horizontal swipe
          event.preventDefault();
      }
  }, { passive: false }); // Need to prevent default for horizontal swipes

  swipeContainer.addEventListener('touchend', function(event) {
      if (!isSwipeGesture) return;
      
      touchendX = event.changedTouches[0].clientX;
      touchendY = event.changedTouches[0].clientY;
      handleSwipe();
  }, { passive: true });

  function handleSwipe() {
      const swipeDistance = touchendX - touchstartX;
      const verticalDistance = Math.abs(touchendY - touchstartY);
      
      // Ignore swipes that are too vertical
      if (verticalDistance > verticalThreshold) return;
      
      if (swipeDistance < -swipeThreshold && currentSlide < totalSlides - 1) {
          currentSlide++;
          updateSlidePosition();
      } else if (swipeDistance > swipeThreshold && currentSlide > 0) {
          currentSlide--;
          updateSlidePosition();
      }
      
      // Reset touch coordinates and gesture flag
      touchstartX = 0;
      touchendX = 0;
      touchstartY = 0;
      touchendY = 0;
      isSwipeGesture = false;
  }

  updateSlidePosition();

  // Initialize lazy loading for demo links with Intersection Observer
  if ('IntersectionObserver' in window) {
    const observeDemo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          observeDemo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe all demo links containers
    document.querySelectorAll('.demo-links').forEach(el => {
      observeDemo.observe(el);
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll('.demo-links').forEach(el => {
      el.classList.add('loaded');
    });
  }

  // Load saved state from localStorage
  loadGameState();

  // jQuery event delegation for better performance (wait for jQuery to be available)
  if (typeof $ !== 'undefined') {
    setupJQueryEvents();
  } else {
    // Fallback: wait for jQuery to load
    const checkJQuery = setInterval(() => {
      if (typeof $ !== 'undefined') {
        clearInterval(checkJQuery);
        setupJQueryEvents();
      }
    }, 100);
  }
});

// Separate function for jQuery event setup to avoid code duplication
function setupJQueryEvents() {
  $(document).ready(function() {
    $(document).on('click', '.trick', function() {
      $(this).toggleClass('completed');
      debouncedSave();
    });
    
    $(document).on('click', '.choose-side', function(e) {
      e.preventDefault();
      const side = $(this).data('side');
      if (window.goToSide) {
        window.goToSide(side);
      }
    });
    
    $(document).on('click', '.app-header', function(e) {
      e.preventDefault();
      if (window.goToSlide) {
        window.goToSlide(0);
      }
    });
  });
}