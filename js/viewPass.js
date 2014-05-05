/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-3-6
 * Time: 下午5:43
 */
var setView = (function(mod){
    /**
     * @第一个初始化设置的遮罩动画
     * @returns {{setMethod: Function}}
     */
        mod.setViewMaskModel = function(){
            var Mask = function(opation){
                var opation = opation || {},
                    that = this;
                this.sinit = opation.sinit || false;
                this._divTop = document.createElement('div');
                this._divBottom = document.createElement('div');
                this._divTopinside = document.createElement('div');
                this._divBottominside = document.createElement('div');
                this._divImgBox = document.createElement('div');
                this._divImgBoxBottom = document.createElement('div');
                this._divImgBox.className = 'imgBox';
                this._divImgBox.style.left =( window.innerWidth - 70)/2 + 'px';
                this._divImgBox.style.top = ( window.innerHeight - 70)/2 + 'px';
                this._divImgBoxBottom.className = 'imgBox';
                this._divImgBoxBottom.style.left =( window.innerWidth - 70)/2 + 'px';
                this._img = document.createElement('img');
                this._img.src = 'img/logo_top.png';
                this._img.style.height =35 + 'px';
                this._img.style.width = 70 + 'px';
                this._imgBottom = document.createElement('img');
                this._imgBottom.src = 'img/logo_bottom.png';
                this._imgBottom.style.height =35 + 'px';
                this._imgBottom.style.width = 70 + 'px';
                this._divTopinside.className = 'topInside glowInside';
                this._divBottominside.className = 'bottomInside glowInside';
                this._divTop.className = opation.top ||'oTop';
                this._divBottom.className = opation.bottom ||'oBottom';
                this._divTop.style.width = window.innerWidth + 'px';
                this._divTop.style.height = window.innerHeight/2 + 'px';
                this._divTop.style.position = 'absolute';
                this._divBottom.style.position = 'absolute';
                this._divBottom.style.backgroundColor = '#2d2d2d';
                this._divTop.style.backgroundColor = '#2d2d2d';
                this._divBottom.style.width = window.innerWidth + 'px';
                this._divBottom.style.height = window.innerHeight/2 + 'px';
                this._divBottom.style.top = window.innerHeight/2 + 'px';
                this.init(that);
                return this.sinit;
                };
            Mask.prototype = {
                constructor:Mask,
                init:function(){
                    document.body.appendChild(this._divTop);
                    document.body.appendChild(this._divBottom);
                    this._divImgBox.appendChild(this._img);
                    this._divImgBoxBottom.appendChild(this._imgBottom);
                    this._divTop.appendChild(this._divTopinside);
                    this._divTop.appendChild(this._divImgBox);
                    this._divBottom.appendChild(this._divBottominside);
                    this._divBottom.appendChild(this._divImgBoxBottom);
                    this._divTop.addEventListener('touchmove',function(e){
                        e.preventDefault();
                    },false)
                    this._divBottom.addEventListener('touchmove',function(e){
                        e.preventDefault();
                    },false)
                    console.log('------- init -------');
                }
            };
            var oMask,
                _setMask = {
                    setMethod:function(opation){
                        if(oMask === undefined){
                            oMask = new  Mask(opation);
                        }
                        return oMask;
                    },
                    _desrtroy:function(){
                        document.body.removeChild(document.querySelector('.topDiv'));
                        document.body.removeChild(document.querySelector('.bottomDiv'));
                        console.log('------- end-destroy -------')

                    },
                    maskDestroy: function(){
                        console.log('------- init-destroy -------')
                        setTimeout(this._desrtroy.bind(this),2000);
                    }
                };
            return _setMask;
        };
        return mod;
}({}));
/**
 * @初始化设置遮罩层
 */
setView.setViewMaskModel().setMethod();




