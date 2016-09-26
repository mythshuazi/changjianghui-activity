/**
 * Created by Administrator on 2016/2/26.
 */
/**
 * obj.ele 需要绑定事件的元素
 * obj.up  上拉时运行的方法
 * obj.down下拉时运行的方法
 *touchmove & touchend 在Android的webview中同时使用，touchend有可能不执行
 * 所以不使用touchend
 */
function slide(obj){
    obj.ele.on('touchstart',function(e){
        //e.preventDefault();
        var startY = e.targetTouches[0].pageY,
            moveY,
            disY;

        var startX = e.targetTouches[0].pageX,
            moveX,
            disX;

        // console.log('startY:'+startY);
        // console.log('startX:'+startX);

        obj.ele.on('touchmove',function(e){
            moveY = move(e, 'pageY');
            moveX = move(e, 'pageX');

            disY  = moveY ? startY - moveY : 0 ;
            disX  = moveX ? startX - moveX : 0 ;

            //slide up
            // alert('Math.abs(disX): '+Math.abs(disX));
            if(obj.up && (disY > 0)){
                console.log('slide up');
                obj.up(e);
            }

            //slide down
            if(obj.down && disY < 0 && Math.abs(disX) < 10){
                console.log('slide down');
                obj.down();
            }

            obj.ele.off('touchmove');
        });
    });

    function move(e, axis){
        return e.targetTouches[0][axis];
    }
}