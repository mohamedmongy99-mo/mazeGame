// Rabbit Maze Adventure Game
class MazeGame {
    constructor() {
        this.gridSize = window.innerWidth < 768 ? 8 : 10;
        this.maze = [];
        this.rabbitPosition = { x: 1, y: 1 };
        this.giftPosition = { x: this.gridSize - 2, y: this.gridSize - 2 };
        this.steps = 0;
        this.gameWon = false;
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        this.createMaze();
        this.renderMaze();
        this.updateStepsDisplay();
    }
    
    createMaze() {
        // Initialize maze with walls
        this.maze = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill('wall'));
        
        // Create a simple maze pattern with guaranteed path
        this.createPath();
        
        // Ensure start and end positions are paths
        this.maze[this.rabbitPosition.y][this.rabbitPosition.x] = 'path';
        this.maze[this.giftPosition.y][this.giftPosition.x] = 'path';
    }
    
    createPath() {
        // Create a more interesting maze with multiple paths
        const paths = [
            // Main path from start to end
            { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
            { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
            { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 },
            { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }
        ];
        
        // Additional paths for complexity
        const extraPaths = [
            { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3 },
            { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 3, y: 6 },
            { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 },
            { x: 7, y: 2 }, { x: 5, y: 7 }, { x: 6, y: 7 }
        ];
        
        // Apply paths to maze
        [...paths, ...extraPaths].forEach(pos => {
            if (pos.x < this.gridSize && pos.y < this.gridSize) {
                this.maze[pos.y][pos.x] = 'path';
            }
        });
    }
    
    renderMaze() {
        const mazeElement = document.getElementById('maze');
        mazeElement.innerHTML = '';
        mazeElement.style.gridTemplateColumns = `repeat(${this.gridSize}, ${window.innerWidth < 768 ? '40px' : '50px'})`;
        mazeElement.style.gridTemplateRows = `repeat(${this.gridSize}, ${window.innerWidth < 768 ? '40px' : '50px'})`;
        
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Determine cell type
                if (x === this.rabbitPosition.x && y === this.rabbitPosition.y) {
                    cell.classList.add('rabbit');
                } else if (x === this.giftPosition.x && y === this.giftPosition.y) {
                    cell.classList.add('gift');
                } else if (this.maze[y][x] === 'wall') {
                    cell.classList.add('wall');
                } else {
                    cell.classList.add('path');
                }
                
                mazeElement.appendChild(cell);
            }
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameWon) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveRabbit(0, -1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveRabbit(0, 1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.moveRabbit(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.moveRabbit(1, 0);
                    break;
            }
        });
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.resetGame();
            this.hideCelebration();
        });
        
        // Close celebration modal on background click
        document.getElementById('celebration-modal').addEventListener('click', (e) => {
            if (e.target.id === 'celebration-modal') {
                this.hideCelebration();
                this.resetGame();
            }
        });
    }
    
    moveRabbit(dx, dy) {
        const newX = this.rabbitPosition.x + dx;
        const newY = this.rabbitPosition.y + dy;
        
        // Check boundaries
        if (newX < 0 || newX >= this.gridSize || newY < 0 || newY >= this.gridSize) {
            this.playErrorSound();
            return;
        }
        
        // Check if new position is a wall
        if (this.maze[newY][newX] === 'wall') {
            this.playErrorSound();
            return;
        }
        
        // Move rabbit
        this.rabbitPosition.x = newX;
        this.rabbitPosition.y = newY;
        this.steps++;
        
        // Play move sound
        this.playMoveSound();
        
        // Update display
        this.renderMaze();
        this.updateStepsDisplay();
        
        // Check win condition
        if (newX === this.giftPosition.x && newY === this.giftPosition.y) {
            this.winGame();
        }
    }
    
    updateStepsDisplay() {
        document.getElementById('steps').textContent = this.steps;
    }
    
    winGame() {
        this.gameWon = true;
        setTimeout(() => {
            this.showCelebration();
        }, 500);
    }
    
    showCelebration() {
        document.getElementById('final-steps').textContent = this.steps;
        document.getElementById('celebration-modal').classList.remove('hidden');
        this.createConfetti();
        this.playCelebrationSound();
    }
    
    hideCelebration() {
        document.getElementById('celebration-modal').classList.add('hidden');
        this.clearConfetti();
    }
    
    createConfetti() {
        const container = document.getElementById('confetti-container');
        container.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }
    }
    
    clearConfetti() {
        document.getElementById('confetti-container').innerHTML = '';
    }
    
    resetGame() {
        this.rabbitPosition = { x: 1, y: 1 };
        this.steps = 0;
        this.gameWon = false;
        this.renderMaze();
        this.updateStepsDisplay();
    }
    
    // Sound effects (using Web Audio API for simple beeps)
    playMoveSound() {
        this.playTone(220, 0.1, 'sine');
    }
    
    playErrorSound() {
        this.playTone(150, 0.2, 'sawtooth');
    }
    
    playCelebrationSound() {
        // Play a happy melody
        const notes = [262, 294, 330, 349, 392, 440, 494, 523];
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'sine');
            }, index * 150);
        });
    }
    
    playTone(frequency, duration, type = 'sine') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            // Fallback for browsers that don't support Web Audio API
            console.log('Audio not supported');
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MazeGame();
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Reinitialize game with new grid size if needed
    const currentGame = window.mazeGame;
    if (currentGame) {
        currentGame.renderMaze();
    }
});
