// game.js - النسخة المحدثة والمتكاملة

// تهيئة اللعبة
let game = null;
let player = null;
let island = null;
let aiDirector = null;
let combatSystem = null;
let injurySystem = null;
let uiManager = null;
let effectsManager = null;
let adminPanel = null;

// عناصر DOM
const loginScreen = document.getElementById('login-screen');
const adminScreen = document.getElementById('admin-screen');
const gameScreen = document.getElementById('game-screen');
const passwordInput = document.getElementById('password');
const enterBtn = document.getElementById('enter-btn');
const adminLink = document.getElementById('admin-link');

// بيانات اللعبة
const gameState = {
    password: "بداية",
    playerData: {
        health: 100,
        trust: 50,
        hunger: 100,
        energy: 100
    },
    world: {
        time: 6,
        mood: 'calm',
        weather: 'clear'
    },
    inventory: ['hand']
};

// مفاتيح الكيبورد المضغوطة
const keys = {};

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

// تهيئة اللعبة
function initGame() {
    console.log('🚀 بدء تهيئة اللعبة...');
    
    // تهيئة الكائنات
    player = new Player();
    island = new Island();
    aiDirector = new AIDirector();
    combatSystem = new CombatSystem();
    injurySystem = new InjurySystem();
    uiManager = new UIManager();
    effectsManager = new EffectsManager();
    adminPanel = new AdminPanel();
    
    // جعل الكائنات متاحة عالمياً
    window.player = player;
    window.island = island;
    window.aiDirector = aiDirector;
    window.combatSystem = combatSystem;
    window.gameState = gameState;
    
    // تهيئة Kaboom
    initKaboom();
    
    // تهيئة الواجهة
    uiManager.init();
    
    // تهيئة المؤثرات
    effectsManager.init();
    effectsManager.addCSSAnimations();
    
    // تهيئة لوحة الأدمن
    adminPanel.init();
    
    // بدء دورة اللعبة
    startGameLoop();
    
    console.log('✅ اللعبة جاهزة!');
}

function initKaboom() {
    // تهيئة Kaboom
    game = kaboom({
        width: window.innerWidth,
        height: window.innerHeight,
        canvas: document.getElementById('game-canvas'),
        background: [0, 0, 0],
        global: false
    });
    
    // تحميل الأصول (افتراضية)
    loadAssets();
    
    // إنشاء المشهد
    createScene();
    
    // إعداد أدوات التحكم
    setupControls();
}

function loadAssets() {
    // هنا سنضيف الصور والأصوات لاحقاً
    console.log("📦 جار تحميل الأصول...");
    
    // تحميل الصور الافتراضية
    game.loadSprite("player", "https://kaboomjs.com/example/sprites/bean.png");
    game.loadSprite("tree", "https://kaboomjs.com/example/sprites/tree.png");
    game.loadSprite("house", "https://kaboomjs.com/example/sprites/block.png");
}

function createScene() {
    // السماء
    game.add([
        game.rect(game.width(), game.height()),
        game.color(70, 130, 180),
        game.pos(0, 0),
        game.fixed(),
        "sky"
    ]);
    
    // الأرض (الجزيرة)
    const islandObj = game.add([
        game.ellipse(600, 450),
        game.color(34, 139, 34),
        game.pos(game.center().x, game.center().y + 50),
        game.area(),
        game.body({ isStatic: true }),
        "island"
    ]);
    
    // البيت
    const house = game.add([
        game.rect(100, 80),
        game.color(139, 69, 19),
        game.pos(islandObj.pos.x - 200, islandObj.pos.y - 50),
        game.area(),
        game.body({ isStatic: true }),
        "house",
        "interactive"
    ]);
    
    // الأشجار
    for (let i = 0; i < 10; i++) {
        game.add([
            game.rect(40, 60),
            game.color(0, 100, 0),
            game.pos(
                islandObj.pos.x - 150 + Math.random() * 300,
                islandObj.pos.y - 200 + Math.random() * 150
            ),
            game.area(),
            game.body({ isStatic: true }),
            "tree",
            "interactive"
        ]);
    }
    
    // اللاعب
    const playerObj = game.add([
        game.rect(30, 50),
        game.color(255, 0, 0),
        game.pos(game.center()),
        game.area(),
        game.body(),
        "player"
    ]);
    
    // تخزين كائن اللاعب
    player.element = playerObj;
}

function setupControls() {
    // تتبع مفاتيح الكيبورد
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        keys[e.code] = true;
        
        // تحكم سريع بالأدمن (Ctrl+Shift+A)
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            if (adminPanel) {
                adminPanel.togglePanel();
            }
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        keys[e.code] = false;
    });
    
    // الفأرة
    game.onClick("interactive", (item) => {
        showMessage(`نظرت إلى ${item.has("house") ? "البيت" : "الشجرة"}`);
    });
    
    // تغيير الأدوات
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tool = btn.dataset.tool;
            if (player) {
                player.switchItem(tool === 'hand' ? 0 : player.inventory.items.indexOf(tool));
                showMessage(`اخترت ${tool === 'hand' ? 'اليدين' : tool}`);
            }
        });
    });
}

