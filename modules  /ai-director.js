class AIDirector {
    constructor() {
        this.memory = {
            player: {
                lastSleepTime: null,
                forestEntries: 0,
                lastHouseTime: null,
                suspiciousActions: 0
            },
            world: {
                lionLastSeen: null,
                policeSuspicion: 0,
                dogMood: 'neutral',
                lastEvent: null
            }
        };
        
        this.rules = [
            // قاعدة: إذا دخل الغابة ليلاً
            {
                condition: () => this.isNight() && this.memory.player.forestEntries > 2,
                action: () => this.triggerEvent('lion_stare'),
                weight: 0.8
            },
            // قاعدة: إذا لم ينم لمدة طويلة
            {
                condition: () => this.getHoursSinceSleep() > 24,
                action: () => this.triggerEvent('fatigue_hallucination'),
                weight: 0.6
            }
        ];
        
        this.events = {
            lion_stare: {
                message: "تشعر بأن عيونًا تراقبك من الغابة...",
                effect: () => this.increaseSuspicion(20),
                sound: "lion_growl"
            },
            fatigue_hallucination: {
                message: "الإرهاق يبدأ بالتأثير على عقلك... تسمع أصواتًا غير موجودة.",
                effect: () => this.decreaseHealth(10),
                sound: "whispers"
            }
        };
    }
    
    update(playerData, worldState) {
        // تحديث الذاكرة
        this.memory.player = { ...this.memory.player, ...playerData };
        
        // التحقق من القواعد
        this.checkRules();
        
        // تحديث مزاج العالم
        this.updateWorldMood();
    }
    
    checkRules() {
        for (const rule of this.rules) {
            if (rule.condition() && Math.random() < rule.weight) {
                rule.action();
                break; // حدث واحد فقط في كل تحديث
            }
        }
    }
    
    triggerEvent(eventName) {
        const event = this.events[eventName];
        if (event) {
            // عرض الرسالة
            if (typeof window.showMessage === 'function') {
                window.showMessage(event.message);
            }
            
            // تطبيق التأثير
            if (event.effect) event.effect();
            
            // تسجيل الحدث
            this.memory.world.lastEvent = {
                name: eventName,
                time: new Date()
            };
        }
    }
    
    increaseSuspicion(amount) {
        this.memory.world.policeSuspicion = 
            Math.min(100, this.memory.world.policeSuspicion + amount);
    }
    
    decreaseHealth(amount) {
        // تحديث صحة اللاعب
        if (window.gameState) {
            window.gameState.playerData.health = 
                Math.max(0, window.gameState.playerData.health - amount);
        }
    }
    
    isNight() {
        if (!window.gameState) return false;
        const hour = window.gameState.world.time;
        return hour > 20 || hour < 6;
    }
    
    getHoursSinceSleep() {
        if (!this.memory.player.lastSleepTime) return 999;
        const diff = new Date() - this.memory.player.lastSleepTime;
        return diff / (1000 * 60 * 60);
    }
    
    updateWorldMood() {
        let tension = this.memory.world.policeSuspicion;
        tension += this.memory.player.suspiciousActions * 10;
        tension += this.memory.player.forestEntries * 5;
        
        if (tension > 70) {
            window.gameState.world.mood = 'ominous';
        } else if (tension > 40) {
            window.gameState.world.mood = 'tense';
        } else {
            window.gameState.world.mood = 'calm';
        }
    }
}

// تصدير المدير
if (typeof module !== 'undefined') {
    module.exports = AIDirector;
} else {
    window.AIDirector = AIDirector;
}
