/**
 * 简化的农历转换库
 * 基于公历计算农历日期和天干地支
 */

const Lunar = {
    // 天干
    tiangan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    // 地支
    dizhi: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    // 生肖
    shengxiao: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    // 农历月份
    lunarMonths: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    // 农历日期
    lunarDays: [
        '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
    ],

    // 计算年柱
    getYearGanZhi: function(year) {
        const ganIndex = (year - 4) % 10;
        const zhiIndex = (year - 4) % 12;
        return {
            gan: this.tiangan[ganIndex < 0 ? ganIndex + 10 : ganIndex],
            zhi: this.dizhi[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex],
            shengxiao: this.shengxiao[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex]
        };
    },

    // 计算月柱
    getMonthGanZhi: function(year, month) {
        const yearGanZhi = this.getYearGanZhi(year);
        const yearGanIndex = this.tiangan.indexOf(yearGanZhi.gan);

        // 农历月份转换（简化版，按节气）
        const lunarMonth = ((month - 1) % 12 + 12) % 12;
        const monthZhi = this.dizhi[lunarMonth];

        // 月干计算
        const monthGanIndex = ((yearGanIndex % 5) * 2 + lunarMonth) % 10;
        const monthGan = this.tiangan[monthGanIndex];

        return {
            gan: monthGan,
            zhi: monthZhi
        };
    },

    // 计算日柱（简化版）
    getDayGanZhi: function(year, month, day) {
        const baseDate = new Date(1900, 0, 31); // 1900 年 1 月 31 日是甲子日
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

        return {
            gan: this.tiangan[diffDays % 10 < 0 ? diffDays % 10 + 10 : diffDays % 10],
            zhi: this.dizhi[diffDays % 12 < 0 ? diffDays % 12 + 12 : diffDays % 12]
        };
    },

    // 计算时柱
    getHourGanZhi: function(dayGan, hour) {
        const dayGanIndex = this.tiangan.indexOf(dayGan);
        const hourZhiIndex = Math.floor((hour + 1) / 2) % 12;
        const hourGanIndex = ((dayGanIndex % 5) * 2 + hourZhiIndex) % 10;

        return {
            gan: this.tiangan[hourGanIndex < 0 ? hourGanIndex + 10 : hourGanIndex],
            zhi: this.dizhi[hourZhiIndex]
        };
    },

    // 计算农历日期（简化版）
    getLunarDate: function(year, month, day) {
        // 计算农历年份
        const yearGanZhi = this.getYearGanZhi(year);

        // 估算农历月份（简化算法）
        const baseDate = new Date(1900, 0, 31);
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

        // 农历月周期约 29.53 天
        const lunarCycle = 29.53;
        const lunarMonthsPassed = Math.floor(diffDays / lunarCycle);
        const lunarMonth = (lunarMonthsPassed % 12 + 12) % 12;
        const lunarDay = Math.floor(diffDays % lunarCycle);

        return {
            yearGanZhi: yearGanZhi.gan + yearGanZhi.zhi + '年',
            month: this.lunarMonths[lunarMonth] + '月',
            day: this.lunarDays[Math.min(lunarDay, 29)] || '初一',
            full: yearGanZhi.gan + yearGanZhi.zhi + '年 ' + this.lunarMonths[lunarMonth] + '月' + (this.lunarDays[Math.min(lunarDay, 29)] || '初一')
        };
    },

    // 获取时辰名称
    getShichenName: function(hour) {
        const shichenNames = [
            { name: '子时', time: '23:00-01:00' },
            { name: '丑时', time: '01:00-03:00' },
            { name: '寅时', time: '03:00-05:00' },
            { name: '卯时', time: '05:00-07:00' },
            { name: '辰时', time: '07:00-09:00' },
            { name: '巳时', time: '09:00-11:00' },
            { name: '午时', time: '11:00-13:00' },
            { name: '未时', time: '13:00-15:00' },
            { name: '申时', time: '15:00-17:00' },
            { name: '酉时', time: '17:00-19:00' },
            { name: '戌时', time: '19:00-21:00' },
            { name: '亥时', time: '21:00-23:00' }
        ];
        return shichenNames[hour] || shichenNames[0];
    },

    // 五行对应
    wuxingMap: {
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
    },

    // 获取五行
    getWuxing: function(ganzhi) {
        return this.wuxingMap[ganzhi] || '未知';
    }
};
