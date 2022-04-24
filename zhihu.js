// ==UserScript==
// @name         知乎宽屏
// @namespace    https://www.cnblogs.com/huanfeiiiii/
// @version      0.1
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
        document.querySelector("#root > div > main > div > div.Topstory-container > div.GlobalSideBar").setAttribute("style", "display:none")
    }

    function searchPage() {
        //搜索页
        document.querySelector("#SearchMain").setAttribute("style", "width:100%")
    }

    if (url == "https://www.zhihu.com/") {
        homePage();
    } else if (url.search("search") != -1) {
        searchPage()
    }

})();