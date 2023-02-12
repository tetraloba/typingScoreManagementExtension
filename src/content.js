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
    // charcterData: false,
    // characterDataOldValue: false,
    attributes: true,
    subtree: true,
}
function callback_game(mutationsList, observer) {
    console.log('callback_game(): 関数が実行されました');
    // for (const mutation of mutationsList) {
    //     mutation.target;
    //     mutation.addedNodes;
    //     mutation.removedNodes;
    // }
    // const result_data = app.getElementsByClassName('result_data')[0];
    // const result_list = result_data.children[0];
    // console.log('test result_list 1');
    // for (const result of result_list.children) {
    //     console.log(result.children[0].textContent); // 属性
    //     console.log(result.children[1].textContent); // 値
    // }
}
function callback(mutationsList, observer) {
    console.log('callback(): 関数が実行されました');
    // const app = document.getElementById('app');
    // if (app) {
    //     console.log('callback(): ゲームが開かれました');
    //     const obs_game = new MutationObserver(callback_game);
    //     obs_game.observe(app, options);
    //     obs.disconnect();
    // }
    const app = document.getElementById('typing_content');
    if (app) {
        console.log('callback(): ゲームが開かれました');
        const obs_game = new MutationObserver(callback_game);
        obs_game.observe(app, options);
        obs.disconnect();
        console.log('callback(): bodyの監視が終了しました');
    }
}
const obs = new MutationObserver(callback);
const target = document.body;
// console.log(target.children[1].children[0].children[1].textContent); // bodyが正しく取得できていることの確認
console.log('test: bodyの監視を開始します');
obs.observe(target, options);
console.log('test: scriptの最終行です');