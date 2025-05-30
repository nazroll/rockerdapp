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
let hasShownCompletionCelebration = false; // Track if we've already celebrated completion
let hasShownCompletionModal = false; // Track if we've already shown the completion modal

function saveGameState() {
    const completedTricks = Array.from(document.querySelectorAll('.trick.completed'))
        .map(el => el.dataset.trickId)
        .filter(Boolean);
    
    try {
        localStorage.setItem('billyBingoState', JSON.stringify(completedTricks));
        completedTricksCache = completedTricks;
        updateProgressBar(); // Update progress bar after saving
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

// Progress tracking functionality
const TOTAL_TRICKS = 16; // 2 legs × 2 positions × 2 categories × 2 tricks each

function calculateProgress() {
    try {
        const savedState = localStorage.getItem('billyBingoState');
        const completedTricks = savedState ? JSON.parse(savedState) : [];
        const completedCount = completedTricks.length;
        const progressPercentage = Math.round((completedCount / TOTAL_TRICKS) * 100);
        
        return {
            completedCount,
            totalCount: TOTAL_TRICKS,
            percentage: progressPercentage
        };
    } catch (error) {
        console.warn('Failed to calculate progress:', error);
        return {
            completedCount: 0,
            totalCount: TOTAL_TRICKS,
            percentage: 0
        };
    }
}

function updateProgressBar() {
    const progress = calculateProgress();
    const progressBar = document.getElementById('main-progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar && progressText) {
        // Update progress bar
        progressBar.style.width = `${progress.percentage}%`;
        progressBar.setAttribute('aria-valuenow', progress.percentage);
        
        // Update text
        progressText.textContent = `${progress.completedCount}/${progress.totalCount}`;
        
        // Add completion celebration effect
        if (progress.percentage === 100) {
            // progressBar.classList.add('bg-warning');
            // progressBar.classList.remove('bg-success');
            // setTimeout(() => {
            //     progressBar.classList.remove('bg-warning');
            //     progressBar.classList.add('bg-success');
            // }, 1000);
            progressBar.classList.add('bg-success');
            
            // Throw confetti celebration! 🎉 (only once per completion)
            if (!hasShownCompletionCelebration) {
                throwConfetti();
                hasShownCompletionCelebration = true;
            }
            
            // Show congratulations modal (only once per completion)
            if (!hasShownCompletionModal) {
                showCongratulationsModal();
                hasShownCompletionModal = true;
            }
        } else {
            // Reset celebration flag when progress drops below 100%
            progressBar.classList.remove('bg-success');
            progressBar.classList.add('bg-primary');
            hasShownCompletionCelebration = false;
            hasShownCompletionModal = false;
        }
    }
}

// Confetti celebration function
function throwConfetti() {
    // Create confetti container
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti';
    document.body.appendChild(confettiContainer);
    
    // Create confetti pieces
    for (let i = 0; i < 18; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';
        confettiContainer.appendChild(confettiPiece);
    }
    
    // Remove confetti after animation completes
    setTimeout(() => {
        if (confettiContainer && confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, 4000);
}

// Show congratulations modal
function showCongratulationsModal() {
    // Small delay to let confetti start first
    setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('congratulationsModal'));
        modal.show();
    }, 500);
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

  // Update choose-side button selection state
  function updateChooseSideButtons() {
    const hash = window.location.hash.substring(1);
    const chooseSideButtons = document.querySelectorAll('.choose-side');
    
    // Remove selected class from all buttons
    chooseSideButtons.forEach(button => {
      button.classList.remove('selected');
    });
    
    // Add selected class to the matching button
    if (hash === 'right' || hash === 'left') {
      const matchingButton = document.querySelector(`.choose-side[data-side="${hash}"]`);
      if (matchingButton) {
        matchingButton.classList.add('selected');
      }
    }
  }

  function updateSlidePosition() {
    const x = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    swipeContainer.style.transform = x;
    updateUrl(); // Update URL when slide changes
    updateChooseSideButtons(); // Update button selection state
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
    updateChooseSideButtons(); // Update button selection state on hash change
  });

  // Initialize slide position from URL
  initializeFromUrl();

  updateSlidePosition();
  
  // Initialize choose-side button states
  updateChooseSideButtons();

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
  
  // Initialize progress bar
  updateProgressBar();

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
      // Update progress bar immediately for better user experience
      setTimeout(updateProgressBar, 10);
      debouncedSave(); // This will now also update the progress bar
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