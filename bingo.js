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

function generateTricksHTML(tricksArray, className = '') {
    let htmlOutput = `<div class="row tricks ${className}">`;
    tricksArray.forEach(trick => {
        htmlOutput += `
    <div class="col-6 trick">
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
    const x = `translateX(-${currentSlide * 100}%)`;
    swipeContainer.style.transform       = x;
    swipeContainer.style.WebkitTransform = x;    // ← use capital “W”
  }

  // Basic Touch Swipe Functionality
  let touchstartX = 0;
  let touchendX = 0;
  const swipeThreshold = 50; // Minimum pixels for a swipe

  swipeContainer.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
  }, { passive: true }); // Use passive for better scroll performance

  swipeContainer.addEventListener('touchend', function(event) {
      touchendX = event.changedTouches[0].screenX;
      handleSwipe();
  }, false);

  function handleSwipe() {
      if (touchendX < touchstartX - swipeThreshold) { // Swiped left
          if (currentSlide < totalSlides - 1) {
              currentSlide++;
              updateSlidePosition();
          }
      } else if (touchendX > touchstartX + swipeThreshold) { // Swiped right
          if (currentSlide > 0) {
              currentSlide--;
              updateSlidePosition();
          }
      }
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
});