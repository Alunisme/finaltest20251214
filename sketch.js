// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// 定義粒子陣列
let particles = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1'); // 設為背景
  canvas.style('position', 'fixed');
  
  // 初始化一些粒子
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(20, 20, 30); // 深色背景
  
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 簡單的粒子類別，模擬鏡頭散景
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(10, 50);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
    this.alpha = random(50, 150);
    this.color = color(random(100, 255), random(100, 255), 255, this.alpha);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > width) this.speedX *= -1;
    if (this.y < 0 || this.y > height) this.speedY *= -1;
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.size);
  }
}
