/*!
 * jquery.scrollLoading.js
 * by zhangxinxu  http://www.zhangxinxu.com
 * 2010-11-19 v1.0
 * 2012-01-13 v1.1 偏移值计算修改 position → offset
 * 2012-09-25 v1.2 增加滚动容器参数, 回调参数
 * modify by ls 2015.10.5 callback的值 $.noop → function(){}
 * 底部的参数由 jQuery -> jQuery || Zepto
 * 以及添加注释
*/
(function($) {
	$.fn.scrollLoading = function(options) {
		//默认配置项
		var defaults = {
			attr: "data-url",
			container: $(window),
			asBackground:false, //modify by 吕帅：正常是通过改变img标签的src加载，也可把图片加载为背景图片，从而图片的适应能力更灵活
			callback: function(){}
		};

		//与用户传入配置项 合并
		var params = $.extend({}, defaults, options || {});

		//用于储存所有选中的元素的标签名，地址，data-url
		params.cache = [];

		$(this).each(function() {
			var node = this.nodeName.toLowerCase(), url = $(this).attr(params["attr"]);
			//重组
			var data = {
				obj: $(this),
				tag: node,
				url: url
			};
			params.cache.push(data);
		});

		//如果配置了回调函数，则运行回调函数；回调函数会在图片替换后运行
		var callback = function(call) {
			if ($.isFunction(params.callback)) {
				params.callback.call(call.get(0));
			}
		};
		
		//动态显示数据
		var loading = function() {
			
			var contHeight = params.container.height();
			if ($(window).get(0) === window) {
				contop = $(window).scrollTop();
			} else {
				contop = params.container.offset().top;
			}		
			
			$.each(params.cache, function(i, data) {
				var o = data.obj, tag = data.tag, url = data.url, post, posb;

				if (o) {
					post = o.offset().top - contop, post + o.height(); //这是个很奇怪的写法
	
					if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
						if (url) {
							//在浏览器窗口内
							if (tag === "img") {
								//图片，改变src
								callback(o.attr("src", url));	//此写法为 callback 传递了→o.attr("src", url)运行后的o
							} else if (params.asBackground){    //modify by 吕帅
								//非图片 且 参数asBackground存在，代表图片作为背景
								callback(o.css("backgroundImage", "url('"+url+"')"));
							} else {
								o.load(url, {}, function() {
									callback(o);
								});
							}		
						} else {
							// 无地址，直接触发回调
							callback(o);
						}
						data.obj = null;	
					}
				}
			});	
		};
		
		//事件触发
		//加载完毕即执行
		loading();
		//滚动执行
		params.container.bind("scroll", loading);
	};
})(window.jQuery || window.Zepto);