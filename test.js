(function(){
    'use strict';
    if(window.plugin_nf_test) return;
    window.plugin_nf_test = true;
    function go(){
        var s = document.createElement('style');
        s.textContent = 'body{background:#000000!important;color:#f5f5f7!important} .menu__item.focus,.menu__item.hover{background:rgba(255,255,255,0.12)!important;color:#fff!important}';
        document.head.appendChild(s);
    }
    if(window.appready) go();
    else Lampa.Listener.follow('app',function(e){if(e.type=='ready')go()});
})();
