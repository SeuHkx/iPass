/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-4-24
 * Time: 下午3:26
 *
 */
(function(doc, win) {
    /**
     *
     * 初始化绘图模块。
     */
    ({
        HEIGHT: win.innerHeight,
        WIDTH: win.innerWidth,
        canvas: this.canvas = doc.querySelector('#canvas'),
        canvas_line : this.canvas_line = doc.querySelector('#canvas_line'),
        canvasDiv: this.canvasDiv = doc.querySelector('#canvasCircle'),
        init: function() {
            this.canvas.width = 280;
            this.canvas.height = 280;
            this.canvas_line.width = 280;
            this.canvas_line.height = 280;
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = (this.HEIGHT - this.canvas.offsetHeight) / 2 + 'px';
            this.canvas.style.left = (this.WIDTH - this.canvas.offsetWidth) / 2 + 'px';
            this.canvas_line.style.position = 'absolute';
            this.canvas_line.style.top = (this.HEIGHT - this.canvas.offsetHeight) / 2 + 'px';
            this.canvas_line.style.left = (this.WIDTH - this.canvas.offsetWidth) / 2 + 'px';
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
            doc.addEventListener('touchmove',function(event){
                event.preventDefault();
            },false);
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
        /**
         * 设置touch
         */
        hasTouch = ("createTouch" in doc),
        /**
         *
         */
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        context_line = _$('canvas_line').getContext('2d'),
        /**
         * 获取绘图上下文元素
         *
         */
        context = _$('canvas').getContext('2d'),

        /**
         * 选取元素
         *
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
                        location: [],
                        _data: [],
                        TOUCHSTART_X:0,
                        TOUCHSTART_Y : 0,
                        TOUCHMOVE_X: 0,
                        TOUCHMOVE_Y: 0,
                        canvasX: _$('canvas').getBoundingClientRect().left,
                        canvasY: _$('canvas').getBoundingClientRect().top,
                        HEIGHT: 25,
                        WIDTH: 25,
                        DIVNUMBER :5,
                        dataImg: null
                },
                /**
                 * 缓存设置状态
                 *
                 */
                cache = function(that) {
                        var _cache = {
                            cacheBorder: function() {
                                that.style.borderColor = '#008dff';
                                //that.className = 'circle';
                            },
                            setBorder: function(){
                                that.style.borderColor = 'red';
                                //that.className = 'circle glow';
                            }
                        };
                        return _cache;
                },
                /**
                 * transparent
                 * 返回一个div
                 */
                activeDiv = (function() {
                        var div = {
                            div: null,
                            tips: function() {
                                var tips = _$('tipsText').innerHTML = '请至少连接4个点';
                                return tips;
                            },
                            successTips : function(){
                                var tips = _$('tipsText').innerHTML = '绘制密码成功!';
                                return tips;
                            },
                            clearTips: function() {
                                var tips = _$('tipsText').innerHTML = '';
                                return tips;
                            },
                            tipsPass : function(str){
                                 _$('tipsPass').innerHTML = str;
                            }
                        };
                        div.div = doc.createElement('div');
                        div.div.style.width = '10px';
                        div.div.style.height = '10px';
                        div.div.style.borderRadius = '10px';
                        div.div.style.position = 'absolute';
                        div.div.style.backgroundColor = 'transparent';
                        return div;
                }()),
                _impact = function(obj,dobj){
                    /**
                     *
                     * @type {Number|number}
                     * @private
                     */
                    var _left = obj.offsetLeft,
                        _d_left = dobj.offsetParent.offsetLeft + dobj.offsetLeft,

                        _right = obj.offsetLeft + obj.offsetWidth,
                        _d_right = dobj.offsetParent.offsetLeft + dobj.offsetLeft + dobj.offsetWidth,


                        _top = obj.offsetTop + obj.offsetHeight,
                        _d_top = dobj.offsetParent.offsetTop + dobj.offsetTop,


                        _bottom = obj.offsetTop + obj.offsetHeight,
                        _d_bottom = dobj.offsetParent.offsetTop + dobj.offsetTop + dobj.offsetHeight;

                    if(_d_top <= _top && _left >= _d_left && _right <= _d_right && _bottom <= _d_bottom) {
                        return true;
                    } else {
                        return false;
                    }
                },
                /**
                 * iPass对象
                 *
                 */
                iPass = function() {
                        var that = this,
                            i = 0,
                            num;
                        this.canvasCircle = _$('canvasCircle');
                        this.circle = Point();
                        if(!that._flag){
                            for(; i < this.circle.length; i += 1) {num = i + 1 ;that._initPoint(num,this.circle[i])}console.log(pointData.location);
                            that._flag = true;
                        }
                        if(typeof this.canvasCircle == 'object' && this.circle != null){
                            that._bind();
                        }
                };
            iPass.prototype = {
                constructor: iPass,
                _flag : false,
                FIRST_INDEX : 0,
                /**
                 *
                 * @param index
                 * @param startX
                 * @param startY
                 * @param endX
                 * @param endY
                 * @returns {*}
                 * @private
                 */
                _decideDraw: function(index,startX,startY,endX,endY){
                    var that = this;
                    switch (index){
                        case 1:
                            that._drawLine(startX,startY,endX,endY);
                            break;
                        case 2:
                            that._drawLine(startX,startY,endX,endY);
                            break;
                        case 3:
                            that._drawLine(startX,startY,endX,endY);
                            break;
                        case 4:
                            that._drawLine(startX,startY,endX,endY);
                            break;
                        case 5:
                            that._drawLine(startX,startY,endX,endY);
                            break;
                        case 6:
                            that._drawLine(startX,startY,endX,endY);
                            break;
                        case 7:
                            that._drawLine(startX,startY,endX,endY);
                            break;
                        case 8:
                            that._drawLine(startX,startY,endX,endY);
                            break;
                        case 9:
                            that._drawLine(startX,startY,endX,endY);
                            break;
                    }
                    return this;
                },
                /**
                 *
                 * @param index
                 * @param that
                 * @private
                 */
                _initPoint: function(index,that){
                    switch (index){
                        case 1:
                                var _point = {
                                    x : null,
                                    y : null
                                };
                                _point.x = that.offsetLeft + that.offsetParent.offsetLeft;
                                _point.y = that.offsetTop + that.offsetParent.offsetTop;
                                pointData.location[index] =  _point;
                            break;
                        case 2:
                                var _point = {
                                    x : null,
                                    y : null
                                };
                                _point.x = that.offsetLeft + that.offsetParent.offsetLeft;
                                _point.y = that.offsetTop + that.offsetParent.offsetTop;
                                pointData.location[index] = _point;
                            break;
                        case 3:
                                var _point = {
                                    x : null,
                                    y : null
                                };
                                _point.x = that.offsetLeft + that.offsetParent.offsetLeft;
                                _point.y = that.offsetTop + that.offsetParent.offsetTop;
                                pointData.location[index] =  _point;
                            break;
                        case 4:
                                var _point = {
                                    x : null,
                                    y : null
                                };
                                _point.x = that.offsetLeft + that.offsetParent.offsetLeft;
                                _point.y = that.offsetTop + that.offsetParent.offsetTop;
                                pointData.location[index] =  _point;
                            break;
                        case 5:
                                var _point = {
                                    x : null,
                                    y : null
                                };
                                _point.x = that.offsetLeft + that.offsetParent.offsetLeft;
                                _point.y = that.offsetTop + that.offsetParent.offsetTop;
                                pointData.location[index] =  _point;
                            break;
                        case 6:
                                var _point = {
                                    x : null,
                                    y : null
                                };
                                _point.x = that.offsetLeft + that.offsetParent.offsetLeft;
                                _point.y = that.offsetTop + that.offsetParent.offsetTop;
                                pointData.location[index] =  _point;
                            break;
                        case 7:
                                var _point = {
                                    x : null,
                                    y : null
                                };
                                _point.x = that.offsetLeft + that.offsetParent.offsetLeft;
                                _point.y = that.offsetTop + that.offsetParent.offsetTop;
                                pointData.location[index] =  _point;
                            break;
                        case 8:
                                var _point = {
                                    x : null,
                                    y : null
                                };
                                _point.x = that.offsetLeft + that.offsetParent.offsetLeft;
                                _point.y = that.offsetTop + that.offsetParent.offsetTop;
                                pointData.location[index] =  _point;
                            break;
                        case 9:
                                var _point = {
                                    x : null,
                                    y : null
                                };
                                _point.x = that.offsetLeft + that.offsetParent.offsetLeft;
                                _point.y = that.offsetTop + that.offsetParent.offsetTop;
                                pointData.location[index] =  _point;
                            break;
                    }
                },
                /**
                 *
                 * @private
                 */
                _saveDraw : function(){
                    pointData.dataImg = context.getImageData(0,0,_$('canvas').width,_$('canvas').height);
                },
                /**
                 *
                 * @private
                 */
                _restrorDraw : function(){
                    context.putImageData(pointData.dataImg,0,0);
                },
                /**
                 *
                 * @param startX
                 * @param startY
                 * @param moveX
                 * @param moveY
                 * @private
                 */
                _drawRubberbandShape : function(startX,startY,moveX,moveY){
                    context.lineWidth = 2;
                    context.beginPath();
                    context.moveTo(startX - pointData.canvasX + pointData.WIDTH,startY - pointData.canvasY + pointData.HEIGHT);
                    context.lineTo(moveX - pointData.canvasX,moveY - pointData.canvasY);
                    context.strokeStyle = 'rgb(0, 141, 255)';
                    context.stroke();
                },
                /**
                 *
                 * @param startX
                 * @param startY
                 * @param endX
                 * @param endY
                 * @private
                 */
                _drawLine : function(startX,startY,endX,endY){
                    context_line.lineWidth = 2;
                    context_line.beginPath();
                    context_line.moveTo(startX - pointData.canvasX + pointData.WIDTH,startY - pointData.canvasY + pointData.HEIGHT);
                    context_line.lineTo(endX - pointData.canvasX + pointData.WIDTH,endY - pointData.canvasY + pointData.HEIGHT);
                    context_line.strokeStyle = 'rgb(0, 141, 255)';
                    context_line.stroke();
                },
                /**
                 *
                 * @private
                 */
                _clearCanvas : function(){
                    context.clearRect(0,0,_$('canvas').width,_$('canvas').height);
                    return this;
                },
                /**
                 *
                 * @private
                 */
                _clearLineCanvas: function(){
                    context_line.clearRect(0,0,_$('canvas_line').width,_$('canvas_line').height);
                    return this;
                },
                /**
                 *
                 * @param el
                 * @param fn
                 * @param bubble
                 * @private
                 */
                _start : function(el,fn,bubble){
                    el.addEventListener('touchstart',fn,!!bubble);
                },
                /**
                 *
                 * @param el
                 * @param fn
                 * @param bubble
                 * @private
                 */
                _move : function (el,fn,bubble){
                    el.addEventListener('touchmove',fn,!!bubble);
                },
                /**
                 *
                 * @param el
                 * @param fn
                 * @param bubble
                 * @private
                 */
                _end : function (el,fn,bubble){
                    el.addEventListener('touchend',fn,!!bubble);
                },
                /**
                 *
                 * @private
                 */
                _bind : function(){
                    var i = 0,
                        num,
                        that = this,
                        l = that.circle.length;
                    for(;i < l; i +=1) { num = i + 1; this._decidePoint(that.circle[i],num,num)}
                    return this;
                },
                /**
                 *
                 * @param el
                 * @param num
                 * @returns {boolean}
                 * @private
                 */
                _decide: function(el,num) {
                    /**
                     * 判断是否是滑动过的点。
                     * @type {Number}
                     */
                    var index = parseInt(el.dataset.index),
                        _index = index + 1,
                        str;
                    if(index == num) {
                        /**
                         * 存入数据
                         */
                        pointData._data.push(index);
                        /**
                         * 设置状态
                         */
                        el.setAttribute('data-index', _index);

                        str = pointData._data.join('--');

                        activeDiv.tipsPass(str);

                        console.log(pointData._data);
                    }
                    else {
                        //console.log('你不要再从这里无情的蹂躏' + parseInt(el.dataset.index));
                        return false;
                    }
                },
                /**
                 *
                 * @private
                 */
                _decidePassEnd : function(el,els){
                    /**
                     * 触摸结束的时候进行的判断。以及状态的还原。
                     * @type {Function|d.length|b.length|x.length|Number|number|number|Number|number|number|Number|number|Number|number|Number|number|number|Number|number|number|number|number|number|number|number|number|number|Number|Number|number|Number|Number|length|number|number|number|number|length|number|number|.rows.length|number}
                     */
                    var l = pointData._data.length,
                        i = 0,
                        that = this;
                    if(l <= 3 ) {
                        for(; i < els.length;i += 1){
                           els[i].setAttribute('data-index',i + 1);
                           els[i].style.borderColor = '#008dff';
                        }
                        /**
                         * 清除画布
                         *
                         */
                        that._clearLineCanvas()._clearCanvas();
                        /**
                         * 还原状态等
                         */
                        cache(el).cacheBorder();
                        /**
                         * 清除消息
                         */
                        activeDiv.tips();
                        /**
                         * 清空数据
                         * @type {Array}
                         * @private
                         */
                        pointData._data = [];
                    }else{
                        /**
                         * 提示成功消息
                         */
                        activeDiv.successTips();
                    }
                },
                /**
                 *
                 * @param el
                 * @param index
                 * @param num
                 * @private
                 */
                _decidePoint : function(el,index,num){
                    var that = this;
                    switch (index){
                        case 1 :
                            that._start(el,function(event){
                                /**
                                 * 初始化当前的位置，以及保存当前的位置
                                 * @type {number}
                                 */
                                index = 1;
                                /**
                                 * 获取当前的位置的坐标，设置初始点坐标。
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                /**
                                 * 设置初始状态，以及初始化的数据判断
                                 *
                                 */
                                cache(el).setBorder();
                                that._decide(el,num);
                                /**
                                 * 初始化元素
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 保存当前画布，用于更新
                                 *
                                 */
                                that._saveDraw();
                                /**
                                 * 插入元素
                                 *
                                 */
                                doc.body.appendChild(activeDiv.div);
                            });
                            /**
                             * move方法
                             *
                             */
                            that._move(el,function(event){
                                /**
                                 * 获取移动中的坐标
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                /**
                                 * 同上
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 更新画布
                                 *
                                 */
                                that._restrorDraw();
                                /**
                                 * 绘制线段
                                 */
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                                /**
                                 * 进行碰撞检测.
                                 *
                                 */
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                /**
                                 * 缓存当前状态值
                                 * @type {*}
                                 */
                                that.FIRST_INDEX = index;
                                for(;i < l ; i +=1){
                                    /**
                                     * 从1开始
                                     * @type {number}
                                     */
                                     num = i + 1;
                                     if(num == index){
                                         continue;
                                     }else if(_impact(activeDiv.div,that.circle[i])){
                                             index = num;
                                             /**
                                              * 碰撞的时候进行设置状态
                                              *
                                              */
                                             if(parseInt(that.circle[i].dataset.index) != num){
                                                 //console.log('!=' + num);
                                                 index = that.FIRST_INDEX;
                                                 continue;
                                             }
                                             cache(that.circle[i]).setBorder();
                                             /**
                                              * 进行数据操作
                                              */
                                             that._decide(that.circle[i],num);
                                             /**
                                              * 打印数据
                                              */
                                             that._decideDraw(index,pointData.location[that.FIRST_INDEX].x,pointData.location[that.FIRST_INDEX].y,pointData.location[index].x,pointData.location[index].y);

                                     }
                                }
                            });

                            /**
                             * end方法
                             *
                             */
                            that._end(el,function(){

                                /**
                                 * 结束的时候进行判断
                                 *
                                 */
                                 that._decidePassEnd(el,that.circle);
                                /**
                                 * 清除画板
                                 */
                                 that._clearCanvas();
                                /**
                                 * 删除div
                                 */
                                 doc.body.removeChild(activeDiv.div);

                            });
                            break;
                        case 2:
                            that._start(el,function(event){
                                /**
                                 * 初始化当前的位置，以及保存当前的位置
                                 * @type {number}
                                 */
                                index = 2;
                                /**
                                 * 获取当前的位置的坐标，设置初始点坐标。
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                /**
                                 * 设置初始状态，以及初始化的数据判断
                                 *
                                 */
                                cache(el).setBorder();
                                that._decide(el,num);
                                /**
                                 * 初始化元素
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 保存当前画布，用于更新
                                 *
                                 */
                                that._saveDraw();
                                /**
                                 * 插入元素
                                 *
                                 */
                                doc.body.appendChild(activeDiv.div);

                            });
                            that._move(el,function(event){
                                /**
                                 * 获取移动中的坐标
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                /**
                                 * 同上
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 更新画布
                                 *
                                 */
                                that._restrorDraw();
                                /**
                                 * 绘制线段
                                 */
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                                /**
                                 * 进行碰撞检测.
                                 *
                                 */
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                /**
                                 * 缓存当前状态值
                                 * @type {*}
                                 */
                                that.FIRST_INDEX = index;
                                for(;i < l ; i +=1){
                                    /**
                                     * 从1开始
                                     * @type {number}
                                     */
                                    num = i + 1;
                                    if(num == index){
                                        continue;
                                    }else if(_impact(activeDiv.div,that.circle[i])){
                                        index = num;
                                        /**
                                         * 碰撞的时候进行设置状态
                                         *
                                         */
                                        if(parseInt(that.circle[i].dataset.index) != num){
                                            //console.log('!=' + num);
                                            index = that.FIRST_INDEX;
                                            continue;
                                        }
                                        cache(that.circle[i]).setBorder();
                                        /**
                                         * 进行数据操作
                                         */
                                        that._decide(that.circle[i],num);
                                        /**
                                         * 打印数据
                                         */
                                        that._decideDraw(index,pointData.location[that.FIRST_INDEX].x,pointData.location[that.FIRST_INDEX].y,pointData.location[index].x,pointData.location[index].y);

                                    }
                                }
                            });
                            that._end(el,function(){
                                /**
                                 * 结束的时候进行判断
                                 *
                                 */
                                that._decidePassEnd(el,that.circle);
                                /**
                                 * 清除画板
                                 */
                                that._clearCanvas();
                                /**
                                 * 删除div
                                 */
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 3:
                            that._start(el,function(event){
                                /**
                                 * 初始化当前的位置，以及保存当前的位置
                                 * @type {number}
                                 */
                                index = 3;
                                /**
                                 * 获取当前的位置的坐标，设置初始点坐标。
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                /**
                                 * 设置初始状态，以及初始化的数据判断
                                 *
                                 */
                                cache(el).setBorder();
                                that._decide(el,num);
                                /**
                                 * 初始化元素
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 保存当前画布，用于更新
                                 *
                                 */
                                that._saveDraw();
                                /**
                                 * 插入元素
                                 *
                                 */
                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                /**
                                 * 获取移动中的坐标
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                /**
                                 * 同上
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 更新画布
                                 *
                                 */
                                that._restrorDraw();
                                /**
                                 * 绘制线段
                                 */
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                                /**
                                 * 进行碰撞检测.
                                 *
                                 */
                                //TODO 在这里进行操作
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                /**
                                 * 缓存当前状态值
                                 * @type {*}
                                 */
                                that.FIRST_INDEX = index;
                                for(;i < l ; i +=1){
                                    /**
                                     * 从1开始
                                     * @type {number}
                                     */
                                    num = i + 1;
                                    if(num == index){
                                        continue;
                                    }else if(_impact(activeDiv.div,that.circle[i])){
                                        index = num;
                                        /**
                                         * 碰撞的时候进行设置状态
                                         *
                                         */
                                        if(parseInt(that.circle[i].dataset.index) != num){
                                            //console.log('!=' + num);
                                            index = that.FIRST_INDEX;
                                            continue;
                                        }
                                        cache(that.circle[i]).setBorder();
                                        /**
                                         * 进行数据操作
                                         */
                                        that._decide(that.circle[i],num);
                                        /**
                                         * 打印数据
                                         */
                                        that._decideDraw(index,pointData.location[that.FIRST_INDEX].x,pointData.location[that.FIRST_INDEX].y,pointData.location[index].x,pointData.location[index].y);

                                    }
                                }
                            });
                            that._end(el,function(){
                                //TODO
                                /**
                                 * 结束的时候进行判断
                                 *
                                 */
                                that._decidePassEnd(el,that.circle);
                                /**
                                 * 清除画板
                                 */
                                that._clearCanvas();
                                /**
                                 * 删除div
                                 */
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 4:
                            that._start(el,function(event){
                                /**
                                 * 初始化当前的位置，以及保存当前的位置
                                 * @type {number}
                                 */
                                index = 4;
                                /**
                                 * 获取当前的位置的坐标，设置初始点坐标。
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                /**
                                 * 设置初始状态，以及初始化的数据判断
                                 *
                                 */
                                cache(el).setBorder();
                                that._decide(el,num);
                                /**
                                 * 初始化元素
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 保存当前画布，用于更新
                                 *
                                 */
                                that._saveDraw();
                                /**
                                 * 插入元素
                                 *
                                 */
                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                /**
                                 * 获取移动中的坐标
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                /**
                                 * 同上
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 更新画布
                                 *
                                 */
                                that._restrorDraw();
                                /**
                                 * 绘制线段
                                 */
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                                /**
                                 * 进行碰撞检测.
                                 *
                                 */
                                //TODO 在这里进行操作
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                /**
                                 * 缓存当前状态值
                                 * @type {*}
                                 */
                                that.FIRST_INDEX = index;
                                for(;i < l ; i +=1){
                                    /**
                                     * 从1开始
                                     * @type {number}
                                     */
                                    num = i + 1;
                                    if(num == index){
                                        continue;
                                    }else if(_impact(activeDiv.div,that.circle[i])){
                                        index = num;
                                        /**
                                         * 碰撞的时候进行设置状态
                                         *
                                         */
                                        if(parseInt(that.circle[i].dataset.index) != num){
                                            //console.log('!=' + num);
                                            index = that.FIRST_INDEX;
                                            continue;
                                        }
                                        cache(that.circle[i]).setBorder();
                                        /**
                                         * 进行数据操作
                                         */
                                        that._decide(that.circle[i],num);
                                        /**
                                         * 打印数据
                                         */
                                        that._decideDraw(index,pointData.location[that.FIRST_INDEX].x,pointData.location[that.FIRST_INDEX].y,pointData.location[index].x,pointData.location[index].y);

                                    }
                                }
                            });
                            that._end(el,function(){
                                //TODO
                                /**
                                 * 结束的时候进行判断
                                 *
                                 */
                                that._decidePassEnd(el,that.circle);
                                /**
                                 * 清除画板
                                 */
                                that._clearCanvas();
                                /**
                                 * 删除div
                                 */
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 5:
                            that._start(el,function(event){
                                /**
                                 * 初始化当前的位置，以及保存当前的位置
                                 * @type {number}
                                 */
                                index = 5;
                                /**
                                 * 获取当前的位置的坐标，设置初始点坐标。
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                /**
                                 * 设置初始状态，以及初始化的数据判断
                                 *
                                 */
                                cache(el).setBorder();
                                that._decide(el,num);
                                /**
                                 * 初始化元素
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 保存当前画布，用于更新
                                 *
                                 */
                                that._saveDraw();
                                /**
                                 * 插入元素
                                 *
                                 */
                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                /**
                                 * 获取移动中的坐标
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                /**
                                 * 同上
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 更新画布
                                 *
                                 */
                                that._restrorDraw();
                                /**
                                 * 绘制线段
                                 */
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                                /**
                                 * 进行碰撞检测.
                                 *
                                 */
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                /**
                                 * 缓存当前状态值
                                 * @type {*}
                                 */
                                that.FIRST_INDEX = index;
                                for(;i < l ; i +=1){
                                    /**
                                     * 从1开始
                                     * @type {number}
                                     */
                                    num = i + 1;
                                    if(num == index){
                                        continue;
                                    }else if(_impact(activeDiv.div,that.circle[i])){
                                        index = num;
                                        /**
                                         * 碰撞的时候进行设置状态
                                         *
                                         */
                                        if(parseInt(that.circle[i].dataset.index) != num){
                                            //console.log('!=' + num);
                                            index = that.FIRST_INDEX;
                                            continue;
                                        }
                                        cache(that.circle[i]).setBorder();
                                        /**
                                         * 进行数据操作
                                         */
                                        that._decide(that.circle[i],num);
                                        /**
                                         * 打印数据
                                         */
                                        that._decideDraw(index,pointData.location[that.FIRST_INDEX].x,pointData.location[that.FIRST_INDEX].y,pointData.location[index].x,pointData.location[index].y);

                                    }
                                }
                            });
                            that._end(el,function(){
                                //TODO
                                /**
                                 * 结束的时候进行判断
                                 *
                                 */
                                that._decidePassEnd(el,that.circle);
                                /**
                                 * 清除画板
                                 */
                                that._clearCanvas();
                                /**
                                 * 删除div
                                 */
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 6:
                            that._start(el,function(event){
                                /**
                                 * 初始化当前的位置，以及保存当前的位置
                                 * @type {number}
                                 */
                                index = 6;
                                /**
                                 * 获取当前的位置的坐标，设置初始点坐标。
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                /**
                                 * 设置初始状态，以及初始化的数据判断
                                 *
                                 */
                                cache(el).setBorder();
                                that._decide(el,num);
                                /**
                                 * 初始化元素
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 保存当前画布，用于更新
                                 *
                                 */
                                that._saveDraw();
                                /**
                                 * 插入元素
                                 *
                                 */
                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                /**
                                 * 获取移动中的坐标
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                /**
                                 * 同上
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 更新画布
                                 *
                                 */
                                that._restrorDraw();
                                /**
                                 * 绘制线段
                                 */
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                                /**
                                 * 进行碰撞检测.
                                 *
                                 */
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                /**
                                 * 缓存当前状态值
                                 * @type {*}
                                 */
                                that.FIRST_INDEX = index;
                                for(;i < l ; i +=1){
                                    /**
                                     * 从1开始
                                     * @type {number}
                                     */
                                    num = i + 1;
                                    if(num == index){
                                        continue;
                                    }else if(_impact(activeDiv.div,that.circle[i])){
                                        index = num;
                                        /**
                                         * 碰撞的时候进行设置状态
                                         *
                                         */
                                        if(parseInt(that.circle[i].dataset.index) != num){
                                            //console.log('!=' + num);
                                            index = that.FIRST_INDEX;
                                            continue;
                                        }
                                        cache(that.circle[i]).setBorder();
                                        /**
                                         * 进行数据操作
                                         */
                                        that._decide(that.circle[i],num);
                                        /**
                                         * 打印数据
                                         */
                                        that._decideDraw(index,pointData.location[that.FIRST_INDEX].x,pointData.location[that.FIRST_INDEX].y,pointData.location[index].x,pointData.location[index].y);

                                    }
                                }
                            });
                            that._end(el,function(){
                                /**
                                 * 结束的时候进行判断
                                 *
                                 */
                                that._decidePassEnd(el,that.circle);
                                /**
                                 * 清除画板
                                 */
                                that._clearCanvas();
                                /**
                                 * 删除div
                                 */
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 7:
                            that._start(el,function(event){
                                /**
                                 * 初始化当前的位置，以及保存当前的位置
                                 * @type {number}
                                 */
                                index = 7;
                                /**
                                 * 获取当前的位置的坐标，设置初始点坐标。
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                /**
                                 * 设置初始状态，以及初始化的数据判断
                                 *
                                 */
                                cache(el).setBorder();
                                that._decide(el,num);
                                /**
                                 * 初始化元素
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 保存当前画布，用于更新
                                 *
                                 */
                                that._saveDraw();
                                /**
                                 * 插入元素
                                 *
                                 */
                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                /**
                                 * 获取移动中的坐标
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                /**
                                 * 同上
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 更新画布
                                 *
                                 */
                                that._restrorDraw();
                                /**
                                 * 绘制线段
                                 */
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                                /**
                                 * 进行碰撞检测.
                                 *
                                 */
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                /**
                                 * 缓存当前状态值
                                 * @type {*}
                                 */
                                that.FIRST_INDEX = index;
                                for(;i < l ; i +=1){
                                    /**
                                     * 从1开始
                                     * @type {number}
                                     */
                                    num = i + 1;
                                    if(num == index){
                                        continue;
                                    }else if(_impact(activeDiv.div,that.circle[i])){
                                        index = num;
                                        /**
                                         * 碰撞的时候进行设置状态
                                         *
                                         */
                                        if(parseInt(that.circle[i].dataset.index) != num){
                                            //console.log('!=' + num);
                                            index = that.FIRST_INDEX;
                                            continue;
                                        }
                                        cache(that.circle[i]).setBorder();
                                        /**
                                         * 进行数据操作
                                         */
                                        that._decide(that.circle[i],num);
                                        /**
                                         * 打印数据
                                         */
                                        that._decideDraw(index,pointData.location[that.FIRST_INDEX].x,pointData.location[that.FIRST_INDEX].y,pointData.location[index].x,pointData.location[index].y);

                                    }
                                }
                            });
                            that._end(el,function(){
                                /**
                                 * 结束的时候进行判断
                                 *
                                 */
                                that._decidePassEnd(el,that.circle);
                                /**
                                 * 清除画板
                                 */
                                that._clearCanvas();
                                /**
                                 * 删除div
                                 */
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 8:
                            that._start(el,function(event){
                                /**
                                 * 初始化当前的位置，以及保存当前的位置
                                 * @type {number}
                                 */
                                index = 8;
                                /**
                                 * 获取当前的位置的坐标，设置初始点坐标。
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                /**
                                 * 设置初始状态，以及初始化的数据判断
                                 *
                                 */
                                cache(el).setBorder();
                                that._decide(el,num);
                                /**
                                 * 初始化元素
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 保存当前画布，用于更新
                                 *
                                 */
                                that._saveDraw();
                                /**
                                 * 插入元素
                                 *
                                 */
                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                /**
                                 * 获取移动中的坐标
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                /**
                                 * 同上
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 更新画布
                                 *
                                 */
                                that._restrorDraw();
                                /**
                                 * 绘制线段
                                 */
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                                /**
                                 * 进行碰撞检测.
                                 *
                                 */
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                /**
                                 * 缓存当前状态值
                                 * @type {*}
                                 */
                                that.FIRST_INDEX = index;
                                for(;i < l ; i +=1){
                                    /**
                                     * 从1开始
                                     * @type {number}
                                     */
                                    num = i + 1;
                                    if(num == index){
                                        continue;
                                    }else if(_impact(activeDiv.div,that.circle[i])){
                                        index = num;
                                        /**
                                         * 碰撞的时候进行设置状态
                                         *
                                         */
                                        if(parseInt(that.circle[i].dataset.index) != num){
                                            //console.log('!=' + num);
                                            index = that.FIRST_INDEX;
                                            continue;
                                        }
                                        cache(that.circle[i]).setBorder();
                                        /**
                                         * 进行数据操作
                                         */
                                        that._decide(that.circle[i],num);
                                        /**
                                         * 打印数据
                                         */
                                        that._decideDraw(index,pointData.location[that.FIRST_INDEX].x,pointData.location[that.FIRST_INDEX].y,pointData.location[index].x,pointData.location[index].y);

                                    }
                                }
                            });
                            that._end(el,function(){
                                /**
                                 * 结束的时候进行判断
                                 *
                                 */
                                that._decidePassEnd(el,that.circle);
                                /**
                                 * 清除画板
                                 */
                                that._clearCanvas();
                                /**
                                 * 删除div
                                 */
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 9:
                            that._start(el,function(event){
                                /**
                                 * 初始化当前的位置，以及保存当前的位置
                                 * @type {number}
                                 */
                                index = 9;
                                /**
                                 * 获取当前的位置的坐标，设置初始点坐标。
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                /**
                                 * 设置初始状态，以及初始化的数据判断
                                 *
                                 */
                                cache(el).setBorder();
                                that._decide(el,num);
                                /**
                                 * 初始化元素
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 保存当前画布，用于更新
                                 *
                                 */
                                that._saveDraw();
                                /**
                                 * 插入元素
                                 *
                                 */
                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                /**
                                 * 获取移动中的坐标
                                 * @type {number|Number}
                                 */
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                /**
                                 * 同上
                                 * @type {string}
                                 */
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                /**
                                 * 更新画布
                                 *
                                 */
                                that._restrorDraw();
                                /**
                                 * 绘制线段
                                 */
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                                /**
                                 * 进行碰撞检测.
                                 *
                                 */
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                /**
                                 * 缓存当前状态值
                                 * @type {*}
                                 */
                                that.FIRST_INDEX = index;
                                for(;i < l ; i +=1){
                                    /**
                                     * 从1开始
                                     * @type {number}
                                     */
                                    num = i + 1;
                                    if(num == index){
                                        continue;
                                    }else if(_impact(activeDiv.div,that.circle[i])){
                                        index = num;
                                        /**
                                         * 碰撞的时候进行设置状态
                                         *
                                         */
                                        if(parseInt(that.circle[i].dataset.index) != num){
                                            //console.log('!=' + num);
                                            index = that.FIRST_INDEX;
                                            continue;
                                        }
                                        cache(that.circle[i]).setBorder();
                                        /**
                                         * 进行数据操作
                                         */
                                        that._decide(that.circle[i],num);
                                        /**
                                         * 打印数据
                                         */
                                        that._decideDraw(index,pointData.location[that.FIRST_INDEX].x,pointData.location[that.FIRST_INDEX].y,pointData.location[index].x,pointData.location[index].y);

                                    }
                                }
                            });
                            that._end(el,function(){
                                /**
                                 * 结束的时候进行判断
                                 *
                                 */
                                that._decidePassEnd(el,that.circle);
                                /**
                                 * 清除画板
                                 */
                                that._clearCanvas();
                                /**
                                 * 删除div
                                 */
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                    }
                },
                /**
                 *
                 * @returns {*}
                 */
                strData : function(){
                    /**
                     *公共接口，返回一个string
                     * @type {*}
                     */
                    var strData = pointData._data.join('');
                    console.log(strData);
                    return strData;
                },
                /**
                 * reset重置
                 */
                resetPass : function(){
                    /**
                     * 公共接口，调用其方法清除所有数据
                     * @type {number}
                     */
                    var i = 0,
                        that = this,
                        l = this.circle.length;
                    for(; i < l; i += 1) {
                        this.circle[i].setAttribute('data-index',i + 1);
                        this.circle[i].style.borderColor = '#008dff';
                        this.circle[i].className = 'circle';
                    }
                    /**
                     * 还原出厂设置
                     * @type {number}
                     */
                    this.FIRST_INDEX = 0;

                    that._clearLineCanvas()._clearCanvas();

                    activeDiv.clearTips();

                    activeDiv.tipsPass('');

                    pointData._data = [];
                }
            };
            return iPass;
        }());
    win['iPass'] = iPassMoudel;
}(document, window));
