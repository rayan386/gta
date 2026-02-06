class AdminPanel {
    constructor() {
        this.isVisible = false;
        this.adminPassword = 'admin123';
        this.playerStats = {};
        this.worldControls = {};
        this.teleportLocations = [
            { name: 'البيت', x: 350, y: 250 },
            { name: 'الغابة', x: 200, y: 200 },
            { name: 'الشاطئ', x: 500, y: 400 },
            { name: 'التلال', x: 600, y: 150 }
        ];
    }

    init() {
        this.createPanel();
        this.setupEvents();
    }

    createPanel() {
        const panelHTML = `
            <div id="admin-panel" class="admin-panel hidden">
                <div class="admin-header">
                    <h3>🛠️ لوحة التحكم الإدارية</h3>
                    <button id="close-admin" class="close-btn">✕</button>
                </div>
                
                <div class="admin-tabs">
                    <button class="tab-btn active" data-tab="players">👥 اللاعبون</button>
                    <button class="tab-btn" data-tab="world">🌍 العالم</button>
                    <button class="tab-btn" data-tab="spawn">➕ إنشاء</button>
                    <button class="tab-btn" data-tab="debug">🐛 تصحيح</button>
                </div>
                
                <div class="tab-content" id="players-tab">
                    <h4>اللاعبون المتصلون</h4>
                    <div id="players-list">جار التحميل...</div>
                    
                    <div class="player-controls">
                        <h4>تحكم باللاعب المحدد</h4>
                        <button id="teleport-player">نقل لاعب</button>
                        <button id="heal-player">علاج</button>
                        <button id="damage-player">إصابة (10 ضرر)</button>
                        <button id="kick-player">طرد</button>
                    </div>
                </div>
                
                <div class="tab-content hidden" id="world-tab">
                    <h4>تحكم بالعالم</h4>
                    
                    <div class="control-group">
                        <label>الوقت: <input type="range" id="time-slider" min="0" max="23" value="6"></label>
                        <span id="time-value">06:00</span>
                    </div>
                    
                    <div class="control-group">
                        <label>الطقس:</label>
                        <select id="weather-select">
                            <option value="clear">صافي</option>
                            <option value="cloudy">غائم</option>
                            <option value="rain">مطر</option>
                            <option value="storm">عاصفة</option>
                            <option value="fog">ضباب</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label>المزاج العام:</label>
                        <select id="mood-select">
                            <option value="calm">هادئ</option>
                            <option value="tense">متوتر</option>
                            <option value="dangerous">خطير</option>
                            <option value="peaceful">مسالم</option>
                        </select>
                    </div>
                    
                    <button id="apply-world-changes">تطبيق التغييرات</button>
                </div>
                
                <div class="tab-content hidden" id="spawn-tab">
                    <h4>إنشاء كائنات</h4>
                    
                    <div class="spawn-controls">
                        <select id="spawn-type">
                            <option value="lion">أسد</option>
                            <option value="dog">كلب</option>
                            <option value="horse">حصان</option>
                            <option value="tree">شجرة</option>
                            <option value="rock">صخرة</option>
                            <option value="chest">صندوق</option>
                        </select>
                        
                        <input type="number" id="spawn-x" placeholder="X" value="400">
                        <input type="number" id="spawn-y" placeholder="Y" value="300">
                        
                        <button id="spawn-object">إنشاء</button>
                        <button id="spawn-at-player">إنشاء عند اللاعب</button>
                    </div>
                    
                    <div class="spawn-list">
                        <h4>الكائنات المنشأة</h4>
                        <div id="spawned-objects">لا توجد كائنات</div>
                    </div>
                </div>
                
                <div class="tab-content hidden" id="debug-tab">
                    <h4>أدوات التصحيح</h4>
                    
                    <div class="debug-tools">
                        <button id="show-coords">إظهار الإحداثيات</button>
                        <button id="toggle-collision">تفعيل/تعطيل الاصطدام</button>
                        <button id="toggle-godmode">وضع الإله</button>
                        <button id="unlock-all">فتح كل الأقفال</button>
                    </div>
                    
                    <div class="debug-info">
                        <h4>معلومات التصحيح</h4>
                        <pre id="debug-output">جار التحميل...</pre>
                    </div>
                    
                    <button id="refresh-debug">تحديث المعلومات</button>
                </div>
                
                <div class="admin-footer">
                    <p id="admin-status">جاهز</p>
                    <button id="save-admin">حفظ التغييرات</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', panelHTML);
        this.panel = document.getElementById('admin-panel');
    }

    setupEvents() {
        // إظهار/إخفاء اللوحة بـ Ctrl+Shift+A
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                this.togglePanel();
            }
        });

        // زر الإغلاق
        document.getElementById('close-admin').addEventListener('click', () => {
            this.hidePanel();
        });

        // التبويبات
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // التحكم في الوقت
        const timeSlider = document.getElementById('time-slider');
        const timeValue = document.getElementById('time-value');
        
        timeSlider.addEventListener('input', (e) => {
            const hour = parseInt(e.target.value);
            timeValue.textContent = hour.toString().padStart(2, '0') + ':00';
        });

        // إنشاء كائنات
        document.getElementById('spawn-object').addEventListener('click', () => {
            this.spawnObject();
        });

        // زر حفظ
        document.getElementById('save-admin').addEventListener('click', () => {
            this.saveChanges();
        });

        // تحديث التصحيح
        document.getElementById('refresh-debug').addEventListener('click', () => {
            this.updateDebugInfo();
        });
    }

    togglePanel() {
        if (this.isVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }

    showPanel() {
        // طلب كلمة المرور أولاً
        const password = prompt('كلمة مرور الأدمن:');
        
        if (password === this.adminPassword) {
            this.panel.classList.remove('hidden');
            this.isVisible = true;
            this.updatePlayerList();
            this.updateDebugInfo();
        } else {
            alert('كلمة المرور خاطئة!');
        }
    }

    hidePanel() {
        this.panel.classList.add('hidden');
        this.isVisible = false;
    }

    switchTab(tabName) {
        // إخفاء كل المحتويات
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // إزالة النشاط من كل الأزرار
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // إظهار المحتوى المطلوب
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        
        // تفعيل الزر
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    updatePlayerList() {
        // في النسخة الحقيقية، هذا سيأتي من السيرفر
        const playersList = document.getElementById('players-list');
        
        if (window.gameState && window.player) {
            playersList.innerHTML = `
                <div class="player-item">
                    <strong>اللاعب الرئيسي</strong>
                    <br>الصحة: ${window.player.stats.health}
                    <br>الموقع: X=${Math.floor(window.player.position.x)}, Y=${Math.floor(window.player.position.y)}
                    <br>الثقة: ${window.gameState.playerData.trust}
                </div>
            `;
        } else {
            playersList.innerHTML = 'لا يوجد لاعبون متصلون';
        }
    }

    spawnObject() {
        const type = document.getElementById('spawn-type').value;
        const x = parseInt(document.getElementById('spawn-x').value);
        const y = parseInt(document.getElementById('spawn-y').value);
        
        console.log(`إنشاء ${type} عند (${x}, ${y})`);
        
        // عرض رسالة
        this.showStatus(`تم إنشاء ${type}`, 'success');
        
        // إضافة إلى القائمة
        const objectsList = document.getElementById('spawned-objects');
        const objectDiv = document.createElement('div');
        objectDiv.className = 'spawned-item';
        objectDiv.innerHTML = `${type} عند (${x}, ${y}) <button class="remove-obj">حذف</button>`;
        objectsList.appendChild(objectDiv);
        
        // في النسخة الحقيقية، هذا سيخلق الكائن في اللعبة
        if (window.game && type === 'lion') {
            // إنشاء أسد جديد
            const lion = new Animal('lion', { x, y });
            // إضافة إلى اللعبة...
        }
    }

    updateDebugInfo() {
        const debugOutput = document.getElementById('debug-output');
        
        const info = {
            gameState: window.gameState || 'غير محمل',
            player: window.player ? {
                position: window.player.position,
                health: window.player.stats.health,
                inventory: window.player.inventory.items
            } : 'غير موجود',
            aiDirector: window.aiDirector ? {
                worldMood: window.aiDirector.memory.world,
                playerMemory: window.aiDirector.memory.player
            } : 'غير محمل',
            performance: {
                fps: Math.floor(1000 / 16.67), // تقديري
                memory: (performance.memory ? (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'غير متوفر'),
                timestamp: Date.now()
            }
        };
        
        debugOutput.textContent = JSON.stringify(info, null, 2);
    }

    saveChanges() {
        // حفظ تغييرات الأدمن
        localStorage.setItem('eden_island_admin', JSON.stringify({
            lastModified: new Date(),
            changes: this.worldControls
        }));
        
        this.showStatus('تم حفظ التغييرات', 'success');
    }

    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('admin-status');
        statusEl.textContent = message;
        statusEl.className = `admin-status ${type}`;
        
        setTimeout(() => {
            statusEl.textContent = 'جاهز';
            statusEl.className = 'admin-status';
        }, 3000);
    }

    teleportPlayer(x, y) {
        if (window.player) {
            window.player.position.x = x;
            window.player.position.y = y;
            this.showStatus(`تم نقل اللاعب إلى (${x}, ${y})`, 'success');
        }
    }

    setTime(hour) {
        if (window.gameState) {
            window.gameState.world.time = hour;
            this.showStatus(`تم تغيير الوقت إلى ${hour}:00`, 'success');
        }
    }

    setWeather(weather) {
        if (window.gameState) {
            window.gameState.world.weather = weather;
            this.showStatus(`تم تغيير الطقس إلى ${weather}`, 'success');
        }
    }
}

// إضافة CSS للأدمن
const adminStyles = `
    .admin-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 800px;
        height: 600px;
        background: rgba(20, 25, 40, 0.95);
        border: 2px solid #4444aa;
        border-radius: 10px;
        z-index: 10000;
        color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
    }

    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #4444aa;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }

    .close-btn {
        background: #aa4444;
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
    }

    .admin-tabs {
        display: flex;
        gap: 5px;
        margin-bottom: 20px;
    }

    .tab-btn {
        padding: 8px 15px;
        background: rgba(50, 50, 70, 0.8);
        border: 1px solid #4444aa;
        color: white;
        cursor: pointer;
        border-radius: 5px 5px 0 0;
    }

    .tab-btn.active {
        background: rgba(68, 68, 170, 0.8);
        border-bottom: 2px solid white;
    }

    .tab-content {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 5px;
    }

    .control-group {
        margin: 15px 0;
        padding: 10px;
        background: rgba(30, 30, 50, 0.5);
        border-radius: 5px;
    }

    .control-group label {
        display: block;
        margin-bottom: 5px;
    }

    .control-group input, .control-group select {
        width: 100%;
        padding: 5px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #666;
        color: white;
        border-radius: 3px;
    }

    .admin-footer {
        margin-top: 20px;
        border-top: 1px solid #4444aa;
        padding-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #admin-status {
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 0.9em;
    }

    .admin-status.success {
        background: rgba(0, 100, 0, 0.5);
        border: 1px solid #00aa00;
    }

    .admin-status.error {
        background: rgba(100, 0, 0, 0.5);
        border: 1px solid #ff4444;
    }

    .admin-status.info {
        background: rgba(0, 0, 100, 0.5);
        border: 1px solid #4444aa;
    }

    .spawned-item {
        background: rgba(50, 50, 70, 0.5);
        padding: 5px;
        margin: 3px 0;
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
    }

    .remove-obj {
        background: #aa4444;
        color: white;
        border: none;
        padding: 2px 8px;
        border-radius: 3px;
        cursor: pointer;
    }

    .debug-info pre {
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 5px;
        max-height: 200px;
        overflow-y: auto;
        font-size: 0.8em;
    }

    button {
        padding: 8px 15px;
        background: rgba(68, 68, 170, 0.8);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 5px;
    }

    button:hover {
        background: rgba(88, 88, 200, 0.8);
    }
`;

// إضافة الـ styles إلى الصفحة
const styleSheet = document.createElement("style");
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);

// التصدير
if (typeof module !== 'undefined') {
    module.exports = AdminPanel;
} else {
    window.AdminPanel = AdminPanel;
}
