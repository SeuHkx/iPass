/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-3-6
 * Time: 下午5:18
 */
loadJs.loadJsMod({
    /**
     * 动态异步按加载脚本
     */
    src:'js/viewPass.js',
    fn:function(){
        console.log('-------viewPass.js-------');
        loadJs.loadJsMod({
            src: 'js/canvasPass_v1.0.js',
            fn : function(){
                console.log('-------canvasPass_v1.0.js-------');
                loadJs.loadJsMod({
                    src: 'js/MD5.js',
                    fn : function(){
                        console.log('-------MD5.js-------');
                        loadJs.loadJsMod({
                            src: 'js/index_.js',
                            fn : function(){
                                console.log('-------index_.js-------')
                            }
                        })
                    }
                })
            }
        })

    }
});
/**
 * @方法的入口
 */
var timer,
    flag = false;
    timer = setTimeout(function(){
            flag = true;
            if(flag){
                clearTimeout(timer);
                document.querySelector('.oTop').className  = 'topDiv';
                document.querySelector('.oBottom').className = 'bottomDiv';
                loadJs.addloadEvent(setView.setViewMaskModel().maskDestroy());
                }
    },2000);

