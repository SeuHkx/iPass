/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-4-21
 * Time: 上午12:24
 */
(function(){
    var loade = function (){
        var ipass = new iPass({
            lock: 'circlePass',
            canvas : 'canvasPass'
        });
    };
    window.addEventListener('load',loade,false);
}());
