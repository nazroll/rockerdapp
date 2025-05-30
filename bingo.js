  const tricksData = {
    "gazelle": [
        {"name": "Open Gazelle", "completed": false},
        {"name": "Closed Gazelle", "completed": false},
        
    ],
    "lion": [
        {"name": "Open Lion", "completed": false},
        {"name": "Closed Lion", "completed": false}
    ]
}

const frontTricksData = {
  "gazelle": [
      {"name": "Open Gazelle", "completed": false, "link" : "https://billyarlew021217.wordpress.com/fog"},
      {"name": "Closed Gazelle", "completed": false, "link" : "https://billyarlew021217.wordpress.com/fcg"},
  ],
  "lion": [
      {"name": "Open Lion", "completed": false, "link" : "https://billyarlew021217.wordpress.com/fol"},
      {"name": "Closed Lion", "completed": false, "link" : "https://eccentricinline.com/fcl/"}
  ]
}

const backTricksData = {
  "gazelle": [
      {"name": "Open Gazelle", "completed": false, "link" : "https://billyarlew021217.wordpress.com/bog"},
      {"name": "Closed Gazelle", "completed": false, "link" : "https://billyarlew021217.wordpress.com/bcg"},
  ],
  "lion": [
      {"name": "Open Lion", "completed": false, "link" : "https://billyarlew021217.wordpress.com/bol"},
      {"name": "Closed Lion", "completed": false, "link" : "https://billyarlew021217.wordpress.com/bcl"}
  ]
}

const bingoData = {
    "title": "Billy's Wizard Basics Bingo!",
    "legs": {
        "right": {
            "front": frontTricksData,
            "back": backTricksData
        },
        "left": {
            "front": frontTricksData,
            "back": backTricksData
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
        console.log('Game state saved:', completedTricks);
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
      console.log('Loading game state:', completedTricks);
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

  document.querySelector('.app-header').textContent = bingoData.title;

  function updateSlidePosition() {
    console.log('updateSlidePosition called, currentSlide:', currentSlide);
    const x = `translate3d(-${currentSlide * 100}%, 0, 0)`;  // use 3d for better Safari compatibility
    console.log('Transform value:', x);
    swipeContainer.style.transform = x;
    swipeContainer.style.webkitTransform = x;    // correct vendor prefix
    
    // Add loading state for better UX
    swipeContainer.classList.add('transitioning');
    setTimeout(() => {
      swipeContainer.classList.remove('transitioning');
    }, 300);
    
    // Force browser to acknowledge the transform change
    swipeContainer.offsetHeight;
  }

  // Expose functions globally for jQuery event handlers
  window.goToSlide = function(slideNumber) {
    currentSlide = slideNumber;
    updateSlidePosition();
  };

  window.goToSide = function(side) {
    console.log('goToSide called with:', side);
    currentSlide = (side === 'right') ? 1 : 2;
    console.log('Setting currentSlide to:', currentSlide);
    updateSlidePosition();
  };

  // Basic Touch Swipe Functionality
  let touchstartX = 0;
  let touchendX = 0;
  const swipeThreshold = 50; // Minimum pixels for a swipe

  swipeContainer.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
      console.log(`Touch start: ${touchstartX}`);
  }, { passive: true }); // Use passive for better scroll performance

  swipeContainer.addEventListener('touchend', function(event) {
      touchendX = event.changedTouches[0].screenX;
      console.log(`Touch end: ${touchendX}`);
      handleSwipe();
  }, false);

  function handleSwipe() {
      const swipeDistance = touchendX - touchstartX;
      console.log(`Swipe: start=${touchstartX}, end=${touchendX}, distance=${swipeDistance}, currentSlide=${currentSlide}, totalSlides=${totalSlides}`);
      
      if (touchendX < touchstartX - swipeThreshold) { // Swiped left
          if (currentSlide < totalSlides - 1) {
              currentSlide++;
              console.log(`Swiping left to slide ${currentSlide}`);
              updateSlidePosition();
          } else {
              console.log(`Cannot swipe left: already at last slide (${currentSlide})`);
          }
      } else if (touchendX > touchstartX + swipeThreshold) { // Swiped right
          if (currentSlide > 0) {
              currentSlide--;
              console.log(`Swiping right to slide ${currentSlide}`);
              updateSlidePosition();
          } else {
              console.log(`Cannot swipe right: already at first slide (${currentSlide})`);
          }
      } else {
          console.log(`Swipe distance ${swipeDistance} below threshold ${swipeThreshold}`);
      }
      
      // Reset touch coordinates
      touchstartX = 0;
      touchendX = 0;
  }

  updateSlidePosition();

  // Load saved state from localStorage
  loadGameState();

  // jQuery event delegation for better performance (wait for jQuery to be available)
  $(document).ready(function() {
    $(document).on('click', '.trick', function() {
      $(this).toggleClass('completed');
      debouncedSave(); // Use debounced save
    });
    
    $(document).on('click', '.choose-side', function(e) {
      e.preventDefault();
      const side = $(this).data('side');
      console.log('Choose side clicked:', side);
      console.log('goToSide function exists:', typeof window.goToSide);
      if (window.goToSide) {
        window.goToSide(side);
        console.log('Called goToSide with:', side);
      } else {
        console.error('goToSide function not found');
      }
    });
    
    $(document).on('click', '.app-header', function(e) {
      e.preventDefault();
      if (window.goToSlide) {
        window.goToSlide(0);
      }
    });
  });
});