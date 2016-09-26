require.config({
    baseUrl: 'bower_components',
    paths: {
        Vue:'vue/dist/vue.min',
        vueValidator:'vue-validator/dist/vue-validator',
        domReady:'domReady/domReady',
        wxLogin:'../javascripts/wx-login'
    }
});

require(['Vue','vueValidator','domReady!'], function (Vue) {
    require(['wxLogin/setHtmlFontSize']);

    var vm = new Vue({
        el: '#app',
        data: {
            msg: 'hello'
        }
    });
    //console.log(vm);
});