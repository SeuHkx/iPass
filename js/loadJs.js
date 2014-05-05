/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-3-6
 * Time: 下午4:51
 */
var loadJs = (function(mod){
    mod.loadJsMod = function(option){
        var script = document.createElement('script');
        if(script.readyState){
            script.onreadystatechange = function(){
                if(script.readyState == 'loaded' || script.readyState == 'complete'){
                    script.onreadystatechange = null;
                    option.fn();
                }
            }
        }else{
            script.onload = function(){
                option.fn();
            }
        }
        script.src = option.src;
        document.getElementsByTagName('head')[0].appendChild(script);
    };
    mod.addloadEvent = function(fn){
        var oldonload = window.onload;
        if(typeof window.onload != 'function'){
            window.onload = fn;
        }else{
            window.onload = function(){
                oldonload();
                fn();
            }
        }
    };
    return mod;
}(window.loadJs || {}));
