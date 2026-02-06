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
   function createScene() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // تعيين حجم الكانفاس
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // السماء (تدرج جميل)
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#87CEEB'); // أزرق فاتح
    skyGradient.addColorStop(1, '#E0F7FF'); // أزرق فاتح جداً
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // الشمس
    ctx.beginPath();
    ctx.arc(100, 100, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    
    // الغيوم
    drawCloud(ctx, 300, 80);
    drawCloud(ctx, 500, 120);
    drawCloud(ctx, 200, 180);
    
    // الجزيرة (أرض)
    ctx.beginPath();
    ctx.ellipse(canvas.width/2, canvas.height/2 + 100, 400, 300, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#8B4513'; // تربة
    ctx.fill();
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // العشب على الجزيرة
    ctx.beginPath();
    ctx.ellipse(canvas.width/2, canvas.height/2 + 100, 380, 280, 0, 0, Math.PI * 2);
    const grassGradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2 + 100, 0,
        canvas.width/2, canvas.height/2 + 100, 380
    );
    grassGradient.addColorStop(0, '#7CFC00'); // أخضر فاتح
    grassGradient.addColorStop(1, '#228B22'); // أخضر غابة
    ctx.fillStyle = grassGradient;
    ctx.fill();
    
    // البيت الخشبي
    drawHouse(ctx, canvas.width/2 - 200, canvas.height/2 - 50);
    
    // الأشجار
    for(let i = 0; i < 15; i++) {
        drawTree(ctx, 
            canvas.width/2 - 300 + Math.random() * 250,
            canvas.height/2 - 200 + Math.random() * 150
        );
    }
    
    // شاطئ رملي
    ctx.beginPath();
    ctx.ellipse(canvas.width/2, canvas.height/2 + 180, 420, 320, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#F4E4A6'; // لون رملي
    ctx.fill();
    
    // الماء
    ctx.beginPath();
    ctx.rect(0, canvas.height/2 + 250, canvas.width, canvas.height/2);
    const waterGradient = ctx.createLinearGradient(0, canvas.height/2 + 250, 0, canvas.height);
    waterGradient.addColorStop(0, '#1E90FF'); // أزرق ماء
    waterGradient.addColorStop(1, '#00008B'); // أزرق داكن
    ctx.fillStyle = waterGradient;
    ctx.fill();
    
    // أمواج
    drawWaves(ctx);
    
    // إسطبل الأحصنة
    drawStable(ctx, canvas.width/2 + 150, canvas.height/2 + 50);
    
    // الحصان
    drawHorse(ctx, canvas.width/2 + 200, canvas.height/2 + 100);
    
    // كومة الحطب
    drawWoodPile(ctx, canvas.width/2 - 100, canvas.height/2 + 150);
    
    // الشخصية (اللاعب)
    drawCharacter(ctx, canvas.width/2, canvas.height/2);
    
    // الكلب
    drawDog(ctx, canvas.width/2 + 50, canvas.height/2 + 50);
    
    console.log('🎨 تم رسم المشهد!');
}

// دالة لرسم غيمة
function drawCloud(ctx, x, y) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y - 15, 25, 0, Math.PI * 2);
    ctx.arc(x + 45, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y + 10, 25, 0, Math.PI * 2);
    ctx.fill();
}

// دالة لرسم بيت خشبي
function drawHouse(ctx, x, y) {
    // الأساس
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y, 120, 100);
    
    // السقف
    ctx.fillStyle = '#A52A2A';
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 60, y - 50);
    ctx.lineTo(x + 130, y);
    ctx.closePath();
    ctx.fill();
    
    // الباب
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + 50, y + 40, 30, 60);
    
    // النوافذ
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + 20, y + 30, 20, 20); // نافذة يسار
    ctx.fillRect(x + 85, y + 30, 20, 20); // نافذة يمين
    
    // مدخنة
    ctx.fillStyle = '#696969';
    ctx.fillRect(x + 90, y - 60, 15, 40);
}

// دالة لرسم شجرة
function drawTree(ctx, x, y) {
    // الجذع
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 10, y, 20, 60);
    
    // الأوراق
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(x, y - 20, 40, 0, Math.PI * 2);
    ctx.arc(x - 30, y - 10, 35, 0, Math.PI * 2);
    ctx.arc(x + 30, y - 10, 35, 0, Math.PI * 2);
    ctx.arc(x, y - 60, 30, 0, Math.PI * 2);
    ctx.fill();
}

