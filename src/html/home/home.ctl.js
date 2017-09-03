(function () {
    'use strict';
    module.exports = function ($scope,$state) {
        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 300
            // edge: 'right', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true, // Choose whether you can drag to open on touch screens,
            onOpen: function (el) { /* Do Stuff */ }, // A function to be called when sideNav is opened
            onClose: function (el) { /* Do Stuff */ }, // A function to be called when sideNav is closed
        });
        var vm = this;

        var currentTime = Date.now();
        var refreshTest = function () {
            console.log("Has User Logged in? ",(localStorage.getItem('user-email')===null)?'No':'Yes');
            if(localStorage.getItem('user-email')===null){
                $state.go('login');
            }
            console.log("Home screen ||| " + new Date(currentTime));
        };
        refreshTest();

        $scope.site_name = "MySite";

        $scope.userInfo = {
            firstName:"Saurav",
            lastName:"Suman",
            role:"Developer",
            email:localStorage.getItem('user-email')
        };

        vm.logout = function(){
            console.log("User Logged Out");
            localStorage.removeItem('user-email');
            $state.go('login');
        };

        return vm;
    };
})();
