// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ionic.cloud', 'app.controllers', 'ngCordova', 'firebase', 'ionic.native', 'app.services', 'ionic-material', 'ionMdInput'])

.run(function($ionicPlatform, $rootScope) {
  $rootScope.desafio = {};
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicCloudProvider) {


  $ionicCloudProvider.init({
    "core": {
      "app_id": "e6256981"
    },
    "push": {
      "sender_id": "630205633611",
      "pluginConfig": {
        "ios": {
          "badge": true,
          "sound": true
        },
        "android": {
          "iconColor": "#343434"
        }
      }
    }
  });
  
  $ionicConfigProvider.views.maxCache(0);
  //var appID = 330666343961057;
  //var version = "v2.0"; // or leave blank and default is v2.0
  //$cordovaFacebookProvider.browserInit(appID, version);

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url:'/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      },
      'fabContent': {
                template: ''
            } 
    }
  })

  .state('app.registro', {
      url: '/login/registro',
      views: {
        'menuContent': {
          templateUrl: 'templates/registro.html',
          controller: 'RegistroCtrl'
        }, 
        'fabContent': {
                template: ''
            }
      }
    })

  .state('app.desafios', {
    url: '/desafios',
    views: {
      'menuContent': {
        templateUrl: 'templates/desafios.html',
        controller: 'DesafiosCtrl'
      },
      'fabContent': {
                template: '<button id="nvo-desafio" class="button button-fab button-fab-top-right expanded button-energized-900 flap" ng-click="NuevoDesafio()" ng-hide="admin"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout, $state, $scope) {
                    $scope.admin = $scope.$parent.isAdmin;
                    if (!$scope.admin) {
                      $timeout(function () {
                        document.getElementById('nvo-desafio').classList.toggle('on');
                        $scope.NuevoDesafio = function(){
                          document.getElementById('nvo-desafio').classList.toggle('off');
                          $state.go('app.nvo-desafio');
                        }
                      }, 200);
                    };
                }
        }
    }
  })
  .state('app.nvo-desafio', {
    url: '/desafios/nuevo',
    views: {
      'menuContent': {
        templateUrl: 'templates/nuevo-desafio.html',
        controller: 'NuevoDesafioCtrl'
      },
      'fabContent': {
                template: '<button id="nvo-desafio-help" class="button button-fab button-fab-top-right expanded button-energized-900 flap" ng-click="NuevoDesafioHelp()"><i class="icon ion-help"></i></button>',
                controller: function ($timeout, $state, $scope, $ionicPopover) {
                    $timeout(function () {
                        document.getElementById('nvo-desafio-help').classList.toggle('on');
                        $scope.NuevoDesafioHelp = function(){
                          var template =  '<ion-popover-view style="margin-top:60px">' +
                                          '   <ion-header-bar>' +
                                          '       <h1 class="title" style="color:#000">Ayuda</h1>' +
                                          '   </ion-header-bar>' +
                                          '   <ion-content class="padding">' +
                                          '       Descripcion: En este campo debe explicar en que consistira su desafio<br> ' +
                                          '       Creditos: Aqui debe especificar la cantidad de creditos que apostara.<br>' +
                                          '       Nota: Los creditos le seran descontados una vez generado el desafio. Si' +
                                          '       gana se le devolvera el doble, si el desafio queda expirado se le devolvera' +
                                          '       lo apostado y si pierde no habra cambios.' +  
                                          '<button class="button button-block button-assertive btn-log-off" ng-click="Cerrar()">Cerrar</button>' + 
                                          '   </ion-content>' +
                                          '</ion-popover-view>';
                          $scope.popover = $ionicPopover.fromTemplate(template, {
                              scope: $scope
                          });
                          $scope.popover.show();
                        }
                        $scope.Cerrar = function(){
                          $scope.popover.hide();
                        }
                        $scope.$on('$destroy', function() {
                            $scope.popover.remove();
                        });
                    }, 200);
                }
        }
    }
  })
  .state('app.detalle-desafio', {
    url: '/desafios/detalle',
    params:{
      Detalle: null,
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/detalle-desafio.html',
        controller: 'DetalleDesafioCtrl'
      },
      'fabContent': {
                template: ''
            } 
    }
  })

  .state('app.nva-batalla', {
    url: '/nuevaBatalla',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/nueva-batalla.html',
        controller: 'NuevaBatallaCtrl'
      },
      'fabContent': {
                template: '<button id="nva-batalla-help" class="button button-fab button-fab-top-right expanded button-energized-900 flap" ng-click="NuevaBatallaHelp()"><i class="icon ion-help"></i></button>',
                controller: function ($timeout, $state, $scope, $ionicPopover) {
                    $timeout(function () {
                        document.getElementById('nva-batalla-help').classList.toggle('on');
                        $scope.NuevaBatallaHelp = function(){
                          var template =  '<ion-popover-view style="margin-top:60px">' +
                                          '   <ion-header-bar>' +
                                          '       <h1 class="title" style="color:#000">Ayuda</h1>' +
                                          '   </ion-header-bar>' +
                                          '   <ion-content class="padding">' +
                                          '       Creditos: Aqui debe especificar la cantidad de creditos que apostara.<br>' +
                                          '       Combo Box: Aqui debe elegir a su oponente. Solo Aparecen los usuarios online.<br> ' +
                                          '       Nota: Los creditos le seran descontados una vez generada la batalla. Si' +
                                          '       gana se le devolvera el doble y si pierde no habra cambios.' + 
                                          '<button class="button button-block button-assertive btn-log-off" ng-click="Cerrar()">Cerrar</button>' + 
                                          '   </ion-content>' +
                                          '</ion-popover-view>';
                          $scope.popover = $ionicPopover.fromTemplate(template, {
                              scope: $scope
                          });
                          $scope.popover.show();
                        }
                        $scope.Cerrar = function(){
                          $scope.popover.hide();
                        }
                        $scope.$on('$destroy', function() {
                            //$scope.popover.remove();
                        });
                    }, 200);
                }
        }
    }
  })


  .state('app.batalla', {
    url: '/nuevaBatalla/batalla/:datosBatalla',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/batalla.html',
        controller: 'BatallaCtrl'
      }, 
      'fabContent': {
              template: ''
        }
    }
  })

  .state('app.home', {
      url: '/home',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        },
        'fabContent': {
                template: ''
          }
      }
    })

  .state('app.perfil', {
      url: '/perfil',
      views: {
        'menuContent': {
          templateUrl: 'templates/perfil.html',
          controller: 'PerfilCtrl'
        },
        'fabContent': {
                template: ''
          }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
})

.directive('ngLastRepeat', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngLastRepeat'+ (attr.ngLastRepeat ? '.'+attr.ngLastRepeat : ''));
                });
            }
        }
    };
});
