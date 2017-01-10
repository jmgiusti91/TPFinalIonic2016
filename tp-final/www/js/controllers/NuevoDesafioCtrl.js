angular.module('app.controllers')

.controller('NuevoDesafioCtrl', function($scope, $state, $rootScope, User, SrvFirebase) {

  $scope.desafio = {};

  var userId = firebase.auth().currentUser.uid;

  $scope.GenerarDesafio = function(){

    if($scope.desafio.creditos <= parseInt(User.getCreditos())){

      User.setCreditos(parseInt(User.getCreditos()) - $scope.desafio.creditos);
      SrvFirebase.RefUsuario(User.getUid()).set({
        uid: User.getUid(),
        email: User.getEmail(),
        foto : User.getFoto(),
        creditos: User.getCreditos()
      });

      $scope.desafio.queHago = "alta";
      $rootScope.desafio = $scope.desafio;


      alert("desafio generado");

      $state.go('app.desafios');
    } else {
      alert("No tienes creditos suficientes");
    }
  }

})