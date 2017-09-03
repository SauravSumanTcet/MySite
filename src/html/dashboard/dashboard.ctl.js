(function () {
    'use strict';
    module.exports = function ($scope, $state, $interval) {
        var vm = this;
        $('.carousel').carousel({
            indicators: true // Set to true to show indicators. (Default: false)
        });
        // $('.carousel.carousel-slider').carousel({fullWidth: true});
        // $interval(function () {
        //     $('.carousel').carousel('next');
        // }, 1000);

        var currentTime = Date.now();
        var refreshTest = function () {
            console.log("Dashboard screen ||| " + new Date(currentTime));
        };
        refreshTest();

        $scope.site_name = "MySite";

        $scope.userInfo = {
            firstName: "Saurav",
            lastName: "Suman",
            role: "Developer",
            email: localStorage.getItem('user-email')
        };

        return vm;
    };
})();
