

const checkLyrics = async () => {
    const [response1, response2] = await Promise.all([
        fetch('../lyrics/kr-words.qrc'),  // 韩文 QRC 混合文本
        fetch('../lyrics/genius.txt')   // 中文 纯文本
    ]);
    let [origin, test] = await Promise.all([
        response1.text(),
        response2.text()
    ]);
    origin = origin.replace(/[^\p{Script=Hangul}\s]/gu, '').trim().split(/\s+/)
    test = test.replace(/[^\p{Script=Hangul}\s]/gu, '').trim().split(/\s+/)
    for (let i = 0; i < origin.length; i++) {
        if (origin[i] !== test[i]) {
            console.log("FAIL============>>>>>>", i, origin[i], test[i]);
            break
        } else {
            console.log(i, origin[i], test[i]);
        }
    }
}
checkLyrics()
