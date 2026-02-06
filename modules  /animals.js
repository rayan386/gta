class Animal {
    constructor(type, position) {
        this.type = type; // 'lion', 'dog', 'horse'
        this.position = position;
        this.state = 'idle'; // idle, alert, hunting, fleeing
        this.health = 100;
        this.mood = 'neutral'; // neutral, angry, scared, curious
        this.lastActionTime = Date.now();
    }
    
    update(playerPosition) {
        const distance = this.calculateDistance(playerPosition);
        
        switch (this.type) {
            case 'lion':
                this.updateLion(playerPosition, distance);
                break;
            case 'dog':
                this.updateDog(playerPosition, distance);
                break;
        }
    }
    
    updateLion(playerPosition, distance) {
        // الأسود حذرة لكنها خطيرة
        if (distance < 50) {
            this.state = 'alert';
            this.mood = 'angry';
            
            // فرصة للهجوم
            if (distance < 20 && Math.random() < 0.1) {
                this.attack();
            }
        } else if (distance < 100) {
            this.state = 'curious';
            this.mood = 'curious';
        } else {
            this.state = 'idle';
            this.mood = 'neutral';
        }
    }
    
    updateDog(playerPosition, distance) {
        // الكلب مخلص ويتابع اللاعب
        if (distance > 100) {
            // اتبع اللاعب
            this.moveTowards(playerPosition);
        } else if (distance < 30) {
            // اقترب من اللاعب
            this.state = 'friendly';
            
            // إذا كان العالم متوتراً، يحذر اللاعب
            if (window.gameState?.world.mood === 'tense') {
                this.barkWarning();
            }
        }
    }
    
    attack() {
        console.log(`${this.type} يهاجم!`);
        // تخفيض صحة اللاعب
        if (window.gameState) {
            window.gameState.playerData.health -= 30;
            
            // عرض رسالة
            if (typeof window.showMessage === 'function') {
                window.showMessage("⚔️ تعرضت لهجوم! تحتاج إلى علاج سريع!");
            }
        }
    }
    
    moveTowards(target) {
        // حركة بسيطة نحو الهدف
        const dx = target.x - this.position.x;
        const dy = target.y - this.position.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length > 0) {
            this.position.x += (dx / length) * 2;
            this.position.y += (dy / length) * 2;
        }
    }
    
    calculateDistance(target) {
        const dx = target.x - this.position.x;
        const dy = target.y - this.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    barkWarning() {
        console.log("الكلب ينبح تحذيراً!");
        if (typeof window.showMessage === 'function') {
            window.showMessage("🐕 الكلب ينبح بقلق... يبدو أن هناك خطراً قريباً");
        }
    }
}

// نظام القتال (سيضاف لاحقاً)
class CombatSystem {
    constructor() {
        this.weapons = {
            axe: { damage: 40, range: 30, speed: 1 },
            knife: { damage: 25, range: 20, speed: 1.5 },
            barehands: { damage: 10, range: 15, speed: 2 }
        };
        
        this.currentWeapon = 'barehands';
    }
    
    attack(target) {
        const weapon = this.weapons[this.currentWeapon];
        
        if (target instanceof Animal) {
            target.health -= weapon.damage;
            
            if (target.health <= 0) {
                this.killAnimal(target);
            }
        }
    }
    
    killAnimal(animal) {
        console.log(`قتلت ${animal.type}`);
        // إضافة إلى الجوائز
        // تحديث الثقة (تقل لأنك قاتلت)
        if (window.gameState) {
            window.gameState.playerData.trust -= 20;
        }
    }
}

// تصدير
if (typeof module !== 'undefined') {
    module.exports = { Animal, CombatSystem };
} else {
    window.Animal = Animal;
    window.CombatSystem = CombatSystem;
}
