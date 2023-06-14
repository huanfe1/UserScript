// ==UserScript==
// @name         CSDN 简化
// @namespace    https://huanfei.top/
// @version      0.0.1
// @description  去除 CSDN 博客多余杂项，保持页面简洁
// @author       huanfei
// @match        *://blog.csdn.net/*
// @icon         https://www.csdn.net/favicon.ico
// @grant        GM_addStyle
// @license      MIT License
// @run-at       document-start
// ==/UserScript==

(function () {
    const style = [
        'aside.blog_container_aside{display:none}',
        'main{width:100%}',
        '#mainBox{width:70%}',
        '.recommend-box{display:none}',
        '#recommendNps{display:none !important}',
        '.option-box[data-type="guide"]{display:none !important}',
        '.option-box[data-type="cs"]{display:none !important}',
        '.hide-article-box.hide-article-pos{display:none !important}}'
    ];
    GM_addStyle(style.join(''));
    document.onreadystatechange = () => {
        document.querySelector('.option-box[data-type="gotop"]').remove();
        const top = document.createElement('a');
        top.addEventListener('click', () => {
            window.scrollTo({ left: 0, top: 0 });
        });
        top.className = 'option-box';
        top.innerHTML = `<img src="https://g.csdnimg.cn/side-toolbar/3.4/images/fanhuidingbucopy.png" alt="" srcset="">
            <span class="show-txt">返回<br>顶部</span>`;
        document.querySelector('.csdn-side-toolbar ').appendChild(top);
    };
})();
