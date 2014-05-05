/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-4-18
 * Time: 下午5:24
 */
(function(doc,win){

    var passLockModuel = (function(){
        var _$ = function(id) {
                if(arguments.length == 1 && doc.getElementById || typeof id == 'string') {
                    return doc.getElementById(id);
                }
            },
            _getClass = function(eleParent, sClass) {
                var eles = eleParent.getElementsByTagName('*'),
                    elesArr = [],
                    i = 0,
                    l = eles.length;
                for(; i < l; i += 1) {
                    if(eles[i].className == sClass) {
                        elesArr.push(eles[i]);
                    }
                }
                return elesArr;
            },
            _initPoint = (function(){
                var point = {
                        x : 0,
                        y : 0
                    };
                return point;
            }())
            ,
            _div = (function(){
                var setDiv = {
                    div : null
                };
                setDiv.div = doc.createElement('div');
                setDiv.div.style.width = '40px';
                setDiv.div.style.height = '40px';
                setDiv.div.style.borderRadius = '40px';
                setDiv.div.style.webkitBorderRadius = '40px';
                setDiv.div.style.backgroundColor = 'red';
                return setDiv;
            }())
            ,
            iPassLock = function(el){
                this.lock = typeof _$(el.lock) == 'object' ? _$(el.lock) : _$(el.lock);
                this.canvas =typeof _$(el.canvas) == 'object' ? _$(el.canvas) : _$(el.canvas);
                this.lockcircle = _getClass(this.lock,'circle');
            };
        iPassLock.prototype = {
            constructor:iPassLock,
            _bind : function(el,fn,bubble){
                el.addEventListener('touchstart',fn,!!bubble);
            }
        };
        return iPassLock;
    }());
    win['iPass'] = passLockModuel;
}(document,window));
