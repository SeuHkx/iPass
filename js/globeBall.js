/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-4-18
 * Time: 上午10:44
 */
(function(doc, win) {
    var _$ = function(id) {
            if(arguments.length == 1 && doc.getElementById || typeof id == 'string') {
                return doc.getElementById(id);
            }
        },
        globeBallModuel = (function() {
            /**
             * 私有化事件  私有对象
             * @param el
             * @param opation
             * @private
             */
            var _TapClick = function(el, opation) {
                var that = this;
                /**
                 *
                 * @type {*}
                 */
                this.tapGlobe = typeof el.tapGlobe == 'object'? _$(el.tapGlobe):_$(el.tapGlobe);
                /**
                 *
                 * @type {{active: null, cancel: null}}
                 */
                that.opation = {
                    active:null,
                    cancel:null
                };
                /**
                 *
                 * @type {*|{active: null, cancel: null}}
                 */
                that.opation = opation || that.opation;
                for(var i in opation) that.opation[i] = opation[i];
            };
            /**
             *
             * @type {Object|Function|Function|Object|_TapClick}
             */
            _TapClick.fn = _TapClick.prototype;
            _TapClick.fn._decide = true;
            _TapClick.fn.trigger  = function(fn){
                var that = this;
                switch (that._decide){
                    case true:
                        if(that.opation.active != null)that.opation.active();
                        fn.active();
                        that._decide = false;
                        break;
                    case false:
                        if(that.opation.cancel != null)that.opation.cancel();
                        fn.cancel();
                        that._decide = true;
                        break;
                }
            };
            /**
             *
             * @param el
             * @param fn
             * @param bubble
             * @private
             */
            _TapClick.fn._bind = function(el,fn,bubble){
                (el || this.tapGlobe).addEventListener('click', fn, !!bubble);
            };
            /**
             *
             * @param fn
             */
            _TapClick.fn.tap = function(fn){
                var that = this;
                this._bind(this.tapGlobe,function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    that.trigger(fn);
                });
            };
            /**
             * 定义构造函数
             * @param el
             * @param opation
             * @constructor
             */
            var Globe = function(el,opation){
                var  globe = new _TapClick(el,opation),
                     i = 0,
                     that = this;
                this.cubelist = [];
                this.globecubebox = _$(el.globecubebox);
                this.globecubeboxlist = this.globecubebox.children;
                for(;i < this.globecubeboxlist.length ; i += 1){
                    if(this.globecubeboxlist.className = 'globe-cube'){
                        this.cubelist[i] = this.globecubeboxlist[i];
                    }
                }
                if(typeof el != null && !this._initFlag) {
                    this.init();
                    for(var i = 0,l = this.cubelist.length ;i < l; i += 1){
                        switch (getComputedStyle(this.cubelist[i],null)['display']){
                            case 'none':
                                this.cubelist[i].style.display = 'block';
                                break;
                            default :
                                this.cubelist[i].style.display = 'block';
                                break;
                        }
                        this.cubelist[i].style.left = (this.globecubebox.offsetWidth - this.cubelist[i].offsetWidth)/2 + 'px';
                        this.cubelist[i].style.top = (this.globecubebox.offsetHeight - this.cubelist[i].offsetHeight)/2 + 'px';
                    }
                }
                if(globe) { globe.tap({active: function() {that._start();},cancel: function() {that._end();}});};
            };
            /**
             *
             * @type {{constructor: Function, init: Function, _start: Function, _end: Function, _move: Function, _moevEnd: Function}}
             */
            Globe.prototype = {
                constructor: Globe,
                /**
                 * 定义位置的初始值来用于保存和更新
                 */
                _initFlag:false,
                timer : null,
                /**
                 *
                 * 再来定义一个初始值
                 */
                init : function(){
                    this.globecubebox.style.position = 'absolute';
                    this._initFlag = true;
                    for(var i = 0,l = this.cubelist.length ;i < l; i += 1){
                         switch (getComputedStyle(this.cubelist[i],null)['display']){
                             case 'block':
                                 this.cubelist[i].style.display = 'none';
                                 break;
                             default :
                                 this.cubelist[i].style.display = 'none';
                                 break;
                         }
                         this.cubelist[i].style.position = 'absolute';
                         this.cubelist[i].style.zIndex = '-1';
                    }
                },
                _start: function(){
                    for(var i = 0,l = this.cubelist.length ;i < l; i += 1)this._move(this.cubelist[i],i);
                },
                _end : function(){
                    for(var i = 0,l = this.cubelist.length ;i < l; i += 1)this._moveEnd(this.cubelist[i],i);
                },
                _move : function(that,index){
                    switch (index){
                        case  0:
                                //that.style.webkitTransform = 'translate3d(' +0 + 'px,' +  -150 + 'px,' + 0 + ')';
                                that.className  = 'globe-cube up';
                            break;
                        case  1:
                                that.style.top = '-50px';
                                that.style.left = '100px';
                            break;
                        case  2:
                                that.style.top = '30px';
                                that.style.left = '150px';
                            break;
                    }
                },
                _moveEnd :function(that,index){
                    switch (index){
                        case  0:
                            that.className  = 'globe-cube down';
                            break;
                        case  1:
                            that.style.top = '24px';
                            that.style.left = '24px';
                            break;
                        case  2:
                            that.style.top = '24px';
                            that.style.left = '24px';
                            break;
                    }
                }
            };
            return Globe;
        }());
    win['iGlboe'] = globeBallModuel;
}(document, window));
