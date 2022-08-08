export function voicePlay(word) {
    let url = "https://tts.baidu.com/text2audio?cuid=baike&spd=5&lan=ZH&ctp=1&pdt=301&vol=4&rate=32&per=0&tex=' "+ encodeURI(word);
    let n = new Audio(url);
    n.src = url;
    n.play();//播放阅读
    return n
}