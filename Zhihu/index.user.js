// ==UserScript==
// @name         知乎宽屏
// @namespace    https://huanfei.top/
// @version      1.1.12
// @description  将网页主体部分变宽，去除杂冗部分
// @author       huanfei
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT License
// @run-at       document-start
// ==/UserScript==

(function () {
    const style = [
        // 通用
        'ul.AppHeader-Tabs li:has(a[href*="zhida"]){display:none;}',
        '.Topic-tabs{overflow:visible;}',
        'html[data-theme=dark] body{color: #cecece;}',
        'html[data-theme=dark] h2.ContentItem-title{color: #cbcbcb;}',
        '.Pc-word-new{display:none;}',
        // 首页
        '.origin_image{max-width:50%;}',
        '.Topstory-mainColumn{width:inherit;}',
        '.Topstory>div:not([class]){display:none;}',
        '.Topstory-container > div:nth-child(2){display:none;}',
        '.css-yhjwoe{justify-content:space-between;}',
        '.RichContent.is-collapsed .RichText-ADLinkCardContainer{display:none;}',
        '.Card.TopstoryItem:has(.ZVideoItem){display:none;}',
        '.Card.TopstoryItem:has(.VideoAnswerPlayer){display:none;}',
        '.Card.TopstoryItem.TopstoryItem-isRecommend:has(.ContentItem.PinItem){display:none;}', // 屏蔽Pin
        '.Card.TopstoryItem.TopstoryItem-isRecommend:has(.Pc-feedAd-container){display:none;}', // 广告
        // 搜索页面
        '#SearchMain{width:inherit;}',
        '#SearchMain ~ div{display:none;}',
        // 问题页面
        '.Question-sideColumn{display:none;}',
        '.Question-mainColumn, .ListShortcut{width:inherit;}',
        '.AuthorInfo.AnswerItem-authorInfo.AnswerItem-authorInfo--related .FollowButton{display:none;}',
        '.RichContent--unescapable.is-collapsed .RichContent-inner{min-height: 125px;}', // 回答文字较短时出现的样式错误
        //  收藏夹页面
        '.CollectionsDetailPage-mainColumn{width:inherit;}',
        '.CollectionsDetailPage > div:nth-child(2){min-width:20%;}',
        // 用户页面
        '.Profile-mainColumn{width:inherit;}',
        '.Profile-sideColumn{display:none;}',
        '.AuthorInfo-Widget{display:none;}',
        // 等你来答
        '.QuestionWaiting > div:nth-child(1){width:inherit;}',
        '.QuestionWaiting > div:nth-child(2){display:none;}',
        // 话题页面
        '.App-main div[data-za-detail-view-path-module="TopicItem"] > div:nth-child(1){width:inherit;}',
        '.App-main div[data-za-detail-view-path-module="TopicItem"] > div:nth-child(2){display:none;}',
        // 通知页面
        '.Notifications-Layout > div:nth-child(1){width:inherit;}',
        '.Notifications-Layout > div:nth-child(2){display:none;}',
        // 折叠按钮
        '.CornerAnimayedFlex{height:130px;}',
        '.CornerAnimayedFlex > button:nth-child(2){margin-top:10px;transform:rotate(90deg);}',
    ];
    GM_addStyle(style.join('').replaceAll(';', '!important;'));

    // 关闭首页广告
    document.onreadystatechange = () => {
        if (document.querySelector('.Topstory>div:not([class])')) {
            document.querySelector('.Topstory>div:not([class]) svg').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
    };

    // 点击事件监听
    document.addEventListener('click', e => {
        // 快捷关闭评论弹窗
        if (e.target == document.querySelector('span[data-focus-scope-start="true"] ~ div > div:nth-child(1)')) {
            document.querySelector('span[data-focus-scope-start="true"] ~ div > div:nth-child(2) > button').click();
        }
        // 去除外链限制
        document.querySelectorAll("a.external:not([class~='modify'])").forEach(e => {
            let trueURL = new URL(e.href).searchParams.get('target');
            e.href = trueURL;
            e.classList.add('modify');
        });
        // 清除文字超链接
        const textLinkSelector = 'a.RichContent-EntityWord:not(.clear)';
        waitForElementInFrames(() => {
            document.querySelectorAll(textLinkSelector).forEach(e => {
                e.hidden = true;
                e.parentNode.append(e.innerText);
                e.classList.add('clear');
            });
        }, textLinkSelector);
    });

    // 添加折叠按钮
    window.onload = () => {
        const button = document.querySelector('button.CornerButton').cloneNode('true');
        button.setAttribute('aria-label', '全部折叠');
        button.setAttribute('data-tooltip', '全部折叠');
        button.addEventListener('click', () => {
            const topElement = [...document.querySelectorAll('.Topstory-recommend .Card.TopstoryItem')]
                .reverse()
                .find(el => el.getBoundingClientRect().y < 0)?.nextElementSibling;
            document.querySelectorAll('span.RichContent-collapsedText').forEach(el => el.click());
            document.querySelectorAll('.Zi.Zi--Comment.Button-zi').forEach(el => {
                const button = el.parentElement.parentElement;
                if (button.textContent == '​收起评论') button.click();
            });
            requestAnimationFrame(() => topElement?.scrollIntoView());
        });
        document.querySelector('.CornerAnimayedFlex').append(button);
    };

    // 指定帧数内根据元素是否存在执行函数
    function waitForElementInFrames(fn, selectors) {
        let currentFrame = 0;
        const targetFrame = 25;
        function checkFrame() {
            if (currentFrame >= targetFrame) return;
            if (document.querySelector(selectors)) {
                fn();
                return;
            }
            currentFrame++;
            requestAnimationFrame(checkFrame);
        }
        requestAnimationFrame(checkFrame);
    }

    // 自定义菜单
    GM_registerMenuCommand('深浅主题切换', () => {
        const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        const url = new URL(location.href);
        const params = new URLSearchParams(url.search);
        params.set('theme', theme);
        url.search = params.toLocaleString();
        location.href = url.href;
    });
})();
