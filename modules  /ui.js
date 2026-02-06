class UIManager {
    constructor() {
        this.elements = {};
        this.notifications = [];
        this.isInventoryOpen = false;
        this.isMapOpen = false;
        this.isMenuOpen = false;
    }

    init() {
        this.createUIElements();
        this.setupEventListeners();
        this.startUILoop();
    }

    createUIElements() {
        // شريط الصحة والطاقة
        this.createHealthBar();
        this.createStaminaBar();
        this.createHungerThirstBar();
        this.createMiniMap();
        this.createActionButtons();
        this.createNotificationArea();
        this.createInteractionPrompt();
    }

    createHealthBar() {
        const healthBar = document.createElement('div');
        healthBar.id = 'health-bar';
        healthBar.className = 'ui-bar';
        healthBar.innerHTML = `
            <div class="ui-label">❤️ الصحة</div>
            <div class="ui-container">
                <div class="ui-fill" id="health-fill" style="width: 100%"></div>
            </div>
            <div class="ui-value" id="health-value">100</div>
        `;
        document.body.appendChild(healthBar);
        this.elements.healthBar = healthBar;
    }

    createStaminaBar() {
        const staminaBar = document.createElement('div');
        staminaBar.id = 'stamina-bar';
        staminaBar.className = 'ui-bar';
        staminaBar.innerHTML = `
            <div class="ui-label">⚡ الطاقة</div>
            <div class="ui-container">
                <div class="ui-fill" id="stamina-fill" style="width: 100%"></div>
            </div>
            <div class="ui-value" id="stamina-value">100</div>
        `;
        document.body.appendChild(staminaBar);
        this.elements.staminaBar = staminaBar;
    }

    createHungerThirstBar() {
        const hungerThirstBar = document.createElement('div');
        hungerThirstBar.id = 'hunger-thirst-bar';
        hungerThirstBar.className = 'ui-bar double';
        hungerThirstBar.innerHTML = `
            <div class="ui-section">
                <div class="ui-label">🍖 الجوع</div>
                <div class="ui-container">
                    <div class="ui-fill" id="hunger-fill" style="width: 100%"></div>
                </div>
                <div class="ui-value" id="hunger-value">100</div>
            </div>
            <div class="ui-section">
                <div class="ui-label">💧 العطش</div>
                <div class="ui-container">
                    <div class="ui-fill" id="thirst-fill" style="width: 100%"></div>
                </div>
                <div class="ui-value" id="thirst-value">100</div>
            </div>
        `;
        document.body.appendChild(hungerThirstBar);
        this.elements.hungerThirstBar = hungerThirstBar;
    }

    createMiniMap() {
        const miniMap = document.createElement('div');
        miniMap.id = 'mini-map';
        miniMap.className = 'ui-minimap';
        miniMap.innerHTML = `
            <div class="map-title">🗺️ الخريطة المصغرة</div>
            <canvas id="map-canvas" width="200" height="200"></canvas>
            <div class="map-legend">
                <div class="legend-item"><span class="player-dot"></span> أنت</div>
                <div class="legend-item"><span class="house-dot"></span> بيت</div>
                <div class="legend-item"><span class="animal-dot"></span> حيوانات</div>
            </div>
        `;
        document.body.appendChild(miniMap);
        this.elements.miniMap = miniMap;
    }

    createActionButtons() {
        const actionBar = document.createElement('div');
        actionBar.id = 'action-bar';
        actionBar.className = 'ui-action-bar';
        
        const actions = [
            { id: 'inventory-btn', icon: '🎒', label: 'المخزون', key: 'I' },
            { id: 'map-btn', icon: '🗺️', label: 'خريطة', key: 'M' },
            { id: 'craft-btn', icon: '🛠️', label: 'صنع', key: 'C' },
            { id: 'sleep-btn', icon: '🛏️', label: 'نوم', key: 'Z' },
            { id: 'save-btn', icon: '💾', label: 'حفظ', key: 'S' },
            { id: 'menu-btn', icon: '≡', label: 'قائمة', key: 'Esc' }
        ];
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.id = action.id;
            button.className = 'action-btn';
            button.innerHTML = `
                <span class="action-icon">${action.icon}</span>
                <span class="action-label">${action.label}</span>
                <span class="action-key">${action.key}</span>
            `;
            actionBar.appendChild(button);
        });
        
        document.body.appendChild(actionBar);
        this.elements.actionBar = actionBar;
    }

    createNotificationArea() {
        const notificationArea = document.createElement('div');
        notificationArea.id = 'notification-area';
        notificationArea.className = 'ui-notifications';
        document.body.appendChild(notificationArea);
        this.elements.notificationArea = notificationArea;
    }

    createInteractionPrompt() {
        const interactionPrompt = document.createElement('div');
        interactionPrompt.id = 'interaction-prompt';
        interactionPrompt.className = 'ui-interaction-prompt hidden';
        interactionPrompt.innerHTML = '[E] للتفاعل';
        document.body.appendChild(interactionPrompt);
        this.elements.interactionPrompt = interactionPrompt;
    }

    setupEventListeners() {
        // فتح/غلق المخزون
        document.getElementById('inventory-btn').addEventListener('click', () => {
            this.toggleInventory();
        });

        // فتح/غلق الخريطة
        document.getElementById('map-btn').addEventListener('click', () => {
            this.toggleMap();
        });

        // فتح/غلق القائمة
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.toggleMenu();
        });

        // أزرار الكيبورد
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'i':
                    e.preventDefault();
                    this.toggleInventory();
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleMap();
                    break;
                case 'c':
                    e.preventDefault();
                    this.showCraftingMenu();
                    break;
                case 'z':
                    e.preventDefault();
                    this.showSleepPrompt();
                    break;
                case 's':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.showSaveMenu();
                    }
                    break;
                case 'escape':
                    e.preventDefault();
                    this.toggleMenu();
                    break;
            }
        });
    }

    startUILoop() {
        setInterval(() => {
            this.updateUI();
        }, 100); // تحديث كل 100ms
    }

    updateUI() {
        if (!window.player) return;

        const player = window.player;
        
        // تحديث الأشرطة
        this.updateBar('health', player.stats.health);
        this.updateBar('stamina', player.stats.energy);
        this.updateBar('hunger', player.stats.hunger);
        this.updateBar('thirst', player.stats.thirst);
        
        // تحديث الخريطة المصغرة
        this.updateMiniMap();
        
        // تحديث الإشعارات
        this.updateNotifications();
        
        // تحديث موجه التفاعل
        this.updateInteractionPrompt();
    }

    updateBar(type, value) {
        const fill = document.getElementById(`${type}-fill`);
        const valueDisplay = document.getElementById(`${type}-value`);
        
        if (fill && valueDisplay) {
            const percentage = Math.max(0, Math.min(100, value));
            fill.style.width = `${percentage}%`;
            valueDisplay.textContent = Math.floor(value);
            
            // تغيير اللون حسب القيمة
            if (percentage < 20) {
                fill.style.backgroundColor = '#ff4444';
            } else if (percentage < 50) {
                fill.style.backgroundColor = '#ffaa44';
            } else {
                fill.style.backgroundColor = '#44ff44';
            }
        }
    }

    updateMiniMap() {
        const canvas = document.getElementById('map-canvas');
        if (!canvas || !window.player) return;
        
        const ctx = canvas.getContext('2d');
        const player = window.player;
        
        // مسح الخريطة
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // رسم الجزيرة
        ctx.fillStyle = 'rgba(0, 100, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(100, 100, 80, 60, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // رسم البيت
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(80, 90, 15, 12);
        
        // رسم الغابة
        ctx.fillStyle = '#006400';
        for (let i = 0; i < 10; i++) {
            const x = 50 + Math.random() * 60;
            const y = 60 + Math.random() * 40;
            ctx.fillRect(x, y, 5, 8);
        }
        
        // رسم موقع اللاعب
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(
            100 + (player.position.x - 400) / 10,
            100 + (player.position.y - 300) / 10,
            3, 0, Math.PI * 2
        );
        ctx.fill();
    }

    updateNotifications() {
        const area = this.elements.notificationArea;
        if (!area) return;
        
        // إزالة الإشعارات القديمة
        const now = Date.now();
        this.notifications = this.notifications.filter(n => now - n.time < 5000);
        
        // تحديث العرض
        area.innerHTML = '';
        this.notifications.forEach(notification => {
            const element = document.createElement('div');
            element.className = `notification ${notification.type}`;
            element.textContent = notification.text;
            area.appendChild(element);
        });
    }

    updateInteractionPrompt() {
        const prompt = this.elements.interactionPrompt;
        if (!prompt) return;
        
        // التحقق مما إذا كان اللاعب قريباً من شيء يمكن التفاعل معه
        // هذه وظيفة تحتاج إلى تنفيذ في اللعبة الرئيسية
        const hasInteraction = false; // سيتم استبدال هذا
        
        if (hasInteraction) {
            prompt.classList.remove('hidden');
        } else {
            prompt.classList.add('hidden');
        }
    }

    addNotification(text, type = 'info') {
        this.notifications.push({
            text: text,
            type: type,
            time: Date.now()
        });
        
        // حد 5 إشعارات فقط
        if (this.notifications.length > 5) {
            this.notifications.shift();
        }
    }

    toggleInventory() {
        this.isInventoryOpen = !this.isInventoryOpen;
        
        if (this.isInventoryOpen) {
            this.showInventory();
        } else {
            this.hideInventory();
        }
    }

    showInventory() {
        // إنشاء واجهة المخزون
        const inventoryModal = document.createElement('div');
        inventoryModal.id = 'inventory-modal';
        inventoryModal.className = 'ui-modal';
        
        let inventoryHTML = `
            <div class="modal-header">
                <h3>🎒 المخزون</h3>
                <button class="modal-close">✕</button>
            </div>
            <div class="modal-content">
                <div class="inventory-grid" id="inventory-grid">
        `;
        
        if (window.player && window.player.inventory) {
            window.player.inventory.items.forEach((item, index) => {
                const isSelected = index === window.player.inventory.selected;
                inventoryHTML += `
                    <div class="inventory-item ${isSelected ? 'selected' : ''}" data-index="${index}">
                        <div class="item-icon">${this.getItemIcon(item)}</div>
                        <div class="item-name">${this.getItemName(item)}</div>
                    </div>
                `;
            });
        }
        
        inventoryHTML += `
                </div>
                <div class="inventory-info">
                    <h4>المحدد حالياً:</h4>
                    <div id="selected-item-info">لا شيء</div>
                </div>
            </div>
        `;
        
        inventoryModal.innerHTML = inventoryHTML;
        document.body.appendChild(inventoryModal);
        
        // إغلاق المخزون
        inventoryModal.querySelector('.modal-close').addEventListener('click', () => {
            this.toggleInventory();
        });
        
        // اختيار العنصر
        inventoryModal.querySelectorAll('.inventory-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                if (window.player) {
                    window.player.switchItem(index);
                    this.updateInventorySelection();
                }
            });
        });
    }

    hideInventory() {
        const modal = document.getElementById('inventory-modal');
        if (modal) {
            modal.remove();
        }
    }

    updateInventorySelection() {
        document.querySelectorAll('.inventory-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        if (window.player) {
            const selected = document.querySelector(`[data-index="${window.player.inventory.selected}"]`);
            if (selected) {
                selected.classList.add('selected');
            }
        }
    }

    getItemIcon(item) {
        const icons = {
            'hand': '✋',
            'axe': '🪓',
            'knife': '🔪',
            'bow': '🏹',
            'spear': '🗡️',
            'wood': '🪵',
            'stone': '🪨',
            'food': '🍎',
            'water': '💧',
            'medkit': '🧰'
        };
        
        return icons[item] || '❓';
    }

    getItemName(item) {
        const names = {
            'hand': 'اليدين',
            'axe': 'فأس',
            'knife': 'سكين',
            'bow': 'قوس',
            'spear': 'رمح',
            'wood': 'خشب',
            'stone': 'حجر',
            'food': 'طعام',
            'water': 'ماء',
            'medkit': 'علبة إسعاف'
        };
        
        return names[item] || item;
    }

    toggleMap() {
        this.isMapOpen = !this.isMapOpen;
        
        if (this.isMapOpen) {
            this.showFullMap();
        } else {
            this.hideFullMap();
        }
    }

    showFullMap() {
        // إنشاء خريطة كاملة الشاشة
        const fullMap = document.createElement('div');
        fullMap.id = 'full-map';
        fullMap.className = 'ui-fullmap';
        
        fullMap.innerHTML = `
            <div class="map-header">
                <h2>🗺️ خريطة الجزيرة الكاملة</h2>
                <button class="map-close">✕</button>
            </div>
            <div class="map-container">
                <canvas id="full-map-canvas" width="800" height="600"></canvas>
                <div class="map-overlay">
                    <div class="map-legend">
                        <h4>مفاتيح الخريطة:</h4>
                        <div>🏠 البيت الرئيسي</div>
                        <div>🌳 الغابة</div>
                        <div>🏖️ الشاطئ</div>
                        <div>🏔️ التلال</div>
                        <div>🟥 موقعك الحالي</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(fullMap);
        
        // رسم الخريطة
        this.drawFullMap();
        
        // زر الإغلاق
        fullMap.querySelector('.map-close').addEventListener('click', () => {
            this.toggleMap();
        });
    }

    drawFullMap() {
        const canvas = document.getElementById('full-map-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // رسم الخلفية
        ctx.fillStyle = '#1a472a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // رسم الجزيرة
        ctx.fillStyle = '#2a623d';
        ctx.beginPath();
        ctx.ellipse(400, 300, 250, 180, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // رسم المعالم
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(350, 250, 30, 25); // البيت
        
        ctx.fillStyle = '#0a472a';
        ctx.fillRect(200, 150, 100, 80); // الغابة
        
        ctx.fillStyle = '#f4e4a6';
        ctx.fillRect(500, 380, 120, 70); // الشاطئ
        
        ctx.fillStyle = '#8a7f68';
        ctx.fillRect(550, 120, 80, 100); // التلال
        
        // رسم موقع اللاعب
        if (window.player) {
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(
                400 + (window.player.position.x - 400) / 2,
                300 + (window.player.position.y - 300) / 2,
                5, 0, Math.PI * 2
            );
            ctx.fill();
        }
    }

    hideFullMap() {
        const map = document.getElementById('full-map');
        if (map) {
            map.remove();
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.showMenu();
        } else {
            this.hideMenu();
        }
    }

    showMenu() {
        const menu = document.createElement('div');
        menu.id = 'game-menu';
        menu.className = 'ui-menu';
        
        menu.innerHTML = `
            <div class="menu-header">
                <h2>قائمة اللعبة</h2>
                <button class="menu-close">✕</button>
            </div>
            <div class="menu-options">
                <button class="menu-option" id="resume-game">استئناف اللعبة</button>
                <button class="menu-option" id="save-game">حفظ اللعبة</button>
                <button class="menu-option" id="load-game">تحميل حفظ</button>
                <button class="menu-option" id="settings">الإعدادات</button>
                <button class="menu-option" id="help">المساعدة</button>
                <button class="menu-option" id="quit-game">خروج</button>
            </div>
            <div class="menu-footer">
                <p>الجزيرة إيدن - الإصدار 0.1</p>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // أحداث القائمة
        menu.querySelector('.menu-close').addEventListener('click', () => {
            this.toggleMenu();
        });
        
        menu.querySelector('#resume-game').addEventListener('click', () => {
            this.toggleMenu();
        });
        
        menu.querySelector('#save-game').addEventListener('click', () => {
            this.showSaveMenu();
        });
        
        menu.querySelector('#quit-game').addEventListener('click', () => {
            if (confirm('هل تريد الخروج من اللعبة؟ سيتم فقدان التقدم غير المحفوظ.')) {
                window.location.reload();
            }
        });
    }

    hideMenu() {
        const menu = document.getElementById('game-menu');
        if (menu) {
            menu.remove();
        }
    }

    showCraftingMenu() {
        this.addNotification('نظام الصنع قيد التطوير', 'info');
    }

    showSleepPrompt() {
        if (confirm('هل تريد النوم لاستعادة الطاقة؟')) {
            if (window.player) {
                const result = window.player.sleep();
                this.addNotification(result, 'info');
            }
        }
    }

    showSaveMenu() {
        const saveModal = document.createElement('div');
        saveModal.className = 'ui-modal save-modal';
        
        saveModal.innerHTML = `
            <div class="modal-header">
                <h3>💾 حفظ اللعبة</h3>
                <button class="modal-close">✕</button>
            </div>
            <div class="modal-content">
                <input type="text" id="save-name" placeholder="اسم الحفظ" value="الحفظ ${new Date().toLocaleTimeString()}">
                <div class="save-slots">
                    <div class="save-slot" data-slot="1">1. ${localStorage.getItem('eden_save_1') ? 'محفوظ' : 'فارغ'}</div>
                    <div class="save-slot" data-slot="2">2. ${localStorage.getItem('eden_save_2') ? 'محفوظ' : 'فارغ'}</div>
                    <div class="save-slot" data-slot="3">3. ${localStorage.getItem('eden_save_3') ? 'محفوظ' : 'فارغ'}</div>
                </div>
                <button id="confirm-save">حفظ</button>
            </div>
        `;
        
        document.body.appendChild(saveModal);
        
        // أحداث الحفظ
        saveModal.querySelector('.modal-close').addEventListener('click', () => {
            saveModal.remove();
        });
        
        saveModal.querySelector('#confirm-save').addEventListener('click', () => {
            this.saveGame();
            saveModal.remove();
        });
        
        saveModal.querySelectorAll('.save-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                document.getElementById('save-name').value = `الحفظ ${slot.dataset.slot}`;
            });
        });
    }

    saveGame() {
        if (window.gameState && window.player) {
            const saveData = {
                player: {
                    position: window.player.position,
                    stats: window.player.stats,
                    inventory: window.player.inventory
                },
                gameState: window.gameState,
                timestamp: new Date()
            };
            
            localStorage.setItem('eden_island_save', JSON.stringify(saveData));
            this.addNotification('تم حفظ اللعبة بنجاح!', 'success');
        }
    }
}

