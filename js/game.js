const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Carregar imagens
const playerImg = new Image();
const asteroidImg = new Image();
const bulletImg = new Image();

playerImg.src = 'images/player.png';
asteroidImg.src = 'images/asteroid.png';
bulletImg.src = 'images/bullet.png';

// Posição inicial e dimensões do jogador
let player = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50 };
let bullets = [];
let asteroids = [];
let score = 0;
let isGameOver = false;
let lastShotTime = 0;
let lives = 3; // Três vidas para a nave
const shotCooldown = 900; // 900ms entre disparos

function renderAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.save();
        ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2); // Mover a origem para o centro do asteroide
        ctx.rotate(asteroid.rotation * Math.PI / 180); // Aplicar a rotação
        ctx.drawImage(asteroidImg, -asteroid.width / 2, -asteroid.height / 2, asteroid.width, asteroid.height); // Desenhar o asteroide
        ctx.restore();
    });
}

// Função para desenhar vidas
function drawLives() {
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(playerImg, 20 + i * 30, 40, 20, 20); // Ícones menores no topo esquerdo
    }
}

// Função para desenhar a tela de morte
function drawGameOver() {
    ctx.fillStyle = "#f00";
    ctx.font = "24px 'Press Start 2P', cursive";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2 - 50);
    ctx.font = "18px 'Press Start 2P', cursive";
    ctx.fillText("Press R to Restart", canvas.width / 2 - 150, canvas.height / 2);
    ctx.fillText("Press M for Menu", canvas.width / 2 - 120, canvas.height / 2 + 50);
}

// Função para desenhar a tela do jogo
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar jogador
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Desenhar projéteis
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Desenhar asteroides
    renderAsteroids();

    // Desenhar pontuação e vidas
    ctx.fillStyle = "#0f0";
    ctx.font = "18px 'Press Start 2P', cursive";
    ctx.fillText(`Score: ${score}`, 20, 30);
    drawLives();

    if (!isGameOver) {
        requestAnimationFrame(render);
    } else {
        drawGameOver();
    }
}

// Função para atirar
function shoot() {
    const now = Date.now();
    if (now - lastShotTime > shotCooldown) {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 20 });
        lastShotTime = now;
    }
}

// Função para spawnar asteroides
function spawnAsteroid() {
    const asteroidWidth = 50;
    const asteroidHeight = 50;
    const asteroidX = Math.floor(Math.random() * (canvas.width - asteroidWidth));
    const speed = Math.random() * 3 + 1; // Velocidade randomizada entre 1 e 4 (ajustável)
    const rotation = Math.random() * 360; // Rotação randomizada entre 0 e 360 graus
    asteroids.push({ x: asteroidX, y: 0, width: asteroidWidth, height: asteroidHeight, speed: speed, rotation: rotation });
}

// Atualizando funções conforme necessário (movimento, colisão, etc.)
function updateBullets() {
    bullets = bullets.filter(bullet => {
        bullet.y -= 5;
        return bullet.y + bullet.height >= 0; // Manter apenas os projéteis dentro da tela
    });
}

function updateAsteroids() {
    asteroids = asteroids.filter(asteroid => {
        asteroid.y += asteroid.speed; // Usar a velocidade específica do asteroide
        return asteroid.y <= canvas.height; // Manter apenas os asteroides dentro da tela
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        asteroids.forEach((asteroid, aIndex) => {
            if (
                bullet.x < asteroid.x + asteroid.width &&
                bullet.x + bullet.width > asteroid.x &&
                bullet.y < asteroid.y + asteroid.height &&
                bullet.y + bullet.height > asteroid.y
            ) {
                bullets.splice(bIndex, 1);
                asteroids.splice(aIndex, 1);
                score += 10;
            }
        });
    });

    asteroids.forEach((asteroid, aIndex) => {
        if (
            player.x < asteroid.x + asteroid.width &&
            player.x + player.width > asteroid.x &&
            player.y < asteroid.y + asteroid.height &&
            player.y + player.height > asteroid.y
        ) {
            asteroids.splice(aIndex, 1);
            lives--;
            if (lives <= 0) {
                endGame();
            }
        }
    });
}

// Função para encerrar o jogo
function endGame() {
    isGameOver = true;
    drawGameOver();
}

// Função para reiniciar o jogo
function resetGame() {
    isGameOver = false;
    score = 0;
    lives = 3;
    bullets = [];
    asteroids = [];
    player.x = canvas.width / 2 - 25;
    gameLoop();
}

// Adicionar eventos para reiniciar ou voltar ao menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' && isGameOver) {
        resetGame();
    } else if (e.key === 'm' && isGameOver) {
        showMenu();
    }
});

// Função para mostrar o menu principal
function showMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = "24px 'Press Start 2P', cursive";
    ctx.fillText("GALAGA CLONE", canvas.width / 2 - 150, canvas.height / 2 - 100);
    ctx.font = "18px 'Press Start 2P', cursive";
    ctx.fillText("Press S to Start", canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText("Press L for Leaderboard", canvas.width / 2 - 150, canvas.height / 2 + 50);

    document.addEventListener('keydown', (e) => {
        if (e.key === 's') {
            resetGame();
        } else if (e.key === 'l') {
            showLeaderboard();
        }
    });
}

// Função para mostrar o leaderboard
function showLeaderboard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = "24px 'Press Start 2P', cursive";
    ctx.fillText("LEADERBOARD", canvas.width / 2 - 150, 100);

    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    ctx.font = "18px 'Press Start 2P', cursive";

    scores.forEach((score, index) => {
        ctx.fillText(`${index + 1}. ${score}`, canvas.width / 2 - 100, 150 + index * 30);
    });

    ctx.fillText("Press M to Return to Menu", canvas.width / 2 - 180, canvas.height - 50);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'm') {
            showMenu();
        }
    });
}

// Função para movimentar o jogador
let keysPressed = {};
let isShooting = false;
document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
    if (e.key === ' ') {
        isShooting = true;
    }
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
    if (e.key === ' ') {
        isShooting = false;
    }
});

function movePlayer() {
    const playerSpeed = 3.5; // Ajuste esta variável para controlar a velocidade do jogador

    if (keysPressed['ArrowLeft'] && player.x > 0) {
        player.x -= playerSpeed;
    }
    if (keysPressed['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += playerSpeed;
    }
    if (isShooting) {
        shoot();
    }
}

// Loop principal do jogo
function gameLoop() {
    if (!isGameOver) {
        movePlayer();
        updateBullets();
        updateAsteroids();
        checkCollisions();
        render();
        requestAnimationFrame(gameLoop);
    }
}

// Iniciar o loop do jogo
showMenu();
spawnAsteroid();
setInterval(spawnAsteroid, 2000);
