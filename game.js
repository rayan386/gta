// تهيئة اللعبة
let game = null;
let player = null;
let aiDirector = null;
let currentTool = 'hand';

// عناصر DOM
const loginScreen = document.getElementById('login-screen');
const adminScreen = document.getElementById('admin-screen');
const gameScreen = document.getElementById('game-screen');
const passwordInput = document.getElementById('password');
const enterBtn = document.getElementById('enter-btn');
const adminLink = document.getElementById('admin-link');

// بيانات اللعبة
const gameState = {
    password: "بداية",  // كلمة المرور الافتراضية
    playerData: {
        health: 100,
        trust: 50,
        hunger: 100,
        energy: 100
    },
    world: {
        time: 6,  // 06:00
        mood: 'calm',
        weather: 'clear'
    },
    inventory: ['hand']
};

// الدخول إلى اللعبة
enterBtn.addEventListener('click', enterGame);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enterGame();
});

function enterGame() {
    if (passwordInput.value === gameState.password) {
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            initGame();
        }, 500);
    } else {
        passwordInput.style.borderColor = '#ff4444';
        passwordInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }
}

// رابط الأدمن المخفي
adminLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginScreen.classList.add('hidden');
    adminScreen.classList.remove('hidden');
});

// تهيئة اللعبة مع Kaboom
function initGame() {
    // تهيئة Kaboom
    game = kaboom({
        width: window.innerWidth,
        height: window.innerHeight,
        canvas: document.getElementById('game-canvas'),
        background: [0, 0, 0],
        global: false
    });

    // تحميل الأصول
    loadAssets();
    
    // إنشاء المشهد
    createScene();
    
    // إضافة أدوات التحكم
    setupControls();
    
    // بدء دورة اللعبة
    startGameLoop();
}

function loadAssets() {
    // هنا سنضيف الصور والأصوات لاحقاً
    console.log("جار تحميل الأصول...");
}

function createScene() {
    // السماء
    game.add([
        game.rect(game.width(), game.height()),
        game.color(70, 130, 180),
        game.pos(0, 0),
        game.fixed()
    ]);

    // الأرض (الجزيرة)
    const island = game.add([
        game.ellipse(600, 450),
        game.color(34, 139, 34),
        game.pos(game.center().x, game.center().y + 50),
        game.area(),
        game.body(),
        "island"
    ]);

    // البيت
    game.add([
        game.rect(100, 80),
        game.color(139, 69, 19),
        game.pos(island.pos.x - 200, island.pos.y - 50),
        game.area(),
        "house",
        "interactive"
    ]);

    // الغابة
    for (let i = 0; i < 20; i++) {
        game.add([
            game.rect(40, 60),
            game.color(0, 100, 0),
            game.pos(
                island.pos.x - 100 + Math.random() * 200,
                island.pos.y - 150 + Math.random() * 100
            ),
            game.area(),
            "forest",
            "interactive"
        ]);
    }

    // الشاطئ
    game.add([
        game.ellipse(650, 500),
        game.color(240, 230, 140),
        game.pos(island.pos.x, island.pos.y),
        game.outline(2, game.Color.fromHex("#8B4513"))
    ]);
}

function setupControls() {
    // حركة اللاعب
    game.onKeyDown("left", () => {
        // حركة لليسار
    });
    
    game.onKeyDown("right", () => {
        // حركة لليمين
    });
    
    // تفاعل مع العناصر
    game.onClick("interactive", (item) => {
        showMessage(`نظرت إلى ${item.has("house") ? "البيت" : "الشجرة"}`);
    });

    // تغيير الأدوات
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentTool = btn.dataset.tool;
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function startGameLoop() {
    // تحديث الوقت
    setInterval(() => {
        gameState.world.time = (gameState.world.time + 0.1) % 24;
        updateTimeDisplay();
    }, 60000); // كل دقيقة حقيقية = 0.1 ساعة لعب
}

function updateTimeDisplay() {
    const hour = Math.floor(gameState.world.time);
    const minute = Math.floor((gameState.world.time % 1) * 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    document.getElementById('time-display').textContent = timeStr;
    
    // تحديث الصحة والثقة
    document.getElementById('health-display').textContent = gameState.playerData.health;
    document.getElementById('trust-display').textContent = gameState.playerData.trust;
}

function showMessage(text) {
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    
    messageText.textContent = text;
    messageBox.classList.remove('hidden');
    
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

// حفظ اللعبة
function saveGame() {
    localStorage.setItem('eden_island_save', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('eden_island_save');
    if (saved) {
        Object.assign(gameState, JSON.parse(saved));
    }
}

// تحميل اللعبة عند البدء
window.addEventListener('load', loadGame);
// حفظ عند الخروج
window.addEventListener('beforeunload', saveGame);
