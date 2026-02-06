class Island {
    constructor() {
        this.zones = {
            forest: {
                name: 'الغابة',
                position: { x: 200, y: 200 },
                size: { width: 300, height: 200 },
                mood: 'tense',
                animals: [],
                resources: ['wood', 'berries', 'mushrooms'],
                dangerLevel: 3
            },
            beach: {
                name: 'الشاطئ',
                position: { x: 500, y: 400 },
                size: { width: 200, height: 150 },
                mood: 'calm',
                animals: ['seagulls'],
                resources: ['shells', 'driftwood'],
                dangerLevel: 1
            },
            farm: {
                name: 'المزرعة',
                position: { x: 400, y: 300 },
                size: { width: 150, height: 100 },
                mood: 'peaceful',
                animals: ['horse', 'chicken'],
                resources: ['vegetables', 'eggs', 'hay'],
                dangerLevel: 0
            },
            house: {
                name: 'البيت',
                position: { x: 350, y: 250 },
                size: { width: 80, height: 60 },
                mood: 'safe',
                animals: ['dog'],
                resources: ['bed', 'food', 'water'],
                dangerLevel: 0,
                rooms: {
                    bedroom: { hasBed: true, hasWindow: true },
                    kitchen: { hasFood: true, hasWater: true },
                    living: { hasFireplace: true }
                }
            },
            hills: {
                name: 'التلال',
                position: { x: 600, y: 150 },
                size: { width: 100, height: 200 },
                mood: 'windy',
                animals: ['rabbits'],
                resources: ['stones', 'herbs'],
                dangerLevel: 2
            }
        };

        this.weather = {
            current: 'clear',
            temperature: 25,
            windSpeed: 5,
            fogDensity: 0.1,
            rainIntensity: 0
        };

        this.time = {
            hour: 6,
            minute: 0,
            day: 1,
            season: 'spring'
        };

        this.resources = {
            trees: 50,
            rocks: 30,
            waterSources: 3,
            foodSources: 10
        };
    }

    updateTime() {
        this.minute += 1;
        
        if (this.minute >= 60) {
            this.minute = 0;
            this.hour += 1;
            
            if (this.hour >= 24) {
                this.hour = 0;
                this.day += 1;
            }
        }

        // تحديث الطقس بناءً على الوقت
        this.updateWeather();
        
        // تحديث الإضاءة
        this.updateLighting();
    }

    updateWeather() {
        // تغيير عشوائي في الطقس
        const weatherChance = Math.random();
        
        if (weatherChance < 0.01) { // 1% فرصة
            this.weather.current = 'storm';
            this.weather.rainIntensity = 0.8;
            this.weather.windSpeed = 15;
        } else if (weatherChance < 0.05) { // 4% فرصة
            this.weather.current = 'rain';
            this.weather.rainIntensity = 0.5;
            this.weather.windSpeed = 10;
        } else if (weatherChance < 0.1) { // 5% فرصة
            this.weather.current = 'fog';
            this.weather.fogDensity = 0.7;
        } else if (weatherChance < 0.15) { // 5% فرصة
            this.weather.current = 'cloudy';
        } else {
            this.weather.current = 'clear';
            this.weather.rainIntensity = 0;
            this.weather.fogDensity = 0.1;
            this.weather.windSpeed = 5;
        }

        // تغيير درجة الحرارة حسب الوقت
        if (this.hour >= 12 && this.hour <= 15) {
            this.weather.temperature = 30; // حرارة الظهيرة
        } else if (this.hour >= 0 && this.hour <= 5) {
            this.weather.temperature = 15; // برودة الليل
        } else {
            this.weather.temperature = 25;
        }
    }

    updateLighting() {
        // حساب شدة الإضاءة حسب الوقت
        let lightIntensity = 1;
        
        if (this.hour >= 20 || this.hour <= 6) { // الليل
            lightIntensity = 0.2;
        } else if (this.hour >= 18 || this.hour <= 7) { // الغروب/الشروق
            lightIntensity = 0.5;
        }
        
        return lightIntensity;
    }

    getCurrentZone(playerPosition) {
        for (const zoneName in this.zones) {
            const zone = this.zones[zoneName];
            
            if (this.isPointInZone(playerPosition, zone)) {
                return zone;
            }
        }
        
        return null; // خارج المناطق المعرفة
    }

    isPointInZone(point, zone) {
        return (
            point.x >= zone.position.x &&
            point.x <= zone.position.x + zone.size.width &&
            point.y >= zone.position.y &&
            point.y <= zone.position.y + zone.size.height
        );
    }

    getZoneMood(zoneName) {
        const zone = this.zones[zoneName];
        if (!zone) return 'unknown';
        
        // مزاج المنطقة يتأثر بالطقس والوقت
        let mood = zone.mood;
        
        if (this.weather.current === 'storm') {
            mood = 'tense';
        } else if (this.hour >= 20 || this.hour <= 6) {
            if (zone.dangerLevel > 0) {
                mood = 'dangerous';
            }
        }
        
        return mood;
    }

    getResourceAt(position) {
        const zone = this.getCurrentZone(position);
        
        if (!zone || zone.resources.length === 0) {
            return null;
        }
        
        // اختيار مصدر عشوائي من المنطقة
        const randomResource = zone.resources[Math.floor(Math.random() * zone.resources.length)];
        
        return {
            type: randomResource,
            amount: Math.floor(Math.random() * 5) + 1,
            zone: zone.name
        };
    }

    generateRandomEvent() {
        const events = [
            {
                type: 'animal_encounter',
                animal: Math.random() > 0.5 ? 'lion' : 'wolf',
                message: 'صوت وقع أقدام يقترب من الغابة...',
                chance: 0.1
            },
            {
                type: 'weather_change',
                message: 'السماء تمطر فجأة!',
                chance: 0.05
            },
            {
                type: 'resource_discovery',
                message: 'وجدت شيئاً لامعاً تحت الصخور!',
                chance: 0.15
            },
            {
                type: 'mysterious_sound',
                message: 'سمعت صوتاً غامضاً يأتي من بعيد...',
                chance: 0.2
            }
        ];
        
        for (const event of events) {
            if (Math.random() < event.chance) {
                return event;
            }
        }
        
        return null; // لا حدث
    }

    getTimeString() {
        const hourStr = this.hour.toString().padStart(2, '0');
        const minuteStr = this.minute.toString().padStart(2, '0');
        return `${hourStr}:${minuteStr}`;
    }

    getSeason() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const seasonIndex = Math.floor((this.day - 1) / 30) % 4;
        return seasons[seasonIndex];
    }
}

// التصدير
if (typeof module !== 'undefined') {
    module.exports = Island;
} else {
    window.Island = Island;
}
