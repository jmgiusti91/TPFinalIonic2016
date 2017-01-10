angular.module('app.controllers')

.controller('DetalleDesafioCtrl', function($scope, $stateParams, $timeout, $state, SrvFirebase, ionicMaterialMotion, ionicMaterialInk){

	/*Comienzo animacion */
	$scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
	/*Fin animacion*/

  $scope.desafio = {};

  $scope.desafio = $stateParams.Detalle;

  

  $scope.AceptarDesafio = function(){
    console.log($scope.desafio.did);

    $scope.desafio.instancia = "Aceptado";

    var updates = {};
    updates['/instancia/'] = $scope.desafio.instancia;

    SrvFirebase.RefDesafio($scope.desafio.did).update(updates);

    $state.go('app.desafios');

  }

})