angular.module('app.controllers')

.controller('RegistroCtrl', function($scope, $state, User, SrvFirebase){

  $scope.registerData = {};
  $scope.Registrar = function(){
    firebase.auth().createUserWithEmailAndPassword($scope.registerData.mail, $scope.registerData.password).catch(function (error){
      console.info("error", error);
    }).then(function (respuesta){
      console.info("respuesta", respuesta);
    User.login(respuesta.uid, respuesta.email, 1000, "img/unknown.jpg", "img/background-login-min.jpg", $scope.registerData.username, false);
    SrvFirebase.RefUsuarios().child(respuesta.uid).set({
		uid: User.getUid(),
		nombre: User.getNombre(),
		email: User.getEmail(),
		creditos: User.getCreditos(),
		foto: User.getFoto(),
		fotoPortada: User.getFotoPortada(),
		soyAdmin: User.isAdmin()      	
    })
      $state.go('app.home');
    })
  }
})