// إضافة أنماط الـ UI
const uiStyles = `
    .ui-bar {
        position: fixed;
        left: 20px;
        width: 250px;
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid #333;
        border-radius: 10px;
        padding: 10px;
        color: white;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 100;
    }

    #health-bar { top: 20px; border-color: #ff4444; }
    #stamina-bar { top: 70px; border-color: #44aaff; }
    #hunger-thirst-bar { top: 120px; border-color: #ffaa44; width: 300px; }

    .ui-label {
        font-weight: bold;
        min-width: 60px;
    }

    .ui-container {
        flex: 1;
        height: 20px;
        background: rgba(50, 50, 50, 0.8);
        border-radius: 10px;
        overflow: hidden;
    }

    .ui-fill {
        height: 100%;
        background: linear-gradient(90deg, #44ff44, #44aaff);
        transition: width 0.3s;
    }

    .ui-value {
        font-weight: bold;
        min-width: 30px;
        text-align: center;
    }

    .ui-bar.double {
        flex-direction: column;
        gap: 5px;
    }

    .ui-section {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
    }

    .ui-minimap {
        position: fixed;
        right: 20px;
        top: 20px;
        width: 220px;
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid #4444aa;
        border-radius: 10px;
        padding: 10px;
        color: white;
        z-index: 100;
    }

    .map-title {
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
    }

    #map-canvas {
        display: block;
        margin: 0 auto;
        border: 1px solid #666;
        border-radius: 5px;
    }

    .map-legend {
        margin-top: 10px;
        font-size: 0.8em;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        margin: 3px 0;
    }

    .player-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #ff0000;
        border-radius: 50%;
    }

    .house-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #8B4513;
    }

    .animal-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #ffff00;
        border-radius: 50%;
    }

    .ui-action-bar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        background: rgba(0, 0, 0, 0.7);
        padding: 10px;
        border-radius: 10px;
        z-index: 100;
    }

    .action-btn {
        background: rgba(50, 50, 70, 0.8);
        border: 2px solid #4444aa;
        color: white;
        padding: 10px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 70px;
        transition: all 0.2s;
    }

    .action-btn:hover {
        background: rgba(68, 68, 170, 0.8);
        transform: translateY(-2px);
    }

    .action-icon {
        font-size: 1.5em;
    }

    .action-label {
        font-size: 0.8em;
        margin-top: 5px;
    }

    .action-key {
        font-size: 0.7em;
        color: #aaa;
        margin-top: 2px;
    }

    .ui-notifications {
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
        z-index: 100;
    }

    .notification {
        background: rgba(0, 0, 0, 0.9);
        border-left: 5px solid #4444aa;
        padding: 10px 15px;
        border-radius: 5px;
        color: white;
        animation: slideIn 0.3s;
        max-width: 300px;
    }

    .notification.info { border-color: #4444aa; }
    .notification.success { border-color: #44aa44; }
    .notification.warning { border-color: #ffaa44; }
    .notification.error { border-color: #ff4444; }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    .ui-interaction-prompt {
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 10px;
        border: 2px solid #44ff44;
        z-index: 100;
        font-size: 1.2em;
    }

    .ui-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(20, 25, 40, 0.95);
        border: 2px solid #4444aa;
        border-radius: 10px;
        padding: 20px;
        color: white;
        z-index: 1000;
        min-width: 500px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #4444aa;
        padding-bottom: 10px;
    }

    .modal-close {
        background: #aa4444;
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
    }

    .inventory-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
        margin-bottom: 20px;
    }

    .inventory-item {
        background: rgba(50, 50, 70, 0.8);
        border: 2px solid #666;
        border-radius: 5px;
        padding: 10px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .inventory-item:hover {
        border-color: #4444aa;
        transform: scale(1.05);
    }

    .inventory-item.selected {
        border-color: #44ff44;
        background: rgba(68, 255, 68, 0.1);
    }

    .item-icon {
        font-size: 2em;
        margin-bottom: 5px;
    }

    .item-name {
        font-size: 0.9em;
    }

    .ui-fullmap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }

    .map-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .map-overlay {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #4444aa;
    }

    .ui-menu {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(20, 25, 40, 0.98);
        border: 3px solid #4444aa;
        border-radius: 15px;
        padding: 30px;
        color: white;
        z-index: 1000;
        min-width: 400px;
        text-align: center;
    }

    .menu-options {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 20px 0;
    }

    .menu-option {
        background: rgba(68, 68, 170, 0.8);
        border: none;
        color: white;
        padding: 15px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.1em;
        transition: all 0.2s;
    }

    .menu-option:hover {
        background: rgba(88, 88, 200, 0.8);
        transform: scale(1.05);
    }

    .menu-footer {
        margin-top: 20px;
        color: #aaa;
        font-size: 0.9em;
    }

    .hidden {
        display: none !important;
    }
`;

// إضافة الأنماط إلى الصفحة
const uiStyleSheet = document.createElement("style");
uiStyleSheet.textContent = uiStyles;
document.head.appendChild(uiStyleSheet);

// التصدير
if (typeof module !== 'undefined') {
    module.exports = UIManager;
} else {
    window.UIManager = UIManager;
}
