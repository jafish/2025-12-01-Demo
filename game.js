// Token Quest: The Vibe Coder
// A platformer game about collecting tokens to continue vibe coding

// Game state
let player;
let platforms;
let tokens;
let enemies;
let projectiles;
let codeBlocks;
let particles;
let exitPortal;

// Game variables
let score = 0;
let tokensCollected = 0;
let tokensNeeded = 10;
let currentLevel = 1;
let maxLevels = 3;
let gameState = 'playing'; // playing, levelComplete, gameWon, gameOver
let playerLives = 3;
let vibeEnergy = 100;
let vibeDecayRate = 0.05;
let lastVibeBoost = 0;

// Visual elements
let bgStars = [];
let codeParticles = [];

// Platformer constants
const GRAVITY = 0.6;
const JUMP_FORCE = -14;
const MOVE_SPEED = 5;
const PLAYER_SIZE = 40;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

function setup() {
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('game-canvas');
    
    // Initialize background stars
    for (let i = 0; i < 100; i++) {
        bgStars.push({
            x: random(width),
            y: random(height),
            size: random(1, 3),
            brightness: random(100, 255),
            twinkle: random(0.02, 0.05)
        });
    }
    
    // Initialize code particles (floating in background)
    for (let i = 0; i < 20; i++) {
        codeParticles.push({
            x: random(width),
            y: random(height),
            text: random(['{}', '()', '[]', '=>', '++', '--', '==', '!=', '&&', '||', '//', '/*', '*/', '<>', '</>']),
            speed: random(0.3, 1),
            alpha: random(30, 80)
        });
    }
    
    initializeLevel(currentLevel);
}

function initializeLevel(level) {
    // Reset groups
    platforms = new Group();
    tokens = new Group();
    enemies = new Group();
    projectiles = new Group();
    codeBlocks = new Group();
    particles = new Group();
    
    // Create player (the vibe coder - represented by a developer icon)
    player = new Sprite(100, CANVAS_HEIGHT - 100, PLAYER_SIZE, PLAYER_SIZE);
    player.color = color(0, 212, 255);
    player.stroke = color(123, 44, 191);
    player.strokeWeight = 3;
    player.rotationLock = true;
    player.friction = 0.1;
    player.bounciness = 0;
    
    // Adjust level parameters based on current level
    tokensNeeded = 10 + (level - 1) * 5;
    tokensCollected = 0;
    vibeEnergy = 100;
    
    // Create level based on level number
    switch(level) {
        case 1:
            createLevel1();
            break;
        case 2:
            createLevel2();
            break;
        case 3:
            createLevel3();
            break;
        default:
            createLevel1();
    }
    
    gameState = 'playing';
}

function createLevel1() {
    // Ground platform
    createPlatform(400, CANVAS_HEIGHT - 20, 800, 40);
    
    // Floating platforms - Level 1 (easier layout)
    createPlatform(100, 480, 150, 20);
    createPlatform(300, 420, 120, 20);
    createPlatform(500, 360, 150, 20);
    createPlatform(700, 300, 120, 20);
    createPlatform(500, 240, 150, 20);
    createPlatform(250, 200, 120, 20);
    createPlatform(100, 300, 100, 20);
    createPlatform(650, 180, 100, 20);
    createPlatform(400, 120, 180, 20);
    
    // Add tokens scattered around
    createToken(100, 440);
    createToken(300, 380);
    createToken(500, 320);
    createToken(700, 260);
    createToken(500, 200);
    createToken(250, 160);
    createToken(100, 260);
    createToken(650, 140);
    createToken(400, 80);
    createToken(180, 440);
    createToken(600, 320);
    createToken(350, 380);
    
    // Add a couple of enemies
    createEnemy(450, 340, 400, 600);
    createEnemy(200, 180, 150, 350);
    
    // Add code blocks (obstacles that hurt if touched while moving)
    createCodeBlock(600, 450, 30, 30);
    createCodeBlock(200, 320, 30, 30);
    
    // Exit portal
    createExitPortal(750, 80);
}

