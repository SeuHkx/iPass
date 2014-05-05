/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-4-24
 * Time: 下午3:26
 *
 *
 * 初始化一个画线的变量index来调用对应的方法. 先进行碰撞检测，检测完过后，自动画线，然后再进行线段的调整。
 * 画线思路，使用两个canvas。一个画线，一个画真实的线。
 *                  this.touch =("createTouch" in document);//判定是否为手持设备
 *                    this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
 *                    this.MoveEvent = this.touch ? "touchmove" : "mousemove";
 *                   this.EndEvent = this.touch ? "touchend" : "mouseup";
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
        canvasDiv: this.canvasDiv = doc.querySelector('#canvasCircle'),
        init: function() {
            this.canvas.width = 280;
            this.canvas.height = 280;
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
        _getStyle = function(obj,arr){
            return parseInt(getComputedStyle(obj,null)[arr]);
        },
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
                            },
                            setBorder: function(){
                                that.style.borderColor = 'red';
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
                            }
                        };
                        div.div = doc.createElement('div');
                        div.div.style.width = '10px';
                        div.div.style.height = '10px';
                        div.div.style.borderRadius = '10px';
                        div.div.style.position = 'absolute';
                        div.div.style.backgroundColor = 'red';
                        return div;
                }()),
                _impact = function(obj1,obj2){
                    var l1 = obj1.offsetLeft;
                    var r1 = obj1.offsetLeft + obj1.offsetWidth;
                    var t1 = obj1.offsetTop;
                    var b1 = obj1.offsetTop + obj1.offsetHeight;

                    var l2 = obj2.offsetLeft;
                    var r2 = obj2.offsetLeft + obj2.offsetWidth;
                    var t2 = obj2.offsetTop;
                    var b2 = obj2.offsetTop + obj2.offsetHeight;

                    if(r1 < l2 || l1 > r2 || b1 < t2 || t1 > b2){
                        return false;
                    }else{
                        return true;
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
                        console.log("初始化所有点的坐标已完成！:" + pointData.location);
                };
            iPass.prototype = {
                constructor: iPass,
                _flag : false,
                INDEX : 0,
                /**
                 *
                 * @param index
                 * @returns {*}
                 * @private
                 */
                _decideDraw: function(index){
                    var that = this;
                    switch (index){
                        case 7:
                            context.save();
                            context.lineWidth = 2;
                            context.beginPath();
                            context.moveTo(12, 152);
                            context.lineTo(56, 90);
//                    context.lineTo(132 - pointData.canvasX + pointData.HEIGHT,249 - pointData.canvasY + pointData.WIDTH);
//                    context.lineTo(224 - pointData.canvasX + pointData.HEIGHT,346 - pointData.canvasY + pointData.WIDTH);
//                    context.lineTo(224 - pointData.canvasX + pointData.HEIGHT,152 - pointData.canvasY + pointData.WIDTH);
                            context.stroke();
                            break;
                        case 8:
                            context.save();
                            context.lineWidth = 2;
                            context.beginPath();
                            context.moveTo(60, 152);
                            context.lineTo(156, 190);
//                    context.lineTo(132 - pointData.canvasX + pointData.HEIGHT,249 - pointData.canvasY + pointData.WIDTH);
//                    context.lineTo(224 - pointData.canvasX + pointData.HEIGHT,346 - pointData.canvasY + pointData.WIDTH);
//                    context.lineTo(224 - pointData.canvasX + pointData.HEIGHT,152 - pointData.canvasY + pointData.WIDTH);
                            context.stroke();
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
                    context.stroke();

//
//                    context.lineWidth = 2;
//                    context.beginPath();
//                    context.moveTo(12, 152);
//                    context.lineTo(56, 90);
//                    context.lineTo(132 - pointData.canvasX + pointData.HEIGHT,249 - pointData.canvasY + pointData.WIDTH);
//                    context.lineTo(224 - pointData.canvasX + pointData.HEIGHT,346 - pointData.canvasY + pointData.WIDTH);
//                    context.lineTo(224 - pointData.canvasX + pointData.HEIGHT,152 - pointData.canvasY + pointData.WIDTH);
//                    context.restore();
//                    context.stroke();

                },
                _drawLine : function(startX,startY,moveX,moveY){
                    context.lineWidth = 2;
                    context.beginPath();
                    context.moveTo(startX - pointData.canvasX + pointData.WIDTH,startY - pointData.canvasY + pointData.HEIGHT);
                    context.lineTo(moveX - pointData.canvasX + pointData.WIDTH,moveY - pointData.canvasY + pointData.HEIGHT);
                    context.stroke();
                },
                _clearCanvas : function(){
                    context.clearRect(0,0,_$('canvas').width,_$('canvas').height);
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
                        that = this;
                    if(index == num) {
                        that._decideDraw(7);
                        /**
                         * 存入数据
                         */
                        pointData._data.push(index);
                        /**
                         * 设置状态
                         */
                        el.setAttribute('data-index', _index);
                        //TODO
                        console.log(pointData._data);
                    }
                    else {
                        console.log('你不要再从这里无情的蹂躏');
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
                        that._clearCanvas();
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
                        console.log(pointData._data);
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
                                 * 判断操作。有问题。
                                 *
                                 */
                                //that._decideDraw(index);
                                /**
                                 * 进行碰撞检测，有问题。
                                 *
                                 */
                                //TODO 在这里进行操作
                                var i = 0,
                                    num ,
                                    l = that.circle.length;
                                for(;i < l ; i +=1){
                                     num = i + 1;
                                     if(num == index){
                                         continue;
                                     }else if(_impact(activeDiv.div,that.circle[i])){
                                         //TODO 在这里进行操作
                                         index = that.INDEX = num;
                                         /**
                                          * 碰撞的时候进行设置状态
                                          *
                                          */
                                         cache(that.circle[i]).setBorder();
                                         /**
                                          * 进行数据操作
                                          */
                                         that._decide(that.circle[i],num);
                                         /**
                                          * 打印数据
                                          */
                                         console.log(pointData._data + ":当前的数据");
                                         console.log(that.INDEX +  ':当前对应的index');
                                         console.log(index);
                                    }
                                }

                            });
                            /**
                             * end方法
                             *
                             */
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
                        case 2:
                            that._start(el,function(event){
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                cache(el).setBorder();
                                that._decide(el,num);
                                var testPosX = el.offsetLeft + (el.offsetWidth - 10)/ 2,
                                    /**
                                     * 数据中心点位置
                                     */
                                        testPosY = el.offsetTop + (el.offsetHeight - 10)/2;
                                that._saveDraw();
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                console.log(testPosX + ':' + testPosY);

                                doc.body.appendChild(activeDiv.div);

                            });
                            that._move(el,function(event){
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                                that._restrorDraw();
                                that._drawRubberbandShape(pointData.location[index].x,pointData.location[index].y, pointData.TOUCHMOVE_X,pointData.TOUCHMOVE_Y);
                            });
                            that._end(el,function(){
                                that._decidePassEnd(el);
                                that._clearCanvas();
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 3:
                            that._start(el,function(event){
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                cache(el).setBorder();
                                that._decide(el,num);
                                var testPosX = el.offsetLeft + (el.offsetWidth - 10)/ 2,
                                    /**
                                     * 中心点位置
                                     */
                                        testPosY = el.offsetTop + (el.offsetHeight - 10)/2;
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                console.log(testPosX + ':' + testPosY);

                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                            });
                            that._end(el,function(){
                                that._decidePassEnd(el);
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 4:
                            that._start(el,function(event){
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                cache(el).setBorder();
                                that._decide(el,num);
                                var testPosX = el.offsetLeft + (el.offsetWidth - 10)/ 2,
                                    /**
                                     * 中心点位置
                                     */
                                        testPosY = el.offsetTop + (el.offsetHeight - 10)/2;
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                console.log(testPosX + ':' + testPosY);

                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                            });
                            that._end(el,function(){
                                that._decidePassEnd(el);
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 5:
                            that._start(el,function(event){
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                cache(el).setBorder();
                                that._decide(el,num);
                                var testPosX = el.offsetLeft + (el.offsetWidth - 10)/ 2,
                                    /**
                                     * 中心点位置
                                     */
                                        testPosY = el.offsetTop + (el.offsetHeight - 10)/2;
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                console.log(testPosX + ':' + testPosY);

                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                            });
                            that._end(el,function(){
                                that._decidePassEnd(el);
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 6:
                            that._start(el,function(event){
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                cache(el).setBorder();
                                that._decide(el,num);
                                var testPosX = el.offsetLeft + (el.offsetWidth - 10)/ 2,
                                    /**
                                     * 中心点位置
                                     */
                                        testPosY = el.offsetTop + (el.offsetHeight - 10)/2;
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                console.log(testPosX + ':' + testPosY);

                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                            });
                            that._end(el,function(){
                                that._decidePassEnd(el);
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 7:
                            that._start(el,function(event){
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                cache(el).setBorder();
                                that._decide(el,num);
                                var testPosX = el.offsetLeft + (el.offsetWidth - 10)/ 2,
                                    /**
                                     * 中心点位置
                                     */
                                        testPosY = el.offsetTop + (el.offsetHeight - 10)/2;
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                console.log(testPosX + ':' + testPosY);

                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                            });
                            that._end(el,function(){
                                that._decidePassEnd(el);
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 8:
                            that._start(el,function(event){
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                cache(el).setBorder();
                                that._decide(el,num);
                                var testPosX = el.offsetLeft + (el.offsetWidth - 10)/ 2,
                                    /**
                                     * 中心点位置
                                     */
                                        testPosY = el.offsetTop + (el.offsetHeight - 10)/2;
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                console.log(testPosX + ':' + testPosY);

                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                            });
                            that._end(el,function(){
                                that._decidePassEnd(el);
                                doc.body.removeChild(activeDiv.div);
                            });
                            break;
                        case 9:
                            that._start(el,function(event){
                                pointData.TOUCHSTART_X = event.touches[0].clientX;
                                pointData.TOUCHSTART_Y = event.touches[0].clientY;
                                cache(el).setBorder();
                                that._decide(el,num);
                                var testPosX = el.offsetLeft + (el.offsetWidth - 10)/ 2,
                                    /**
                                     * 中心点位置
                                     */
                                        testPosY = el.offsetTop + (el.offsetHeight - 10)/2;
                                activeDiv.div.style.left = pointData.TOUCHSTART_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top =  pointData.TOUCHSTART_Y - pointData.DIVNUMBER + 'px';
                                console.log(testPosX + ':' + testPosY);

                                doc.body.appendChild(activeDiv.div);
                            });
                            that._move(el,function(event){
                                pointData.TOUCHMOVE_X = event.touches[0].clientX;
                                pointData.TOUCHMOVE_Y = event.touches[0].clientY;
                                activeDiv.div.style.left = pointData.TOUCHMOVE_X - pointData.DIVNUMBER + 'px';
                                activeDiv.div.style.top = pointData.TOUCHMOVE_Y - pointData.DIVNUMBER + 'px';
                            });
                            that._end(el,function(){
                                that._decidePassEnd(el);
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
                    var strData = pointData._data.join('');
                    console.log(strData);
                    return strData;
                },
                /**
                 * reset重置
                 */
                resetPass : function(){
                    var i = 0,
                        l = this.circle.length;
                    for(; i < l; i += 1) {
                        this.circle[i].setAttribute('data-index',i + 1);
                        this.circle[i].style.borderColor = '#008dff';
                        this.circle[i].className = 'circle';
                    }
                    activeDiv.clearTips();
                    pointData._data = [];
                }
            };
            return iPass;
        }());
    win['iPass'] = iPassMoudel;
}(document, window));
