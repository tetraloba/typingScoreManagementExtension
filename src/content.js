// 何かしら、実行のタイミングを制御する記述が必要？ window.onloadは非推奨。
// manifest.jsonで制御できたりするのかしら。

var current = document.getElementById("current"); // section id current
var resultData = current.getElementsByClassName("result_data")[0]; // div class resultdata
var resultList = resultData.firstElementChild; // ul

let num_childNodes = resultList.childElementCount; // resultListの子要素の数
// すべての子要素を配列形式のプロパティで参照
for (let i = 0; i < num_childNodes; i++) {
    for (let j = 0; j < 2; j++) {
        console.log(resultList.children[i].children[j].textContent);
    }
}