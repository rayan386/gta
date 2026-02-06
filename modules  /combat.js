class CombatSystem {
    constructor() {
        this.weapons = {
            barehands: {
                name: 'اليدين',
                damage: 10,
                range: 15,
                speed: 1.5,
                durability: Infinity,
                type: 'melee',
                description: 'اليدين العاريتين'
            },
            axe: {
                name: 'فأس',
                damage: 40,
                range: 25,
                speed: 1.0,
                durability: 100,
                type: 'melee',
                description: 'فأس خشبي للقطع والقتال'
            },
            knife: {
                name: 'سكين',
                damage: 25,
                range: 20,
                speed: 2.0,
                durability: 150,
                type: 'melee',
                description: 'سكين صيد حاد'
            },
            bow: {
                name: 'قوس',
                damage: 30,
                range: 100,
                speed: 0.8,
                durability: 80,
                type: 'ranged',
                description: 'قوس بدائي مع سهام',
                ammo: 'arrow'
            },
            spear: {
                name: 'رمح',
                damage: 35,
                range: 35,
                speed: 1.2,
                durability: 120,
                type: 'melee',
                description: 'رمح طويل للمسافة المتوسطة'
            }
        };

        this.ammo = {
            arrow: {
                name: 'سهم',
                damage: 20,
                quantity: 10
            }
        };

        this.currentWeapon = 'barehands';
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.combatLog = [];
    }

    attack(target, playerPosition) {
        if (this.isAttacking || this.attackCooldown > 0) {
            return { success: false, message: 'لا يمكنك الهجوم الآن' };
        }

        const weapon = this.weapons[this.currentWeapon];
        
        if (!weapon) {
            return { success: false, message: 'سلاح غير معروف' };
        }

        // التحقق من المدى
        const distance = this.calculateDistance(playerPosition, target.position);
        
        if (distance > weapon.range) {
            return { success: false, message: 'الهدف بعيد جداً' };
        }

        // بدء الهجوم
        this.isAttacking = true;
        this.attackCooldown = weapon.speed * 30; // تحويل السرعة إلى إطارات

        // تقليل متانة السلاح
        if (weapon.durability < Infinity) {
            weapon.durability -= 1;
            
            if (weapon.durability <= 0) {
                this.breakWeapon();
                return { 
                    success: true, 
                    message: `كسر ${weapon.name}! تحتاج إلى إصلاحه`,
                    damage: 0
                };
            }
        }

        // حساب الضرر (مع بعض العشوائية)
        const baseDamage = weapon.damage;
        const variance = baseDamage * 0.2; // ±20%
        const actualDamage = Math.max(1, baseDamage + (Math.random() * variance * 2 - variance));

        // تسجيل الهجوم
        this.combatLog.push({
            weapon: weapon.name,
            target: target.type,
            damage: actualDamage,
            time: new Date()
        });

        // إذا كان سلاح بعيد، التحقق من الذخيرة
        if (weapon.type === 'ranged' && weapon.ammo) {
            if (this.ammo[weapon.ammo].quantity <= 0) {
                return { success: false, message: 'لا يوجد ذخيرة!' };
            }
            this.ammo[weapon.ammo].quantity -= 1;
        }

        return {
            success: true,
            message: `ضربت ${target.type} بـ ${weapon.name}`,
            damage: actualDamage,
            weapon: weapon.name
        };
    }

    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    update() {
        // تحديث وقت التبريد
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        
        if (this.attackCooldown <= 0 && this.isAttacking) {
            this.isAttacking = false;
        }
    }

    switchWeapon(weaponName) {
        if (this.weapons[weaponName]) {
            this.currentWeapon = weaponName;
            return `تم التبديل إلى ${this.weapons[weaponName].name}`;
        }
        return 'سلاح غير موجود';
    }

    breakWeapon() {
        const weapon = this.weapons[this.currentWeapon];
        
        if (weapon && weapon.durability <= 0) {
            // حذف السلاح من اللعبة
            delete this.weapons[this.currentWeapon];
            this.currentWeapon = 'barehands';
            
            // إشعار للاعب
            if (typeof window.showMessage === 'function') {
                window.showMessage(`⚔️ ${weapon.name} كسر!`);
            }
        }
    }

    repairWeapon(weaponName, amount) {
        if (this.weapons[weaponName]) {
            this.weapons[weaponName].durability = Math.min(
                100,
                this.weapons[weaponName].durability + amount
            );
            return `تم إصلاح ${this.weapons[weaponName].name}`;
        }
        return 'لا يمكن إصلاح هذا السلاح';
    }

    craftWeapon(materials) {
        // نظام صنع الأسلحة
        const recipes = {
            spear: { wood: 3, stone: 2, rope: 1 },
            bow: { wood: 2, rope: 2 },
            arrow: { wood: 1, stone: 1, feather: 1 }
        };

        for (const [weapon, recipe] of Object.entries(recipes)) {
            let canCraft = true;
            
            for (const [material, amount] of Object.entries(recipe)) {
                if (!materials[material] || materials[material] < amount) {
                    canCraft = false;
                    break;
                }
            }

            if (canCraft) {
                // خصم المواد
                for (const [material, amount] of Object.entries(recipe)) {
                    materials[material] -= amount;
                }

                // إضافة السلاح
                if (weapon === 'arrow') {
                    this.ammo.arrow.quantity += 5;
                    return 'صنعت 5 سهام';
                } else {
                    this.weapons[weapon] = {
                        name: weapon === 'spear' ? 'رمح' : 'قوس',
                        damage: weapon === 'spear' ? 35 : 30,
                        range: weapon === 'spear' ? 35 : 100,
                        speed: weapon === 'spear' ? 1.2 : 0.8,
                        durability: 100,
                        type: weapon === 'spear' ? 'melee' : 'ranged',
                        description: weapon === 'spear' ? 'رمح محلي الصنع' : 'قوس محلي الصنع'
                    };
                    return `صنعت ${weapon === 'spear' ? 'رمح' : 'قوس'}`;
                }
            }
        }

        return 'لا تملك المواد الكافية';
    }

    getWeaponStatus() {
        const weapon = this.weapons[this.currentWeapon];
        
        if (!weapon) {
            return { name: 'لا سلاح', durability: 0, damage: 0 };
        }

        return {
            name: weapon.name,
            durability: weapon.durability,
            maxDurability: 100,
            damage: weapon.damage,
            range: weapon.range,
            type: weapon.type
        };
    }

    getAmmoStatus() {
        return this.ammo.arrow.quantity;
    }
}

