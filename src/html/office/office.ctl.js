(function () {
    'use strict';
    module.exports = function ($scope,user) {

        var vm = this;

        vm.currentTime = Date.now();

        vm.refreshTest = function () {
            console.log("Doing refesh from office");
        };
        
        return vm;
    };
})();