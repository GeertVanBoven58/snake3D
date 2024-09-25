// Basic setup for scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creating the snake body
let snake = [];
let snakeSize = 5;
const snakeGeometry = new THREE.BoxGeometry(1, 1, 1);
const snakeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
for (let i = 0; i < snakeSize; i++) {
    let segment = new THREE.Mesh(snakeGeometry, snakeMaterial);
    segment.position.set(i, 0, 0);
    snake.push(segment);
    scene.add(segment);
}

// Food
let foodGeometry = new THREE.SphereGeometry(0.5, 32, 32);
let foodMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let food = new THREE.Mesh(foodGeometry, foodMaterial);
scene.add(food);
generateFood();

// Set camera position
camera.position.z = 10;

let direction = { x: -1, y: 0 };
let gameSpeed = 100;
let lastMoveTime = Date.now();

function generateFood() {
    food.position.x = Math.floor(Math.random() * 20 - 10);
    food.position.y = Math.floor(Math.random() * 20 - 10);
}

function moveSnake() {
    let now = Date.now();
    if (now - lastMoveTime < gameSpeed) return;
    lastMoveTime = now;

    // Move the snake's body
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].position.x = snake[i - 1].position.x;
        snake[i].position.y = snake[i - 1].position.y;
    }

    // Move the snake's head
    snake[0].position.x += direction.x;
    snake[0].position.y += direction.y;

    // Check if the snake eats the food
    if (Math.abs(snake[0].position.x - food.position.x) < 1 &&
        Math.abs(snake[0].position.y - food.position.y) < 1) {
        generateFood();
        growSnake();
    }

    // Check for collisions with walls or itself (Game over condition)
    if (snake[0].position.x > 10 || snake[0].position.x < -10 ||
        snake[0].position.y > 10 || snake[0].position.y < -10) {
        resetGame();
    }
}

function growSnake() {
    let newSegment = new THREE.Mesh(snakeGeometry, snakeMaterial);
    newSegment.position.set(snake[snake.length - 1].position.x, snake[snake.length - 1].position.y);
    snake.push(newSegment);
    scene.add(newSegment);
}

function resetGame() {
    // Reset snake and position
    while (snake.length > 1) {
        scene.remove(snake.pop());
    }
    snake[0].position.set(0, 0, 0);
    direction = { x: -1, y: 0 };
}

function animate() {
    requestAnimationFrame(animate);
    moveSnake();
    renderer.render(scene, camera);
}

animate();

// Event listener for controls
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
});
