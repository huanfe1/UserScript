// ==UserScript==
// @name         知乎宽屏
// @namespace    https://greasyfork.org/zh-CN/scripts/443919
// @version      0.7.4
// @description  将网页主体部分变宽，去除杂冗部分
// @author       huanfei
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// ==/UserScript==


(function () {
    var url = window.location.href;

    var style = '';

    var thirdLevel = url.split(".")[0].split("/")[2];

    switch (thirdLevel) {
        case "www":
            switch (url.split("/")[3].split("?")[0]) {
                case "follow":
                case "hot":
                case "zvideo":
                case "":
                    console.log("首页")
                    homePage()
                    break
                case "question":
                    console.log("问题")
                    questionPage()
                    break
                case "people":
                    console.log("个人主页")
                    peoplePage()
                    break
                case "collection":
                    console.log("收藏夹")
                    collectionPage()
                    break
                case "search":
                    console.log("搜索页")
                    searchPage()
                    break
                case "topic":
                    console.log("话题页")
                    topicPage()
                    break
            }
            break
        case "zhuanlan":
            columnPage()
    }

    console.log(style);
    GM_addStyle(style)


    function homePage() {
        style += '.Topstory-mainColumn{width:inherit}';
        style += '.Topstory-container>.GlobalSideBar{min-width:24%;}';
        style += '.Topstory-container>.GlobalSideBar>div>.Sticky>:not(:nth-child(2)):not(:nth-child(3)){display:none;}';
    }


    function searchPage() {
        style += '.SearchMain{width:inherit;}';
    }


    function questionPage() {
        style += '.Question-sideColumn{display:none;}';
        style += '.Question-mainColumn, .ListShortcut{width:inherit;}';
    }


    function collectionPage() {
        style += `.CollectionsDetailPage-mainColumn{width:inherit;}`;
        // style += '.CollectionDetailPageSideBar-cardHeaderLeftLink{display:none;}';
        style += '.CollectionDetailPageSideBar{min-width:20%}';
    }


    function peoplePage() {
        style += '.Profile-mainColumn{width:inherit;}';
        style += '.Profile-sideColumn{display:none;}';
        style += '.AuthorInfo-Widget{display:none;}'
    }


    function topicPage() {
        style += '.ContentLayout-mainColumn{width:inherit;}';
        style += '.ContentLayout-sideColumn{display:none;}';
    }


    function columnPage() {
        style += '.css-1f6hmyt{width:100%;}';
        style += '.css-1xhi2j9{width:60vw}';
    }
})();