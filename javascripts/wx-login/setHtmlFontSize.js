/**
 * Created by ls on 2016/4/28.
 */

define(function (){
    //设置 html 标签font-size，以便使用rem单位
    var html = document.querySelector('html'), screenWidth;
    setHtmlFontSize();
    window.addEventListener('resize',setHtmlFontSize, false);
    function setHtmlFontSize(){
        screenWidth = document.body.clientWidth;
        html.style.fontSize = screenWidth/10 + 'px';
    }
});