function startGameLoop() {
    // دورة اللعبة الرئيسية
    const gameLoop = () => {
        updateGame();
        renderGame();
        requestAnimationFrame(gameLoop);
    };
    
    // بدء الدورة
    gameLoop();
    
    // تحديث الوقت
    setInterval(() => {
        gameState.world.time = (gameState.world.time + 0.1) % 24;
        updateTimeDisplay();
        
        // تحديث الجزيرة
        if (island) {
            island.updateTime();
        }
        
        // تحديث المؤثرات
        if (effectsManager) {
            effectsManager.updateDayNight();
        }
    }, 60000);
}

function updateGame() {
    // تحديث اللاعب
    if (player) {
        player.update(keys);
        
        // تحديث موقع كائن اللاعب
        if (player.element) {
            player.element.pos.x = player.position.x;
            player.element.pos.y = player.position.y;
        }
        
        // تحديث الإصابات
        if (injurySystem) {
            injurySystem.update(player.stats);
        }
    }
    
    // تحديث AI Director
    if (aiDirector && player) {
        aiDirector.update(player, gameState.world);
    }
    
    // تحديث نظام القتال
    if (combatSystem) {
        combatSystem.update();
    }
    
    // تحديث المؤثرات
    if (effectsManager) {
        effectsManager.updateParticles();
    }
    
    // تحديث الواجهة
    if (uiManager) {
        uiManager.updateUI();
    }
}

function renderGame() {
    // Kaboom يتولى الرسم تلقائياً
    // نضيف هنا أي رسم إضافي إذا لزم
}

function updateTimeDisplay() {
    const hour = Math.floor(gameState.world.time);
    const minute = Math.floor((gameState.world.time % 1) * 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = timeStr;
    }
    
    // تحديث الصحة والثقة
    const healthDisplay = document.getElementById('health-display');
    const trustDisplay = document.getElementById('trust-display');
    
    if (healthDisplay && player) {
        healthDisplay.textContent = Math.floor(player.stats.health);
    }
    
    if (trustDisplay) {
        trustDisplay.textContent = gameState.playerData.trust;
    }
}

function showMessage(text) {
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    
    if (messageBox && messageText) {
        messageText.textContent = text;
        messageBox.classList.remove('hidden');
        
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
    
    // إضافة إشعار في الواجهة
    if (uiManager) {
        uiManager.addNotification(text, 'info');
    }
}

// جعل الدالة متاحة عالمياً
window.showMessage = showMessage;

// حفظ اللعبة
function saveGame() {
    if (player && gameState) {
        const saveData = {
            player: {
                position: player.position,
                stats: player.stats,
                inventory: player.inventory
            },
            gameState: gameState,
            timestamp: new Date()
        };
        
        localStorage.setItem('eden_island_save', JSON.stringify(saveData));
        showMessage('💾 تم حفظ اللعبة بنجاح!');
    }
}

function loadGame() {
    const saved = localStorage.getItem('eden_island_save');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            
            // تحميل بيانات اللاعب
            if (player && data.player) {
                player.position = data.player.position || player.position;
                player.stats = data.player.stats || player.stats;
                player.inventory = data.player.inventory || player.inventory;
            }
            
            // تحميل حالة اللعبة
            if (data.gameState) {
                Object.assign(gameState, data.gameState);
            }
            
            console.log('🔄 تم تحميل الحفظ السابق');
        } catch (e) {
            console.error('❌ خطأ في تحميل الحفظ:', e);
        }
    }
}

// تحميل اللعبة عند البدء
window.addEventListener('load', () => {
    loadGame();
    
    // تحميل أنماط الاهتزاز
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);
});

// حفظ عند الخروج
window.addEventListener('beforeunload', (e) => {
    saveGame();
    
    // تأكيد الخروج إذا كان هناك تقدم غير محفوظ
    if (player && player.stats.health < 100) {
        e.preventDefault();
        e.returnValue = 'لديك تقدم غير محفوظ. هل تريد المغادرة؟';
        return e.returnValue;
    }
});

// إعادة ضبط الحجم عند تغيير حجم النافذة
window.addEventListener('resize', () => {
    if (game) {
        // إعادة ضبط حجم الكانفاس
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }
});

// تصدير للاختبارات
if (typeof module !== 'undefined') {
    module.exports = {
        gameState,
        enterGame,
        initGame,
        saveGame,
        loadGame
    };
}
