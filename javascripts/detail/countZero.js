/**
 * [countZero 秒杀剩余时间，倒计时功能]
 * @param  {[type]} nowTime   [当前时间]
 * @param  {[type]} endTime   [结束时间]
 * @param  {[type]} startTime [开始时间]
 */
var countZeroTimer;
function countZero(nowTime, endTime, startTime){
    var timeWrap= $('.surplus'),
        note= $('.countZero .note'),
        title = $('.describe h3'),
        miaosha = $('#miaosha');

    countZeroTimer = setInterval(function(){

        //活动未开始，且距离活动开始时间大于2小时
        if(nowTime<startTime && startTime-nowTime > 7200000){
            note.html(new Date(startTime).Format("MM月dd日hh:mm")+' 开抢');
            title.html('该商品即将参加长江汇秒杀');
            miaosha.removeClass('ing');
        }

        //活动未开始，且距离活动开始时间小于2小时，开始倒计时
        if(nowTime<startTime && startTime-nowTime < 7200000){
            daojishi(startTime-nowTime, '开始');
            title.html('该商品即将参加长江汇秒杀');
            miaosha.removeClass('ing');
        }

        //活动已经开始，尚未结束，开始倒计时
        if(nowTime>startTime && nowTime<endTime){
            //console.log((endTime-nowTime).toString().toHHMMSS())
            daojishi(endTime-nowTime, '结束');
            title.html('该商品正在参加长江汇秒杀');
            miaosha.addClass('ing');
        }

        //活动已经结束
        if(nowTime>endTime){
            title.html('该商品的长江汇秒杀活动已结束');
            note.html('秒杀活动已结束');
            miaosha.addClass('ing');
            clearInterval(countZeroTimer);
        }

        /**
         *
         * @param msec [Number] 秒数
         * @param type [String] 类型
         */
        function daojishi( msec, type ){
            var hh = $('.hh'), mm = $('.mm'), ss= $('.ss');
            if( hh.length <=0 && mm.length<=0 && ss.length <= 0 ){
                timeWrap.html('').append('<span class="hh">00</span><i>:</i><span class="mm">00</span><i>:</i><span class="ss">00</span>');
            }

            var timeArr = Math.floor(msec/1000).toString().toHHMMSS().split(':');

            hh.html(timeArr[0]);
            mm.html(timeArr[1]);
            ss.html(timeArr[2]);
            note.html('距活动'+type+'倒计时');
        }

        nowTime = nowTime + 1000;

    },1000);
}

function startCount(currentTime,rushBeginTime,rushEndTime){
    var loadTime, nowTime, endTime, startTime;
    //处理“还剩多少时间”
    loadTime = Math.ceil( (new Date().getTime() - loadStartTime));
    nowTime  = parseInt(currentTime*1000) + loadTime; //数据库nowTime + 文档加载时间
    endTime  = parseInt(rushEndTime*1000);
    startTime= parseInt(rushBeginTime*1000);
    console.log( '开始'+startTime,'现在'+nowTime, '结束'+endTime)
    countZero( nowTime, endTime, startTime);
}