// 🎮 جزيرة إيدن - الإصدار الخيالي (400 سطر)
// ⚡ جرافيك خيالي + أنشطة كاملة + شخصية مفصلة

// ==================== التهيئة ====================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 800;

let gameTime = 0;
let isRidingHorse = false;
let isSleeping = false;
let playerMoney = 5000;
let playerHealth = 100;
let inventory = { wood: 0, food: 5, arrows: 10 };

// ==================== الشخصية ====================
class Player {
    constructor() {
        this.x = 600;
        this.y = 400;
        this.speed = isRidingHorse ? 8 : 5;
        this.direction = 'down';
        this.animationFrame = 0;
        this.colorShirt = '#4169E1';
        this.colorPants = '#228B22';
        this.hatColor = '#8B4513';
    }

    update(keys) {
        if (isSleeping) return;
        
        this.animationFrame += 0.2;
        this.speed = isRidingHorse ? 8 : 5;
        
        if (keys['ArrowUp'] || keys['w']) {
            this.y -= this.speed;
            this.direction = 'up';
        }
        if (keys['ArrowDown'] || keys['s']) {
            this.y += this.speed;
            this.direction = 'down';
        }
        if (keys['ArrowLeft'] || keys['a']) {
            this.x -= this.speed;
            this.direction = 'left';
        }
        if (keys['ArrowRight'] || keys['d']) {
            this.x += this.speed;
            this.direction = 'right';
        }
        
        this.x = Math.max(50, Math.min(canvas.width - 50, this.x));
        this.y = Math.max(80, Math.min(canvas.height - 80, this.y));
    }

    draw() {
        if (isSleeping) {
            this.drawSleeping();
            return;
        }
        
        if (isRidingHorse) {
            this.drawRiding();
            return;
        }
        
        this.drawWalking();
    }

