const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas to full width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store all dots
let dotsArray = [];
let mouseX = undefined;
let mouseY = undefined;

// Dot object
class Dot {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = 'white'; // Dot color
        this.baseX = x;       // Store the original X position
        this.baseY = y;       // Store the original Y position
        this.density = (Math.random() * 30) + 1; // Random movement speed
        this.velocityX = (Math.random() * 0.2) - 0.1; // Random horizontal velocity for drifting
        this.velocityY = (Math.random() * 0.2) - 0.1; // Random vertical velocity for drifting
    }

    // Method to draw the dot
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    // Method to update the dot's position
    update() {
        // Make the dot move slightly even when there's no mouse interaction (drifting)
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Reverse the velocity if it hits the canvas edges
        if (this.x < 0 || this.x > canvas.width) this.velocityX = -this.velocityX;
        if (this.y < 0 || this.y > canvas.height) this.velocityY = -this.velocityY;

        this.draw();
    }
}

// Function to create dots
function createDots() {
    dotsArray = [];
    let numberOfDots = (canvas.width * canvas.height) / 15000; // Reduce the number of dots
    for (let i = 0; i < numberOfDots; i++) {
        let size = Math.random() * 3 + 1; // Dot size
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        dotsArray.push(new Dot(x, y, size));
    }
    // Debugging: Log the number of dots created
    console.log(`Created ${dotsArray.length} dots.`);
}

// Function to draw lines between dots that are close to each other and to the mouse
function connectDots() {
    let opacityValue = 1;
    const maxDistance = 150; // Reduce the distance for connecting lines to decrease the number of lines
    for (let a = 0; a < dotsArray.length; a++) {
        for (let b = a; b < dotsArray.length; b++) {
            let dx = dotsArray[a].x - dotsArray[b].x;
            let dy = dotsArray[a].y - dotsArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                opacityValue = 1 - (distance / maxDistance); // Opacity based on distance
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                ctx.lineWidth = 1; // Thinner line width
                ctx.beginPath();
                ctx.moveTo(dotsArray[a].x, dotsArray[a].y);
                ctx.lineTo(dotsArray[b].x, dotsArray[b].y);
                ctx.stroke();
            }
        }
    }

    // Draw lines to the mouse cursor
    if (mouseX !== undefined && mouseY !== undefined) {
        for (let i = 0; i < dotsArray.length; i++) {
            let dx = mouseX - dotsArray[i].x;
            let dy = mouseY - dotsArray[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                opacityValue = 1 - (distance / maxDistance); // Opacity based on distance
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                ctx.lineWidth = 1; // Thinner line width
                ctx.beginPath();
                ctx.moveTo(dotsArray[i].x, dotsArray[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    dotsArray.forEach(dot => {
        dot.update();
    });

    connectDots(); // Draw lines between dots

    requestAnimationFrame(animate);
}

// Initialize the dots and start animation
createDots();
animate();

// Handle window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createDots(); // Recreate dots on resize
});

// Handle mouse movement
canvas.addEventListener('mousemove', function(event) {
    mouseX = event.x;
    mouseY = event.y;
});
