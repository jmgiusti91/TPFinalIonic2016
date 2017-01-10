angular.module('app.controllers')

.controller('LoginCtrl', function($scope, $ionicHistory, $state, $timeout, $ionicSideMenuDelegate, $location, User, SrvFirebase){

  // hide-nav-bar="true"

  $scope.loginData = {};

  $scope.loginData.username = "jmgiusti91@gmail.com";
  $scope.loginData.password = "123456";
  $scope.habilitado = true;

  $scope.$on('$ionicView.enter', function(e) {
    $scope.habilitado = true;
  });

  $scope.Loguear = function(){
    $scope.habilitado = false;
    firebase.auth().signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password).catch(function (error){
      $scope.varLog = true;
      $scope.habilitado = true;
      if(error.code === "auth/user-not-found"){
        alert("No estas registrado");
      }

      if(error.code === "auth/wrong-password"){
        alert("La contraseña es incorrecta");
      }
      console.log("error", error);
    }).then(function (respuesta){
      $timeout(function(){
        if(respuesta){
          $scope.varLog = false;
          console.log(respuesta.emailVerified);
          $scope.verificado = respuesta.emailVerified;
          
          var userId = firebase.auth().currentUser.uid;

          //console.log(firebase.auth().currentUser);

          $timeout(function(){
            SrvFirebase.RefUsuario(userId).once('value').then(function(snapshot) {
              console.log(snapshot.val());
              User.login(snapshot.val().uid, snapshot.val().email, snapshot.val().creditos, snapshot.val().foto, snapshot.val().fotoPortada, snapshot.val().nombre, snapshot.val().soyAdmin);
              $state.go('app.home');
            }).catch(function (error){

              /*User.login(firebase.auth().currentUser.uid, firebase.auth().currentUser.email, 1000, "img/unknown.jpg", false);
              
              SrvFirebase.RefUsuario(userId).set({
                uid: userId,
                email: User.getEmail(),
                foto: User.getFoto(),
                creditos: User.getCreditos(),
                soyAdmin: User.isAdmin()
              });*/
              console.log("error", error);
            });

          })
        }
        
      })
    })
  }

  $scope.Registrar = function(){
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $state.go('app.registro');
  }

  $scope.Olvide = function(){
    if($scope.loginData.username != ""){
        firebase.auth().sendPasswordResetEmail($scope.loginData.username).then(function (respuesta){
        console.info("respuestaOlvide", respuesta);
      }).catch(function (error){
        console.info("errorOlvide", error);
      })
    } else {
      alert("Ingrese un mail valido en el campo Username");
    }
  }

})