// نظام الإصابات والعلاج
class InjurySystem {
    constructor() {
        this.injuries = [];
        this.bleedingRate = 0;
        this.painLevel = 0;
    }

    addInjury(type, location, severity) {
        const injury = {
            type: type, // cut, bruise, fracture, burn
            location: location, // arm, leg, head, torso
            severity: severity, // 1-10
            treated: false,
            timeReceived: new Date(),
            bleedAmount: severity > 5 ? severity - 5 : 0
        };

        this.injuries.push(injury);
        
        // تحديث معدل النزيف
        this.updateBleedingRate();
        
        // تحديث مستوى الألم
        this.updatePainLevel();

        return injury;
    }

    updateBleedingRate() {
        this.bleedingRate = 0;
        
        for (const injury of this.injuries) {
            if (!injury.treated && injury.bleedAmount > 0) {
                this.bleedingRate += injury.bleedAmount;
            }
        }
    }

    updatePainLevel() {
        this.painLevel = 0;
        
        for (const injury of this.injuries) {
            if (!injury.treated) {
                this.painLevel += injury.severity;
            }
        }
        
        // الحد الأقصى للألم 100
        this.painLevel = Math.min(100, this.painLevel * 2);
    }

    treatInjury(injuryIndex, treatment) {
        if (injuryIndex >= 0 && injuryIndex < this.injuries.length) {
            const injury = this.injuries[injuryIndex];
            
            if (injury.treated) {
                return 'هذا الجرح معالج بالفعل';
            }

            // التحقق من العلاج المناسب
            let treatmentSuccess = false;
            
            switch(injury.type) {
                case 'cut':
                    if (treatment === 'bandage' || treatment === 'medkit') {
                        treatmentSuccess = true;
                    }
                    break;
                case 'fracture':
                    if (treatment === 'splint') {
                        treatmentSuccess = true;
                    }
                    break;
                case 'burn':
                    if (treatment === 'ointment') {
                        treatmentSuccess = true;
                    }
                    break;
                default:
                    if (treatment === 'bandage') {
                        treatmentSuccess = true;
                    }
            }

            if (treatmentSuccess) {
                injury.treated = true;
                injury.bleedAmount = 0;
                
                // تحديث المعدلات
                this.updateBleedingRate();
                this.updatePainLevel();
                
                return `تم علاج ${injury.type} في ${injury.location}`;
            } else {
                return 'العلاج غير مناسب لهذا النوع من الإصابات';
            }
        }
        
        return 'جرح غير موجود';
    }

    update(playerStats) {
        // تطبيق النزيف
        if (this.bleedingRate > 0) {
            playerStats.health -= this.bleedingRate * 0.1;
        }

        // تطبيق الألم
        if (this.painLevel > 50) {
            // الألم يقلل من الدقة والسرعة
            playerStats.speed *= (1 - (this.painLevel - 50) / 100);
        }

        // تلقائي العلاج البسيط مع الوقت
        if (this.painLevel > 0 && this.injuries.length > 0) {
            const chance = 0.001; // 0.1% فرصة كل تحديث
            if (Math.random() < chance) {
                const untreated = this.injuries.filter(i => !i.treated);
                if (untreated.length > 0) {
                    const randomInjury = untreated[Math.floor(Math.random() * untreated.length)];
                    randomInjury.severity = Math.max(1, randomInjury.severity - 1);
                    this.updatePainLevel();
                }
            }
        }
    }

    getInjuries() {
        return this.injuries.map((injury, index) => ({
            index: index,
            type: injury.type,
            location: injury.location,
            severity: injury.severity,
            treated: injury.treated,
            time: Math.floor((new Date() - injury.timeReceived) / 60000) // دقائق
        }));
    }

    getStatus() {
        return {
            totalInjuries: this.injuries.length,
            untreated: this.injuries.filter(i => !i.treated).length,
            bleedingRate: this.bleedingRate.toFixed(1),
            painLevel: Math.floor(this.painLevel),
            critical: this.bleedingRate > 5 || this.painLevel > 80
        };
    }
}

// التصدير
if (typeof module !== 'undefined') {
    module.exports = { CombatSystem, InjurySystem };
} else {
    window.CombatSystem = CombatSystem;
    window.InjurySystem = InjurySystem;
}
