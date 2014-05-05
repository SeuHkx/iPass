/**
 * Created with JetBrains WebStorm.
 * User: Hkx
 * Date: 14-4-21
 * Time: 下午3:13
 */
(function() {
    var loade = function() {
        var ipass = new iPass(),
            _sureBtn = document.getElementById('sureBtn'),
            _resetBtn = document.getElementById('reset');

        _sureBtn.addEventListener('click', function() {
            console.log(b64_md5(ipass.strData()));
        }, false);
        _resetBtn.addEventListener('click', function() {
            ipass.resetPass();
        }, false);
    };
    window.addEventListener('load', loade, false);
}());
