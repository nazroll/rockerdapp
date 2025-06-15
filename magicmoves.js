const triangleTricks = [
  "Front Open",
  "Front Closed", 
  "Back Open",
  "Back Closed"
];

const circleTricks = [
  "Predator",
  "Tree",
  "Gazelle",
  "Lion",
  "Gazelle S",
  "Lion S",
  "Tornado",
  "Typhoon",
  "Monsoon",
  "Tsunami",
  "Fan volt",
  "Toe pivot",
  "Heel pivot",
  "Toe press",
  "Heel press",
  "Toe roll",
  "Heel roll",
  "Daffy",
  "Open book",
  "Closed book",
  "Parallel slide",
  "Soul slide",
  "Acid slide",
  "Mizu slide",
  "Star slide",
  "Fast slide",
  "Back slide",
  "360 jump",
  "180 jump",
  "Blindfolded"
];

class TrickGenerator {
    constructor() {
        this.triangleSlot = document.getElementById('trickStart');
        this.circleSlot = document.getElementById('trickEnd');
        this.generateBtn = document.getElementById('btnGenerateCombo');
        this.mm = document.getElementById('magicMoves');
        this.mmWrapper = document.getElementById('mmWrapper');
        this.isGenerating = false;
        
        this.init();
    }
    
    init() {
        this.generateBtn.addEventListener('click', () => this.generateTrick());
    }
    
    // Haptic feedback helper
    triggerHapticFeedback() {
        // Try modern vibration API
        if ('vibrate' in navigator) {
            // Light tap: 10ms vibration
            navigator.vibrate(10);
        }
        
        // For devices that support haptic feedback (iOS Safari)
        if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
            // iOS haptic feedback simulation through audio context
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 200;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.01);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.01);
            } catch (e) {
                // Fallback: do nothing if audio context fails
            }
        }
    }
    
    // Disable pointer events temporarily
    disablePointerEvents() {
        this.generateBtn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            this.generateBtn.style.pointerEvents = 'auto';
        }, 300);
    }
    
    async generateTrick() {
        if (this.isGenerating) return;
        
        // Trigger haptic feedback immediately on tap
        this.triggerHapticFeedback();
        
        // Disable pointer events for 200ms
        this.disablePointerEvents();
        
        this.isGenerating = true;
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = 'Generating...';

        // Reset to light state
        this.mm.classList.add('text-secondary')
        this.mm.classList.remove('text-white')
        this.mmWrapper.classList.remove('bg-dark');
        this.mmWrapper.classList.remove('shadow-lg');
        this.mmWrapper.classList.remove('magic-moves-appear');

        // Simulate slot machine effect
        await this.animateSlots();
        
        // Generate final results
        const triangleResult = this.getRandomItem(triangleTricks);
        const circleResult = this.getRandomItem(circleTricks);

        // Track the combo generation with Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_combo', {
                'event_category': 'Magic Moves',
                'event_label': `${triangleResult} + ${circleResult}`,
                'custom_parameters': {
                    'triangle_trick': triangleResult,
                    'circle_trick': circleResult,
                    'full_combo': `${triangleResult} + ${circleResult}`
                }
            });
        }
        
        // Display results
        this.triangleSlot.textContent = triangleResult;
        this.circleSlot.textContent = circleResult + ' ✨';
        
        // Remove spinning animation
        this.triangleSlot.classList.remove('spinning');
        this.circleSlot.classList.remove('spinning');

        // Apply dark pill styling with scale-in animation
        this.mm.classList.remove('text-secondary')
        this.mm.classList.add('text-capitalize');
        this.mm.classList.add('text-white')
        this.mmWrapper.classList.add('bg-dark');
        this.mmWrapper.classList.add('shadow-lg');
        
        // Add scale-in animation for the "new drop" moment
        this.mmWrapper.classList.add('magic-moves-appear');
        
        // Trigger haptic feedback again for the "new drop" moment
        setTimeout(() => {
            this.triggerHapticFeedback();
        }, 1600); // After slot animation completes
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.mmWrapper.classList.remove('magic-moves-appear');
        }, 250);

        // Reset button
        this.generateBtn.disabled = false;
        this.generateBtn.textContent = 'Generate Combo';
        this.isGenerating = false;
    }
    
    async animateSlots() {
        const duration = 1500; // 1.5 seconds
        const interval = 100; // Update every 100ms
        const steps = duration / interval;
        
        for (let i = 0; i < steps; i++) {
            this.triangleSlot.textContent = this.getRandomItem(triangleTricks);
            this.circleSlot.textContent = this.getRandomItem(circleTricks);
            
            await this.delay(interval);
        }
    }
    
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TrickGenerator();
});