    drawWalking() {
        const wave = Math.sin(this.animationFrame);
        
        // الظل
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 45, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // الساقان المتحركتان
        ctx.fillStyle = this.colorPants;
        const legOffset = wave * 8;
        
        if (this.direction === 'left' || this.direction === 'right') {
            ctx.fillRect(this.x - 12, this.y + 25 + legOffset, 8, 30);
            ctx.fillRect(this.x + 4, this.y + 25 - legOffset, 8, 30);
        } else {
            ctx.fillRect(this.x - 15, this.y + 25, 10, 35);
            ctx.fillRect(this.x + 5, this.y + 25, 10, 35);
        }
        
        // الجسم
        ctx.fillStyle = this.colorShirt;
        ctx.fillRect(this.x - 20, this.y - 15, 40, 45);
        
        // الذراعان المتحركتان
        ctx.fillStyle = this.colorShirt;
        const armOffset = wave * 12;
        
        if (this.direction === 'left') {
            ctx.fillRect(this.x - 30, this.y - 10 + armOffset, 10, 35);
            ctx.fillRect(this.x + 20, this.y - 10 - armOffset, 10, 35);
        } else if (this.direction === 'right') {
            ctx.fillRect(this.x - 30, this.y - 10 - armOffset, 10, 35);
            ctx.fillRect(this.x + 20, this.y - 10 + armOffset, 10, 35);
        } else {
            ctx.fillRect(this.x - 30, this.y - 10, 10, 40);
            ctx.fillRect(this.x + 20, this.y - 10, 10, 40);
        }
        
        // الرأس
        ctx.fillStyle = '#FFCC99';
        ctx.beginPath();
        ctx.arc(this.x, this.y - 25, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // القبعة
        ctx.fillStyle = this.hatColor;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y - 40, 22, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // الوجه حسب الاتجاه
        this.drawFace();
    }

    drawRiding() {
        // الحصان
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 10, 40, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // أرجل الحصان
        const legWave = Math.sin(this.animationFrame * 2);
        ctx.fillRect(this.x - 25, this.y + 35 + legWave * 5, 12, 35);
        ctx.fillRect(this.x - 5, this.y + 35 - legWave * 5, 12, 35);
        ctx.fillRect(this.x + 15, this.y + 35 + legWave * 5, 12, 35);
        ctx.fillRect(this.x + 35, this.y + 35 - legWave * 5, 12, 35);
        
        // رقبة الحصان
        ctx.fillRect(this.x + 35, this.y - 15, 25, 40);
        
        // رأس الحصان
        ctx.beginPath();
        ctx.ellipse(this.x + 55, this.y - 25, 15, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // عين الحصان
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 60, this.y - 25, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // اللاعب راكباً
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(this.x - 15, this.y - 40, 30, 25);
        
        // رأس اللاعب
        ctx.fillStyle = '#FFCC99';
        ctx.beginPath();
        ctx.arc(this.x, this.y - 55, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // قبعة اللاعب
        ctx.fillStyle = this.hatColor;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y - 65, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // ذيل الحصان
        ctx.fillStyle = '#8B4513';
        for(let i = 0; i < 8; i++) {
            ctx.beginPath();
            const angle = Math.PI * 0.7 + (i / 10);
            const tailX = this.x - 45 + Math.cos(angle + this.animationFrame) * 20;
            const tailY = this.y - 5 + Math.sin(angle + this.animationFrame) * 20;
            ctx.arc(tailX, tailY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawSleeping() {
        // السرير
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - 60, this.y, 120, 20);
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(this.x - 60, this.y - 10, 120, 10);
        
        // اللاعب نائماً
        ctx.fillStyle = this.colorShirt;
        ctx.fillRect(this.x - 15, this.y - 30, 30, 40);
        
        ctx.fillStyle = '#FFCC99';
        ctx.beginPath();
        ctx.arc(this.x, this.y - 40, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // علامة النوم ZZZ
        ctx.fillStyle = 'blue';
        ctx.font = '24px Arial';
        for(let i = 0; i < 3; i++) {
            const offset = i * 25;
            const wave = Math.sin(this.animationFrame * 0.5 + i) * 5;
            ctx.fillText('💤', this.x + 30 + offset, this.y - 60 + wave);
        }
    }

    drawFace() {
        ctx.fillStyle = 'black';
        
        if (this.direction === 'left') {
            ctx.beginPath();
            ctx.arc(this.x - 8, this.y - 25, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // فم جانبي
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - 15);
            ctx.lineTo(this.x - 10, this.y - 15);
            ctx.stroke();
        } else if (this.direction === 'right') {
            ctx.beginPath();
            ctx.arc(this.x + 8, this.y - 25, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - 15);
            ctx.lineTo(this.x + 10, this.y - 15);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(this.x - 6, this.y - 25, 3, 0, Math.PI * 2);
            ctx.arc(this.x + 6, this.y - 25, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // ابتسامة
            ctx.beginPath();
            ctx.arc(this.x, this.y - 15, 8, 0, Math.PI);
            ctx.stroke();
        }
    }
}

// ==================== العالم الخيالي ====================
function drawFantasyWorld() {
    // السماء السحرية
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
    const timeOfDay = (Math.sin(gameTime * 0.0001) + 1) / 2;
    skyGradient.addColorStop(0, `hsl(${210 + timeOfDay * 60}, 70%, ${60 + timeOfDay * 20}%)`);
    skyGradient.addColorStop(1, `hsl(${280 + timeOfDay * 40}, 80%, ${70 + timeOfDay * 10}%)`);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);
    
    // شمس/قمر سحري
    const celestialX = 150 + Math.sin(gameTime * 0.0002) * 100;
    const celestialY = 150 + Math.cos(gameTime * 0.0003) * 50;
    const celestialSize = 50 + Math.sin(gameTime * 0.0005) * 10;
    
    ctx.fillStyle = timeOfDay > 0.5 ? '#FFD700' : '#F0F8FF';
    ctx.beginPath();
    ctx.arc(celestialX, celestialY, celestialSize, 0, Math.PI * 2);
    ctx.fill();
    
    // تأثير توهج
    const glow = ctx.createRadialGradient(
        celestialX, celestialY, celestialSize,
        celestialX, celestialY, celestialSize * 2
    );
    glow.addColorStop(0, timeOfDay > 0.5 ? 'rgba(255,215,0,0.8)' : 'rgba(240,248,255,0.8)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);
    
    // جبال سحرية
    for(let i = 0; i < 5; i++) {
        const mountainX = (i * 300) + Math.sin(gameTime * 0.0001 + i) * 20;
        const mountainHeight = 150 + Math.sin(gameTime * 0.0003 + i) * 30;
        
        ctx.fillStyle = i % 2 === 0 ? '#2F4F4F' : '#4682B4';
        ctx.beginPath();
        ctx.moveTo(mountainX - 150, canvas.height * 0.7);
        ctx.lineTo(mountainX, canvas.height * 0.7 - mountainHeight);
        ctx.lineTo(mountainX + 150, canvas.height * 0.7);
        ctx.closePath();
        ctx.fill();
        
        // ثلوج على القمم
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(mountainX - 50, canvas.height * 0.7 - mountainHeight + 20);
        ctx.lineTo(mountainX, canvas.height * 0.7 - mountainHeight);
        ctx.lineTo(mountainX + 50, canvas.height * 0.7 - mountainHeight + 20);
        ctx.closePath();
        ctx.fill();
    }
    
    // الأرض السحرية
    const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
    groundGradient.addColorStop(0, '#32CD32');
    groundGradient.addColorStop(0.5, '#228B22');
    groundGradient.addColorStop(1, '#006400');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
    
    // أنهار ضوئية
    drawMagicRivers();
    
    // أشجار سحرية
    for(let i = 0; i < 20; i++) {
        drawMagicTree(i);
    }
    
    // البيت الخيالي
    drawMagicHouse();
    
    // البحيرة البلورية
    drawCrystalLake();
    
    // الشلال السحري
    drawMagicWaterfall();
}

function drawMagicRivers() {
    for(let i = 0; i < 3; i++) {
        const riverY = canvas.height * 0.75 + i * 50;
        ctx.strokeStyle = `hsla(${200 + i * 30}, 100%, 70%, 0.6)`;
        ctx.lineWidth = 20 + i * 5;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(-50, riverY);
        for(let x = 0; x < canvas.width + 100; x += 30) {
            const wave = Math.sin(x * 0.03 + gameTime * 0.001 + i) * 15;
            ctx.lineTo(x, riverY + wave);
        }
        ctx.stroke();
        
        // نقاط ضوء في النهر
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for(let x = 0; x < canvas.width; x += 40) {
            if (Math.random() > 0.7) {
                const lightY = riverY + Math.sin(x * 0.05 + gameTime * 0.002 + i) * 10;
                ctx.beginPath();
                ctx.arc(x, lightY, 3 + Math.sin(gameTime * 0.005 + x) * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawMagicTree(index) {
    const treeX = 100 + (index * 60) % (canvas.width - 200);
    const treeY = canvas.height * 0.75 + 50;
    const treeHeight = 80 + Math.sin(gameTime * 0.001 + index) * 20;
    const treeColor = `hsl(${120 + Math.sin(index) * 30}, 70%, 40%)`;
    const leafColor = `hsl(${90 + Math.cos(index) * 40}, 80%, 50%)`;
    
    // الجذع المتوهج
    ctx.fillStyle = treeColor;
    ctx.fillRect(treeX - 8, treeY - treeHeight, 16, treeHeight);
    
    // تأثير توهج الجذع
    ctx.strokeStyle = `hsl(${40 + Math.sin(index) * 20}, 100%, 60%)`;
    ctx.lineWidth = 2;
    ctx.strokeRect(treeX - 10, treeY - treeHeight, 20, treeHeight);
    
    // الأوراق السحرية
    for(let layer = 0; layer < 4; layer++) {
        const layerSize = 40 - layer * 8;
        const layerY = treeY - treeHeight - layer * 20;
        
        ctx.fillStyle = leafColor;
        ctx.beginPath();
        ctx.arc(treeX, layerY, layerSize, 0, Math.PI * 2);
        ctx.fill();
        
        // نقاط ضوء في الأوراق
        ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
        for(let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + gameTime * 0.001;
            const lightX = treeX + Math.cos(angle) * (layerSize * 0.7);
            const lightY = layerY + Math.sin(angle) * (layerSize * 0.7);
            const lightSize = 2 + Math.sin(gameTime * 0.005 + i) * 1.5;
            
            ctx.beginPath();
            ctx.arc(lightX, lightY, lightSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // فواكه سحرية
    if (index % 3 === 0) {
        ctx.fillStyle = `hsl(${Math.sin(index + gameTime * 0.001) * 360}, 100%, 60%)`;
        for(let i = 0; i < 5; i++) {
            const fruitX = treeX + Math.cos(i * 1.2) * 25;
            const fruitY = treeY - treeHeight + 20 + Math.sin(i * 1.2) * 15;
            ctx.beginPath();
            ctx.arc(fruitX, fruitY, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawMagicHouse() {
    const houseX = canvas.width * 0.7;
    const houseY = canvas.height * 0.65;
    
    // الأساس البلوري
    ctx.fillStyle = 'rgba(135, 206, 235, 0.7)';
    ctx.fillRect(houseX - 80, houseY, 160, 100);
    
    // جدران ذهبية
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(houseX - 70, houseY - 60, 140, 60);
    
    // نوافذ سحرية
    for(let i = 0; i < 3; i++) {
        const windowX = houseX - 50 + i * 50;
        ctx.fillStyle = `hsla(${200 + Math.sin(gameTime * 0.001 + i) * 60}, 100%, 70%, 0.8)`;
        ctx.fillRect(windowX - 8, houseY - 30, 16, 20);
        
        // توهج النافذة
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.strokeRect(windowX - 10, houseY - 32, 20, 24);
    }
    
    // باب بلوري
    ctx.fillStyle = 'rgba(70, 130, 180, 0.9)';
    ctx.fillRect(houseX - 15, houseY + 20, 30, 60);
    
    // مقبض الباب المتوهج
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.arc(houseX + 8, houseY + 50, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // سقف سحري
    ctx.fillStyle = '#8A2BE2';
    ctx.beginPath();
    ctx.moveTo(houseX - 90, houseY - 60);
    ctx.lineTo(houseX, houseY - 120);
    ctx.lineTo(houseX + 90, houseY - 60);
    ctx.closePath();
    ctx.fill();
    
    // كرات سحرية على السقف
    for(let i = 0; i < 5; i++) {
        const ballX = houseX - 60 + i * 30;
        const ballY = houseY - 70 + Math.sin(gameTime * 0.002 + i) * 5;
        const ballColor = `hsl(${i * 72}, 100%, 60%)`;
        
        ctx.fillStyle = ballColor;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // توهج الكرة
        const ballGlow = ctx.createRadialGradient(ballX, ballY, 8, ballX, ballY, 20);
        ballGlow.addColorStop(0, ballColor);
        ballGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = ballGlow;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawCrystalLake() {
    const lakeX = canvas.width * 0.3;
    const lakeY = canvas.height * 0.75;
    const lakeRadius = 120;
    
    // البحيرة البلورية
    const lakeGradient = ctx.createRadialGradient(
        lakeX, lakeY, 0,
        lakeX, lakeY, lakeRadius
    );
    lakeGradient.addColorStop(0, 'rgba(64, 224, 208, 0.9)');
    lakeGradient.addColorStop(0.7, 'rgba(0, 191, 255, 0.7)');
    lakeGradient.addColorStop(1, 'rgba(30, 144, 255, 0.5)');
    
    ctx.fillStyle = lakeGradient;
    ctx.beginPath();
    ctx.arc(lakeX, lakeY, lakeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // أمواج سحرية
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    
    for(let wave = 0; wave < 5; wave++) {
        const waveRadius = lakeRadius - 20 + wave * 10;
        const waveOffset = Math.sin(gameTime * 0.001 + wave) * 5;
        
        ctx.beginPath();
        for(let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const x = lakeX + Math.cos(angle) * (waveRadius + Math.sin(angle * 3 + gameTime * 0.002) * 10 + waveOffset);
            const y = lakeY + Math.sin(angle) * (waveRadius + Math.cos(angle * 3 + gameTime * 0.002) * 10 + waveOffset);
            
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // بلورات في البحيرة
    for(let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + gameTime * 0.0005;
        const distance = 40 + Math.sin(i * 0.5) * 30;
        const crystalX = lakeX + Math.cos(angle) * distance;
        const crystalY = lakeY + Math.sin(angle) * distance;
        const crystalSize = 5 + Math.sin(gameTime * 0.003 + i) * 3;
        const crystalColor = `hsl(${i * 18}, 100%, ${60 + Math.sin(gameTime * 0.004 + i) * 20}%)`;
        
        ctx.fillStyle = crystalColor;
        ctx.beginPath();
        
        // شكل بلوري سداسي
        for(let side = 0; side < 6; side++) {
            const crystalAngle = (side / 6) * Math.PI * 2;
            const cx = crystalX + Math.cos(crystalAngle) * crystalSize;
            const cy = crystalY + Math.sin(crystalAngle) * crystalSize;
            
            if (side === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
        }
        ctx.closePath();
        ctx.fill();
        
        // توهج البلورة
        const crystalGlow = ctx.createRadialGradient(crystalX, crystalY, crystalSize, crystalX, crystalY, crystalSize * 3);
        crystalGlow.addColorStop(0, crystalColor);
        crystalGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = crystalGlow;
        ctx.beginPath();
        ctx.arc(crystalX, crystalY, crystalSize * 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawMagicWaterfall() {
    const fallX = canvas.width * 0.85;
    const fallStartY = canvas.height * 0.3;
    const fallEndY = canvas.height * 0.85;
    const fallWidth = 60;
    
    // الشلال الرئيسي
    const fallGradient = ctx.createLinearGradient(fallX - fallWidth/2, fallStartY, fallX - fallWidth/2, fallEndY);
    fallGradient.addColorStop(0, 'rgba(135, 206, 250, 0.9)');
    fallGradient.addColorStop(0.5, 'rgba(173, 216, 230, 0.8)');
    fallGradient.addColorStop(1, 'rgba(240, 248, 255, 0.7)');
    
    ctx.fillStyle = fallGradient;
    ctx.fillRect(fallX - fallWidth/2, fallStartY, fallWidth, fallEndY - fallStartY);
    
    // قطرات ماء متحركة
    for(let i = 0; i < 50; i++) {
        const dropX = fallX - fallWidth/2 + Math.random() * fallWidth;
        const dropSpeed = 5 + Math.random() * 10;
        const dropY = fallStartY + ((gameTime * 0.05 * dropSpeed) + i * 10) % (fallEndY - fallStartY);
        const dropSize = 2 + Math.random() * 4;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(gameTime * 0.01 + i) * 0.3})`;
        ctx.beginPath();
        ctx.arc(dropX, dropY, dropSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // رذاذ الشلال
    for(let i = 0; i < 100; i++) {
        const sprayAngle = Math.random() * Math.PI;
        const sprayDistance = 30 + Math.random() * 50;
        const sprayX = fallX + Math.cos(sprayAngle) * sprayDistance;
        const sprayY = fallEndY - 20 + Math.sin(sprayAngle) * sprayDistance;
        const spraySize = 1 + Math.random() * 3;
        const sprayLife = (gameTime * 0.02 + i) % 100;
        const sprayAlpha = 0.3 * (1 - sprayLife / 100);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${sprayAlpha})`;
        ctx.beginPath();
        ctx.arc(sprayX, sprayY, spraySize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // قوس قزح من الشلال
    for(let colorIndex = 0; colorIndex < 7; colorIndex++) {
        const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
        const rainbowY = fallEndY - 40 + colorIndex * 8;
        
        ctx.strokeStyle = rainbowColors[colorIndex];
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        const startX = fallX - fallWidth/2 - 30 - colorIndex * 5;
        const endX = fallX + fallWidth/2 + 30 + colorIndex * 5;
        const curveHeight = 20 + Math.sin(gameTime * 0.001 + colorIndex) * 10;
        
        ctx.moveTo(startX, rainbowY);
        ctx.quadraticCurveTo(
            fallX,
            rainbowY - curveHeight,
            endX,
            rainbowY
        );
        ctx.stroke();
    }
}

// ==================== الحيوانات السحرية ====================
function drawFantasyAnimals(player) {
    // وحيد قرن سحري
    const unicornX = 400 + Math.sin(gameTime * 0.0008) * 100;
    const unicornY = 500 + Math.cos(gameTime * 0.0006) * 50;
    
    // جسم وحيد القرن
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.ellipse(unicornX, unicornY, 35, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // قرن سحري
    const hornLength = 40 + Math.sin(gameTime * 0.005) * 10;
    ctx.fillStyle = `hsl(${gameTime * 0.1 % 360}, 100%, 60%)`;
    ctx.beginPath();
    ctx.moveTo(unicornX + 35, unicornY - 25);
    ctx.lineTo(unicornX + 35 + hornLength, unicornY - 40);
    ctx.lineTo(unicornX + 35, unicornY - 15);
    ctx.closePath();
    ctx.fill();
    
    // توهج القرن
    const hornGlow = ctx.createRadialGradient(
        unicornX + 35 + hornLength/2, unicornY - 40,
        0,
        unicornX + 35 + hornLength/2, unicornY - 40,
        hornLength * 1.5
    );
    hornGlow.addColorStop(0, `hsl(${gameTime * 0.1 % 360}, 100%, 60%)`);
    hornGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = hornGlow;
    ctx.beginPath();
    ctx.arc(unicornX + 35 + hornLength/2, unicornY - 40, hornLength * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // عين وحيد القرن
    ctx.fillStyle = 'rgba(100, 200, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(unicornX + 45, unicornY - 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(unicornX + 48, unicornY - 20, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // شعر وحيد القرن
    ctx.fillStyle = `hsl(${gameTime * 0.05 % 360}, 100%, 70%)`;
    for(let i = 0; i < 10; i++) {
        const hairAngle = Math.PI * 0.7 + (i / 15);
        const hairX = unicornX - 20 + Math.cos(hairAngle + gameTime * 0.001) * 25;
        const hairY = unicornY - 30 + Math.sin(hairAngle + gameTime * 0.001) * 25;
        ctx.beginPath();
        ctx.arc(hairX, hairY, 2 + Math.sin(gameTime * 0.01 + i) * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // تنين صغير
    const dragonX = 900 + Math.cos(gameTime * 0.0007) * 80;
    const dragonY = 300 + Math.sin(gameTime * 0.0009) * 40;
    
    // جسم التنين
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(dragonX, dragonY, 25, 15, Math.sin(gameTime * 0.001) * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // أجنحة التنين
    ctx.fillStyle = 'rgba(34, 139, 34, 0.7)';
    const wingFlap = Math.sin(gameTime * 0.01) * 20;
    ctx.beginPath();
    ctx.ellipse(dragonX - 20, dragonY - wingFlap, 30, 15, Math.PI * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(dragonX + 20, dragonY + wingFlap, 30, 15, -Math.PI * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // رأس التنين
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.arc(dragonX + 35, dragonY - 5, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // عيون التنين
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(dragonX + 40, dragonY - 8, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // لهب التنين
    if (Math.sin(gameTime * 0.02) > 0.5) {
        const flameColors = ['#FF4500', '#FF8C00', '#FFD700'];
        for(let i = 0; i < 3; i++) {
            ctx.fillStyle = flameColors[i];
            ctx.beginPath();
            const flameX = dragonX + 45 + i * 8;
            const flameY = dragonY - 5 + Math.sin(gameTime * 0.05 + i) * 5;
            const flameSize = 10 - i * 2;
            ctx.arc(flameX, flameY, flameSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // طيور سحرية
    for(let i = 0; i < 5; i++) {
        const birdX = 200 + (i * 100) + Math.sin(gameTime * 0.001 + i) * 50;
        const birdY = 200 + Math.cos(gameTime * 0.001 + i * 1.3) * 30;
        const birdColor = `hsl(${i * 72 + gameTime * 0.01}, 100%, 60%)`;
        const birdWing = Math.sin(gameTime * 0.02 + i) * 15;
        
        // جسم الطائر
        ctx.fillStyle = birdColor;
        ctx.beginPath();
        ctx.arc(birdX, birdY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // أجنحة الطائر
        ctx.beginPath();
        ctx.ellipse(birdX - 10, birdY + birdWing, 12, 6, Math.PI * 0.2, 0, Math.PI * 2);
        ctx.ellipse(birdX + 10, birdY - birdWing, 12, 6, -Math.PI * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // ذيل الطائر
        ctx.beginPath();
        ctx.moveTo(birdX - 15, birdY);
        ctx.lineTo(birdX - 30, birdY - 10);
        ctx.lineTo(birdX - 30, birdY + 10);
        ctx.closePath();
        ctx.fill();
        
        // مسار الطائر (نجوم)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(gameTime * 0.03 + i) * 0.2})`;
        for(let trail = 0; trail < 5; trail++) {
            const trailX = birdX - 20 - trail * 10;
            const trailY = birdY + Math.sin(trail * 0.5 + gameTime * 0.01) * 5;
            ctx.beginPath();
            ctx.arc(trailX, trailY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ==================== الواجهة ====================
function drawUI(player) {
    // خلفية الواجهة
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(20, 20, 300, 160);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 300, 160);
    
    // العنوان
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('🏝️ جزيرة إيدن السحرية', 40, 55);
    
    // الصحة
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(40, 75, 200, 20);
    ctx.fillStyle = '#44FF44';
    ctx.fillRect(40, 75, playerHealth * 2, 20);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`❤️ الصحة: ${playerHealth}%`, 250, 90);
    
    // المال
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`💰 المال: ${playerMoney}`, 40, 125);
    
    // الوقت
    const hours = Math.floor((gameTime * 0.001) % 24);
    const minutes = Math.floor((gameTime * 0.06) % 60);
    ctx.fillStyle = '#87CEEB';
    ctx.fillText(`⏰ الوقت: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`, 40, 155);
    
    // المخزون
    ctx.fillStyle = '#9370DB';
    ctx.fillText(`🪓 خشب: ${inventory.wood}`, 40, 185);
    ctx.fillText(`🍎 طعام: ${inventory.food}`, 160, 185);
    
    // التعليمات
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '14px Arial';
    ctx.fillText('E: تفاعل | R: حصان | T: نوم | F: أكل', 40, 215);
    ctx.fillText('C: قطع خشب | Space: قفز | M: خريطة', 40, 235);
    
    // حالة خاصة
    if (isRidingHorse) {
        ctx.fillStyle = '#8B4513';
        ctx.fillText('🐎 تركب حصاناً (أسرع 2x)', 40, 265);
    }
    if (isSleeping) {
        ctx.fillStyle = '#4169E1';
        ctx.fillText('💤 نائم... اضغط T للاستيقاظ', 40, 265);
    }
}

// ==================== التحكم ====================
const keys = {};
const player = new Player();

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    
    // أنشطة سريعة
    if (e.key === 'r' || e.key === 'R') toggleHorse();
    if (e.key === 't' || e.key === 'T') toggleSleep();
    if (e.key === ' ' || e.key === ' ') playerJump();
    if (e.key === 'f' || e.key === 'F') eatFood();
    if (e.key === 'c' || e.key === 'C') chopWood();
    if (e.key === 'e' || e.key === 'E') interact();
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function toggleHorse() {
    if (Math.abs(player.x - 400) < 100 && Math.abs(player.y - 500) < 100) {
        isRidingHorse = !isRidingHorse;
        showMessage(isRidingHorse ? '🐎 ركبت الحصان السحري!' : '🐎 نزلت من الحصان');
    }
}

function toggleSleep() {
    if (Math.abs(player.x - 840) < 100 && Math.abs(player.y - 520) < 100) {
        isSleeping = !isSleeping;
        if (isSleeping) {
            showMessage('💤 نمت للراحة... الصحة تتعافى');
            playerHealth = Math.min(100, playerHealth + 30);
        } else {
            showMessage('☀️ استيقظت مفعماً بالطاقة!');
        }
    }
}

function playerJump() {
    showMessage('⬆️ قفزت عالياً في الهواء!');
}

function eatFood() {
    if (inventory.food > 0) {
        inventory.food--;
        playerHealth = Math.min(100, playerHealth + 20);
        showMessage('🍎 أكلت طعاماً (+20 صحة)');
    }
}

function chopWood() {
    if (Math.abs(player.x - 300) < 150 && Math.abs(player.y - 600) < 100) {
        inventory.wood++;
        playerMoney += 50;
        showMessage('🪓 قطعت خشباً (+50💰)');
    }
}

function interact() {
    // تفاعل مع وحيد القرن
    if (Math.abs(player.x - 400) < 80 && Math.abs(player.y - 500) < 80) {
        showMessage('🦄 وحيد القرن السحري يلمع بفرح!');
        playerMoney += 200;
    }
    
    // تفاعل مع البحيرة
    if (Math.abs(player.x - 360) < 130 && Math.abs(player.y - 600) < 130) {
        showMessage('💎 وجدت بلورة سحرية! (+300💰)');
        playerMoney += 300;
    }
}

function showMessage(text) {
    const messageBox = document.createElement('div');
    messageBox.textContent = text;
    messageBox.style.cssText = `
        position: fixed;
        bottom: 150px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 15px 30px;
        border-radius: 15px;
        border: 3px solid #4CAF50;
        font-size: 18px;
        z-index: 10000;
        animation: messagePop 3s;
        box-shadow: 0 0 20px #4CAF50;
    `;
    document.body.appendChild(messageBox);
    
    setTimeout(() => messageBox.remove(), 3000);
}

// ==================== الدورة الرئيسية ====================
function gameLoop() {
    gameTime += 16; // حوالي 60 FPS
    
    // تحديث اللاعب
    player.update(keys);
    
    // رسم كل شيء
    drawFantasyWorld();
    drawFantasyAnimals(player);
    player.draw();
    drawUI(player);
    
    // استمرار الدورة
    requestAnimationFrame(gameLoop);
}

// ==================== البدء ====================
// إضافة أنماط CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes messagePop {
        0% { opacity: 0; transform: translateX(-50%) scale(0.5); bottom: 100px; }
        20% { opacity: 1; transform: translateX(-50%) scale(1.1); bottom: 150px; }
        40% { transform: translateX(-50%) scale(1); bottom: 150px; }
        80% { opacity: 1; bottom: 150px; }
        100% { opacity: 0; bottom: 180px; }
    }
    
    body {
        margin: 0;
        overflow: hidden;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    
    canvas {
        border: 3px solid #4CAF50;
        border-radius: 10px;
        box-shadow: 0 0 50px rgba(76, 175, 80, 0.5);
    }
`;
document.head.appendChild(style);

// بدء اللعبة
gameLoop();

console.log('🎮 جزيرة إيدن السحرية جاهزة!');
console.log('🐎 جرافيك خيالي كامل في 400 سطر!');
