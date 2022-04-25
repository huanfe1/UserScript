// ==UserScript==
// @name         知乎宽屏
// @namespace    https://www.cnblogs.com/huanfeiiiii/
// @version      0.5
// @description  将网页主体部分变宽，去除杂冗部分
// @author       huanfei
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// ==/UserScript==



(function () {

    function homePage() {
        // 主页

        // 主体
        var body = document.querySelector("#root > div > main > div > div.Topstory-container > div");
        // 侧边栏
        var side = document.querySelector("#root > div > main > div > div.Topstory-container > div.GlobalSideBar");
        var height = getComputedStyle(side, null).height
        
        body.setAttribute("style", "width:100%");

        // 清除文字部分
        var footer = document.querySelector("#root > div > main > div > div.Topstory-container > div.GlobalSideBar > div > div > footer");
        footer.remove();
        

        // 创建svg
        var SVG_NS = "http://www.w3.org/2000/svg";

        var tag = document.createElementNS(SVG_NS, 'svg');
        var path = document.createElementNS(SVG_NS, "path");

        // 设置属性
        tag.setAttribute("width", "100%");
        tag.setAttribute("height", "30px");
        tag.setAttribute("viewBox", "0 0 24 24");
        tag.setAttribute("data-new-api", "GearFill24");
        tag.setAttribute("data-old-api", "Settings");
        tag.setAttribute("class", "Zi Zi--Settings");
        tag.setAttribute("fill", "currentColor");
        // 设置path属性
        path.setAttribute('d', "M10.809 2.17a2.415 2.415 0 012.382 0l6.842 3.878a2.415 2.415 0 011.224 2.1v7.703c0 .87-.468 1.672-1.224 2.101L13.19 21.83a2.415 2.415 0 01-2.381 0l-6.842-3.878a2.415 2.415 0 01-1.224-2.1V8.148c0-.87.467-1.672 1.224-2.101l6.842-3.878zm-2.633 9.82a3.858 3.858 0 117.716 0 3.858 3.858 0 01-7.716 0zm3.858-2.357a2.358 2.358 0 100 4.716 2.358 2.358 0 000-4.716z");
        path.setAttribute("fill-rule", "evenodd");
        path.setAttribute("clip-rule", "evenodd");

        // 添加到页面
        tag.appendChild(path);
        side.prepend(tag);

        // 侧边栏缩小
        
        side.style.position = "absolute";
        side.setAttribute("style", "overflow:hidden;width:30px;position:absolute;height:30px;right:-20%;transition:all 0.5s");

        // 侧栏伸缩鼠标操作
        side.onmouseover = function () {
            side.style.height = height;
            side.style.width = "300px";
        }
        side.onmouseout = function () {
            side.style.height = '30px';
            side.style.width = '30px';
        }

        // 解决页面滑动问题
        var dynamicElements = document.querySelector("#root > div > main > div > div.Topstory-container > div.GlobalSideBar > div");
        observe(dynamicElements, function dsa() {
            var sticky = document.querySelector("#root > div > main > div > div.Topstory-container > div.GlobalSideBar > div > div.Sticky.is-fixed");
            if (sticky) {
                sticky.className = "Sticky";
            }
        });
    }


    function searchPage() {
        // 搜索页
        document.querySelector("#SearchMain").setAttribute("style", "width:100%");
    }


    function questionPage() {
        // 问题页
        var side = document.querySelector("#root > div > main > div > div > div.Question-main > div.Question-sideColumn.Question-sideColumn--sticky");
        side.setAttribute("style", "display:none");

        var body = document.querySelector(".Question-mainColumn");
        body.setAttribute("style", "width:100%");

        observe(document.getElementById("AnswerFormPortalContainer"), questionPage);
    }


    function collectionPage() {
        // 收藏夹页
        var body = document.querySelector("#root > div > main > div > div.CollectionsDetailPage-mainColumn");
        body.setAttribute("style", "width: 100%");

        window.onload = function () {
            var side = document.querySelector("#root > div > main > div > div.CollectionDetailPageSideBar > div");
            side.style.position = 'fixed';
            var height = getComputedStyle(side, null).height;
            var width = getComputedStyle(side, null).width;
            side.setAttribute("style", "height:50px;width:100px;position: fixed;right:10px;top:10%;transition:all 0.5s")

            side.onmouseover = function () {
                side.style.height = height;
                side.style.width = width;
            }
            side.onmouseout = function () {
                side.style.height = '50px';
                side.style.width = '100px';
            }
        }
    }


    function peoplePage() {
        // TODO个人页面
    }


    function observe(element, func) {
        //对传入的元素进行检测，如果发生变化就执行函数

        var targetNode = element;

        // 观察者的选项(要观察哪些突变)
        var config = { attributes: true, childList: true, subtree: true };

        // 当观察到突变时执行的回调函数
        var callback = function (mutationsList) {
            mutationsList.forEach(function (item, index) {
                func();
            });
        };

        // 创建一个链接到回调函数的观察者实例
        var observer = new MutationObserver(callback);

        // 开始观察已配置突变的目标节点
        observer.observe(targetNode, config);

        // 停止观察
        // observer.disconnect();
    }

    var url = window.location.href;

    if (url.search("https://www.zhihu.com|zvideo|follow|hot|") != -1) {
        homePage();
    } else if (url.search("search") != -1) {
        searchPage();
    } else if (url.search("question") != -1) {
        questionPage();
        console.log("问题页")
    } else if (url.search("collection/[0-9]+") != -1) {
        collectionPage();
        console.log("收藏页")
    } else if (url.search("people") != -1) {
        peoplePage();
    }

})();

// 参考:
// https://meta.appinn.net/t/topic/23988
// https://www.csdn.net/tags/MtjaEgysNjQ0NTEtYmxvZwO0O0OO0O0O.html