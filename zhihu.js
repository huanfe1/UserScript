// ==UserScript==
// @name         知乎宽屏
// @namespace    https://www.cnblogs.com/huanfeiiiii/
// @version      0.6
// @description  将网页主体部分变宽，去除杂冗部分
// @author       huanfei
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// ==/UserScript==


var url = window.location.href;
var style_Add = document.createElement('style');

var style = '';
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
}

document.lastChild.appendChild(style_Add).textContent = style;


function homePage() {
    style += '.Topstory-mainColumn{width:inherit}.Topstory-container>.GlobalSideBar{min-width:24%;}.Topstory-container>.GlobalSideBar>div>.Sticky>:not(:nth-child(2)):not(:nth-child(3)){display:none;}'
}


function searchPage() {
    style += '.SearchMain{width:inherit;}'
}


function questionPage() {
    style += '.Question-sideColumn{display:none;}.Question-mainColumn{width:inherit;}'
}


function collectionPage() {
    style += `.CollectionsDetailPage-mainColumn{width:inherit;}.SideBarCollectionItem-description{display:none;}.CollectionDetailPageSideBar-cardHeaderLeftLink{display:none;}`
}


function peoplePage() {
    style += '.Profile-mainColumn{width:inherit;}.Profile-sideColumn{display:none;}'
}


// 参考:
// https://meta.appinn.net/t/topic/23988
// https://www.csdn.net/tags/MtjaEgysNjQ0NTEtYmxvZwO0O0OO0O0O.html