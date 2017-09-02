(function () {
    'use strict';
    /**
     * Load states for application
     */
    module.exports = function ($stateProvider, $urlRouterProvider) {
        // any unknown URLS go to 404
        $urlRouterProvider.otherwise('/404');
        // no route goes to index
        $urlRouterProvider.when('', '/');
        // use a state provider for routing
        $stateProvider
            .state('home', {
                url:'/home',
                resolve: {
                    user: function($http) {
                        return $http.get('http://localhost:8081/getJSON');
                    }
                },
                templateUrl: 'src/html/home/home.view.html',
                controller: "homeController",
                controllerAs: 'home' 
            })
            .state('home.home', {
                url:'/home',
                resolve: {
                    user: function($http) {
                        return $http.get('http://localhost:8081/getJSON');
                    }
                },
                templateUrl: 'src/html/home/home.view.html',
                controller: "homeController",
                controllerAs: 'home' 
            })
            .state('loader', {
                url:'/loader',
                template: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader"></i><span class="sr-only">Loading...</span>'
            })
            .state('404', {
                url:'/404',
                templateUrl: 'src/html/404/404.html'
            })
            ;		
    };
})();