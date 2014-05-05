/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-4-21
 * Time: 上午11:05
 *
 */
(function(doc, win) {
    /**
     *
     * 初始化。
     */
    ({
        HEIGHT: win.innerHeight,
        WIDTH: win.innerWidth,
        canvas: this.canvas = doc.querySelector('#canvas'),
        canvasDiv: this.canvasDiv = doc.querySelector('#canvasCircle'),
        init: function() {
            this.canvas.width = 280;
            this.canvas.height = this.HEIGHT / 2;
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = (this.HEIGHT - this.canvas.offsetHeight) / 2 + 'px';
            this.canvas.style.left = (this.WIDTH - this.canvas.offsetWidth) / 2 + 'px';
            this.canvasDiv.style.position = 'absolute';
            this.canvasDiv.style.width = '320px';
            this.canvasDiv.style.height = this.canvas.height + 'px';
            this.canvasDiv.style.top = (this.HEIGHT - this.canvasDiv.offsetHeight) / 2 + 'px';
            this.canvasDiv.style.left = (this.WIDTH - this.canvasDiv.offsetWidth) / 2 + 'px';
            var i = 0;
            for(; i < 9; i += 1) {
                var div = doc.createElement('div');
                div.className = 'circle';
                div.setAttribute('data-index', 1 + i);
                this.canvasDiv.appendChild(div);
            }
            console.log('初始化已经完成！');
            return this;
        }
    }).init();
    /**
     *
     * @param id
     * @returns {HTMLElement}
     * @private
     */
    var _$ = function(id) {
            if(arguments.length == 1 && doc.getElementById || typeof id == 'string') {
                return doc.getElementById(id);
            }
        },
        context = _$('canvas').getContext('2d'),
        /**
         *
         * 返回一个数组，待完善
         */
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
        /**
         * iPass模块 里面各种方法对象参数。
         *
         */
        iPassMoudel = (function() {
            /**
             *
             * @returns {*}
             * @constructor
             */
            var Point = function() {
                    var canvasCircle = _$('canvasCircle'),
                        circle = _getClass(canvasCircle, 'circle');
                    return circle;
                },
                /**
                 *
                 * 初始化数组
                 */
                pointData = {
                    location : [],
                    _data : [],
                    touchX : 0,
                    touchY : 0,
                    canvasX : _$('canvas').getBoundingClientRect().left,
                    canvasY : _$('canvas').getBoundingClientRect().top,
                    HEIGHT : 25,
                    WIDTH : 25,
                    dataImg : null
                },
                /**
                 * 设置状态
                 *
                 */
                cache = function(that){
                    var _cache = {
                        cacheBorder :function(){
                            that.style.borderColor = '#008dff';
                        },
                        setBorder : that.style.borderColor = 'red'
                    };
                    return _cache;
                },
                activeDiv = (function(){
                    var div = {
                        div:null,
                        tips :function(){
                            var tips = _$('tipsText') .innerHTML = '请至少连接4个点' ;
                            return tips;
                        },
                        clearTips : function(){
                            var tips = _$('tipsText') .innerHTML = '' ;
                            return tips;
                        }
                    };
                    div.div = doc.createElement('div');
                    div.div.style.width = '40px';
                    div.div.style.height = '40px';
                    div.div.style.borderRadius = '30px';
                    div.div.style.position = 'absolute';
                    div.div.style.backgroundColor = 'red';
                    div.div.style.left = '20px';
                    return div;
                }()),
                /**
                 * _bind方法
                 */
                _bind = function(that,fn,bubble){
                    that.addEventListener('touchstart',fn,!!bubble);
                },
                _bindEnd = function(that,fn,bubble){
                    that.addEventListener('touchend',fn,!!bubble);
                },
                _bindMove = function(that,fn,bubble){
                    that.addEventListener('touchmove',fn,!!bubble);
                },
                /**
                 * 设置事件等！
                 *
                 */
                _setEvent = function(){
                    var point = Point(),
                        i = 0,
                        l = point.length;
                    for(;i < l;i+=1){
                        var num = i + 1;
                        _decideData(point[i],num,num);
                    }
                },
                /**
                 * 数据的判断与操作
                 * 第一次操作的时候把数据放入进去，并且把已放入的点的数据给重新设置。并且判断是否是第二次执行在当前位置。
                 *
                 */
                _decide = function(that,i){
                    var data_index = parseInt(that.dataset.index),
                        _index = data_index + 1;
                    if(data_index == i) {
                        pointData._data.push(data_index);
                        that.setAttribute('data-index', _index);
                        //TODO
                    }
                    else {
                        //TODO
                        activeDiv.tips();
                        return false;
                    }
                },
                /**
                 *
                 * 当前点，释放的时候，判断是否满足条件。
                 */
                _decideEnd = function(){
                    var l = pointData._data.length;
                    if(l <= 3 ) {
                        activeDiv.tips();
                        pointData._data = [];
                    }
                },
                /**
                 * 数据的判断与操作
                 *
                 */
                _decideData = function(that,index,num){
                    /**
                     * 判断对象操作的方式与被操作对象的索引与对应点坐标位置
                     */
                    switch (index){
                        case 1:
                            /**
                             * index 1 给点绑定了touchstart事件和touchend事件，以下同理
                             */
                            _bind(that,function(){
                                cache(that).setBorder;
                                _decide(that,num);
                            });
                            _bindEnd(that,function(){
                                cache(that).cacheBorder();
                                _decideEnd();
                            });
                            break;
                        case 2:
                            /**
                             * index 2
                             */
                            _bind(that,function(){
                                cache(that).setBorder;
                                _decide(that,num);
                            });
                            _bindEnd(that,function(){
                                cache(that).cacheBorder();
                                _decideEnd();
                            });
                            break;
                        case 3:
                            /**
                             * index 3
                             */
                            _bind(that,function(){
                                cache(that).setBorder;
                                _decide(that,num);
                            });
                            _bindEnd(that,function(){
                                cache(that).cacheBorder();
                                _decideEnd();
                            });
                            break;
                        case 4:
                            /**
                             * index 4
                             */
                            _bind(that,function(){
                                cache(that).setBorder;
                                _decide(that,num);
                            });
                            _bindEnd(that,function(){
                                cache(that).cacheBorder();
                                _decideEnd();
                            });
                            break;
                        case 5:
                            /**
                             * index 5
                             */
                            _bind(that,function(){
                                cache(that).setBorder;
                                _decide(that,num);
                            });
                            _bindEnd(that,function(){
                                cache(that).cacheBorder();
                                _decideEnd();
                            });
                            break;
                        case 6:
                            /**
                             * index 6
                             */
                            _bind(that,function(){
                                cache(that).setBorder;
                                _decide(that,num);
                            });
                            _bindEnd(that,function(){
                                cache(that).cacheBorder();
                                _decideEnd();
                            });
                            break;
                        case 7:
                            /**
                             * index 7
                             */
                            _bind(that,function(){
                                cache(that).setBorder;
                                _decide(that,num);
                            });
                            _bindEnd(that,function(){
                                cache(that).cacheBorder();
                                _decideEnd();
                            });
                            break;
                        case 8:
                            /**
                             * index 8
                             */
                            _bind(that,function(){
                                cache(that).setBorder;
                                _decide(that,num);
                            });
                            _bindEnd(that,function(){
                                cache(that).cacheBorder();
                                _decideEnd();
                            });
                            break;
                        case 9:
                            /**
                             * index 9
                             */
                            _bind(that,function(){
                                cache(that).setBorder;
                                _decide(that,num);
                            });
                            _bindEnd(that,function(){
                                cache(that).cacheBorder();
                                _decideEnd();
                            });
                            break;
                    }
                },
                /**
                 *
                 * canvas绘制图形的动作。
                 * 方法，属性。
                 *
                 */
                saveDraw = function(){
                    pointData.dataImg = context.getImageData(0,0,_$('canvas').width,_$('canvas').height);
                },
                restrorDraw = function(){
                    context.putImageData(pointData.dataImg,0,0);
                },
                drawRubberbandShape = function(x1,y1,x,y) {
                    context.lineWidth = 2;
                    context.beginPath();
                    context.moveTo(x1 - pointData.canvasX + pointData.HEIGHT,y1 - pointData.canvasY + pointData.WIDTH);
                    context.lineTo(x - pointData.canvasX,y - pointData.canvasY);
//                    context.lineTo(132 - pointData.canvasX + pointData.HEIGHT,249 - pointData.canvasY + pointData.WIDTH);
//                    context.lineTo(224 - pointData.canvasX + pointData.HEIGHT,346 - pointData.canvasY + pointData.WIDTH);
//                    context.lineTo(224 - pointData.canvasX + pointData.HEIGHT,152 - pointData.canvasY + pointData.WIDTH);
                    context.stroke();
                },
                clearCanvas = function(){
                    context.clearRect(0,0,_$('canvas').width,_$('canvas').height);
                },
                restoreCanvas = function(){
                    context.restore();
                },
                /**
                 *
                 * iPass对像化
                 * 通过实例化iPass对象来实现相对应的操作，和逻辑判断。与上面的方法，判断，互不干扰。
                 *
                 */
                iPass = function(){
                    var that = this;
                    this.canvasCircle = _$('canvasCircle');
                    this.circle = _getClass(this.canvasCircle,'circle');
                    var testobj = doc.querySelector('.circle');
                    if(typeof this.canvasCircle == 'object' && this.circle != null){
                        _setEvent();
                    }
                    //TODO
                    for(var i = 0;i < this.circle.length;i += 1){
                        pointData.location.push(this.circle[i].offsetLeft,this.circle[i].offsetTop + this.circle[i].offsetParent.offsetTop);
                    }
                    console.log("初始化所有点的坐标:" + pointData.location);
                    console.log("canvasX:" + pointData.canvasX + "canvasY:" + pointData.canvasY);
                    //TODO
                    _bind(testobj,function(){
                        that._bind(event);
                    });

                    _bindMove(testobj,function(){
                        that._bind(event);
                    });
                    _bindEnd(testobj,function(){
                        that._bind(event);
                        clearCanvas();
                    });
                };

            iPass.prototype = {
                constructor : iPass,
                _start : function(){
                       //TODO
                },
                _move : function(){
                    //TODO
                },
                _end : function(){
                    //TODO
                },
                _bind : function(event){
                    if(event.touches.length == 1){
                        switch (event.type){
                            case 'touchstart':
                                //TODO
                                saveDraw();
                                break;
                            case 'touchmove':
                                event.preventDefault();
                                //TODO
                                pointData.touchX = event.changedTouches[0].clientX;
                                pointData.touchY = event.changedTouches[0].clientY;
                                restrorDraw();

                                if(pointData.touchX == 64 && pointData.touchY == 249){
                                    context.lineWidth = 2;
                                    context.beginPath();
                                    //context.moveTo(132 - pointData.canvasX + pointData.HEIGHT,177 - pointData.canvasY + pointData.WIDTH);
                                    context.translate(40,249 - 152  - pointData.canvasY + pointData.WIDTH);
                                    context.lineTo(pointData.touchX - pointData.canvasX,pointData.touchY - pointData.canvasY);
                                    context.stroke();
                                    return true;
                                }else{
                                    drawRubberbandShape(40,152,pointData.touchX,pointData.touchY);
                                }

                                console.log(" touchX: " + pointData.touchX + " touchY: " + pointData.touchY + ":" + event.type);
                        }
                    }
                },
                /**
                 *
                 * @returns {*}
                 */
                strData : function(){
                    var strData = pointData._data.join('');
                    console.log(strData);
                    return strData;
                }
            };
            return iPass;
        }());
    win['iPass'] = iPassMoudel;
}(document, window));
