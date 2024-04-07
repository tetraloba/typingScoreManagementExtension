/* グラフに 時刻:スコア に対応する点を追加する */
function add_point(graph, hours, minutes, seconds, score){
    const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttributeNS(null, 'x', ((hours * 60 + minutes) * 3 + seconds / 20) / 10);
    rect.setAttributeNS(null, 'y', 270 - score / 2);
    rect.setAttributeNS(null, 'width', '2');
    rect.setAttributeNS(null, 'height', '2');
    rect.setAttributeNS(null, 'style', "fill:#cc0000");
    graph.appendChild(rect);
    // console.log(rect); // debug
}

/* 文字列(yyyy/mm/dd HH:MM:SS)から対応するDateオブジェクトを生成する */
function str2date(date_text){
    const year = parseInt(date_text.substr(0, 4));
    const month = parseInt(date_text.substr(5, 7)) - 1;
    const day = parseInt(date_text.substr(8, 10));
    const hours = parseInt(date_text.substr(11, 13));
    const minutes = parseInt(date_text.substr(14, 16));
    const seconds = parseInt(date_text.substr(17, 19));
    return new Date(year, month, day, hours, minutes, seconds);
}


/* main */
const today = new Date(); // 現在の日時
const graph = document.getElementById('graph'); // SVGグラフの要素

/* データベースから既存の記録を取得してグラフに反映 */
chrome.storage.local.get(null, function (data) {
    const allValues = Object.values(data);
    for (const v of allValues) {
        let date_text = v.substr(0, v.indexOf(',')).replaceAll('"', ''); // 日時を表す文字列"yyyy/mm/dd HH:MM:SS"を取得
        const dd = str2date(date_text);
        if (dd.getFullYear() != today.getFullYear() || dd.getMonth() != today.getMonth() || dd.getDate() != today.getDate()) {
            continue; // 日付が異なる場合は処理しない
        }
        const score = parseInt(v.substr(23, 26));
        add_point(graph, dd.getHours(), dd.getMinutes(), dd.getSeconds(), score) // グラフを更新する処理
    }
})

/* データベースが更新された時に実行 */
chrome.storage.local.onChanged.addListener(function (changes) {
    // console.log("database update!"); // debug
    // console.log(changes); // debug
    const changedKeys = Object.keys(changes);
    for (const key of changedKeys) {
        const v = changes[key].newValue;
        let date_text = v.substr(0, v.indexOf(',')).replaceAll('"', ''); // 日時を表す文字列"yyyy/mm/dd HH:MM:SS"を取得
        const dd = str2date(date_text);
        if (dd.getFullYear() != today.getFullYear() || dd.getMonth() != today.getMonth() || dd.getDate() != today.getDate()) {
            continue; // 日付が異なる場合は処理しない
        }
        const score = parseInt(v.substr(23, 26));
        add_point(graph, dd.getHours(), dd.getMinutes(), dd.getSeconds(), score) // グラフを更新する処理
    }
})


