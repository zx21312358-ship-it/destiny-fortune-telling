// 命运之境 - 算命网页核心功能

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
})();

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

    // 生成随机运势值
    const overall = Math.floor(Math.random() * 40) + 60;
    const love = Math.floor(Math.random() * 40) + 60;
    const money = Math.floor(Math.random() * 40) + 60;
    const career = Math.floor(Math.random() * 40) + 60;
    const health = Math.floor(Math.random() * 40) + 60;

    // 设置颜色
    const getBarColor = (value) => {
        if (value >= 80) return 'linear-gradient(90deg, #00ffff, #00ff88)';
        if (value >= 60) return 'linear-gradient(90deg, #ffd700, #ffaa00)';
        return 'linear-gradient(90deg, #ff6b6b, #ff4757)';
    };

    // 更新 UI
    document.getElementById('result-zodiac').textContent = signData.name;
    document.getElementById('result-date').textContent = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

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

    // 随机选择指引
    const guidance = fortuneTexts[Math.floor(Math.random() * fortuneTexts.length)];
    document.getElementById('fortune-guidance').textContent = guidance;

    // 显示结果
    document.getElementById('horoscope-result').classList.remove('hidden');
}

document.getElementById('get-horoscope-btn').addEventListener('click', getHoroscope);

// ==================== 八字算命 ====================
const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const wuxing = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
    '子': '水', '丑': '土',
    '寅': '木', '卯': '木',
    '辰': '土', '巳': '火',
    '午': '火', '未': '土',
    '申': '金', '酉': '金',
    '戌': '土', '亥': '水'
};
const shengxiaoArr = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 年柱计算
function getYearGanZhi(year) {
    const ganIndex = (year - 4) % 10;
    const zhiIndex = (year - 4) % 12;
    return {
        gan: tiangan[ganIndex < 0 ? ganIndex + 10 : ganIndex],
        zhi: dizhi[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex]
    };
}

// 月柱计算（简化版）
function getMonthGanZhi(year, month) {
    const yearGanZhi = getYearGanZhi(year);
    const yearGanIndex = tiangan.indexOf(yearGanZhi.gan);

    // 月支固定
    const monthZhiIndex = (month + 2) % 12;
    const monthZhi = dizhi[monthZhiIndex];

    // 月干根据年干推算
    const monthGanIndex = ((yearGanIndex % 5) * 2 + month - 1) % 10;
    const monthGan = tiangan[monthGanIndex < 0 ? monthGanIndex + 10 : monthGanIndex];

    return { gan: monthGan, zhi: monthZhi };
}

// 日柱计算（简化版，实际应查万年历）
function getDayGanZhi(year, month, day) {
    const baseDate = new Date(1900, 0, 31); // 1900 年 1 月 31 日是甲子日
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

    const ganIndex = diffDays % 10;
    const zhiIndex = diffDays % 12;

    return {
        gan: tiangan[ganIndex < 0 ? ganIndex + 10 : ganIndex],
        zhi: dizhi[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex]
    };
}

// 时柱计算
function getHourGanZhi(dayGan, hour) {
    const dayGanIndex = tiangan.indexOf(dayGan);

    // 时支
    const hourZhiIndex = Math.floor((hour + 1) / 2) % 12;
    const hourZhi = dizhi[hourZhiIndex];

    // 时干根据日干推算
    const hourGanIndex = ((dayGanIndex % 5) * 2 + hourZhiIndex) % 10;
    const hourGan = tiangan[hourGanIndex < 0 ? hourGanIndex + 10 : hourGanIndex];

    return { gan: hourGan, zhi: hourZhi };
}

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

