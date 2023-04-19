/**
 * The program content.js is released under the MIT license.
 * See https://opensource.org/licenses/MIT
 *
 * @author tetraloba
 */

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
        var str = dd.getFullYear().toString() + '/' + ('0'+(dd.getMonth() + 1)).slice(-2) + '/' + ('0'+dd.getDate()).slice(-2) + ' ' + ('0'+dd.getHours()).slice(-2) + ':' + ('0'+dd.getMinutes()).slice(-2) + ':' + ('0'+dd.getSeconds()).slice(-2) + ',';
        var flag_end = 1; // ゲームが正常に終了したならば1, 中断された場合は0
        for (const result of result_list.children) {
            // console.log(result.children[0].textContent + ': ' + result.children[1].textContent); // 属性: 値
            str += result.children[1].textContent + ',';
            if (result.children[1].textContent == '-') { // 中断した場合
                flag_end = 0;
            }
        }
        str += document.getElementsByClassName('pp_description')[0].textContent; // 種類 (腕試しレベルチェックなど)
        if (flag_end) { // 中断していない場合は記録する
            str = str.replace('%', '').replace('秒', '.').replace('分', ':'); // %を削除, 秒を小数点に置き換え 分をコロンに置き換え
            chrome.storage.local.set({[dd.getTime()] : str}).then(() => {
                console.log("Value is set to " + str);
            });
        }
        /* chrome.storage.localの内容を表示 */
        chrome.storage.local.get(null, function (data) {
            var str_blob = '';
            var allValues = Object.values(data);
            for (const v of allValues) {
                str_blob += v + "\n";
                // console.log(str_blob);
            }
            // console.log(data);
            /* BlobとそのURLを作成して表示 */
            let bom  = new Uint8Array([0xEF, 0xBB, 0xBF]); // utf-8 BOM
            var str_url = URL.createObjectURL(new Blob([bom, str_blob], {type: "text/csv"}));
            const comment = app.children[0].children[0].children[2];
            var new_element = document.createElement("a");
            new_element.download = 'result.csv';
            new_element.href = str_url;
            new_element.textContent = 'Download result.csv here!';
            comment.appendChild(new_element);
        });
        /* 終了処理 (再び起動する方法を考える必要がある) */
        flag_retry = 0;
        // obs_game.disconnect();
        // console.log('callback_game(): obs_gameの監視が終了しました');
    } else if (typing_content.contentWindow.document.getElementById('example_container')) {
        flag_retry = 1;
    }
}
function callback_body(mutationsList, observer) {
    console.log('callback_body(): 関数が実行されました');
    typing_content = document.getElementById('typing_content'); // ゲームのウィンドウ(iframe)
    if (typing_content) {
        // console.log('callback_body(): ゲームが開かれました');
        app = typing_content.contentWindow.document.getElementById('app');
        if (app) {
            // console.log('callback_body(): ゲームが読み込まれました');
            console.log('callback_body(): ゲーム画面の監視を開始します');
            obs_game.observe(app, options);
            // obs.disconnect();
            // console.log('callback_body(): bodyの監視が終了しました');
        }
    }
}
var app; // ゲーム
var typing_content;
var flag_retry = 1;
const obs_body = new MutationObserver(callback_body);
const obs_game = new MutationObserver(callback_game);
const target = document.body;
if (!target) {
    console.error('bodyの取得に失敗しました');
}
console.log('test: bodyの監視を開始します');
obs_body.observe(target, options);
console.log('test: scriptの最終行です');