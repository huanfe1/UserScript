// ==UserScript==
// @name         套图吧跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  跳转到多图显示的页面
// @author       huanfei
// @match        www.192tp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=192tp.com
// @grant        none
// @license      WTFPL
// ==/UserScript==


var bodyElement = document.querySelector("body > div.mainer > div.picmainer > div.pictopline > p.pright");

if (bodyElement) {
    var info = bodyElement.childNodes[3].nodeValue;
    var re = '<a href="(.+?)"><i class="icon-list"></i>多图显示</a></span>-';
    var url = info.match(re)[1];
    self.location.href = url;
}