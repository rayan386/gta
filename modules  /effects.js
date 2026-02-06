class EffectsManager {
    constructor() {
        this.particles = [];
        this.sounds = {};
        this.weatherEffects = {};
        this.dayNightCycle = null;
        this.currentAmbience = null;
    }

    init() {
        this.loadSounds();
        this.setupWeather();
        this.startAmbience();
        this.startParticleLoop();
    }

    loadSounds() {
        // قائمة الأصوات الأساسية
        this.sounds = {
            footsteps: this.createSound('assets/sounds/footsteps.mp3', 0.3),
            wind: this.createSound('assets/sounds/wind.mp3', 0.2, true),
            birds: this.createSound('assets/sounds/birds.mp3', 0.2, true),
            rain: this.createSound('assets/sounds/rain.mp3', 0.4, true),
            thunder: this.createSound('assets/sounds/thunder.mp3', 0.5),
            lion: this.createSound('assets/sounds/lion.mp3', 0.6),
            dog: this.createSound('assets/sounds/dog.mp3', 0.4),
            attack: this.createSound('assets/sounds/attack.mp3', 0.5),
            heal: this.createSound('assets/sounds/heal.mp3', 0.4),
            uiClick: this.createSound('assets/sounds/click.mp3', 0.2)
        };
    }

    createSound(src, volume = 1, loop = false) {
        const audio = new Audio();
        audio.volume = volume;
        audio.loop = loop;
        // في الحقيقة، سيكون src مسار ملف صوتي
        return audio;
    }

    playSound(name, options = {}) {
        const sound = this.sounds[name];
        if (!sound) return;

        const clone = sound.cloneNode();
        clone.volume = options.volume || sound.volume;
        clone.playbackRate = options.speed || 1;
        
        if (options.loop !== undefined) {
            clone.loop = options.loop;
        }

        clone.play().catch(e => console.log('تعذر تشغيل الصوت:', e));
    }

    startAmbience() {
        // بدء الأصوات المحيطة بناءً على الوقت والطقس
        setInterval(() => {
            this.updateAmbience();
        }, 5000);
    }

    updateAmbience() {
        if (!window.gameState) return;

        const hour = window.gameState.world.time;
        const weather = window.gameState.world.weather;

        // إيقاف الصوت الحالي
        if (this.currentAmbience) {
            this.currentAmbience.pause();
        }

        // اختيار الصوت المناسب
        let soundName = 'birds';
        let volume = 0.2;

        if (hour >= 20 || hour <= 6) { // ليل
            soundName = 'wind';
            volume = 0.3;
        }

        if (weather === 'rain' || weather === 'storm') {
            soundName = 'rain';
            volume = 0.4;
        }

        // تشغيل الصوت الجديد
        this.currentAmbience = this.sounds[soundName];
        if (this.currentAmbience) {
            this.currentAmbience.volume = volume;
            this.currentAmbience.play().catch(e => console.log(e));
        }
    }

    setupWeather() {
        this.weatherEffects = {
            rain: {
                particles: [],
                intensity: 0,
                color: '#4488ff'
            },
            snow: {
                particles: [],
                intensity: 0,
                color: '#ffffff'
            },
            fog: {
                density: 0,
                color: '#cccccc'
            }
        };
    }

    updateWeather(weather, intensity) {
        const effect = this.weatherEffects[weather];
        if (effect) {
            effect.intensity = intensity;
            
            if (weather === 'rain' || weather === 'snow') {
                this.generateWeatherParticles(weather, intensity);
            }
        }
    }

    generateWeatherParticles(type, intensity) {
        const count = Math.floor(intensity * 100);
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                type: type,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speed: type === 'rain' ? 5 + Math.random() * 10 : 1 + Math.random() * 3,
                size: type === 'rain' ? 2 + Math.random() * 3 : 3 + Math.random() * 5,
                color: type === 'rain' ? '#4488ff' : '#ffffff',
                opacity: 0.5 + Math.random() * 0.5
            });
        }
    }

    startParticleLoop() {
        setInterval(() => {
            this.updateParticles();
            this.renderParticles();
        }, 16); // حوالي 60 FPS
    }

    updateParticles() {
        // تحديث مواقع الجسيمات
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            if (p.type === 'rain') {
                p.y += p.speed;
                p.x += p.speed * 0.2; // ميل المطر
                
                // إذا خرجت من الشاشة، إعادة تعيين
                if (p.y > window.innerHeight) {
                    p.y = -10;
                    p.x = Math.random() * window.innerWidth;
                }
            } else if (p.type === 'snow') {
                p.y += p.speed;
                p.x += Math.sin(Date.now() * 0.001 + i) * 0.5;
                
                // دوران الثلج
                p.rotation = (p.rotation || 0) + 0.01;
                
                if (p.y > window.innerHeight) {
                    p.y = -10;
                    p.x = Math.random() * window.innerWidth;
                }
            } else if (p.type === 'blood') {
                p.y += p.speed;
                p.speed *= 0.95; // تباطؤ
                p.opacity *= 0.98; // اختفاء تدريجي
                
                if (p.opacity < 0.01) {
                    this.particles.splice(i, 1);
                    continue;
                }
            }
        }
    }

    renderParticles() {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // مسح مؤثرات الجسيمات السابقة
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // رسم الجسيمات
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            
            if (p.type === 'rain') {
                ctx.fillRect(p.x, p.y, 1, p.size);
            } else if (p.type === 'snow') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'blood') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    }

    createBloodSplash(x, y, amount) {
        for (let i = 0; i < amount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            
            this.particles.push({
                type: 'blood',
                x: x,
                y: y,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                speed: speed,
                size: 1 + Math.random() * 3,
                color: '#ff0000',
                opacity: 0.8 + Math.random() * 0.2
            });
        }
        
        this.playSound('attack', { volume: 0.5 });
    }

    createDamageEffect(target, damage) {
        // تأثير اهتزاز عند تلقي الضرر
        if (window.player && window.player.element) {
            const element = window.player.element;
            element.style.animation = 'damageShake 0.3s';
            setTimeout(() => {
                element.style.animation = '';
            }, 300);
        }
        
        // نص الضرر العائم
        this.createFloatingText(target.position.x, target.position.y - 30, `-${damage}`, '#ff4444');
        
        // صوت الضرر
        this.playSound('attack', { volume: 0.3, speed: 1.2 });
    }

    createHealingEffect(target, amount) {
        // تأثير الشفاء
        this.createFloatingText(target.position.x, target.position.y - 30, `+${amount}`, '#44ff44');
        
        // جسيمات الشفاء
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                type: 'heal',
                x: target.position.x,
                y: target.position.y,
                speedX: (Math.random() - 0.5) * 2,
                speedY: -1 - Math.random() * 2,
                size: 2 + Math.random() * 3,
                color: '#44ff44',
                opacity: 0.8,
                life: 60 // إطارات
            });
        }
        
        this.playSound('heal', { volume: 0.4 });
    }

    createFloatingText(x, y, text, color) {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-weight: bold;
            font-size: 18px;
            text-shadow: 1px 1px 2px black;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        `;
        
        document.body.appendChild(floatingText);
        
        // إزالة النص بعد الأنيميشن
        setTimeout(() => {
            floatingText.remove();
        }, 1000);
    }

    createScreenFlash(color, duration = 200) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            opacity: 0.3;
            z-index: 9999;
            pointer-events: none;
            animation: fadeOut ${duration}ms ease-out forwards;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, duration);
    }

    createFootstep(x, y) {
        // جسيمات أثر القدم
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                type: 'footstep',
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                size: 2 + Math.random() * 2,
                color: '#8B4513',
                opacity: 0.3,
                life: 30
            });
        }
        
        // صوت الخطى (باحتمال 50% لتجنب التكرار الممل)
        if (Math.random() > 0.5) {
            this.playSound('footsteps', { volume: 0.1, speed: 1 + Math.random() * 0.5 });
        }
    }

    updateDayNight() {
        if (!window.gameState) return;
        
        const hour = window.gameState.world.time;
        let brightness = 1;
        
        if (hour >= 20 || hour <= 6) { // ليل
            brightness = 0.2;
        } else if (hour >= 18 || hour <= 7) { // شروق/غروب
            brightness = 0.5;
        }
        
        // تطبيق السطوع على الشاشة
        const overlay = document.getElementById('day-night-overlay');
        if (!overlay) {
            this.createDayNightOverlay();
        }
        
        const overlayEl = document.getElementById('day-night-overlay');
        overlayEl.style.backgroundColor = `rgba(0, 0, 0, ${1 - brightness})`;
    }

    createDayNightOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'day-night-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
            transition: background-color 1s ease;
        `;
        document.body.appendChild(overlay);
    }

    addCSSAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-50px); opacity: 0; }
            }
            
            @keyframes fadeOut {
                0% { opacity: 0.3; }
                100% { opacity: 0; }
            }
            
            @keyframes damageShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .floating-text {
                animation: floatUp 1s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
}

// التصدير
if (typeof module !== 'undefined') {
    module.exports = EffectsManager;
} else {
    window.EffectsManager = EffectsManager;
}
