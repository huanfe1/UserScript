// ==UserScript==
// @name         知乎宽屏
// @namespace    https://ixory.com
// @version      1.0.1
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

    switch (url.split(".")[0].split("/")[2]) {
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
        style += '.Topstory-container > div:nth-child(2){display:none}';
    }


    function searchPage() {
        style += '.SearchMain{width:inherit;}';
        style += '.css-knqde{display:none}'
    }


    function questionPage() {
        style += '.Question-sideColumn{display:none;}';
        style += '.Question-mainColumn, .ListShortcut{width:inherit;}';
        style += '.AuthorInfo.AnswerItem-authorInfo.AnswerItem-authorInfo--related{max-width: inherit;}'
    }


    function collectionPage() {
        style += `.CollectionsDetailPage-mainColumn{width:inherit;}`;
        style += '.CollectionsDetailPage > div:nth-child(2){min-width:20%}';
    }


    function peoplePage() {
        style += '.Profile-mainColumn{width:inherit;}';
        style += '.Profile-sideColumn{display:none;}';
        style += '.AuthorInfo-Widget{display:none;}'
    }


    function topicPage() {
        style += '.App-main > div > div:nth-child(1){width:inherit;}';
        style += '.App-main > div > div:nth-child(2){display:none;}';
    }


    function columnPage() {
        style += '.css-1f6hmyt{width:100%;}';
    }
})();