function getBazi() {
    const name = document.getElementById('name').value || '缘主';
    const gender = document.getElementById('gender').value;
    const year = parseInt(document.getElementById('birth-year').value);
    const month = parseInt(document.getElementById('birth-month').value);
    const day = parseInt(document.getElementById('birth-day').value);
    const hour = parseInt(document.getElementById('birth-hour').value);

    // 计算四柱
    const yearGanZhi = getYearGanZhi(year);
    const monthGanZhi = getMonthGanZhi(year, month);
    const dayGanZhi = getDayGanZhi(year, month, day);
    const hourGanZhi = getHourGanZhi(dayGanZhi.gan, hour);

    // 更新 UI
    document.getElementById('bazi-name').textContent = name + '的命盘';
    document.getElementById('bazi-info').textContent =
        `${year}年${month}月${day}日 ${dizhi[hour]}时 ${gender === 'male' ? '男' : '女'}`;

    document.getElementById('year-gan').textContent = yearGanZhi.gan;
    document.getElementById('year-zhi').textContent = yearGanZhi.zhi;
    document.getElementById('month-gan').textContent = monthGanZhi.gan;
    document.getElementById('month-zhi').textContent = monthGanZhi.zhi;
    document.getElementById('day-gan').textContent = dayGanZhi.gan;
    document.getElementById('day-zhi').textContent = dayGanZhi.zhi;
    document.getElementById('hour-gan').textContent = hourGanZhi.gan;
    document.getElementById('hour-zhi').textContent = hourGanZhi.zhi;

    // 日元
    document.getElementById('riyuan').textContent = dayGanZhi.gan + ' (' + wuxing[dayGanZhi.gan] + ')';

    // 五行统计
    const allGanZhi = [
        yearGanZhi.gan, yearGanZhi.zhi,
        monthGanZhi.gan, monthGanZhi.zhi,
        dayGanZhi.gan, dayGanZhi.zhi,
        hourGanZhi.gan, hourGanZhi.zhi
    ];

    const wuxingCount = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
    allGanZhi.forEach(gz => {
        if (wuxing[gz]) {
            wuxingCount[wuxing[gz]]++;
        }
    });

    const wuxingStr = Object.entries(wuxingCount)
        .map(([wx, count]) => `${wx}:${count}`)
        .join('  ');
    document.getElementById('wuxing').textContent = wuxingStr;

    // 生肖
    const yearZhiIndex = (year - 4) % 12;
    const shengxiao = shengxiaoArr[yearZhiIndex < 0 ? yearZhiIndex + 12 : yearZhiIndex];
    document.getElementById('shengxiao').textContent = shengxiao;

    // 性格、财运、感情
    const dayGanIndex = tiangan.indexOf(dayGanZhi.gan);
    document.getElementById('bazi-personality').textContent = personalityTexts[dayGanIndex];
    document.getElementById('bazi-wealth').textContent = wealthTexts[dayGanIndex];
    document.getElementById('bazi-love').textContent = loveTexts[dayGanIndex];

    // 显示结果
    document.getElementById('bazi-result').classList.remove('hidden');
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

    // 显示洗牌动画
    document.getElementById('tarot-shuffling').classList.remove('hidden');
    document.getElementById('tarot-result').classList.add('hidden');

    // 洗牌延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    document.getElementById('tarot-shuffling').classList.add('hidden');

    // 随机选择牌
    selectedCards = [];
    const indices = new Set();
    const cardCount = tarotPositions[spread].length;

    while (indices.size < cardCount) {
        indices.add(Math.floor(Math.random() * tarotCards.length));
    }

    const cardsData = Array.from(indices).map(index => ({
        ...tarotCards[index],
        reversed: Math.random() > 0.7 // 30% 概率逆位
    }));

    // 显示结果
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

        // 点击翻牌
        let revealed = false;
        cardEl.addEventListener('click', () => {
            if (revealed) return;
            revealed = true;
            cardEl.classList.add('revealed');

            // 检查是否全部翻开
            const allRevealed = cardsContainer.querySelectorAll('.revealed').length === cardsData.length;
            if (allRevealed) {
                showInterpretation(spread, cardsData);
            }
        });

        cardsContainer.appendChild(cardEl);
    });

    isShuffling = false;
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

    // 综合解读
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
}

document.getElementById('draw-tarot-btn').addEventListener('click', drawTarot);

// ==================== 页面加载欢迎语 ====================
window.addEventListener('load', () => {
    console.log('✨ 命运之境已加载完毕 ✨');
    console.log('本结果仅供娱乐参考，命运掌握在自己手中');
});
