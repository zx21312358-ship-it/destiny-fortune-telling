/**
 * 农历转换 - 使用外部 lunar-lib 库
 * 这个库提供准确的农历转换功能
 */

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 月份名称
const MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
// 日期名称
const DAY_NAMES = [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 获取年干支
function getYearGanZhi(year) {
    const ganIndex = (year - 4) % 10;
    const zhiIndex = (year - 4) % 12;
    return {
        gan: TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex],
        zhi: DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex],
        shengxiao: SHENG_XIAO[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex]
    };
}

// 获取月干支
function getMonthGanZhi(year, month) {
    const yearGanZhi = getYearGanZhi(year);
    const yearGanIndex = TIAN_GAN.indexOf(yearGanZhi.gan);
    const monthZhiIndex = (month - 1 + 2) % 12;
    const monthGanIndex = ((yearGanIndex % 5) * 2 + month - 1) % 10;
    return {
        gan: TIAN_GAN[monthGanIndex < 0 ? monthGanIndex + 10 : monthGanIndex],
        zhi: DI_ZHI[monthZhiIndex]
    };
}

// 获取日干支
function getDayGanZhi(year, month, day) {
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - baseDate) / 86400000);
    return {
        gan: TIAN_GAN[(0 + diffDays) % 10],
        zhi: DI_ZHI[(10 + diffDays) % 12]
    };
}

// 获取时干支
function getHourGanZhi(dayGan, hour) {
    const dayGanIndex = TIAN_GAN.indexOf(dayGan);
    const hourZhiIndex = Math.floor(((hour % 24) + 1) / 2) % 12;
    const hourGanIndex = ((dayGanIndex % 5) * 2 + hourZhiIndex) % 10;
    return {
        gan: TIAN_GAN[hourGanIndex < 0 ? hourGanIndex + 10 : hourGanIndex],
        zhi: DI_ZHI[hourZhiIndex]
    };
}

// 获取时辰名称
function getShichenName(hour) {
    const names = [
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
    const index = Math.floor(((hour % 24) + 1) / 2) % 12;
    return names[index] || names[0];
}

// 获取五行
function getWuxing(ganzhi) {
    const map = {
        '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
        '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
        '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
        '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
        '戌': '土', '亥': '水'
    };
    return map[ganzhi] || '土';
}

// 统一导出接口 - 使用外部 lunar-javascript 库
const LunarSimple = {
    getLunarDate: async function(year, month, day) {
        return this.getLunarDateSync(year, month, day);
    },

    getLunarDateSync: function(year, month, day) {
        // 优先使用外部 lunar-javascript 库 (全局 Solar/Lunar)
        if (typeof Solar !== 'undefined' && typeof Lunar !== 'undefined') {
            try {
                const solar = Solar.fromYmd(year, month, day);
                const lunar = solar.getLunar();
                return {
                    year: lunar.getYear(),
                    yearGanZhi: lunar.getYearInGanZhi(),
                    month: Math.abs(lunar.getMonth()),
                    day: lunar.getDay(),
                    monthName: lunar.getMonthInChinese(),
                    dayName: lunar.getDayInChinese(),
                    full: lunar.getYearInGanZhi() + '年 ' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese(),
                    isLeapMonth: lunar.getMonth() < 0
                };
            } catch (e) {
                console.warn('Lunar library error, using fallback:', e);
            }
        }
        return solarToLunarSimple(year, month, day);
    },

    getYearGanZhi: getYearGanZhi,
    getMonthGanZhi: getMonthGanZhi,
    getDayGanZhi: getDayGanZhi,
    getHourGanZhi: getHourGanZhi,
    getShichenName: getShichenName,
    getWuxing: getWuxing,
    
    tiangan: TIAN_GAN,
    dizhi: DI_ZHI,
    shengxiao: SHENG_XIAO
};

// 简化的农历转换（备用）
function solarToLunarSimple(year, month, day) {
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    // 使用外部库如果可用
    const lib = window.LunarLib;
    if (lib && lib.Solar) {
        try {
            const solar = lib.Solar.fromYmd(year, month, day);
            const lunar = solar.getLunar();
            return {
                year: lunar.getYear(),
                yearGanZhi: lunar.getYearInGanZhi(),
                month: Math.abs(lunar.getMonth()),
                day: lunar.getDay(),
                monthName: lunar.getMonthInChinese(),
                dayName: lunar.getDayInChinese(),
                full: lunar.getYearInGanZhi() + '年 ' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese(),
                isLeapMonth: lunar.getMonth() < 0
            };
        } catch (e) {
            console.warn('Lunar library error:', e);
        }
    }
    
    // 简单估算（不准确，仅用于备用）
    const ganZhi = getYearGanZhi(year);
    return {
        year: year,
        month: month,
        day: day,
        monthName: MONTH_NAMES[month - 1] || '正',
        dayName: DAY_NAMES[(day - 1) % 30] || '初一',
        full: ganZhi.gan + ganZhi.zhi + '年 ' + month + '月' + day + '日',
        isLeapMonth: false,
        isToday: isToday
    };
}

function waitForLunarLibrary(timeout = 3000) {
    return new Promise((resolve) => {
        if (window.LunarLibLoaded && window.LunarLib) {
            resolve(window.LunarLib);
            return;
        }
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (window.LunarLibLoaded && window.LunarLib) {
                clearInterval(checkInterval);
                resolve(window.LunarLib);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                resolve(null);
            }
        }, 100);
    });
}