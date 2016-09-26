/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-09-09 15:03:19
 * @version $Id$
 */

//顶部幻灯片
$(document).ready(function() {	
	var sideBar = $('#sideBar');

	//详情页，顶部轮播图片
	instanceCarousel();

    //顶部标题栏的回退按钮
    $('#topBar i.back').on('tap', function(e){
        jsCallAppCloseThisPage();
    });

    //分享按钮
    $('#topBar i.share').on('tap', function(e){
        jsCallApp2Share();
    });

    //顶部轮播图片绑定的click事件
    $(document).on("click","#carousel .swiper-container img",function(e){
        var obj  = {},
            list = [],
            index = $(this).parent().index();

        $(this).closest('.swiper-wrapper').find('.swiper-slide').each(function(){
            list.push( {"imgUrl": $(this).find('img').attr('src') || $(this).find('img').data("src")} );
        });

        obj.list = list;
        obj.index = index;
        console.log(JSON.stringify(obj));
        jsCallAppIsTapImgAndIndex(JSON.stringify(obj));
    });

	/*滑动侧边栏*/
	//弹出侧边栏
	$(document).on('tap','#choosed',function(){
        if( smtType == 5) return;
		jsCallAppSideBarIsShow(1);

		sideBar.show();
		setTimeout(function(){
			$('#sideBar').addClass('show');
		},50);
	});
    //防止 iphone5s 等以下设备点不到箭头
    $(document).on('tap','#choosed .arrowMore', function(e){
        e.stopPropagation();
        jsCallAppSideBarIsShow(1);

        sideBar.show();
        //myScroll.refreshIscrollIns();
        setTimeout(function(){
            $('#sideBar').addClass('show');

        },50);        
    });

	//收起侧边栏函数
	var hideSideBar = function(){
		jsCallAppSideBarIsShow(0);

		sideBar.removeClass('show');
        //myScroll.refreshIscrollIns();
		setTimeout(function(){
			sideBar.hide();
		},650);
	};

	//滑动收起侧边栏
	$(document).on('swipeRight','#sideBar',function(e){
		hideSideBar();		
	});

	//单击收起侧边栏
	$(document).on('tap','#sideBar',function(e){

		if(e.target === $(this)[0]){
			hideSideBar();
		}
	});
	

	//侧边栏点击选项，切换active选中样式
	$(document).on('tap','.options span', function(e){
		e.stopPropagation();
		
		$(this).addClass('active');
		$(this).siblings('span').removeClass('active');

		
		jsCallAppModifyOptions();
		
	});

	//减少购物数量
	$(document).on('tap','.amount .reduce', function(e){
		e.stopPropagation();

        //如果无库存，退出
        if(parseFloat(globalStocks)<1){
            return;
        }

        //可购买数量
		var canBuyNums = (limitUp && limitUp>0 && limitUp<globalStocks) ? limitUp : globalStocks;
        canBuyNums = parseInt(canBuyNums);

		var count 	   = $(this).siblings('.count'),
			currentVal = parseInt(count.val()),
			newVal     = currentVal - 1;


		if( newVal >= canBuyNums ){
			count[0].value = canBuyNums;
		}else if(newVal < 1 ){
			count[0].value = 1;
		}else{
			count[0].value = newVal;
		}


        //数量改变，发送给app当前购买数量;
        jsCallAppModifyCount( newVal );

        //updateChoosedCount();	
		
	});

	//增加购物数量
	$(document).on('tap','.amount .add', function(e){
		e.stopPropagation();

        //如果无库存，退出条件判断
        if(parseFloat(globalStocks)<1){
            return;
        }

        //可购买数量
		var canBuyNums = (limitUp && limitUp>0 && limitUp<globalStocks) ? limitUp : globalStocks;
        canBuyNums = parseInt(canBuyNums);

		var count      = $(this).siblings('.count'),
			currentVal = parseInt(count.val()), //当前值
			newVal     = currentVal+1;			 //+1 后的值

        if( newVal >= canBuyNums ){
            count[0].value = canBuyNums;
            //库存、限购提示语
            if(canBuyNums == limitUp && limitUp <= globalStocks){
                $('.noteThat').html('*该商品每个用户限购'+canBuyNums+'件');
            }else if(canBuyNums == globalStocks && limitUp != globalStocks){
                $('.noteThat').html('*当前库存仅剩'+canBuyNums+'件');
            }
        }else{
            count[0].value= newVal;
        }

		//数量改变，发送给app当前购买数量;
		jsCallAppModifyCount( newVal );

        //updateChoosedCount();
	});

    //自定义输入
    $(document).on('input propertychange','.amount .count', function(){
        if(globalStocks<1){
            $(this)[0].value = 0;
            return;
        }

        var re       = /^([1-9]\d+)$/,
            inputVal =  $(this).val() ,
            canBuyNums= (limitUp && limitUp>0 && limitUp<globalStocks) ? limitUp : globalStocks; //限购存在且限购为正且限购小于库存，取限购。
        canBuyNums = parseInt(canBuyNums);

        //防止输入非数字
        if( re.test(inputVal) ){
            //console.log('对了');
        }else{
            //先把非数字的都替换掉;把开头为0的替换掉
            $(this)[0].value = $(this)[0].value.replace(/[^\d]/g, "");
            $(this)[0].value = $(this)[0].value.replace(/^0*/g, "");
        }

        //实际购买数量
        var purchaseNums = parseInt($(this).val());
        
        if(purchaseNums>canBuyNums){
            $(this)[0].value = canBuyNums;
        }

        if(purchaseNums<1){
            $(this)[0].value = 1;
        }

        //库存、限购提示语
        if(purchaseNums >= limitUp && limitUp <= globalStocks){
            $('.noteThat').html('*该商品每个用户限购'+canBuyNums+'件');
        }else if(purchaseNums == globalStocks && limitUp != globalStocks){
            $('.noteThat').html('*当前库存仅剩'+canBuyNums+'件');
        }

        //数量改变，发送给app当前购买数量;
        // jsCallAppModifyCount( $(this).val() );
    });

    $(document).on('blur','.amount .count',function(){
        console.log('blur');
        var purchaseNums = parseInt( $(this).val() );
        var canBuyNums   = (limitUp && limitUp>0 && limitUp<globalStocks) ? limitUp : globalStocks; //可以购买的实际数量

        //当输入数字小于0.1，则等于0.1
        if( purchaseNums < 1 ){
            $(this)[0].value = 1;
        }


        //实际购买数量
        var purchaseNums = $(this).val();

        if(purchaseNums>canBuyNums){
            $(this)[0].value = parseInt(canBuyNums);
        }

        if(purchaseNums<1){
            $(this)[0].value = 1;
        }

        jsCallAppModifyCount( $(this).val() );
        // updateChoosedCount();
    });


	//点击加入购物车
	$(document).on('tap','.addCart', function(){
		if($(this).hasClass('disabled')){
			console.log('无库存');
			return;
		}else{
			var nums = $('.amount .count').val();
			//console.log(JSON.stringify({"goodsId":goodsId,"nums":nums}) );
			jsCallAppAddToCart( JSON.stringify({"goodsId":goodsId,"nums":nums}) );

			hideSideBar();
		}		
	});


	//点击立即购买
	$(document).on('tap','.buyNow', function(){		
		if($(this).hasClass('disabled')){
			console.log('无库存');
			return;
		}else{
			var nums = $('.amount .count').val();
			jsCallAppBuyNow( JSON.stringify({"goodsId":goodsId,"nums":nums}) );
		}
	});


	//点击评价晒单，进入评论列表页面
	$(document).on('tap','.enterComment',function(){
		if( $(this).find('span.noComment').length>0 ) return;
		jsCallApp2AppraiseListPage();
	});

	//点击联系客服
	$(document).on('tap','.contact', function(){
		jsCallAppTell2Phone();
	});

	//展开评论
	$(document).on('tap','.unfold', function(){
		$(this).closest('.user_reply').toggleClass('unfold');
        myScroll.refreshIscrollIns();
	});

    //点击猜你喜欢中的商品传递商品id 调用
    $(document).on('click', '#guess-list .swiper-slide', function(){
        console.log('data-id:'+$(this).data('id'));
        jsCallAppTellGo2GoodsDetail($(this).data('id'));
    });

    //实例化滚动-停顿-图文详情实例
    myScroll = new MyScroll( '.mainContainer', '#wrap', '#up', '.mainContent', '#down', '#detail','#topBar', 0.4, function(){
        if(!$('#detail').html()){
            jsCallAppSlideUp( JSON.stringify({"goodsId":goodsId}) );
        }
    },function(){

    });

});



