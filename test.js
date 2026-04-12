(function(){
    'use strict';
    if(window.plugin_nf_test) return;
    window.plugin_nf_test = true;
    function go(){
        var s = document.createElement('style');
        s.textContent = 'body{background:#141414!important} .menu__item.focus,.menu__item.hover{background:#E50914!important}';
        document.head.appendChild(s);
    }
    if(window.appready) go();
    else Lampa.Listener.follow('app',function(e){if(e.type=='ready')go()});
})();