function createLevel2() {
    // Ground with gaps
    createPlatform(100, CANVAS_HEIGHT - 20, 200, 40);
    createPlatform(400, CANVAS_HEIGHT - 20, 200, 40);
    createPlatform(700, CANVAS_HEIGHT - 20, 200, 40);
    
    // More complex platform layout
    createPlatform(50, 480, 100, 20);
    createPlatform(200, 420, 100, 20);
    createPlatform(350, 360, 100, 20);
    createPlatform(500, 300, 100, 20);
    createPlatform(650, 240, 100, 20);
    createPlatform(500, 180, 100, 20);
    createPlatform(350, 120, 100, 20);
    createPlatform(200, 180, 100, 20);
    createPlatform(100, 260, 80, 20);
    createPlatform(750, 350, 80, 20);
    createPlatform(750, 150, 80, 20);
    createPlatform(50, 350, 80, 20);
    
    // Tokens placed on accessible platform locations
    createToken(50, 440);
    createToken(200, 380);
    createToken(350, 320);
    createToken(500, 260);
    createToken(650, 200);
    createToken(500, 140);
    createToken(350, 80);
    createToken(200, 140);
    createToken(100, 220);
    createToken(750, 310);
    createToken(750, 110);
    createToken(50, 310);
    createToken(150, 550);
    createToken(450, 550);
    createToken(650, 550)
    
    // More enemies
    createEnemy(300, 340, 250, 450);
    createEnemy(500, 280, 450, 600);
    createEnemy(150, 400, 100, 300);
    createEnemy(650, 220, 600, 720);
    
    // More code blocks
    createCodeBlock(400, 450, 40, 40);
    createCodeBlock(250, 280, 35, 35);
    createCodeBlock(600, 180, 35, 35);
    createCodeBlock(150, 150, 30, 30);
    
    // Exit portal
    createExitPortal(750, 110);
}

function createLevel3() {
    // Minimal ground - mostly platforming
    createPlatform(100, CANVAS_HEIGHT - 20, 150, 40);
    createPlatform(700, CANVAS_HEIGHT - 20, 150, 40);
    
    // Complex multi-tier platform system
    // Lower tier
    createPlatform(250, 520, 80, 15);
    createPlatform(400, 500, 80, 15);
    createPlatform(550, 520, 80, 15);
    
    // Middle tier
    createPlatform(100, 420, 80, 15);
    createPlatform(220, 380, 80, 15);
    createPlatform(360, 350, 80, 15);
    createPlatform(500, 380, 80, 15);
    createPlatform(640, 420, 80, 15);
    createPlatform(750, 380, 60, 15);
    
    // Upper tier
    createPlatform(50, 300, 70, 15);
    createPlatform(170, 260, 70, 15);
    createPlatform(300, 220, 70, 15);
    createPlatform(430, 180, 70, 15);
    createPlatform(560, 220, 70, 15);
    createPlatform(680, 260, 70, 15);
    
    // Top tier
    createPlatform(120, 140, 80, 15);
    createPlatform(300, 100, 80, 15);
    createPlatform(500, 100, 80, 15);
    createPlatform(680, 140, 80, 15);
    createPlatform(400, 60, 100, 15);
    
    // Tokens placed on accessible platform locations
    // Ground tokens
    createToken(100, 540);
    createToken(700, 540);
    // Lower tier tokens
    createToken(250, 480);
    createToken(400, 460);
    createToken(550, 480);
    // Middle tier tokens
    createToken(100, 380);
    createToken(220, 340);
    createToken(360, 310);
    createToken(500, 340);
    createToken(640, 380);
    createToken(750, 340);
    // Upper tier tokens
    createToken(50, 260);
    createToken(170, 220);
    createToken(300, 180);
    createToken(430, 140);
    createToken(560, 180);
    createToken(680, 220);
    // Top tier tokens
    createToken(120, 100);
    createToken(300, 60);
    createToken(500, 60);
    createToken(680, 100);
    createToken(400, 20)
    
    // Many enemies
    createEnemy(300, 480, 220, 430);
    createEnemy(500, 480, 370, 580);
    createEnemy(300, 330, 280, 400);
    createEnemy(500, 360, 470, 580);
    createEnemy(170, 240, 140, 250);
    createEnemy(560, 200, 530, 640);
    createEnemy(300, 80, 270, 380);
    
    // Many code blocks (bugs in the code!)
    createCodeBlock(180, 480, 30, 30);
    createCodeBlock(620, 480, 30, 30);
    createCodeBlock(450, 340, 25, 25);
    createCodeBlock(250, 300, 25, 25);
    createCodeBlock(380, 240, 25, 25);
    createCodeBlock(600, 280, 25, 25);
    createCodeBlock(150, 180, 20, 20);
    createCodeBlock(650, 180, 20, 20);
    
    // Exit portal at the very top
    createExitPortal(400, 25);
}

