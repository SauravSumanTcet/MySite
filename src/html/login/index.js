(function () {
    'use strict';
    // module master file , here you create module related components
    angular.module('myApp').controller('loginController', ["$scope","$state", require('./login.ctl')]);
})();