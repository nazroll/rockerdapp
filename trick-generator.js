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
        this.triangleSlot = document.getElementById('triangleSlot');
        this.circleSlot = document.getElementById('circleSlot');
        this.generateBtn = document.getElementById('generateBtn');
        this.trickResult = document.getElementById('trickResult');
        this.isGenerating = false;
        
        this.init();
    }
    
    init() {
        this.generateBtn.addEventListener('click', () => this.generateTrick());
    }
    
    async generateTrick() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = 'Generating...';
        
        // Add spinning animation
        this.triangleSlot.classList.add('spinning');
        this.circleSlot.classList.add('spinning');

        this.trickResult.classList.add('d-none');

        // Simulate slot machine effect
        await this.animateSlots();
        
        // Generate final results
        const triangleResult = this.getRandomItem(triangleTricks);
        const circleResult = this.getRandomItem(circleTricks);
        
        // Display results
        this.triangleSlot.textContent = triangleResult;
        this.circleSlot.textContent = circleResult;
        
        // Update main result
        this.trickResult.textContent = `${triangleResult} ${circleResult}`;
        this.trickResult.classList.add('success');
        
        // Remove spinning animation
        this.triangleSlot.classList.remove('spinning');
        this.circleSlot.classList.remove('spinning');
        
        // Reset button
        this.generateBtn.disabled = false;
        this.generateBtn.textContent = 'Generate';
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