function createPlatform(x, y, w, h) {
    let platform = new Sprite(x, y, w, h, 'static');
    platform.color = color(60, 60, 80);
    platform.stroke = color(100, 100, 140);
    platform.strokeWeight = 2;
    platforms.add(platform);
    return platform;
}

function createToken(x, y) {
    let token = new Sprite(x, y, 25);
    token.color = color(255, 215, 0);
    token.stroke = color(255, 165, 0);
    token.strokeWeight = 2;
    token.rotation = 0;
    token.rotationSpeed = 2;
    tokens.add(token);
    return token;
}

function createEnemy(x, y, minX, maxX) {
    let enemy = new Sprite(x, y, 35, 35);
    enemy.color = color(255, 60, 60);
    enemy.stroke = color(180, 0, 0);
    enemy.strokeWeight = 2;
    enemy.minX = minX;
    enemy.maxX = maxX;
    enemy.direction = 1;
    enemy.speed = 2 + currentLevel * 0.5;
    enemy.rotationLock = true;
    enemies.add(enemy);
    return enemy;
}

function createCodeBlock(x, y, w, h) {
    let block = new Sprite(x, y, w, h, 'static');
    block.color = color(180, 0, 180);
    block.stroke = color(255, 0, 255);
    block.strokeWeight = 2;
    codeBlocks.add(block);
    return block;
}

function createExitPortal(x, y) {
    exitPortal = new Sprite(x, y, 50, 60, 'static');
    exitPortal.color = color(0, 255, 150, 150);
    exitPortal.stroke = color(0, 255, 200);
    exitPortal.strokeWeight = 3;
}

function createParticle(x, y, c) {
    let particle = new Sprite(x, y, random(5, 10));
    particle.color = c;
    particle.vel.x = random(-3, 3);
    particle.vel.y = random(-5, -1);
    particle.life = 60;
    particles.add(particle);
}

function draw() {
    // Draw background
    drawBackground();
    
    if (gameState === 'playing') {
        updateGame();
    }
    
    // Draw all sprites
    allSprites.draw();
    
    // Draw UI overlay
    drawUI();
    
    // Draw game state screens
    if (gameState === 'levelComplete') {
        drawLevelComplete();
    } else if (gameState === 'gameWon') {
        drawGameWon();
    } else if (gameState === 'gameOver') {
        drawGameOver();
    }
}

function drawBackground() {
    // Dark space-like background
    background(15, 15, 35);
    
    // Draw twinkling stars
    for (let star of bgStars) {
        star.brightness += sin(frameCount * star.twinkle) * 2;
        fill(star.brightness);
        noStroke();
        ellipse(star.x, star.y, star.size);
    }
    
    // Draw floating code particles
    textSize(12);
    for (let cp of codeParticles) {
        fill(0, 212, 255, cp.alpha);
        text(cp.text, cp.x, cp.y);
        cp.y -= cp.speed;
        if (cp.y < -20) {
            cp.y = height + 20;
            cp.x = random(width);
        }
    }
}

