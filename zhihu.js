// ==UserScript==
// @name         知乎宽屏
// @namespace    https://www.cnblogs.com/huanfeiiiii/
// @version      0.2
// @description  将网页主体部分变宽，去除杂冗部分
// @author       huanfei
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// ==/UserScript==

(function () {
    var url = window.location.href;

    function homePage() {   
        // 主页
        var body = document.querySelector("#root > div > main > div > div.Topstory-container > div")
        body.setAttribute("style", "width:100%")

        var side = document.querySelector("#root > div > main > div > div.Topstory-container > div.GlobalSideBar")
        side.setAttribute("style", "display:none")
    }

    function searchPage() {
        //搜索页
        document.querySelector("#SearchMain").setAttribute("style", "width:100%")
    }

    function question() {
        // 问题页

        var side = document.querySelector("#root > div > main > div > div > div.Question-main > div.Question-sideColumn.Question-sideColumn--sticky")
        side.setAttribute("style", "display:none")

        var body = document.querySelector("#root > div > main > div > div > div.Question-main > div.ListShortcut > div")
        body.setAttribute("style", "width:100%")
    }

    if (url == "https://www.zhihu.com/") {
        homePage();
    } else if (url.search("search") != -1) {
        searchPage()
    } else if (url.search("question") != -1) {
        question()
    }

})();