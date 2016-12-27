;(function($){
    $.fn.drag = function(){
        var zBase=997,zIndex = this.data('z') || zBase;
        var the = this;
        $(window).on('keydown', function(e){
            var act = $('.active')
            var left = act.position().left;
            var top  = act.position().top;

            switch (e.keyCode){
                case 38://上
                    act.css({top:top-1});
                    log(act);
                    break;
                case 39://右
                    act.css({left:left+1});
                    log(act);
                    break;
                case 40://下
                    act.css({top:top+1});
                    log(act);
                    break;
                case 37://左
                    act.css({left:left-1});
                    log(act);
                    break;
            }
        });

        this.forEach(function(ele,index,self){
            $(ele).css('zIndex',zBase);
            $(ele).on('touchstart', function(e){
                $('.drag').removeClass('active');
                $(this).addClass('active');
                //lines($(this));

                var disX = e.touches[0].clientX - $(ele).position().left;
                var disY = e.touches[0].clientY - $(ele).position().top;

                $(ele).css('zIndex',++zIndex);
                $(ele).data('zara', zIndex);

                $(ele).on('touchmove', fnMove);
                $(ele).on('touchend', fnEnd);

                function fnMove(e){
                    $(ele).css('left', e.touches[0].clientX - disX);
                    $(ele).css('top', e.touches[0].clientY - disY);
                }

                function fnEnd(){
                    log(ele);
                    $(ele).off('touchmove');
                    $(ele).off('touchend');
                }
            });
        });


        function lines(node){
            if($('.lines').length>0) return;
            $('<ul class="lines"><li></li><li></li><li></li><li></li></ul>').insertBefore(node);
            $('ul.lines').css({
                position:'absolute',
                top:0,
                overflow:'hidden',
                width:'100%',
                height:'100%',
                zIndex:2
            });
            $('ul.lines li').css({
                boxSizing:'border-box',
                display:'inline-block',
                width:'25%',
                height:'100%',
                borderRight:'1px solid red'
            })
        }

        function log(ele){
            var ele = $(ele);
            var pageH=$('.page').height();
            var pageW=$('.page').width();
            console.log('left: ' + ele.css('left'));
            console.log('top: ' + ele.css('top'));

            var eleW = ele.width();
            var eleH = ele.height();
            var percentH = eleH /pageH*100;
            var percentW = eleW /pageW*100;

            var percentLeft = ele.position().left/pageW*100;
            var percentTop = ele.position().top/pageH*100;

            console.log('width:'+percentW+'%;'+'\r\n'+'height:'+percentH+'%;'+'\r\n'+'left: ' + percentLeft.toFixed(2) + '%;' + '\r\n'+'top: ' + percentTop.toFixed(2) + '%;');
            console.log('');
        }
    }
})(window.Zepto);