// دالة لرسم أمواج
function drawWaves(ctx) {
    const canvas = document.getElementById('game-canvas');
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    
    for(let i = 0; i < 10; i++) {
        ctx.beginPath();
        const waveY = canvas.height/2 + 280 + Math.sin(Date.now()/1000 + i) * 10;
        ctx.moveTo(0, waveY + i * 15);
        for(let x = 0; x < canvas.width; x += 20) {
            const y = waveY + i * 15 + Math.sin(x/50 + Date.now()/1000) * 8;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

// دالة لرسم إسطبل
function drawStable(ctx, x, y) {
    ctx.fillStyle = '#D2691E';
    ctx.fillRect(x, y, 100, 80);
    
    // سقف الإسطبل
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 50, y - 40);
    ctx.lineTo(x + 110, y);
    ctx.closePath();
    ctx.fill();
    
    // باب الإسطبل
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 35, y + 20, 30, 60);
}

// دالة لرسم حصان
function drawHorse(ctx, x, y) {
    // الجسم
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 30, y - 20, 60, 40);
    
    // الرقبة والرأس
    ctx.fillRect(x + 20, y - 40, 20, 40);
    
    // الرأس
    ctx.beginPath();
    ctx.ellipse(x + 35, y - 55, 10, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // الأرجل
    ctx.fillRect(x - 25, y + 20, 10, 30);
    ctx.fillRect(x - 5, y + 20, 10, 30);
    ctx.fillRect(x + 15, y + 20, 10, 30);
    ctx.fillRect(x + 35, y + 20, 10, 30);
    
    // الذيل
    ctx.beginPath();
    ctx.moveTo(x - 35, y - 10);
    ctx.quadraticCurveTo(x - 60, y, x - 50, y - 30);
    ctx.quadraticCurveTo(x - 40, y - 20, x - 35, y - 10);
    ctx.fill();
    
    // العين
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + 40, y - 55, 3, 0, Math.PI * 2);
    ctx.fill();
}

// دالة لرسم كومة حطب
function drawWoodPile(ctx, x, y) {
    ctx.fillStyle = '#654321';
    
    // قطع خشب متراكمة
    for(let i = 0; i < 10; i++) {
        const woodX = x + (i % 5) * 20;
        const woodY = y + Math.floor(i / 5) * 15;
        ctx.fillRect(woodX, woodY, 40, 10);
    }
    
    // فأس
    ctx.fillStyle = '#808080'; // معدن
    ctx.fillRect(x - 10, y + 50, 30, 5); // مقبض
    ctx.beginPath();
    ctx.moveTo(x + 25, y + 45);
    ctx.lineTo(x + 45, y + 52);
    ctx.lineTo(x + 35, y + 60);
    ctx.closePath();
    ctx.fill();
}

// دالة لرسم الشخصية (اللاعب)
function drawCharacter(ctx, x, y) {
    // الرأس
    ctx.fillStyle = '#FFCC99'; // لون البشرة
    ctx.beginPath();
    ctx.arc(x, y - 40, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // الجسم (قميص)
    ctx.fillStyle = '#4169E1'; // أزرق
    ctx.fillRect(x - 25, y - 20, 50, 60);
    
    // الساقين
    ctx.fillStyle = '#228B22'; // أخضر (بنطلون)
    ctx.fillRect(x - 20, y + 40, 15, 40); // ساق يسار
    ctx.fillRect(x + 5, y + 40, 15, 40); // ساق يمين
    
    // الذراعين
    ctx.fillStyle = '#4169E1'; // نفس لون القميص
    ctx.fillRect(x - 35, y - 15, 10, 40); // ذراع يسار
    ctx.fillRect(x + 25, y - 15, 10, 40); // ذراع يمين
    
    // العينين
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 8, y - 45, 3, 0, Math.PI * 2); // عين يسار
    ctx.arc(x + 8, y - 45, 3, 0, Math.PI * 2); // عين يمين
    ctx.fill();
    
    // الفم
    ctx.beginPath();
    ctx.arc(x, y - 35, 8, 0, Math.PI); // ابتسامة
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // الشعر
    ctx.fillStyle = '#8B4513'; // بني
    ctx.beginPath();
    ctx.arc(x, y - 55, 15, 0, Math.PI * 2);
    ctx.fill();
}

// دالة لرسم كلب
function drawDog(ctx, x, y) {
    // الجسم
    ctx.fillStyle = '#A0522D'; // بني
    ctx.fillRect(x - 20, y - 15, 40, 25);
    
    // الرأس
    ctx.beginPath();
    ctx.ellipse(x + 25, y - 20, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // الأذنين
    ctx.beginPath();
    ctx.moveTo(x + 30, y - 30);
    ctx.lineTo(x + 40, y - 40);
    ctx.lineTo(x + 35, y - 30);
    ctx.closePath();
    ctx.fill();
    
    // الساقين
    ctx.fillRect(x - 15, y + 10, 8, 20);
    ctx.fillRect(x - 5, y + 10, 8, 20);
    ctx.fillRect(x + 5, y + 10, 8, 20);
    ctx.fillRect(x + 15, y + 10, 8, 20);
    
    // الذيل
    ctx.beginPath();
    ctx.moveTo(x - 25, y - 10);
    ctx.quadraticCurveTo(x - 40, y - 5, x - 35, y - 20);
    ctx.fill();
    
    // العين
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + 30, y - 20, 2, 0, Math.PI * 2);
    ctx.fill();
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
