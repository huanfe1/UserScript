// ==UserScript==
// @name         知乎宽屏
// @namespace    https://www.cnblogs.com/huanfeiiiii/
// @version      0.4
// @description  将网页主体部分变宽，去除杂冗部分
// @author       huanfei
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    var url = window.location.href;

    function homePage() {
        // 主页
        var body = document.querySelector("#root > div > main > div > div.Topstory-container > div");
        body.setAttribute("style", "width:100%");

        var side = document.querySelector("#root > div > main > div > div.Topstory-container > div.GlobalSideBar");
        side.setAttribute("style", "display:none");
    }

    function searchPage() {
        // 搜索页
        document.querySelector("#SearchMain").setAttribute("style", "width:100%");
    }

    function question() {
        // 问题页
        var side = document.querySelector("#root > div > main > div > div > div.Question-main > div.Question-sideColumn.Question-sideColumn--sticky");
        side.setAttribute("style", "display:none");

        var body = document.querySelector(".Question-mainColumn");
        body.setAttribute("style", "width:100%");

        observe("AnswerFormPortalContainer", question);
    }

    function collection() {
        // 收藏夹页
        var body = document.querySelector("#root > div > main > div > div.CollectionsDetailPage-mainColumn");
        body.setAttribute("style", "width: 100%");

        window.onload = function () {
            var side = document.querySelector("#root > div > main > div > div.CollectionDetailPageSideBar > div");
            side.style.position = 'absolute';
            var height = getComputedStyle(side, null).height;
            var width = getComputedStyle(side, null).width;
            side.setAttribute("style", "height:50px;width:100px;position: absolute;right:0;transition:all 0.5s")

            side.onmouseover = function () {
                side.style.height = height
                side.style.width = width
            }
            side.onmouseout = function () {
                side.style.height = '50px'
                side.style.width = '100px'
            }
        }
    }

    function observe(id, fun) {
        //对传入ID的元素进行检测，如果发生变化就执行函数

        var targetNode = document.getElementById('AnswerFormPortalContainer');

        // 观察者的选项(要观察哪些突变)
        var config = { attributes: true, childList: true, subtree: true };

        // 当观察到突变时执行的回调函数
        var callback = function (mutationsList) {
            mutationsList.forEach(function (item, index) {
                fun();
            });
        };

        // 创建一个链接到回调函数的观察者实例
        var observer = new MutationObserver(callback);

        // 开始观察已配置突变的目标节点
        observer.observe(targetNode, config);

        // 停止观察
        // observer.disconnect();
    }

    if (url == "https://www.zhihu.com/") {
        homePage();
    } else if (url.search("search") != -1) {
        searchPage();
    } else if (url.search("question") != -1) {
        question();
    } else if (url.search("collection") != -1) {
        collection();
    }

})();

// 参考:
// https://meta.appinn.net/t/topic/23988
// https://www.csdn.net/tags/MtjaEgysNjQ0NTEtYmxvZwO0O0OO0O0O.html