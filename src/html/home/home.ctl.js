(function () {
    'use strict';
    module.exports = function ($scope,user) {

        var vm = this;

        vm.currentTime = Date.now();
        
        vm.refreshTest = function () {
            console.log("Loading homepage on "+new Date(vm.currentTime)+"...");
        };
        vm.refreshTest();

        return vm;
    };
})();