(function () {
    'use strict';
    // Here you have to set your app name to myApp it manually
    require('angular');
    window.$ = window.jQuery = require('jquery');
    require('hammerjs/hammer');
    require("materialize");
    // require('bootstrap');
    require('angular-ui-router');
    require('angular-animate');

    angular.module('myApp', [
        'ui.router'
    ]);

    angular.module('myApp').config(['$stateProvider', '$urlRouterProvider', require('./app.states')]);
    
    require('../html/login');
    require('../html/home');
    require('../html/dashboard');

})();