function updateGame() {
    // Player movement
    if (kb.pressing('left') || kb.pressing('a')) {
        player.vel.x = -MOVE_SPEED;
    } else if (kb.pressing('right') || kb.pressing('d')) {
        player.vel.x = MOVE_SPEED;
    } else {
        player.vel.x *= 0.8;
    }
    
    // Jumping
    if ((kb.presses('up') || kb.presses('space') || kb.presses('w')) && player.colliding(platforms)) {
        player.vel.y = JUMP_FORCE;
        // Create jump particles
        for (let i = 0; i < 5; i++) {
            createParticle(player.x, player.y + PLAYER_SIZE/2, color(0, 212, 255, 150));
        }
    }
    
    // Keep player in bounds
    player.x = constrain(player.x, PLAYER_SIZE/2, width - PLAYER_SIZE/2);
    
    // Check if player fell off screen
    if (player.y > height + 100) {
        playerLives--;
        if (playerLives <= 0) {
            gameState = 'gameOver';
        } else {
            // Reset player position
            player.x = 100;
            player.y = CANVAS_HEIGHT - 100;
            player.vel.x = 0;
            player.vel.y = 0;
        }
    }
    
    // Update vibe energy (decreases over time, increases when collecting tokens)
    vibeEnergy -= vibeDecayRate;
    if (vibeEnergy <= 0) {
        vibeEnergy = 0;
        playerLives--;
        if (playerLives <= 0) {
            gameState = 'gameOver';
        } else {
            vibeEnergy = 50; // Partial refill on life loss
        }
    }
    
    // Token collection
    for (let token of tokens) {
        if (player.overlaps(token)) {
            tokensCollected++;
            score += 100;
            vibeEnergy = min(vibeEnergy + 15, 100);
            
            // Create collection particles
            for (let i = 0; i < 8; i++) {
                createParticle(token.x, token.y, color(255, 215, 0, 200));
            }
            
            token.remove();
        }
    }
    
    // Enemy movement and collision
    for (let enemy of enemies) {
        // Patrol movement
        enemy.x += enemy.direction * enemy.speed;
        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
            enemy.direction *= -1;
        }
        
        // Player collision with enemy
        if (player.overlaps(enemy)) {
            // Check if player is jumping on enemy from above
            if (player.vel.y > 0 && player.y < enemy.y - 10) {
                // Defeat enemy
                score += 200;
                for (let i = 0; i < 10; i++) {
                    createParticle(enemy.x, enemy.y, color(255, 60, 60, 200));
                }
                enemy.remove();
                player.vel.y = JUMP_FORCE * 0.6; // Bounce
            } else {
                // Player takes damage
                playerLives--;
                vibeEnergy -= 25;
                if (playerLives <= 0) {
                    gameState = 'gameOver';
                } else {
                    // Knockback
                    player.vel.x = (player.x < enemy.x ? -8 : 8);
                    player.vel.y = -5;
                }
            }
        }
    }
    
    // Code block collision (bugs cause damage when player is moving fast)
    for (let block of codeBlocks) {
        if (player.overlaps(block)) {
            if (abs(player.vel.x) > 2 || abs(player.vel.y) > 2) {
                vibeEnergy -= 10;
                // Knockback
                player.vel.x *= -0.5;
                player.vel.y = -3;
                
                // Bug particles
                for (let i = 0; i < 5; i++) {
                    createParticle(block.x, block.y, color(180, 0, 180, 200));
                }
            }
        }
    }
    
    // Update particles
    for (let particle of particles) {
        particle.life--;
        if (particle.life <= 0) {
            particle.remove();
        }
    }
    
    // Check exit portal
    if (exitPortal && player.overlaps(exitPortal) && tokensCollected >= tokensNeeded) {
        if (currentLevel >= maxLevels) {
            gameState = 'gameWon';
        } else {
            gameState = 'levelComplete';
        }
    }
    
    // Restart level
    if (kb.presses('r')) {
        playerLives = 3;
        score = Math.max(0, score - 500);
        initializeLevel(currentLevel);
    }
}

function drawUI() {
    // Draw score
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 20, 20);
    
    // Draw tokens collected
    fill(255, 215, 0);
    text(`Tokens: ${tokensCollected}/${tokensNeeded}`, 20, 50);
    
    // Draw lives
    fill(255, 100, 100);
    text(`Lives: ${'❤️'.repeat(playerLives)}`, 20, 80);
    
    // Draw current level
    fill(0, 255, 150);
    text(`Level: ${currentLevel}/${maxLevels}`, 20, 110);
    
    // Draw vibe energy bar
    fill(255);
    textAlign(RIGHT, TOP);
    text('Vibe Energy', width - 20, 20);
    
    // Energy bar background
    fill(50);
    stroke(100);
    strokeWeight(2);
    rect(width - 170, 45, 150, 20, 5);
    
    // Energy bar fill
    let energyColor = vibeEnergy > 50 ? color(0, 255, 150) : 
                      vibeEnergy > 25 ? color(255, 200, 0) : color(255, 60, 60);
    fill(energyColor);
    noStroke();
    rect(width - 168, 47, map(vibeEnergy, 0, 100, 0, 146), 16, 3);
    
    // Draw portal hint if enough tokens
    if (tokensCollected >= tokensNeeded && exitPortal) {
        fill(0, 255, 150);
        textAlign(CENTER, TOP);
        textSize(16);
        text('🚀 Portal Open! Go to the green portal!', width/2, height - 30);
    } else if (exitPortal) {
        fill(150);
        textAlign(CENTER, TOP);
        textSize(14);
        text(`Collect ${tokensNeeded - tokensCollected} more tokens to open the portal`, width/2, height - 30);
    }
    
    // Draw player icon (developer character)
    drawPlayerIcon();
}

