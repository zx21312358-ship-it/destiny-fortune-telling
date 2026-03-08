// 命运之境 - 算命网页核心功能（升级版）

// ==================== 全局状态 ====================
let currentResult = null; // 当前占卜结果
let currentType = null;   // 当前占卜类型

// ==================== 主题切换 ====================
const ThemeManager = {
    init: function() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.setAttribute('data-theme', savedTheme);
        this.updateActiveTheme(savedTheme);
    },

    setTheme: function(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateActiveTheme(theme);
    },

    updateActiveTheme: function(theme) {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });
    },

    togglePanel: function() {
        const panel = document.getElementById('theme-panel');
        panel.classList.toggle('hidden');
        document.getElementById('history-panel')?.classList.add('hidden');
    }
};

// ==================== 历史记录管理 ====================
const HistoryManager = {
    STORAGE_KEY: 'destiny_history',
    MAX_ITEMS: 50,

    init: function() {
        this.render();
    },

    save: function(type, title, data) {
        const history = this.getAll();
        const newItem = {
            id: Date.now().toString(),
            type: type,
            title: title,
            data: data,
            timestamp: Date.now()
        };

        history.unshift(newItem);
        if (history.length > this.MAX_ITEMS) {
            history.pop();
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        this.render();
        return newItem;
    },

    getAll: function() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    },

    delete: function(id) {
        const history = this.getAll().filter(item => item.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        this.render();
    },

    clear: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.render();
    },

    formatTime: function(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
        if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';

        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    },

    getTypeName: function(type) {
        const names = {
            horoscope: '星座运势',
            bazi: '八字算命',
            tarot: '塔罗占卜'
        };
        return names[type] || type;
    },

    render: function() {
        const history = this.getAll();
        const container = document.getElementById('history-list');

        if (history.length === 0) {
            container.innerHTML = '<p class="empty-history">暂无历史记录</p>';
            return;
        }

        container.innerHTML = history.map(item => `
            <div class="history-item" data-id="${item.id}" data-type="${item.type}">
                <div class="history-item-header">
                    <span class="history-type">${this.getTypeName(item.type)}</span>
                    <button class="history-delete" data-id="${item.id}">×</button>
                </div>
                <div class="history-title">${item.title}</div>
                <div class="history-time">${this.formatTime(item.timestamp)}</div>
            </div>
        `).join('');

        // 绑定事件
        container.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('history-delete')) {
                    this.delete(e.target.dataset.id);
                } else {
                    this.loadHistory(item.dataset.id, item.dataset.type);
                }
            });
        });
    },

    loadHistory: function(id, type) {
        const history = this.getAll().find(item => item.id === id);
        if (!history) return;

        // 切换到对应标签页
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === type);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === type);
        });
        document.getElementById('history-panel')?.classList.add('hidden');

        // 加载结果
        if (type === 'horoscope') {
            this.loadHoroscopeResult(history.data);
        } else if (type === 'bazi') {
            this.loadBaziResult(history.data);
        } else if (type === 'tarot') {
            this.loadTarotResult(history.data);
        }
    },

    loadHoroscopeResult: function(data) {
        const getBarColor = (value) => {
            if (value >= 80) return '#00ffff';
            if (value >= 60) return '#ffd700';
            return '#ff6b6b';
        };

        document.getElementById('result-zodiac').textContent = data.signName;
        document.getElementById('result-date').textContent = data.date;

        ['overall', 'love', 'money', 'career', 'health'].forEach(key => {
            const value = data[key];
            document.getElementById(key + '-bar').style.width = value + '%';
            document.getElementById(key + '-bar').style.background = getBarColor(value);
            document.getElementById(key + '-value').textContent = value + '%';
        });

        document.getElementById('fortune-guidance').textContent = data.guidance;
        document.getElementById('horoscope-result').classList.remove('hidden');
    },

    loadBaziResult: function(data) {
        document.getElementById('bazi-name').textContent = data.name + '的命盘';
        document.getElementById('bazi-info').textContent = data.info;
        document.getElementById('bazi-lunar').textContent = data.lunar;

        document.getElementById('year-gan').textContent = data.yearGan;
        document.getElementById('year-zhi').textContent = data.yearZhi;
        document.getElementById('month-gan').textContent = data.monthGan;
        document.getElementById('month-zhi').textContent = data.monthZhi;
        document.getElementById('day-gan').textContent = data.dayGan;
        document.getElementById('day-zhi').textContent = data.dayZhi;
        document.getElementById('hour-gan').textContent = data.hourGan;
        document.getElementById('hour-zhi').textContent = data.hourZhi;

        document.getElementById('riyuan').textContent = data.riyuan;
        document.getElementById('wuxing').textContent = data.wuxing;
        document.getElementById('shengxiao').textContent = data.shengxiao;
        document.getElementById('bazi-personality').textContent = data.personality;
        document.getElementById('bazi-wealth').textContent = data.wealth;
        document.getElementById('bazi-love').textContent = data.love;

        document.getElementById('bazi-result').classList.remove('hidden');
    },

    loadTarotResult: function(data) {
        document.getElementById('tarot-question-display').textContent = '问题：' + data.question;
        document.getElementById('tarot-spread-info').textContent = data.spreadInfo;
        document.getElementById('tarot-interpretation').innerHTML = data.interpretation;

        const cardsContainer = document.getElementById('tarot-cards');
        cardsContainer.innerHTML = '';

        data.cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'tarot-card revealed';
            cardEl.innerHTML = `
                <div class="card-inner">
                    <div class="card-back"></div>
                    <div class="card-front">
                        <span class="card-name">${card.name}</span>
                        <span class="card-meaning">${card.reversed ? '逆位' : '正位'}</span>
                        <span style="font-size: 2rem; margin: 10px 0;">🔮</span>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(cardEl);
        });

        document.getElementById('tarot-result').classList.remove('hidden');
    },

    togglePanel: function() {
        const panel = document.getElementById('history-panel');
        panel.classList.toggle('hidden');
        document.getElementById('theme-panel')?.classList.add('hidden');
    }
};

// ==================== 选项卡切换 ====================
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// ==================== 初始化年份选择 ====================
(function initYearSelect() {
    const yearSelect = document.getElementById('birth-year');
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i + '年';
        yearSelect.appendChild(option);
    }

    const daySelect = document.getElementById('birth-day');
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i + '日';
        daySelect.appendChild(option);
    }
    
    // 初始化农历显示
    updateLunarDate();
})();

// ==================== 农历日期实时更新 ====================
function updateLunarDate() {
    const year = parseInt(document.getElementById('birth-year')?.value);
    const month = parseInt(document.getElementById('birth-month')?.value);
    const day = parseInt(document.getElementById('birth-day')?.value);
    const container = document.getElementById('lunar-display-container');
    const lunarText = document.getElementById('lunar-date-text');
    
    if (!year || !month || !day || !container || !lunarText) {
        if (container) container.style.display = 'none';
        return;
    }
    
    // 使用 LunarSimple 获取农历日期
    const lunarData = LunarSimple.getLunarDateSync(year, month, day);
    
    lunarText.textContent = lunarData.full + ' (' + lunarData.monthName + '月' + lunarData.dayName + ')';
    container.style.display = 'flex';
}

// 绑定日期选择器变化事件
document.getElementById('birth-year')?.addEventListener('change', updateLunarDate);
document.getElementById('birth-month')?.addEventListener('change', updateLunarDate);
document.getElementById('birth-day')?.addEventListener('change', updateLunarDate);

// ==================== 工具函数 ====================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==================== 星座运势 ====================
const horoscopeData = {
    aries: { name: '白羊座', element: '火', quality: '开拓' },
    taurus: { name: '金牛座', element: '土', quality: '稳定' },
    gemini: { name: '双子座', element: '风', quality: '变化' },
    cancer: { name: '巨蟹座', element: '水', quality: '感受' },
    leo: { name: '狮子座', element: '火', quality: '领导' },
    virgo: { name: '处女座', element: '土', quality: '分析' },
    libra: { name: '天秤座', element: '风', quality: '平衡' },
    scorpio: { name: '天蝎座', element: '水', quality: '深刻' },
    sagittarius: { name: '射手座', element: '火', quality: '探索' },
    capricorn: { name: '摩羯座', element: '土', quality: '坚持' },
    aquarius: { name: '水瓶座', element: '风', quality: '创新' },
    pisces: { name: '双鱼座', element: '水', quality: '直觉' }
};

const fortuneTexts = [
    "今天是一个充满机遇的日子，保持开放的心态，新的想法和人脉可能会为你带来意想不到的收获。",
    "内在的平静是你今天最大的财富。花些时间独处，倾听内心的声音，你会找到前进的方向。",
    "创造力在今天达到高峰，无论是工作还是生活，都能找到独特的解决方案。",
    "人际关系是今天的重点，真诚的沟通能够化解之前的误解，加深彼此的理解。",
    "财务方面需要谨慎，避免冲动消费。理性的规划会为你带来长期的安全感。",
    "健康状况需要关注，适当的休息和运动会让你保持最佳状态。",
    "今天适合学习新知识，你的理解力和记忆力都处于不错的状态。",
    "感情方面可能会有新的进展，单身的你有机会遇到心仪的对象。",
    "工作上的努力会被看见，这是一个展示才华的好时机。",
    "家庭和朋友会给你支持和力量，珍惜与他们相处的时光。"
];

function getHoroscope() {
    const sign = document.getElementById('zodiac-sign').value;
    const signData = horoscopeData[sign];

    const overall = Math.floor(Math.random() * 40) + 60;
    const love = Math.floor(Math.random() * 40) + 60;
    const money = Math.floor(Math.random() * 40) + 60;
    const career = Math.floor(Math.random() * 40) + 60;
    const health = Math.floor(Math.random() * 40) + 60;

    const getBarColor = (value) => {
        if (value >= 80) return '#00ffff';
        if (value >= 60) return '#ffd700';
        return '#ff6b6b';
    };

    const dateStr = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    document.getElementById('result-zodiac').textContent = signData.name;
    document.getElementById('result-date').textContent = dateStr;

    document.getElementById('overall-bar').style.width = overall + '%';
    document.getElementById('overall-bar').style.background = getBarColor(overall);
    document.getElementById('overall-value').textContent = overall + '%';

    document.getElementById('love-bar').style.width = love + '%';
    document.getElementById('love-bar').style.background = getBarColor(love);
    document.getElementById('love-value').textContent = love + '%';

    document.getElementById('money-bar').style.width = money + '%';
    document.getElementById('money-bar').style.background = getBarColor(money);
    document.getElementById('money-value').textContent = money + '%';

    document.getElementById('career-bar').style.width = career + '%';
    document.getElementById('career-bar').style.background = getBarColor(career);
    document.getElementById('career-value').textContent = career + '%';

    document.getElementById('health-bar').style.width = health + '%';
    document.getElementById('health-bar').style.background = getBarColor(health);
    document.getElementById('health-value').textContent = health + '%';

    const guidance = fortuneTexts[Math.floor(Math.random() * fortuneTexts.length)];
    document.getElementById('fortune-guidance').textContent = guidance;

    document.getElementById('horoscope-result').classList.remove('hidden');

    // 保存当前结果
    currentType = 'horoscope';
    currentResult = {
        sign: sign,
        signName: signData.name,
        date: dateStr,
        overall: overall,
        love: love,
        money: money,
        career: career,
        health: health,
        guidance: guidance
    };
}

document.getElementById('get-horoscope-btn').addEventListener('click', getHoroscope);

// ==================== 八字算命 ====================
const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const shengxiaoArr = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

const personalityTexts = [
    "你性格坚毅，有强烈的进取心和领导力。做事果断，不喜欢拖泥带水。",
    "你为人稳重踏实，注重实际。有很强的耐心，能够持之以恒地追求目标。",
    "你思维敏捷，善于沟通。适应能力强，对新事物充满好奇心。",
    "你情感丰富，有很强的同理心。重视家庭和亲情，是很好的倾听者。",
    "你自信开朗，有领导才能。喜欢成为焦点，天生具有感染力。",
    "你心思细腻，追求完美。有很强的分析能力，做事井井有条。",
    "你追求公平和谐，善于协调人际关系。有很好的审美和判断力。",
    "你洞察力强，直觉敏锐。做事专注，不达目的不罢休。",
    "你乐观开朗，热爱自由。有远大的理想，勇于探索未知。",
    "你意志坚定，有很强的责任感。做事有计划，能够承担重任。",
    "你思维独特，有创新精神。不拘泥于传统，喜欢挑战常规。",
    "你富有想象力，心地善良。有很强的艺术天赋，感性而浪漫。"
];

const wealthTexts = [
    "你的财运平稳，正财运较好。通过努力工作和专业技能可以获得稳定的收入。",
    "你对金钱有较强的管理能力，适合稳健的理财方式。偏财运一般，不宜冒险投机。",
    "你的财运多变，有机会通过人脉和合作获得财富。但要注意理财规划。",
    "你的财运与家庭密切相关，可能从家族或房产中获得收益。",
    "你有较强的赚钱能力，但开销也大。需要注意控制消费欲望。",
    "你适合通过专业技能和知识积累财富。持续学习会带来更好的财运。",
    "你的财运与合作有关，找到合适的伙伴能够带来可观的收益。",
    "你的偏财运不错，但要见好就收。投资需谨慎，避免贪心。",
    "你的财运与远方有关，可能通过外贸、旅行或海外投资获得财富。",
    "你的财运需要长期积累，大器晚成。中年后财运会明显好转。",
    "你的财运来自创新和变革。保持开放心态，抓住新兴领域的机会。",
    "你的财运与人际关系密切，贵人相助会带来意外之财。"
];

const loveTexts = [
    "你的感情热烈直接，喜欢就会主动追求。在感情中需要保持耐心，给对方足够的空间。",
    "你的感情稳定持久，一旦认定就会全心全意付出。适合找性格温和的伴侣。",
    "你的感情丰富多彩，喜欢新鲜感。需要学会在感情中保持专注和忠诚。",
    "你的感情细腻敏感，很会照顾人。但要注意不要过度依赖对方。",
    "你在感情中热情大方，喜欢浪漫和惊喜。适合找能欣赏你光芒的伴侣。",
    "你的感情需要建立在理解和信任的基础上。慢热但一旦投入就会很专一。",
    "你重视感情的平衡和和谐，是很好的沟通者。适合找有共同价值观的伴侣。",
    "你的感情深刻强烈，占有欲较强。需要学会信任和放手。",
    "你热爱自由，不喜欢被束缚。适合找能理解你、给你空间的伴侣。",
    "你的感情认真务实，以结婚为目的。适合找同样重视家庭的伴侣。",
    "你的感情特立独行，不喜欢传统模式。适合找能接受你独特性的伴侣。",
    "你的感情浪漫梦幻，期待童话般的爱情。需要区分理想和现实。"
];

async function getBazi() {
    const name = document.getElementById('name').value || '缘主';
    const gender = document.getElementById('gender').value;
    const year = parseInt(document.getElementById('birth-year').value);
    const month = parseInt(document.getElementById('birth-month').value);
    const day = parseInt(document.getElementById('birth-day').value);
    const hour = parseInt(document.getElementById('birth-hour').value);

    // 使用外部 lunar-javascript 库（如果可用）
    let yearGanZhi, monthGanZhi, dayGanZhi, hourGanZhi, lunarDate, shichen;
    
    if (window.Solar && window.Lunar) {
        // 使用外部库
        const solar = Solar.fromYmd(year, month, day);
        const lunar = solar.getLunar();
        
        yearGanZhi = {
            gan: lunar.getYearGan(),
            zhi: lunar.getYearZhi(),
            shengxiao: lunar.getYearShengXiao()
        };
        monthGanZhi = {
            gan: lunar.getMonthGan(),
            zhi: lunar.getMonthZhi()
        };
        dayGanZhi = {
            gan: lunar.getDayGan(),
            zhi: lunar.getDayZhi()
        };
        hourGanZhi = LunarSimple.getHourGanZhi(dayGanZhi.gan, hour);
        lunarDate = {
            full: lunar.getYearInGanZhi() + '年 ' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese()
        };
        shichen = LunarSimple.getShichenName(hour);
    } else {
        // 使用 LunarSimple 备用方案
        yearGanZhi = LunarSimple.getYearGanZhi(year);
        monthGanZhi = LunarSimple.getMonthGanZhi(year, month);
        dayGanZhi = LunarSimple.getDayGanZhi(year, month, day);
        hourGanZhi = LunarSimple.getHourGanZhi(dayGanZhi.gan, hour);
        lunarDate = LunarSimple.getLunarDateSync(year, month, day);
        shichen = LunarSimple.getShichenName(hour);
    }

    const info = `${year}年${month}月${day}日 ${shichen.name} ${gender === 'male' ? '男' : '女'}`;

    document.getElementById('bazi-name').textContent = name + '的命盘';
    document.getElementById('bazi-info').textContent = info;
    document.getElementById('bazi-lunar').textContent = `农历：${lunarDate.full}`;

    document.getElementById('year-gan').textContent = yearGanZhi.gan;
    document.getElementById('year-zhi').textContent = yearGanZhi.zhi;
    document.getElementById('month-gan').textContent = monthGanZhi.gan;
    document.getElementById('month-zhi').textContent = monthGanZhi.zhi;
    document.getElementById('day-gan').textContent = dayGanZhi.gan;
    document.getElementById('day-zhi').textContent = dayGanZhi.zhi;
    document.getElementById('hour-gan').textContent = hourGanZhi.gan;
    document.getElementById('hour-zhi').textContent = hourGanZhi.zhi;

    // 日元
    const riyuan = dayGanZhi.gan + ' (' + LunarSimple.getWuxing(dayGanZhi.gan) + ')';
    document.getElementById('riyuan').textContent = riyuan;

    // 五行统计
    const allGanZhi = [
        yearGanZhi.gan, yearGanZhi.zhi,
        monthGanZhi.gan, monthGanZhi.zhi,
        dayGanZhi.gan, dayGanZhi.zhi,
        hourGanZhi.gan, hourGanZhi.zhi
    ];

    const wuxingCount = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
    allGanZhi.forEach(gz => {
        if (LunarSimple.getWuxing(gz)) {
            wuxingCount[LunarSimple.getWuxing(gz)]++;
        }
    });

    const wuxingStr = Object.entries(wuxingCount)
        .map(([wx, count]) => `${wx}:${count}`)
        .join('  ');
    document.getElementById('wuxing').textContent = wuxingStr;

    // 生肖
    document.getElementById('shengxiao').textContent = yearGanZhi.shengxiao;

    // 性格、财运、感情
    const dayGanIndex = tiangan.indexOf(dayGanZhi.gan);
    document.getElementById('bazi-personality').textContent = personalityTexts[dayGanIndex];
    document.getElementById('bazi-wealth').textContent = wealthTexts[dayGanIndex];
    document.getElementById('bazi-love').textContent = loveTexts[dayGanIndex];

    document.getElementById('bazi-result').classList.remove('hidden');

    // 保存当前结果
    currentType = 'bazi';
    currentResult = {
        name: name,
        info: info,
        lunar: lunarDate.full,
        yearGan: yearGanZhi.gan,
        yearZhi: yearGanZhi.zhi,
        monthGan: monthGanZhi.gan,
        monthZhi: monthGanZhi.zhi,
        dayGan: dayGanZhi.gan,
        dayZhi: dayGanZhi.zhi,
        hourGan: hourGanZhi.gan,
        hourZhi: hourGanZhi.zhi,
        riyuan: riyuan,
        wuxing: wuxingStr,
        shengxiao: yearGanZhi.shengxiao,
        personality: personalityTexts[dayGanIndex],
        wealth: wealthTexts[dayGanIndex],
        love: loveTexts[dayGanIndex]
    };
}

document.getElementById('get-bazi-btn').addEventListener('click', getBazi);

// ==================== 塔罗牌占卜 ====================
const tarotCards = [
    { name: '愚者', meaning: '新的开始、冒险、自由', upright: '新的旅程，充满无限可能。勇敢迈出第一步，不要害怕未知。', reversed: '鲁莽、冒险、不考虑后果' },
    { name: '魔术师', meaning: '创造力、技能、自信', upright: '你拥有实现目标所需的一切资源和能力。现在是行动的好时机。', reversed: '技巧不足、计划不周' },
    { name: '女祭司', meaning: '直觉、智慧、神秘', upright: '倾听内心的声音，你的直觉会给你正确的指引。', reversed: '情绪化、直觉受阻' },
    { name: '皇后', meaning: '丰饶、美丽、母性', upright: '创造力旺盛，可能迎来新的生命或项目。享受生活的美好。', reversed: '创造力受阻、依赖他人' },
    { name: '皇帝', meaning: '权威、结构、控制', upright: '需要理性和纪律来实现目标。建立秩序和结构。', reversed: '专制、缺乏自律' },
    { name: '教皇', meaning: '传统、信仰、指导', upright: '寻求精神指导或遵循传统智慧。学习和发展信念。', reversed: '打破传统、反叛' },
    { name: '恋人', meaning: '爱、和谐、选择', upright: '面临重要选择，相信你的心。关系和谐，爱意满满。', reversed: '不和谐、错误的选择' },
    { name: '战车', meaning: '决心、胜利、控制', upright: '通过自律和决心克服障碍。朝着目标前进。', reversed: '失去控制、方向不明' },
    { name: '力量', meaning: '勇气、耐心、控制', upright: '用温和和耐心应对挑战。内在的力量比你想象的更强大。', reversed: '软弱、怀疑自己' },
    { name: '隐士', meaning: '内省、孤独、指导', upright: '需要独处思考，寻找内心的答案。智慧来自内在。', reversed: '孤立、拒绝帮助' },
    { name: '命运之轮', meaning: '变化、循环、命运', upright: '变化即将到来，顺应命运的流转。新的周期开始。', reversed: '抵抗变化、重复模式' },
    { name: '正义', meaning: '公平、真相、法律', upright: '真相会大白，做出公正的决定。为你的行为负责。', reversed: '不公平、偏见' },
    { name: '倒吊人', meaning: '牺牲、新视角、等待', upright: '换个角度看问题，愿意做出牺牲。耐心等待时机。', reversed: '无谓的牺牲、拖延' },
    { name: '死神', meaning: '结束、转变、过渡', upright: '旧的结束意味着新的开始。拥抱转变和更新。', reversed: '抗拒改变、停滞' },
    { name: '节制', meaning: '平衡、适度、耐心', upright: '找到生活的平衡点，保持耐心和毅力。', reversed: '失衡、过度' },
    { name: '恶魔', meaning: '束缚、物质、欲望', upright: '警惕被物质或欲望束缚。认识并打破限制你的模式。', reversed: '解脱、恢复力量' },
    { name: '高塔', meaning: '突变、混乱、觉醒', upright: '突如其来的变化可能颠覆你的生活，但这是必要的觉醒。', reversed: '避免灾难、渐进改变' },
    { name: '星星', meaning: '希望、灵感、宁静', upright: '保持希望，宇宙在支持你。跟随你的灵感和梦想。', reversed: '失去希望、缺乏信心' },
    { name: '月亮', meaning: '幻觉、恐惧、潜意识', upright: '事情可能不是表面看起来那样。相信直觉，穿越迷雾。', reversed: '真相浮现、恐惧消散' },
    { name: '太阳', meaning: '快乐、成功、活力', upright: '光明和快乐的时期。享受成功和认可，保持活力。', reversed: '暂时的阴霾、缺乏热情' },
    { name: '审判', meaning: '重生、召唤、宽恕', upright: '新的阶段即将开始，回应内心的召唤。原谅自己和他人。', reversed: '抗拒召唤、自我怀疑' },
    { name: '世界', meaning: '完成、成就、旅行', upright: '一个周期的圆满完成，庆祝你的成就。新的旅程在等待。', reversed: '未完成、缺乏进展' }
];

const tarotPositions = {
    single: ['指引'],
    three: ['过去', '现在', '未来'],
    celtic: ['现状', '挑战', '根源', '过去', '目标', '近期', '态度', '环境', '希望', '结果']
};

let selectedCards = [];
let isShuffling = false;

async function drawTarot() {
    if (isShuffling) return;
    isShuffling = true;

    const question = document.getElementById('tarot-question').value || '我的人生指引';
    const spread = document.getElementById('tarot-spread').value;

    document.getElementById('tarot-shuffling').classList.remove('hidden');
    document.getElementById('tarot-result').classList.add('hidden');

    await new Promise(resolve => setTimeout(resolve, 2000));

    document.getElementById('tarot-shuffling').classList.add('hidden');

    selectedCards = [];
    const indices = new Set();
    const cardCount = tarotPositions[spread].length;

    while (indices.size < cardCount) {
        indices.add(Math.floor(Math.random() * tarotCards.length));
    }

    const cardsData = Array.from(indices).map(index => ({
        ...tarotCards[index],
        reversed: Math.random() > 0.7
    }));

    document.getElementById('tarot-result').classList.remove('hidden');
    document.getElementById('tarot-question-display').textContent = `问题：${question}`;
    document.getElementById('tarot-spread-info').textContent =
        `牌阵：${spread === 'single' ? '单张牌' : spread === 'three' ? '三张牌' : '凯尔特十字'}`;

    const cardsContainer = document.getElementById('tarot-cards');
    cardsContainer.innerHTML = '';

    cardsData.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'tarot-card';
        cardEl.innerHTML = `
            <div class="card-inner">
                <div class="card-back"></div>
                <div class="card-front">
                    <span class="card-name">${card.name}</span>
                    <span class="card-meaning">${card.reversed ? '逆位' : '正位'}</span>
                    <span style="font-size: 2rem; margin: 10px 0;">🔮</span>
                </div>
            </div>
        `;

        let revealed = false;
        cardEl.addEventListener('click', () => {
            if (revealed) return;
            revealed = true;
            cardEl.classList.add('revealed');

            const allRevealed = cardsContainer.querySelectorAll('.revealed').length === cardsData.length;
            if (allRevealed) {
                showInterpretation(spread, cardsData);
            }
        });

        cardsContainer.appendChild(cardEl);
    });

    isShuffling = false;

    // 保存临时数据
    currentType = 'tarot';
    currentResult = {
        question: question,
        spread: spread,
        spreadInfo: document.getElementById('tarot-spread-info').textContent,
        cards: cardsData
    };
}

function showInterpretation(spread, cardsData) {
    const positions = tarotPositions[spread];
    const container = document.getElementById('tarot-interpretation');

    let html = '<h4>🔮 牌面解读</h4>';

    cardsData.forEach((card, index) => {
        const position = positions[index] || '指引';
        const meaning = card.reversed ? card.reversed : card.upright;
        html += `
            <div class="tarot-position">
                <strong>${position}：${card.name} ${card.reversed ? '(逆位)' : '(正位)'}</strong>
                <p>${meaning}</p>
            </div>
        `;
    });

    const uprightCount = cardsData.filter(c => !c.reversed).length;
    let summary = '';

    if (uprightCount >= cardsData.length * 0.7) {
        summary = '整体来看，牌面非常积极。宇宙在支持你，保持信心，勇敢前进。';
    } else if (uprightCount <= cardsData.length * 0.3) {
        summary = '牌面提示你需要谨慎行事。可能需要重新考虑你的计划或方法，倾听内在的声音。';
    } else {
        summary = '牌面显示机遇与挑战并存。关键在于如何平衡和应对变化。相信自己，你能找到正确的道路。';
    }

    html += `
        <div class="tarot-position" style="border: 2px solid var(--accent-purple);">
            <strong>✨ 综合指引</strong>
            <p>${summary}</p>
        </div>
    `;

    container.innerHTML = html;

    // 更新当前结果
    currentResult.interpretation = html;
}

document.getElementById('draw-tarot-btn').addEventListener('click', drawTarot);

// ==================== 保存历史记录按钮 ====================
document.querySelectorAll('.save-history-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.dataset.type;
        if (!currentResult || currentType !== type) {
            alert('请先生成占卜结果');
            return;
        }

        let title = '';
        if (type === 'horoscope') {
            title = `${currentResult.signName} - ${currentResult.date}`;
        } else if (type === 'bazi') {
            title = `${currentResult.name} - ${currentResult.info}`;
        } else if (type === 'tarot') {
            title = currentResult.question;
        }

        HistoryManager.save(type, title, currentResult);
        alert('已保存到历史记录！');
    });
});

// ==================== 事件绑定 ====================
document.getElementById('theme-toggle').addEventListener('click', () => ThemeManager.togglePanel());
document.getElementById('history-toggle').addEventListener('click', () => HistoryManager.togglePanel());
document.getElementById('close-theme').addEventListener('click', () => {
    document.getElementById('theme-panel').classList.add('hidden');
});
document.getElementById('close-history').addEventListener('click', () => {
    document.getElementById('history-panel').classList.add('hidden');
});

document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
        ThemeManager.setTheme(option.dataset.theme);
    });
});

document.getElementById('clear-history').addEventListener('click', () => {
    if (confirm('确定要清空所有历史记录吗？')) {
        HistoryManager.clear();
    }
});

// ==================== AI 解读模块 ====================
const AIInterpreter = {
    // 生成星座运势 AI 解读
    generateHoroscopeInterpretation: function(data) {
        const signInfo = horoscopeData[data.sign] || { name: data.signName, element: '未知', quality: '未知' };
        
        return `
            <h4>🌟 ${data.signName} 深度解析</h4>
            
            <div class="ai-result-section">
                <p><strong>星座特质：</strong>${signInfo.name}属于<span class="highlight">${signInfo.element}象星座</span>，具有"${signInfo.quality}"的特质。今天你的整体能量指数为<span class="highlight">${data.overall}%</span>。</p>
            </div>
            
            <h4>运势分析</h4>
            <div class="ai-result-section">
                <p><strong>整体运势：</strong>${this.getFortuneLevel(data.overall)} ${this.getHoroscopeAdvice('overall', data.overall)}</p>
                <p><strong>爱情运势：</strong>${this.getFortuneLevel(data.love)} ${this.getHoroscopeAdvice('love', data.love)}</p>
                <p><strong>财运：</strong>${this.getFortuneLevel(data.money)} ${this.getHoroscopeAdvice('money', data.money)}</p>
                <p><strong>事业：</strong>${this.getFortuneLevel(data.career)} ${this.getHoroscopeAdvice('career', data.career)}</p>
                <p><strong>健康：</strong>${this.getFortuneLevel(data.health)} ${this.getHoroscopeAdvice('health', data.health)}</p>
            </div>
            
            <h4>💡 开运建议</h4>
            <div class="ai-result-section">
                <ul>
                    <li>幸运颜色：${this.getLuckyColor(signInfo.element)}</li>
                    <li>幸运数字：${this.getLuckyNumber(data.sign)}</li>
                    <li>宜：${this.getDailyAdvice('good', signInfo.element)}</li>
                    <li>忌：${this.getDailyAdvice('bad', signInfo.element)}</li>
                </ul>
            </div>
            
            <div class="ai-result-section" style="border-left-color: var(--accent-gold);">
                <p><strong>✨ 心灵寄语：</strong>${data.guidance}</p>
                <p style="margin-top: 10px; font-style: italic;">记住，星座运势只是参考，真正的命运掌握在你自己手中。保持积极的心态，用行动创造美好的未来。</p>
            </div>
        `;
    },

    getFortuneLevel: function(value) {
        if (value >= 80) return '🌟 非常旺盛';
        if (value >= 60) return '⭐ 平稳向上';
        return '⚠️ 需要谨慎';
    },

    getHoroscopeAdvice: function(type, value) {
        const advices = {
            overall: {
                high: '能量充沛，适合开展新计划。',
                mid: '保持稳定，按部就班前进。',
                low: '宜静不宜动，积蓄能量。'
            },
            love: {
                high: '感情甜蜜，单身者有机会邂逅。',
                mid: '感情平稳，多沟通增进理解。',
                low: '注意情绪管理，避免争吵。'
            },
            money: {
                high: '财运亨通，可适当投资。',
                mid: '收支平衡，不宜大额消费。',
                low: '谨慎理财，避免冲动消费。'
            },
            career: {
                high: '事业顺利，易获认可。',
                mid: '稳扎稳打，积累实力。',
                low: '低调行事，避免冲突。'
            },
            health: {
                high: '精力充沛，适合运动。',
                mid: '状态良好，注意休息。',
                low: '关注身体信号，及时休息。'
            }
        };
        const level = value >= 80 ? 'high' : value >= 60 ? 'mid' : 'low';
        return advices[type]?.[level] || '';
    },

    getLuckyColor: function(element) {
        const colors = {
            '火': '红色、橙色',
            '土': '黄色、棕色',
            '风': '蓝色、绿色',
            '水': '黑色、深蓝色'
        };
        return colors[element] || '白色';
    },

    getLuckyNumber: function(sign) {
        const numbers = {
            'aries': '1, 9', 'taurus': '2, 6', 'gemini': '3, 5',
            'cancer': '2, 8', 'leo': '1, 4', 'virgo': '5, 6',
            'libra': '6, 9', 'scorpio': '8, 9', 'sagittarius': '3, 9',
            'capricorn': '4, 8', 'aquarius': '1, 7', 'pisces': '3, 9'
        };
        return numbers[sign] || '7';
    },

    getDailyAdvice: function(type, element) {
        const good = {
            '火': '开拓新领域、运动健身、表达自我',
            '土': '稳健投资、整理收纳、享受美食',
            '风': '社交聚会、学习新知、短途旅行',
            '水': '冥想反思、艺术创作、陪伴家人'
        };
        const bad = {
            '火': '冲动决策、与人争执、过度消费',
            '土': '固执己见、拒绝改变、暴饮暴食',
            '风': '三心二意、传播谣言、熬夜失眠',
            '水': '情绪化、过度敏感、逃避现实'
        };
        return type === 'good' ? good[element] : bad[element];
    },

    // 生成八字命理 AI 解读
    generateBaziInterpretation: function(data) {
        const wuxingAnalysis = this.analyzeWuxing(data.wuxing);
        const riyuanAnalysis = this.analyzeRiyuan(data.riyuan);
        
        return `
            <h4>📜 ${data.name} 命盘深度解析</h4>
            
            <div class="ai-result-section">
                <p><strong>出生信息：</strong>${data.info}</p>
                <p><strong>农历：</strong>${data.lunar}</p>
                <p><strong>生肖：</strong><span class="highlight">${data.shengxiao}</span></p>
            </div>
            
            <h4>八字排盘</h4>
            <div class="ai-result-section">
                <p><strong>年柱：</strong>${data.yearGan}${data.yearZhi}（祖上、父母宫）</p>
                <p><strong>月柱：</strong>${data.monthGan}${data.monthZhi}（兄弟、事业宫）</p>
                <p><strong>日柱：</strong>${data.dayGan}${data.dayZhi}（自身、配偶宫）</p>
                <p><strong>时柱：</strong>${data.hourGan}${data.hourZhi}（子女、晚年宫）</p>
            </div>
            
            <h4>五行分析</h4>
            <div class="ai-result-section">
                <p>${wuxingAnalysis}</p>
            </div>
            
            <h4>日元解析</h4>
            <div class="ai-result-section">
                <p>${riyuanAnalysis}</p>
            </div>
            
            <h4>综合运势</h4>
            <div class="ai-result-section">
                <p><strong>性格特征：</strong>${data.personality}</p>
                <p><strong>财运分析：</strong>${data.wealth}</p>
                <p><strong>感情运势：</strong>${data.love}</p>
            </div>
            
            <div class="ai-result-section" style="border-left-color: var(--accent-gold);">
                <p><strong>✨ 开运建议：</strong></p>
                <ul>
                    <li>幸运方位：${this.getLuckyDirection(data.shengxiao)}</li>
                    <li>幸运颜色：${this.getLuckyColorByWuxing(wuxingAnalysis)}</li>
                    <li>适合行业：${this.getSuitableCareer(data.riyuan)}</li>
                </ul>
                <p style="margin-top: 10px; font-style: italic;">命理分析仅供参考，人生道路需要自己去走。知命而不认命，才是改运的真谛。</p>
            </div>
        `;
    },

    analyzeWuxing: function(wuxingStr) {
        const counts = {};
        wuxingStr.split('  ').forEach(item => {
            const [wx, count] = item.split(':');
            counts[wx] = parseInt(count);
        });
        
        const max = Math.max(...Object.values(counts));
        const min = Math.min(...Object.values(counts));
        const missing = Object.entries(counts).filter(([_, c]) => c === 0).map(([w]) => w);
        
        let analysis = `五行分布：${wuxingStr}。`;
        
        if (missing.length > 0) {
            analysis += `命中缺${missing.join('、')}，建议在生活中多补充相关元素。`;
        }
        
        if (max >= 3) {
            const dominant = Object.entries(counts).find(([_, c]) => c === max)[0];
            analysis += `${dominant}较旺，性格上会表现出${this.getWuxingTrait(dominant)}的特质。`;
        }
        
        return analysis;
    },

    analyzeRiyuan: function(riyuan) {
        const gan = riyuan.split(' ')[0];
        const descriptions = {
            '甲': '甲木日元，如参天大树，正直有骨气，有领导才能。',
            '乙': '乙木日元，如花草藤蔓，柔韧适应，善于变通。',
            '丙': '丙火日元，如太阳般热情，开朗外向，乐于助人。',
            '丁': '丁火日元，如烛光灯火，温和细腻，富有同情心。',
            '戊': '戊土日元，如大地般厚重，诚实可靠，包容力强。',
            '己': '己土日元，如田园之土，温和谦逊，善于培育。',
            '庚': '庚金日元，如刀剑之金，刚毅果断，有决断力。',
            '辛': '辛金日元，如珠宝之金，精致优雅，追求完美。',
            '壬': '壬水日元，如江河湖海，聪明智慧，适应力强。',
            '癸': '癸水日元，如雨露之水，温柔内敛，富有想象力。'
        };
        return descriptions[gan] || '日元分析暂缺。';
    },

    getWuxingTrait: function(wuxing) {
        const traits = {
            '金': '刚毅、果断、重义气',
            '木': '仁慈、正直、有上进心',
            '水': '智慧、灵活、善于变通',
            '火': '热情、开朗、有领导力',
            '土': '诚信、稳重、包容力强'
        };
        return traits[wuxing] || '';
    },

    getLuckyDirection: function(shengxiao) {
        const directions = {
            '鼠': '北方', '牛': '东北方', '虎': '东方',
            '兔': '东方', '龙': '东南方', '蛇': '南方',
            '马': '南方', '羊': '西南方', '猴': '西方',
            '鸡': '西方', '狗': '西北方', '猪': '北方'
        };
        return directions[shengxiao] || '中央';
    },

    getLuckyColorByWuxing: function(analysis) {
        if (analysis.includes('缺金')) return '白色、金色';
        if (analysis.includes('缺木')) return '绿色、青色';
        if (analysis.includes('缺水')) return '黑色、蓝色';
        if (analysis.includes('缺火')) return '红色、紫色';
        if (analysis.includes('缺土')) return '黄色、棕色';
        return '根据个人喜好选择';
    },

    getSuitableCareer: function(riyuan) {
        const gan = riyuan.split(' ')[0];
        const careers = {
            '甲': '管理、军警、体育',
            '乙': '艺术、设计、教育',
            '丙': '演艺、销售、餐饮',
            '丁': '文化、咨询、服务业',
            '戊': '房地产、建筑、农业',
            '己': '教育、医疗、服务业',
            '庚': '金融、法律、机械',
            '辛': '珠宝、美容、精密行业',
            '壬': '贸易、旅游、物流',
            '癸': '研究、艺术、咨询'
        };
        return careers[gan] || '多元化发展';
    },

    // 生成塔罗牌 AI 解读
    generateTarotInterpretation: function(data) {
        const uprightCount = data.cards.filter(c => !c.reversed).length;
        const reversedCount = data.cards.length - uprightCount;
        
        return `
            <h4>🔮 ${data.question} 深度解析</h4>
            
            <div class="ai-result-section">
                <p><strong>问题：</strong>${data.question}</p>
                <p><strong>牌阵：</strong>${data.spreadInfo}</p>
                <p><strong>正位牌：${uprightCount} 张 | 逆位牌：${reversedCount} 张</strong></p>
            </div>
            
            <h4>牌面详解</h4>
            ${data.cards.map((card, index) => `
                <div class="ai-result-section">
                    <p><strong>${tarotPositions[data.spread]?.[index] || '位置'}：${card.name} ${card.reversed ? '(逆位)' : '(正位)'}</strong></p>
                    <p>${card.reversed ? card.reversed : card.upright}</p>
                    <p style="margin-top: 8px; color: var(--accent-primary);">${this.getTarotAdvice(card, card.reversed)}</p>
                </div>
            `).join('')}
            
            <h4>综合指引</h4>
            <div class="ai-result-section" style="border-left-color: var(--accent-gold);">
                <p>${this.getTarotSummary(uprightCount, data.cards.length)}</p>
                <p style="margin-top: 10px; font-style: italic;">塔罗牌是潜意识的映射，真正的力量在你内心。相信自己的直觉，做出最适合你的选择。</p>
            </div>
        `;
    },

    getTarotAdvice: function(card, isReversed) {
        const advices = {
            '愚者': isReversed ? '建议三思而后行，不要过于冲动。' : '勇敢迈出第一步，但也要做好准备工作。',
            '魔术师': isReversed ? '需要提升技能，不要急于求成。' : '善用你的才能和资源，现在是行动的好时机。',
            '女祭司': isReversed ? '不要忽视直觉，但也要理性分析。' : '倾听内心的声音，答案就在你心中。',
            '皇后': isReversed ? '避免过度依赖他人，培养独立性。' : '发挥创造力，享受生活的美好。',
            '皇帝': isReversed ? '学会灵活变通，不要过于专制。' : '建立秩序和结构，发挥领导力。',
            '教皇': isReversed ? '可以挑战传统，寻找自己的道路。' : '寻求指导，学习传统智慧。',
            '恋人': isReversed ? '慎重做出选择，避免错误决定。' : '相信你的心，做出真诚的选择。',
            '战车': isReversed ? '重新调整方向，不要强行推进。' : '保持自律，朝着目标坚定前进。',
            '力量': isReversed ? '重建信心，你比想象中更强大。' : '用耐心和温柔应对挑战。',
            '隐士': isReversed ? '不要完全孤立自己，接受他人帮助。' : '给自己独处的时间，寻找内在答案。',
            '命运之轮': isReversed ? '耐心等待时机，不要抗拒变化。' : '顺应命运的流转，把握机会。',
            '正义': isReversed ? '保持客观，避免偏见影响判断。' : '做出公正的决定，为自己的行为负责。',
            '倒吊人': isReversed ? '避免无谓的牺牲，重新评估付出。' : '换个角度看问题，等待最佳时机。',
            '死神': isReversed ? '放下过去，拥抱新的开始。' : '接受结束，迎接新的转变。',
            '节制': isReversed ? '寻找平衡，避免极端行为。' : '保持耐心和适度，找到中庸之道。',
            '恶魔': isReversed ? '认识到束缚，开始寻求解脱。' : '警惕欲望和执念的束缚。',
            '高塔': isReversed ? ' gradual 改变好过剧烈冲击。' : '接受必要的破坏，为重建做准备。',
            '星星': isReversed ? '重拾希望，相信未来会更好。' : '保持信心，跟随你的梦想。',
            '月亮': isReversed ? '真相即将浮现，不要害怕面对。' : '相信直觉，穿越迷雾找到方向。',
            '太阳': isReversed ? '暂时的阴霾会过去，保持耐心。' : '享受成功和快乐，散发正能量。',
            '审判': isReversed ? '原谅自己和他人，放下过去。' : '回应内心的召唤，迎接新阶段。',
            '世界': isReversed ? '完成未完成的事，准备新的开始。' : '庆祝成就，准备新的旅程。'
        };
        return advices[card.name] || '相信你的直觉，做出最适合的选择。';
    },

    getTarotSummary: function(upright, total) {
        const ratio = upright / total;
        if (ratio >= 0.7) {
            return '整体来看，牌面非常积极。宇宙在支持你，保持信心和开放的心态，勇敢追求你的目标。正位牌居多，表示能量流动顺畅，是采取行动的好时机。';
        } else if (ratio <= 0.3) {
            return '牌面显示目前可能面临一些挑战和阻碍。逆位牌居多，提示你需要内省和调整。不要急于行动，先理清思路，等时机成熟再前进。';
        } else {
            return '牌面显示机遇与挑战并存。正逆位牌相当，表示你需要在变化中寻找平衡。保持灵活和开放的心态，根据情况调整策略。';
        }
    },

    // 显示 AI 解读
    showInterpretation: function(type, data) {
        const panel = document.getElementById('ai-panel');
        const loading = panel.querySelector('.ai-loading');
        const result = document.getElementById('ai-result');
        
        // 显示面板和加载动画
        panel.classList.remove('hidden');
        loading.classList.remove('hidden');
        result.innerHTML = '';
        
        // 模拟 AI 思考时间
        setTimeout(() => {
            loading.classList.add('hidden');
            
            let interpretation = '';
            if (type === 'horoscope') {
                interpretation = this.generateHoroscopeInterpretation(data);
            } else if (type === 'bazi') {
                interpretation = this.generateBaziInterpretation(data);
            } else if (type === 'tarot') {
                interpretation = this.generateTarotInterpretation(data);
            }
            
            result.innerHTML = interpretation;
        }, 1500);
    }
};

// AI 解读按钮事件绑定
document.querySelectorAll('.ai-interpret-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.dataset.type;
        
        if (!currentResult || currentType !== type) {
            alert('请先生成占卜结果');
            return;
        }
        
        AIInterpreter.showInterpretation(type, currentResult);
    });
});

// 关闭 AI 面板
document.getElementById('close-ai')?.addEventListener('click', () => {
    document.getElementById('ai-panel').classList.add('hidden');
});

// ==================== 初始化 ====================
ThemeManager.init();
HistoryManager.init();

// 页面加载欢迎语
window.addEventListener('load', () => {
    console.log('✨ 命运之境已加载完毕 ✨');
    console.log('本结果仅供娱乐参考，命运掌握在自己手中');
});
