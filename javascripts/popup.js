/**
 * 弹窗
 * Created by ls on 2016/2/25.
 * {
 *  container:'弹窗的父级选择器（即将放置的地方）',
 *  ancestor:'弹窗的最外层标签选择器（即背景为半透明层）',
 *  main:'弹窗的窗体标签选择器',
 *  txt:'弹窗内容文本',
 *  txtWrap:'内容选择器',
 *  exit:'弹窗关闭按钮选择器（一个字符串||一个选择器字符串数组）',
 *  initCallback:'初始化好后传入回调函数，可实现一些自定功能'
 * }
 *
 * html:
 *  <div id="rulePop" class="pop">
        <div class="main">
            <i class="exit">×</i>
        </div>
    </div>
 */
function Popup(obj){
    this.default = {
        ancestor:'',
        main:'',
        txt:'',
        txtWrap:'',
        exit:false,
        container:'body',
        top:0.8,
        tapBorderHide:true
    };


    this.init(obj);


}
Popup.prototype = {
    constructor: Popup,
    init:function(obj){
        var the = this;
        var addCallback = function(methods){
            for(var i=0; i<methods.length; i++){
                if(obj[methods[i]] && $.isFunction(obj[methods[i]])){
                    the[methods[i]] = obj[methods[i]];
                    obj[methods[i]] = undefined;
                }
            }
        };
        addCallback(['initCallback','showCallback','closeCallback']);

        var opts = the.default = $.extend(the.default, obj);
        the.err(opts);

        opts.ancestorEle = $(opts.ancestor);

        //计算弹窗父级的高度
        window.onload=function(){
            if($(opts.container).height() < $(window).height()){
                $(opts.container).height($(window).height());
            }
        };
        opts.ancestorEle.css({
            'position':'absolute',
            'top':0,
            'width':'100%',
            'bottom':0,
            'opacity':0,
            'transition': 'opacity 0.2s',
            '-webkit-transition': 'opacity 0.2s'
        });

        //绑定点击旁边隐藏弹框
        if(opts.tapBorderHide){
            opts.ancestorEle.on('tap',function(e){
                var reg     = /^[.#]/g,
                    target  = $(e.target),
                    selector= reg.test(opts.ancestor) ? opts.ancestor.substring(1,opts.ancestor.length) : opts.ancestor;

                if(target.hasClass(selector) || target.attr('id')==selector){
                    the.close();
                }
            });
        }

        //弹框出现时，禁用滚动
        opts.ancestorEle.on('touchmove',function(e){
            e.preventDefault();
        });

        //弹框中的关闭按钮隐藏弹框
        if( opts.exit.constructor == Array ){
            for(var i=0;i<opts.exit.length;i++){
                $(opts.ancestor +' '+ opts.exit[i]).on('tap',function(){
                    the.close();
                });
            }
        }else if( opts.exit.constructor == String){
            $(opts.ancestor +' '+ opts.exit).on('tap',function(){
                the.close();
            });
        }

        //插入弹框内容
        if( opts.txtWrap){
            if(opts.txt){
                //$(opts.txt).appendTo(opts.ancestor + ' ' + opts.txtWrap);
                $(opts.ancestor + ' ' + opts.txtWrap).html(opts.txt);
            }
        }

        the.initCallback && $.isFunction(the.initCallback) && the.initCallback();
    },
    show:function(txt){
        var opts = this.default;
        this.err(opts);
        opts.ancestorEle.show();
        if(txt){
            $(opts.ancestor + ' ' + opts.txtWrap).html(txt);
        }

        var main      = $(opts.ancestor + ' ' + opts.main),
            container = $(opts.container),
            windowH   = $(window).height(),
            mainHeight= main.height(),
            halfWin   = (windowH - mainHeight)/2;

        main.css({
            overflow:'hidden',
            margin:'0 auto',
            marginTop: (halfWin * opts.top) + container.scrollTop() +'px'
        });console.log(halfWin* opts.top);

        opts.ancestorEle.css({
            'opacity':1
        });

        this.showCallback && $.isFunction(this.showCallback) && this.showCallback();
    },
    close:function(){
        var opts = this.default;
        this.err(opts);
        opts.ancestorEle.css({
            'opacity':0
        });
        opts.ancestorEle.hide();
        this.closeCallback && $.isFunction(this.closeCallback) && this.closeCallback();
    },
    err:function(opts){
        if(!opts.ancestor || !opts.main){
            console.log('参数ancestor、main必须有值');
            return false;
        }
    }
};