function drawPlayerIcon() {
    // Draw a cute developer icon on the player sprite
    push();
    translate(player.x, player.y);
    
    // Glasses
    stroke(255);
    strokeWeight(2);
    noFill();
    rect(-12, -5, 10, 8, 2);
    rect(2, -5, 10, 8, 2);
    line(-2, -1, 2, -1);
    
    // Eyes behind glasses
    fill(255);
    noStroke();
    ellipse(-7, -1, 4, 4);
    ellipse(7, -1, 4, 4);
    
    // Pupils (looking in movement direction)
    fill(0);
    let pupilOffset = player.vel.x > 0.5 ? 1 : (player.vel.x < -0.5 ? -1 : 0);
    ellipse(-7 + pupilOffset, -1, 2, 2);
    ellipse(7 + pupilOffset, -1, 2, 2);
    
    // Smile
    stroke(255);
    strokeWeight(2);
    noFill();
    arc(0, 5, 12, 8, 0, PI);
    
    // Hair/hat (laptop)
    fill(100, 100, 120);
    stroke(80, 80, 100);
    strokeWeight(1);
    rect(-10, -18, 20, 12, 2);
    
    // Screen glow
    fill(0, 200, 255, 150);
    noStroke();
    rect(-8, -16, 16, 8, 1);
    
    pop();
}

function drawLevelComplete() {
    // Overlay
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    
    // Message
    fill(0, 255, 150);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(`Level ${currentLevel} Complete!`, width/2, height/2 - 60);
    
    fill(255);
    textSize(24);
    text(`Score: ${score}`, width/2, height/2);
    text(`Tokens Collected: ${tokensCollected}`, width/2, height/2 + 40);
    
    fill(200);
    textSize(18);
    text('Press SPACE to continue', width/2, height/2 + 100);
    
    if (kb.presses('space')) {
        currentLevel++;
        initializeLevel(currentLevel);
    }
}

function drawGameWon() {
    // Celebration overlay
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    
    // Victory message
    fill(255, 215, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('🎉 YOU WON! 🎉', width/2, height/2 - 80);
    
    fill(0, 255, 150);
    textSize(28);
    text('The Vibe Coder is Unstoppable!', width/2, height/2 - 30);
    
    fill(255);
    textSize(22);
    text(`Final Score: ${score}`, width/2, height/2 + 20);
    text(`Total Tokens: ${tokensCollected}`, width/2, height/2 + 55);
    
    fill(200);
    textSize(16);
    text('You collected enough tokens to vibe code forever!', width/2, height/2 + 100);
    text('Press R to play again', width/2, height/2 + 130);
    
    if (kb.presses('r')) {
        currentLevel = 1;
        score = 0;
        playerLives = 3;
        initializeLevel(currentLevel);
    }
}

function drawGameOver() {
    // Dark overlay
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    
    // Game over message
    fill(255, 60, 60);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width/2, height/2 - 60);
    
    fill(200);
    textSize(24);
    text('You ran out of vibe energy!', width/2, height/2);
    text(`Final Score: ${score}`, width/2, height/2 + 40);
    
    fill(150);
    textSize(18);
    text('Press R to try again', width/2, height/2 + 100);
    
    if (kb.presses('r')) {
        currentLevel = 1;
        score = 0;
        playerLives = 3;
        initializeLevel(currentLevel);
    }
}
