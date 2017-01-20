angular.module('app.controllers')

.controller('HomeCtrl', function($scope, $rootScope, $ionicPush, $ionicSideMenuDelegate, $timeout, $ionicHistory, User, SrvFirebase, ionicMaterialMotion, ionicMaterialInk){

  /*COMIENZO ANIMACION*/

    $scope.usuario = {};

    $scope.usuario.fotoPortada = User.getFotoPortada();
    $scope.usuario.fotoPerfil = User.getFoto();
    $scope.usuario.nombre = User.getNombre();
    $scope.usuario.email = User.getEmail();
    $scope.admin = User.isAdmin();

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
  /*FIN ANIMACION*/

  $scope.$on('$ionicView.enter', function(e) {

    $scope.usuario.fotoPortada = User.getFotoPortada();
    $scope.usuario.fotoPerfil = User.getFoto();
    
  });

  $scope.PushNotification = function(){
    console.log($rootScope.token);
    SrvFirebase.EnviarNotificacion(); //En ionic push param $rootScope.token
    alert("Notificacion Enviada");
  }

  /*$scope.$on('cloud:push:notification', function(event, data) {
      var msg = data.message;
      alert(msg.title + ': ' + msg.text);
   });*/

})