//public functions
/**
 * 实例化轮播图片
 */
function instanceCarousel(){
	//详情页，顶部轮播图片
	var carousel = new Swiper('#carousel .swiper-container',{
        autoplayDisableOnInteraction:false,
		lazyLoading : true,
		lazyLoadingInPrevNext : true,
		pagination : '.swiper-pagination',
		preventLinksPropagation : true
    });
}


/**
 * [ScrollView 仿京东、淘宝详情页]
 * @param {[String]} container [selector最外围的包裹层，1屏高度]
 * @param {[String]} wrap      [selector需要滚动的次外围，2屏高]
 * @param {[String]} up        [selector上半部分包裹，1屏高]
 * @param {[String]} upInner   [selector上半部分内容，高度根据内容，基本上是超过1屏]
 * @param {[String]} down      [selector下半部分包裹，1屏高]
 * @param {[String]} donwInner [selector下半部分内容，高度根据内容，基本上是超过1屏]
 * @param {[String]} topBar    [selector作为标题的顶部栏，] 
 *
 * 注意：所有的参数必填，前6个(包含6)的参数不能为空；从第7个参数开始，若实际情况没有值,则传对应的空值
 * 
 */
function MyScroll( container, wrap, up, upInner, down, downInner, topBar, duration, afterUpCb, afterDownCb, critical ){
    var the = this;
    the.slt = {
        container:container,
        wrap     : wrap,
        up       : up,
        upInner  : upInner,
        down     : down,
        downInner:downInner
    };
    //----------------------selector 字符串--------------------------------
    the.container = $(container);                   //最外围的包裹层
    the.wrap      = $(wrap);                        //次外围的包裹层，需要transilate3d滚动
    the.up        = $(up);                          //上半部分包裹层
    the.upInner   = $(upInner);                     //上半部分的内容
    the.down      = $(down);                        //下半部分的包裹
    the.downInner = $(downInner);                   //下半部分的内容
    the.topBar    = topBar ? $(topBar) : null;      //置顶的标题
    //----------------------以上为 DOM 对象---------------------------------
    the.upIscroll;                                  //up的iScroll实例
    the.downIscroll;                                //down的iScroll实例
    //--------------------以上为 iScroll 实例-------------------------------
    the.HtopBar    = the.topBar ? the.topBar.height() : 0;
    the.Hwebview   = the.container.height();        //webview,在屏幕中真实的高度
    the.Hdevice    = the.Hwebview - the.HtopBar;   //1屏的高度=设备高度;如果有顶部栏，一屏高需减去顶部高
    the.Hup = the.Hdown = the.Hdevice;              //上半部分的包裹=下半部分的包裹=最外围包裹=1屏
    the.HupInner   = the.upInner.height();          //上半部分的内容
    the.HdownInner = the.downInner.height();        //下半部分的内容
    the.duration   = duration ? duration : 0.3;
    the.critical   = critical!=undefined && parseFloat(critical>0) ? critical : the.Hdevice/10;  //临界值，超过这个值就滑动页面
    the.afterUpCb  = afterUpCb && $.isFunction(afterUpCb) ? afterUpCb : function(){};
    the.afterDownCb=afterDownCb && $.isFunction(afterDownCb) ? afterDownCb: function(){};

    the.upStartY;
    the.upDisY;
    the.downStartY;
    the.downDisY;

    the.init();  
}

