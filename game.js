const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏对象
const game = {
    player: {
        x: 400,
        y: 500,
        width: 50,
        height: 50,
        speed: 5
    },
    obstacles: [],
    items: [],
    score: 0,
    isGameOver: false
};

// 初始化障碍物
function createObstacle() {
    return {
        x: Math.random() * (canvas.width - 30),
        y: -50,
        width: 30,
        height: 30,
        speed: 3
    };
}

// 初始化道具
function createItem() {
    return {
        x: Math.random() * (canvas.width - 20),
        y: -30,
        width: 20,
        height: 20,
        speed: 2
    };
}

// 控制玩家移动
document.addEventListener('keydown', (event) => {
    if (!game.isGameOver) {
        switch(event.key) {
            case 'ArrowLeft':
                if (game.player.x > 0) {
                    game.player.x -= game.player.speed;
                }
                break;
            case 'ArrowRight':
                if (game.player.x < canvas.width - game.player.width) {
                    game.player.x += game.player.speed;
                }
                break;
            case 'Space':
                // 紧急迫降功能
                game.player.y = 500;
                break;
        }
    }
});

// 检测碰撞
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 更新游戏状态
function update() {
    if (game.isGameOver) return;

    // 生成障碍物
    if (Math.random() < 0.02) {
        game.obstacles.push(createObstacle());
    }

    // 生成道具
    if (Math.random() < 0.01) {
        game.items.push(createItem());
    }

    // 更新障碍物位置
    game.obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;
        if (obstacle.y > canvas.height) {
            game.obstacles.splice(index, 1);
        }
        if (checkCollision(game.player, obstacle)) {
            game.isGameOver = true;
        }
    });

    // 更新道具位置
    game.items.forEach((item, index) => {
        item.y += item.speed;
        if (item.y > canvas.height) {
            game.items.splice(index, 1);
        }
        if (checkCollision(game.player, item)) {
            game.score += 10;
            game.items.splice(index, 1);
        }
    });
}

// 绘制游戏画面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家
    ctx.fillStyle = 'blue';
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);

    // 绘制障碍物
    ctx.fillStyle = 'red';
    game.obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // 绘制道具
    ctx.fillStyle = 'green';
    game.items.forEach(item => {
        ctx.fillRect(item.x, item.y, item.width, item.height);
    });

    // 绘制分数
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`分数: ${game.score}`, 10, 30);

    if (game.isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('游戏结束!', canvas.width/2 - 100, canvas.height/2);
    }
}

// 游戏主循环
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 开始游戏
gameLoop(); 