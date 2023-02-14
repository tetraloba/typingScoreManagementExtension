// 何かしら、実行のタイミングを制御する記述が必要？ window.onloadは非推奨。
// manifest.jsonで制御できたりするのかしら。

// var current = document.getElementById("current"); // section id current
// var resultData = current.getElementsByClassName("result_data")[0]; // div class resultdata
// var resultList = resultData.firstElementChild; // ul

// let num_childNodes = resultList.childElementCount; // resultListの子要素の数
// // すべての子要素を配列形式のプロパティで参照
// for (let i = 0; i < num_childNodes; i++) {
//     for (let j = 0; j < 2; j++) {
//         console.log(resultList.children[i].children[j].textContent);
//     }
// }

console.log('test: scriptが実行されました');
const options = {
    childList: true,
    attributes: true,
    subtree: true,
}
function callback_game(mutationsList, observer) {
    // console.log('callback_game(): 関数が実行されました');
    // for (const mutation of mutationsList) {
    //     mutation.target;
    //     mutation.addedNodes;
    //     mutation.removedNodes;
    // }
    const result_data = app.getElementsByClassName('result_data')[0];
    if (flag_retry && result_data) {
        // console.log('callback_game(): ゲームが終了しました');
        const result_list = result_data.children[0];
        var dd = new Date();
        var str = dd.getFullYear().toString() + ('0'+(dd.getMonth() + 1)).slice(-2) + ('0'+dd.getDate()).slice(-2) + ('0'+dd.getHours()).slice(-2) + ('0'+dd.getMinutes()).slice(-2) + ('0'+dd.getSeconds()).slice(-2) + ',';
        var flag_end = 1;
        for (const result of result_list.children) {
            console.log(result.children[0].textContent + ': ' + result.children[1].textContent); // 属性: 値
            str += result.children[1].textContent + ',';
            if (result.children[1].textContent == '-') { // 中断した場合
                flag_end = 0;
            }
        }
        str += document.getElementsByClassName('pp_description')[0].textContent; // 種類 (腕試しレベルチェックなど)
        if (flag_end) { // 中断していない場合は記録する
            str = str.replace('%', '').replace('秒', '.'); // %を削除, 秒を小数点に置き換え
            chrome.storage.local.set({[dd.getTime()] : str}).then(() => {
                console.log("Value is set to " + str);
            });
        }
        chrome.storage.local.get(null, function (data) {
            console.info(data);
        });
        /* 終了処理 (再び起動する方法を考える必要がある) */
        flag_retry = 0;
        // obs_game.disconnect();
        // console.log('callback_game(): obs_gameの監視が終了しました');
    } else if (typing_content.contentWindow.document.getElementById('example_container')) {
        flag_retry = 1;
    }
}
function callback(mutationsList, observer) {
    console.log('callback(): 関数が実行されました');
    typing_content = document.getElementById('typing_content'); // ゲームのウィンドウ(iframe)
    if (typing_content) {
        // console.log('callback(): ゲームが開かれました');
        app = typing_content.contentWindow.document.getElementById('app');
        if (app) {
            // console.log('callback(): ゲームが読み込まれました');
            console.log('callback(): ゲーム画面の監視を開始します');
            obs_game.observe(app, options);
            // obs.disconnect();
            // console.log('callback(): bodyの監視が終了しました');
        }
    }
}
var app; // ゲーム
var typing_content;
var flag_retry = 1;
const obs = new MutationObserver(callback);
const obs_game = new MutationObserver(callback_game);
const target = document.body;
if (!target) {
    console.error('bodyの取得に失敗しました');
}
console.log('test: bodyの監視を開始します');
obs.observe(target, options);
console.log('test: scriptの最終行です');