MyScroll.prototype = {
    constructor: MyScroll,
    init: function(){
        var the = this;

        // the.wrap.height(2*the.Hdevice); //考虑到有顶部栏，css height:200%无效;强制设为 2 屏高度
        // the.up.height(the.Hdevice);     //考虑到有顶部栏，css height:100%无效;强制设为 1 屏高度
        // the.down.height(the.Hdevice);   //同上

        the.setUpIscroll();
        the.setDownIscroll();

        the.up.on('touchstart',function(e){
            var isBottom   = the.HupInner - the.Hup,
                translateY = the.getTranslateY( the.upInner );

            //console.log(translateY);
            //start 事件中判断是否到底；到底记录当前触摸的位置
            if( Math.abs(translateY) == isBottom || Math.abs(Math.abs(translateY) - isBottom)<=2 ){
                console.log('到底了');
                the.upStartY = e.touches[0].pageY;
            }
        });


        the.up.on('touchmove',function(e){
            var isBottom   = the.HupInner - the.Hup,
                translateY = the.getTranslateY( the.upInner ),
                currentY   = e.touches[0].pageY;

            //document.title=(translateY + ' || ' + the.HupInner + ' - ' + the.Hdevice + '=' + isBottom);
            //console.log( the.upInner.css('-webkit-transform') );

            //到底了运行----------start
            if( Math.abs(translateY) == isBottom || Math.abs(Math.abs(translateY) - isBottom)<=2 ){
                //e.preventDefault();
                console.log('到底了');

                if(!the.upStartY){
                    the.upStartY = currentY;
                }else{
                    the.upDisY = currentY - the.upStartY;

                    if(the.upDisY < 0){
                        e.preventDefault();
                        //console.log(the.upDisY);

                        the.destroy(the.upIscroll);

                        the.wrap.css({
                            'transition':        'transform 0s',
                            '-webkit-transition':'-webkit-transform 0s',
                            'transform':         'translate3d(0,'+(the.upDisY)+'px'+',0)',
                            '-webkit-transform': 'translate3d(0,'+(the.upDisY)+'px'+',0)'
                        });
                    }else{
                        the.upDisY = 0;
                        the.wrap.css({
                            'transition':        'transform 0s',
                            '-webkit-transition':'-webkit-transform 0s',
                            'transform':         'translate3d(0,'+(the.upDisY)+'px'+',0)',
                            '-webkit-transform': 'translate3d(0,'+(the.upDisY)+'px'+',0)'
                        });
                    }

                }            
            }
            //到底了运行----------over
        });


        the.up.on('touchend',function(e){

            if( the.upIscroll.isDestroy /*&& the.upStartY && the.upDisY*/ ){
                console.log('触发了 touchend......................');
                console.log(the.upStartY +' || '+ the.upDisY)

                if( Math.abs(the.upDisY) > the.critical ){
                    the.wrap.css({
                        'transform':         'translate3d(0,'+(-the.Hdevice)+'px'+',0)',
                        '-webkit-transform': 'translate3d(0,'+(-the.Hdevice)+'px'+',0)',
                        'transition':        'transform ' + the.duration + 's',
                        '-webkit-transition':'-webkit-transform ' + the.duration + 's'
                    });

                    the.afterUpCb && the.afterUpCb();
                }else{
                    the.wrap.css({
                        'transform':         'translate3d(0,'+(0)+'px'+',0)',
                        '-webkit-transform': 'translate3d(0,'+(0)+'px'+',0)',
                        'transition':        'transform ' + the.duration + 's',
                        '-webkit-transition':'-webkit-transform ' + the.duration + 's'
                    });
                }

                the.setUpIscroll( the.Hdevice-the.HupInner );
            }

            the.upStartY = false;
            the.upDisY   = false;
        });

        //------------------------------------------------------
        
        the.down.on('touchstart',function(e){
            var translateY = the.getTranslateY( the.downInner );

            if( translateY == 0 ){
                console.log('到顶了');
                the.downStartY = e.touches[0].pageY;
            }
        });

        the.down.on('touchmove',function(e){
            var translateY = the.getTranslateY( the.downInner ),
                currentY   = e.touches[0].pageY;

            //到顶了运行----------start
            if( translateY == 0 ){
                console.log('到顶了');

                if( !the.downStartY ){
                    the.downStartY = currentY;
                }else{
                    the.downDisY = currentY - the.downStartY;

                    if(the.downDisY > 0){
                        e.preventDefault();
                        //console.log(the.downDisY);

                        the.destroy( the.downIscroll );

                        the.wrap.css({
                            'transition':        'transform 0s',
                            '-webkit-transition':'-webkit-transform 0s',
                            'transform':         'translate3d(0,'+(the.downDisY-the.Hdevice)+'px'+',0)',
                            '-webkit-transform': 'translate3d(0,'+(the.downDisY-the.Hdevice)+'px'+',0)'
                        });
                    }else{
                        the.wrap.css({
                            'transition':        'transform 0s',
                            '-webkit-transition':'-webkit-transform 0s',
                            'transform':         'translate3d(0,'+(-1*the.Hdevice)+'px'+',0)',
                            '-webkit-transform': 'translate3d(0,'+(-1*the.Hdevice)+'px'+',0)'
                        });
                    }
                }
            }
            //到顶了运行----------over
        });

        the.down.on('touchend',function(e){
            if( the.downIscroll.isDestroy && the.downStartY && the.downDisY ){
                console.log('触发了 touchend......................');

                //大于临界值
                if( Math.abs(the.downDisY) > the.critical ){
                    the.wrap.css({
                        'transform':         'translate3d(0,'+(0)+'px'+',0)',
                        '-webkit-transform': 'translate3d(0,'+(0)+'px'+',0)',
                        'transition':        'transform ' + the.duration + 's',
                        '-webkit-transition':'-webkit-transform ' + the.duration + 's'
                    });

                    the.afterDownCb && the.afterDownCb();
                }else{
                    the.wrap.css({
                        'transform':         'translate3d(0,'+(-the.Hdevice)+'px'+',0)',
                        '-webkit-transform': 'translate3d(0,'+(-the.Hdevice)+'px'+',0)',
                        'transition':        'transform ' + the.duration + 's',
                        '-webkit-transition':'-webkit-transform ' + the.duration + 's'
                    });
                }

                the.setDownIscroll();
            }

            the.downStartY = false;
            the.downDisY   = false;
        });

        the.refreshIscrollIns()
    },
    /**
     * [setUpIscroll 将上半部分实例化为 iScroll 对象]
     * @param {[Number]} initY [实例化的初始位置]
     */
    setUpIscroll: function( initY ){
        var the = this;

        if( initY ){
           the.upIscroll = new IScroll(the.slt.up, {
                probeType: 3,
                bounce: false,
                startY: initY,
                click:true
            });  
        }else{            
            the.upIscroll = new IScroll(the.slt.up, {
                probeType: 3,
                bounce: false,
                click:true
            }); 
        }
    },
    setDownIscroll: function(){
        var the = this;

        the.downIscroll = new IScroll(the.slt.down, {
            probeType: 3,
            bounce:false,
            click:true
        }); 
    },
    destroy: function(ins){
        ins.destroy();
        ins.isDestroy = true;
    },
    getTranslateY:function ($obj){
        var transformStr = $obj.css('-webkit-transform'),
            translateY;


        if( transformStr.indexOf('translate') >= 0){
            translateY = parseFloat(transformStr.split(',')[1]);
        }

        if( transformStr.indexOf('matrix') >= 0 ){
            translateY = parseFloat(transformStr.split(',')[5]);
        }

        return translateY;
    },
    refreshIscrollIns: function(timeArg){
        var the = this,
            time = timeArg ? timeArg : 100;

        setTimeout(function () {
            the.upIscroll.refresh();
            the.downIscroll.refresh();
            the.HupInner   = the.upInner.height();          //上半部分的内容
            the.HdownInner = the.downInner.height();        //下半部分的内容

        }, 100);
    }
};

