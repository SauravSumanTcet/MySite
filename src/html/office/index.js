(function () {
    'use strict';
    // module master file , here you create module related components
    angular.module('myApp').controller('officeController', ["$scope","user", require('./office.ctl')]);
})();