(function () {
    'use strict';
    module.exports = function ($scope,$state) {

        var vm = this;
        
        var refreshTest = function () {
            if(localStorage.getItem('user-email')!==null)
                $state.go('home.dashboard');
            console.log("Login Screen ||| "+new Date(currentTime));
        };
        refreshTest();

        $scope.site_name = "MySite";

        var currentTime = Date.now();

        var printPwd = function(str){
            var x = "";
            for(var i=0;i<str.length;i++){
                x+="*";
            }
            return x;
        };

        vm.login = function(user){
            console.log("Email :",user.email);
            console.log("Password :",printPwd(user.pwd));
            // console.log("isLogin :",user.isLogin);
            // if((user.email==='sauravat105@gmail.com' && user.pwd==='Sep01@') || true){
                if(user.email==='sauravat105@gmail.com' && user.pwd==='Sep01@'){
                localStorage.setItem('user-email',user.email);
                $state.go('home.dashboard');
            }
        };
        
        return vm;
    };
})();