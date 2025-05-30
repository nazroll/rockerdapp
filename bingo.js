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

const bingoData = {
    "title": "Billy's Wizard Bingo!",
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

document.addEventListener('DOMContentLoaded', function() {
  const swipeContainer = document.querySelector('.swipe-container');
  if (!swipeContainer) return;

  const slides = swipeContainer.querySelectorAll('.swipe-slide');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateSlidePosition() {
    const x = `translate3d(-${currentSlide * 100}%, 0, 0)`;  // use 3d for better Safari compatibility
    swipeContainer.style.transform       = x;
    swipeContainer.style.webkitTransform = x;    // correct vendor prefix
    
    // Force browser to acknowledge the transform change
    swipeContainer.offsetHeight;
    
    console.log(`Updated to slide ${currentSlide}: ${x}`)
  }

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
  
  // wire up “choose-side” links
  const slideLinks = document.querySelectorAll('.choose-side');
  Array.prototype.forEach.call(slideLinks, link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      // read data-side, not dataset.slide
      const side = e.currentTarget.dataset.side;
      currentSlide = (side === 'right') ? 1 : 2;
      updateSlidePosition();
    });
  });

  updateSlidePosition();

  // Load saved state from localStorage
  loadGameState();

  // wire up click events on each trick to toggle completed state
  const trickElements = document.querySelectorAll('.trick');
  trickElements.forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('completed');
      saveGameState();
    });
  });
});

// Save game state to localStorage
function saveGameState() {
  const completedTricks = [];
  document.querySelectorAll('.trick.completed').forEach(el => {
    const trickId = el.dataset.trickId;
    if (trickId) {
      completedTricks.push(trickId);
    }
  });
  localStorage.setItem('billyBingoState', JSON.stringify(completedTricks));
  console.log('Game state saved:', completedTricks);
}

// Load game state from localStorage
function loadGameState() {
  const savedState = localStorage.getItem('billyBingoState');
  if (savedState) {
    const completedTricks = JSON.parse(savedState);
    console.log('Loading game state:', completedTricks);
    
    completedTricks.forEach(trickId => {
      const trickElement = document.querySelector(`[data-trick-id="${trickId}"]`);
      if (trickElement) {
        trickElement.classList.add('completed');
      }
    });
  }
}