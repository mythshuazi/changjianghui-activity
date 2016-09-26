$(function(){
	var bingoList,
		bingoListLen,
		shareTitle,
		shareMemo,
		mobileNum,
		changeBingoListTimer,
		canAjaxLottery=true,
		screenW    = $('body').width(),
		$lhb 	   = $('#lhb'),
		$ul  	   = $('.list ul'),
		$btnShare  = $('.share'),
		$btnDownl  = $('.download'),
		$aboutQhb  = $('#aboutQhb'),
		$smallprize= $('#smallPrize'),
		$bigPrize  = $('#bigPrize'),
		$noChance  = $('#noChance'),
		$tooLate   = $('#tooLate');

	//获取中奖列表
	ajaxGetBingoList();
	setInterval(function(){
		ajaxGetBingoList();
	}, 1000 * 60 * 5);

	//注册事件------------------------------
	//戳我抢红包----------------------------
	$(document).on('tap','.rushBtn',function(){
		$('#qhb').hide();
		$('#lhb').show();
	});

	//规则----------------------------------------
	$(document).on('tap','.rulueBtn',function(){
		popShow($('#rule'));
	});

	$(document).on('tap','.close',function(){
		popHide($('#rule'));
	});

	$(document).on('touchmove','#rule',function(e){
		e.preventDefault();
	});

	//分享-----------------------------------------
	$(document).on('tap','.share',function(){
		popShow($('#share'));
	});

	$(document).on('tap','#share',function(e){
			popHide($(this));
	});
	$(document).on('touchmove','#share',function(e){
			e.preventDefault();
	});
	
	function popShow(obj){
		var $inner= obj.find('.wrap'),
			winH  = $(window).height(),
			scrTop= $('body').scrollTop();

		obj.show();
		if(obj.attr('id')=='rule'){
			$inner.css({
				marginTop:(winH - $inner.height())/2 + scrTop - 30
			});
		}else{
			$inner.css({
				marginTop:scrTop
			});
		}		

	}
	function popHide(obj){
		obj.hide();
	}


	//领取红包------------------------------
	var isRequest = false;
	$(document).on('input propertychange', 'input.phone', function(){
		var re = /[1][345678]\d{9}/;
		var phone = $(this).val();

		//超出11位，删除多余
		if(phone.length>11){
			console.log('超过11位');
			$(this)[0].value = phone.substring(0,11);

		//小于等于11位
		}else{
			if(re.test(phone)){
				console.log('正确');
				if(!isRequest){					
					phoneNumRegister(phone); //ajax 请求入库
				}			
			}else{
				$(this)[0].value = $(this)[0].value.replace(/[^\d]/g, "");

				if($(this).val().length==11){
					console.log('号码输入有误2');
				}

				$('.getBtn').addClass('disabled');	//禁用按钮
			}
		}
		
	});

	$(document).on('tap','.getBtn',function(){
		if($(this).hasClass('disabled')) return ;
		if(canAjaxLottery){			
			var phone = $('.phone').val();

			mobileNum = phone;
			ajaxLottery(phone);		//ajax 请求抽奖
		}
	});
	setInterval(function(){
		ajaxGetBingoList();
	},10000)
	//ajax获取中奖名单
	function ajaxGetBingoList(phoneNum){
		// $.ajax({
		// 	url: '/path/to/file',
		// 	type: 'GET',
		// 	dataType: 'json',
		// 	data: {'phone': phoneNum},
		// 	success:function(data){
				var data = {
			    "share_title": "【有福同享】过年回家不差钱，有钱大家一起抢！",
			    "share_memo": "长江汇狂撒千万红包，助力船友们回家过年！",
			    "list": [
			        {
			            "belongs_phone": "138****4847",
			            "amount": "4888",
			            "open_time": "2016.01.28"
			        },
			        {
			            "belongs_phone": "138****4847",
			            "amount": "20",
			            "open_time": "2016.01.28"
			        },
			        {
			            "belongs_phone": "151****6856",
			            "amount": "58",
			            "open_time": "2016.01.28"
			        },
			        {
			            "belongs_phone": "151****6854",
			            "amount": "20",
			            "open_time": "2016.01.28"
			        },
			        {
			            "belongs_phone": "151****6852",
			            "amount": "288",
			            "open_time": "2016.01.28"
			        },
			        {
			            "belongs_phone": "151****6855",
			            "amount": "1888",
			            "open_time": "2016.01.28"
			        }
			    ]
			}
				bingoList    = data.list;
				bingoListLen = bingoList.length;
				shareTitle   = data.share_title;
				shareMemo    = data.share_memo;

				for(var i=0; i<bingoList.length; i++){
					if(parseInt(bingoList[i].amount) > 188){
						bingoList[i].style = 'bold';
					}else{
						bingoList[i].style = 'normal';
					}
				}

				appendToList();
				changeBingoList();				
		// 	},
		// 	error:function(xhr, errorType, error){
		// 		console.log("请求失败");
		// 	},
		// 	complete:function(xhr, status){
		// 		console.log("请求完成");
		// 	}
		// });		
	}

	//每隔4秒更换中奖列表内容
	function changeBingoList(){
		var $wrap= $('.listWrap'),
			$ul  = $('.list ul'),
			$aLi = $('.list ul li'),
			ulH  = $ul.height(),
			liH  = ($wrap.height()) / 5,
			slideHeight=0;

		//小于 5 不滚屏
		if($aLi.length <= 5) return;

		//复制 一屏的5个于底部，无缝连接
		for(var i=0; i<5; i++){
			$aLi.eq(i).clone().appendTo($ul);
		}

		changeBingoListTimer && clearInterval(changeBingoListTimer);
		changeBingoListTimer = setInterval(function(){
			if(Math.abs(slideHeight) >= ulH){
				slideHeight = 0;
				isBottom = true;
				$ul.css({
					'transition': 'transform 0s',
                    '-webkit-transition':'-webkit-transform 0s',
				});
				$ul.css({
	                'transform':         'translate3d(0,0,0)',
	                '-webkit-transform': 'translate3d(0,0,0)'
				});
			}else{
				slideHeight -= liH;
				$ul.css({
					'transition': 'transform 1s',
                    '-webkit-transition':'-webkit-transform 1s',
	                'transform':         'translate3d(0,'+slideHeight+'px'+',0)',
	                '-webkit-transform': 'translate3d(0,'+slideHeight+'px'+',0)'
				});
			}

			
		}, 3000)
	}

	//将中奖列表中数据插入到ul中
	function appendToList(){
		changeBingoListTimer && clearInterval(changeBingoListTimer);
		$ul.children('li').remove();
		$ul[0].style.transition = 'transform 0s';
		$ul[0].style.webkitTransition = '-webkit-transform 0s';

		$ul[0].style.transform = 'translate3d(0,0,0)';
		$ul[0].style.webkitTransform = 'translate3d(0,0,0)';


		var html='';
		
		for(var i=0; i<bingoList.length; i++){
			html += '<li style="font-weight:'+ bingoList[i].style +'"><span>'+bingoList[i].belongs_phone+'</span><span>'+bingoList[i].open_time+'</span><span>'+'获得'+bingoList[i].amount+'元红包'+'</span></li>'
		}
		
		
		$(html).appendTo($ul);
	}

	//ajax抽奖
	function ajaxLottery(phoneNum){
		canAjaxLottery = false;
		/*{
		    "code": "1",
		    "msg": "红包已放入138****0000账户，长江汇客户端可以使用",
		    "amount":"20"
		}
		{
		    "code": "2",
		    "msg": "不在活动时间内，无法参与抽奖"
		}
		{
		    "code": "3",
		    "msg": "今日红包机会已用完"
		}
		{
		    "code": "4",
		    "msg": "您来晚了，今日红包已被领完了"
		}
		{
		    "code": "5",
		    "msg": "红包活动已下架"
		}*/

		$.ajax({
			url: '/path/to/file',
			type: 'GET',
			dataType: 'json',
			data: {'phone': phoneNum},
			success:function(data){
				switch(parseInt(data.code)){
					case 1:
						$lhb.hide();
						$aboutQhb.show();
						if(data.amount <= 188){
							$smallprize.siblings('div').hide();
							$smallprize.show().find('.num').html(data.amount);
							$smallprize.find('.account').html(mobileNum);
						}else{
							$bigPrize.siblings('div').hide();
							$bigPrize.show().find('.num').html(data.amount);
							$bigPrize.find('.account').html(mobileNum);
						}
						
						$btnShare.show();
						$btnDownl.show();

						//刷新中奖列表
						ajaxGetBingoList(phone);
						break;
					case 2:

						break;
					case 3:
						$lhb.hide();
						$aboutQhb.show();
						$noChance.siblings('div').hide();
						$noChance.show();
						$btnDownl.show();
						break;
					case 4:
						$lhb.hide();
						$aboutQhb.show();
						$tooLate.siblings('div').hide();
						$tooLate.show();
						$btnDownl.show();
						break;
					case 5:

						break;
				}
			},
			error:function(xhr, errorType, error){
				console.log("请求失败");
			},
			complete:function(xhr, status){
				canAjaxLottery = true;
				console.log("请求完成");
			}
		})
	}

	//ajax手机号码入库
	function phoneNumRegister(phoneNum){
		isRequest = true;
		$.ajax({
			url: '/path/to/file',
			type: 'GET',
			dataType: 'json',
			data: {'phone': phoneNum},
			success:function(data){
				$('.getBtn').removeClass('disabled');
			},
			error:function(xhr, errorType, error){
				console.log("请求失败");
			},
			complete:function(xhr, status){
				isRequest = false;
				console.log("请求完成");
			}
		});
	}
});
