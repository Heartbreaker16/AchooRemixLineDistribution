const { convertTime } = require("./timeUtils");

const shiftQrcTime = (text, n) => {
    // 1. 核心：高精度时间格式化工具（将毫秒数还原为 mm:ss.ms 格式并精准补零）
    const formatTime = (totalMs) => {
        if (totalMs < 0) totalMs = 0; // 容错：时间不能小于 0
        const m = Math.floor(totalMs / 60000);
        const s = Math.floor((totalMs % 60000) / 1000);
        const ms = totalMs % 1000;

        const mStr = String(m).padStart(2, '0');
        const sStr = String(s).padStart(2, '0');
        const msStr = String(ms).padStart(3, '0');

        return `${mStr}:${sStr}.${msStr}`;
    };

    // 3. 正则表达式：同时匹配 [00:38.016] 和 <00:38.016> 内部的时间
    // ([\[<]) 捕获左边界符号，(\d+:\d+\.\d+) 捕获时间轴，([\]>]) 捕获右边界符号
    const timeRegex = /([\[<])(\d+:\d+\.\d+)([\]>])/g;

    // 4. 执行替换并返回结果
    text = text.replace(timeRegex, (match, leftBracket, timeStr, rightBracket) => {
        const originalMs = convertTime(timeStr);
        const newMs = originalMs + n; // 调整 n 毫秒
        return `${leftBracket}${formatTime(newMs)}${rightBracket}`;
    });
    console.log(text);
}

// shiftQrcTime(` 319 [10:57.757]<10:57.757>바뀔 <10:58.141>시간이 <10:58.917>됐어 <10:59.349>we <10:59.525>go <10:59.813>up <11:00.237>with <11:00.741>party<11:01.149>
// 327 [11:16.846]<11:16.846>부셔 <11:17.174>백미러 <11:17.588>Imma <11:17.748>hop <11:17.932>out <11:18.100>the <11:18.253>beamer<11:18.517>
// `, 100)

const s = convertTime('11:25.932')  - convertTime('11:11.704'); //13736 14228
console.log(s);
