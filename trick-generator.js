const triangleList = [
  "Front Open",
  "Front Closed", 
  "Back Open",
  "Back Closed"
];

const circleList = [
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

class SlotMachine {
  constructor() {
    this.isSpinning = false;
    this.spinDuration = 2000; // 2 seconds
    this.intervalSpeed = 100; // 100ms between changes
  }

  getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  spin() {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    const triangleSlot = document.getElementById('triangleSlot');
    const circleSlot = document.getElementById('circleSlot');
    const generateBtn = document.getElementById('generateBtn');
    const resultDiv = document.getElementById('trickResult');
    
    // Disable button during spin
    generateBtn.disabled = true;
    generateBtn.textContent = 'Spinning...';
    
    // Clear previous result
    resultDiv.textContent = '';
    
    // Start spinning animation
    const spinInterval = setInterval(() => {
      triangleSlot.textContent = this.getRandomFromArray(triangleList);
      circleSlot.textContent = this.getRandomFromArray(circleList);
    }, this.intervalSpeed);
    
    // Stop spinning after duration
    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Final selection
      const selectedTriangle = this.getRandomFromArray(triangleList);
      const selectedCircle = this.getRandomFromArray(circleList);
      
      triangleSlot.textContent = selectedTriangle;
      circleSlot.textContent = selectedCircle;
      
      // Generate combined trick
      const combinedTrick = `${selectedTriangle} + ${selectedCircle}`;
      resultDiv.textContent = `Your trick: ${combinedTrick}`;
      
      // Re-enable button
      generateBtn.disabled = false;
      generateBtn.textContent = 'Spin Again!';
      this.isSpinning = false;
    }, this.spinDuration);
  }
}

// Initialize slot machine when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const slotMachine = new SlotMachine();
  const generateBtn = document.getElementById('generateBtn');
  
  if (generateBtn) {
    generateBtn.addEventListener('click', () => slotMachine.spin());
  }
});