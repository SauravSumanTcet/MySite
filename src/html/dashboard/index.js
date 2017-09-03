(function () {
    'use strict';
    // module master file , here you create module related components
    angular.module('myApp').controller('dashboardController', ["$scope","$state","$interval", require('./dashboard.ctl')]);
})();