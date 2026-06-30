/**
 * 比对两段 QRC 歌词所有对应时间点的差值是否完全一致
 * @param {string} text1 - 歌词文本1
 * @param {string} text2 - 歌词文本2
 * @returns {boolean} - 差值完全一致返回 true，否则返回 false
 */
const verifyLyricOffsets = (text1, text2) => {
    // 将文本按行切分，并过滤掉空行
    const lines1 = text1.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const lines2 = text2.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    if (lines1.length !== lines2.length) {
        console.error(`❌ 校验失败：总行数不一致！文本1有 ${lines1.length} 行，文本2有 ${lines2.length} 行。`);
        return false;
    }

    // 匹配 00:13.364 这种标准时间戳的正则表达式
    const timeRegex = /\d{2}:\d{2}\.\d{3}/g;
    let baseOffset = null; // 全局基准差值

    // 2. 逐行比对
    for (let i = 0; i < lines1.length; i++) {
        // 提取当前行所有的绝对时间和单字时间
        const t1Matches = lines1[i].match(timeRegex) || [];
        const t2Matches = lines2[i].match(timeRegex) || [];

        if (t1Matches.length !== t2Matches.length) {
            console.error(`❌ 校验失败：第 ${i + 1} 行的时间轴数量不匹配！`);
            console.error(`文本1该行: ${lines1[i]}`);
            console.error(`文本2该行: ${lines2[i]}`);
            return false;
        }

        // 3. 逐个时间轴计算差品
        for (let j = 0; j < t1Matches.length; j++) {
            const ms1 = convertTime(t1Matches[j]);
            const ms2 = convertTime(t2Matches[j]);
            const currentOffset = ms2 - ms1; // 当前时间点的差值

            // 以全文接触到的第一个时间轴差值作为【全局硬标准】
            if (baseOffset === null) {
                baseOffset = currentOffset;
                console.log(`💡 已确立全局基准时间差值 (文本2 - 文本1) 为: ${baseOffset} 毫秒`);
            }
            // 如果后续任何一个字的差值和基准不相等，说明相对时间/持续时间发生了变动
            else if (currentOffset !== baseOffset) {
                console.error(`\n❌ 发现时间轴相对位置或持续时间差异！`);
                console.error(`📍 出错位置: 第 ${i + 1} 行，第 ${j + 1} 个时间戳`);
                console.error(`──────────────────────────────────────────────────`);
                console.error(`文本1该行: ${lines1[i]}`);
                console.error(`文本2该行: ${lines2[i]}`);
                console.error(`──────────────────────────────────────────────────`);
                console.error(`文本1时间点: ${t1Matches[j]} (${ms1} ms)`);
                console.error(`文本2时间点: ${t2Matches[j]} (${ms2} ms)`);
                console.error(`期望差值: ${baseOffset} ms`);
                console.error(`实际差值: ${currentOffset} ms (产生了 ${currentOffset - baseOffset} ms 的时间错位!)`);
                return false;
            }
        }
    }
    console.log(`\n✅ 校验通过！两段歌词所有对应字、行的时间差值严格一致（均为 ${baseOffset} 毫秒），没有任何字发生提前、延后或时长缩水。`);
    return true;
}
// verifyLyricOffsets(
//     `  6 [00:26.972]<00:26.972>I <00:27.124>got <00:27.310>the <00:27.468>win<00:27.876>`,
//     `  324 [11:11.604]<11:11.604>I <11:11.756>got <11:11.942>the <11:12.100>win<11:12.508>`
// )
