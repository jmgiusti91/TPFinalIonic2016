angular.module('app.controllers')

.controller('NuevoDesafioCtrl', function($scope, $state, $rootScope, User, SrvFirebase) {

  $scope.desafio = {};

  var userId = firebase.auth().currentUser.uid;

  $scope.GenerarDesafio = function(){

    if($scope.desafio.creditos <= parseInt(User.getCreditos())){

      User.setCreditos(parseInt(User.getCreditos()) - $scope.desafio.creditos);
      SrvFirebase.GastarCreditos($scope.desafio.creditos, User.getUid());
      /*var updates = {
        creditos: User.getCreditos()
      }
      SrvFirebase.RefUsuario(User.getUid()).update(updates);*/

      $scope.desafio.queHago = "alta";
      $rootScope.desafio = $scope.desafio;


      alert("desafio generado");

      $state.go('app.desafios');
    } else {
      alert("No tienes creditos suficientes");
    }
  }

})