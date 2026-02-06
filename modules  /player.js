class Player {
    constructor() {
        this.position = { x: 400, y: 300 };
        this.velocity = { x: 0, y: 0 };
        this.speed = 5;
        this.direction = 'right';
        this.isRunning = false;
        this.isJumping = false;
        this.inventory = {
            items: ['hand'],
            selected: 0,
            capacity: 10
        };
        this.stats = {
            health: 100,
            hunger: 100,
            thirst: 100,
            energy: 100,
            temperature: 37
        };
        this.interactionRange = 50;
    }

    update(keys) {
        // الحركة
        this.velocity.x = 0;
        this.velocity.y = 0;

        if (keys['ArrowLeft'] || keys['a']) {
            this.velocity.x = -this.speed;
            this.direction = 'left';
        }
        if (keys['ArrowRight'] || keys['d']) {
            this.velocity.x = this.speed;
            this.direction = 'right';
        }
        if (keys['ArrowUp'] || keys['w']) {
            this.velocity.y = -this.speed;
        }
        if (keys['ArrowDown'] || keys['s']) {
            this.velocity.y = this.speed;
        }

        // الركض (زر Shift)
        if (keys['Shift']) {
            this.isRunning = true;
            this.speed = 8;
            this.stats.energy -= 0.1;
        } else {
            this.isRunning = false;
            this.speed = 5;
        }

        // تحديث الموقع
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // حدود العالم
        this.keepInBounds();

        // تحديث الإحصائيات
        this.updateStats();
    }

    keepInBounds() {
        const bounds = {
            minX: 100,
            maxX: 700,
            minY: 100,
            maxY: 500
        };

        this.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, this.position.x));
        this.position.y = Math.max(bounds.minY, Math.min(bounds.maxY, this.position.y));
    }

    updateStats() {
        // الجوع والعطش يتناقصان مع الوقت
        this.stats.hunger = Math.max(0, this.stats.hunger - 0.01);
        this.stats.thirst = Math.max(0, this.stats.thirst - 0.02);

        // الطاقة تتعافى إذا لم يركض
        if (!this.isRunning) {
            this.stats.energy = Math.min(100, this.stats.energy + 0.05);
        }

        // إذا كان الجوع أو العطش منخفضاً، تنخفض الصحة
        if (this.stats.hunger < 20 || this.stats.thirst < 20) {
            this.stats.health -= 0.05;
        }

        // إذا كانت الطاقة منخفضة، تقل السرعة
        if (this.stats.energy < 30) {
            this.speed = 3;
        }

        // تحديث الواجهة
        this.updateHUD();
    }

    updateHUD() {
        if (window.gameState) {
            window.gameState.playerData.health = Math.floor(this.stats.health);
            
            // تحديث عناصر HUD إذا كانت موجودة
            const healthDisplay = document.getElementById('health-display');
            if (healthDisplay) {
                healthDisplay.textContent = Math.floor(this.stats.health);
            }
        }
    }

    interact(target) {
        switch(target.type) {
            case 'tree':
                return this.chopTree(target);
            case 'water':
                return this.drink();
            case 'food':
                return this.eat(target);
            case 'bed':
                return this.sleep();
            case 'animal':
                return this.petAnimal(target);
            default:
                return 'لا يمكن التفاعل مع هذا الشيء';
        }
    }

    chopTree(tree) {
        if (this.inventory.selected === 'axe') {
            // قطع الشجرة
            this.stats.energy -= 10;
            return 'قطعت الشجرة وحصلت على خشب';
        }
        return 'تحتاج إلى فأس لقطع الشجرة';
    }

    drink() {
        this.stats.thirst = Math.min(100, this.stats.thirst + 30);
        return 'شربت الماء';
    }

    eat(food) {
        this.stats.hunger = Math.min(100, this.stats.hunger + food.value);
        return `أكلت ${food.name}`;
    }

    sleep() {
        this.stats.energy = 100;
        this.stats.health = Math.min(100, this.stats.health + 20);
        
        // تحديث وقت النوم في ذاكرة AI Director
        if (window.aiDirector) {
            window.aiDirector.memory.player.lastSleepTime = new Date();
        }
        
        // تغيير الوقت في اللعبة (تقدم 6 ساعات)
        if (window.gameState) {
            window.gameState.world.time = (window.gameState.world.time + 6) % 24;
        }
        
        return 'نمت واستعدت طاقتك';
    }

    petAnimal(animal) {
        if (animal.type === 'dog') {
            // زيادة الثقة
            if (window.gameState) {
                window.gameState.playerData.trust += 5;
            }
            return 'الكلب سعيد بحضورك';
        }
        return 'هذا الحيوان غير ودود';
    }

    takeDamage(amount, source) {
        this.stats.health -= amount;
        
        if (this.stats.health <= 0) {
            this.die();
        }
        
        return `تلقيت ${amount} ضرر من ${source}`;
    }

    die() {
        console.log('المات اللاعب!');
        // إعادة تعيين اللاعب
        this.position = { x: 400, y: 300 };
        this.stats.health = 100;
        
        // عقوبة الموت
        if (window.gameState) {
            window.gameState.playerData.trust -= 30;
        }
        
        // عرض رسالة
        if (typeof window.showMessage === 'function') {
            window.showMessage('💀 لقد ماتت! تم إعادة إحيائك في البيت الرئيسي.');
        }
    }

    switchItem(index) {
        if (index >= 0 && index < this.inventory.items.length) {
            this.inventory.selected = index;
            return `تم اختيار ${this.inventory.items[index]}`;
        }
        return 'عنصر غير موجود';
    }

    addItem(item) {
        if (this.inventory.items.length < this.inventory.capacity) {
            this.inventory.items.push(item);
            return `أضفت ${item} إلى المخزون`;
        }
        return 'المخزون ممتلئ!';
    }

    removeItem(item) {
        const index = this.inventory.items.indexOf(item);
        if (index > -1) {
            this.inventory.items.splice(index, 1);
            return `أزلت ${item} من المخزون`;
        }
        return 'العنصر غير موجود في المخزون';
    }

    getCurrentItem() {
        return this.inventory.items[this.inventory.selected];
    }
}

// التصدير
if (typeof module !== 'undefined') {
    module.exports = Player;
} else {
    window.Player = Player;
}
