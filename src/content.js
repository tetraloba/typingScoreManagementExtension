/**
 * The program content.js is released under the MIT license.
 * See https://opensource.org/licenses/MIT
 *
 * @author tetraloba
 */

const options = {
    childList: true,
    attributes: true,
    subtree: true,
}
/* chrome.storage.localのデータをCSVでDLするリンクを生成する */
function generateCSV() {
    /* chrome.storage.localの内容を表示 */
    chrome.storage.local.get(null, function (data) {
        let str_blob = '';
        const allValues = Object.values(data);
        for (const v of allValues) {
            str_blob += v + "\n";
        }
        /* BlobとそのURLを作成して表示 */
        const bom  = new Uint8Array([0xEF, 0xBB, 0xBF]); // utf-8 BOM
        const str_url = URL.createObjectURL(new Blob([bom, str_blob], {type: "text/csv"})); // URLの生成
        const comment = app.children[0].children[0].children[2];
        const new_element = document.createElement("a");
        new_element.download = 'result.csv';
        new_element.href = str_url;
        new_element.textContent = 'Download result.csv here!';
        comment.appendChild(new_element); // コメント部分にURLを追加
    });
}
function callback_game(mutationsList, observer) {
    const result_data = app.getElementsByClassName('result_data')[0];
    if (flag_retry && result_data) {
        const result_list = result_data.children[0];
        const dd = new Date();
        let str = dd.getFullYear().toString() + '/'
                + ('0'+(dd.getMonth() + 1)).slice(-2) + '/'
                + ('0'+dd.getDate()).slice(-2) + ' '
                + ('0'+dd.getHours()).slice(-2) + ':'
                + ('0'+dd.getMinutes()).slice(-2) + ':'
                + ('0'+dd.getSeconds()).slice(-2) + ',';
        if (result_list.children[0].children[1].textContent != '-') { // 正常終了した(中断していない)場合
            /* ゲームの結果を読み取る */
            for (const result of result_list.children) {
                str += result.children[1].textContent + ',';
            }
            str += document.getElementsByClassName('pp_description')[0].textContent; // 種類 (腕試しレベルチェックなど)
            str = str.replace('%', '').replace('秒', '.').replace('分', ':'); // フォーマットを調整する
            /* chrome.storage.localに記録する */
            chrome.storage.local.set({[dd.getTime()] : str}).then(() => {
                console.log("Value is set to " + str);
            });
        }
        /* chrome.storage.localのデータをCSVでDLするリンクを生成する */
        generateCSV();
        /* 終了処理 (同じ結果を重複記録しないための処理) */
        flag_retry = 0;
    } else if (typing_content.contentWindow.document.getElementById('example_container')) {
        flag_retry = 1;
    }
}
function callback_body(mutationsList, observer) {
    console.log('callback_body(): 関数が実行されました');
    typing_content = document.getElementById('typing_content'); // ゲームのウィンドウ(iframe)
    if (typing_content) {
        app = typing_content.contentWindow.document.getElementById('app');
        if (app) {
            console.log('callback_body(): ゲーム画面の監視を開始します');
            flag_retry = 1;
            obs_game.observe(app, options);
        }
    }
}

/* main */
let app; // ゲーム
let typing_content;
let flag_retry; // ゲーム開始(及びリトライ)時に1, 終了時に0
const obs_body = new MutationObserver(callback_body);
const obs_game = new MutationObserver(callback_game);
const target = document.body;
if (!target) {
    console.error('bodyの取得に失敗しました');
}
console.log('test: bodyの監視を開始します');
obs_body.observe(target, options);
console.log('test: scriptの最終行です');