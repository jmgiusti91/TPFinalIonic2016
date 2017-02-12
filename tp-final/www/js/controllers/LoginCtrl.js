angular.module('app.controllers')

.controller('LoginCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPush, $state, $timeout, $ionicSideMenuDelegate, $location, User, SrvFirebase, $rootScope){

  // hide-nav-bar="true"

  $scope.loginData = {};

  $scope.loginData.username = "jmgiusti91@gmail.com";
  $scope.loginData.password = "123456";
  $scope.habilitado = true;

  $scope.$on('$ionicView.enter', function(e) {
    $scope.habilitado = true;

    if (window.cordova) {
      var options = {
        ignore_user: true
      }
      $ionicPush.register().then(function(t) {
        return $ionicPush.saveToken(t, options);
      }).then(function(t) {
        console.log('Token saved:', t.token);
        $rootScope.token = t.token;
      });
    } else {
      $rootScope.token = "";
    }
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
            /*var options = {
              ignore_user: true
            }
            $ionicPush.register().then(function(t) {
              return $ionicPush.saveToken(t, options);
            }).then(function(t) {
              console.log('Token saved:', t.token);
              $rootScope.token = t.token;
            });*/

            /*if (window.cordova) {
              var options = {
                ignore_user: true
              }
              $ionicPush.register().then(function(t) {
                return $ionicPush.saveToken(t, options);
              }).then(function(t) {
                console.log('Token saved:', t.token);
                $rootScope.token = t.token;
              });
            } else {
              $rootScope.token = "";
            }*/

            SrvFirebase.RefUsuario(userId).once('value').then(function(snapshot) {


              console.log(snapshot.val());
              User.login(snapshot.val().uid, snapshot.val().email, snapshot.val().creditos, snapshot.val().foto, snapshot.val().fotoPortada, snapshot.val().nombre, snapshot.val().soyAdmin);
              console.log(User.getFullData());
              $rootScope.imgUser = User.getFoto(); //Cambio foto y nombre que aparecen en el menu.
              $rootScope.nombreUser = User.getNombre();
              $scope.$parent.setLogin(true);
              $scope.$parent.setAdmin(User.isAdmin());
              snapshot.ref.update({
                pushToken: $rootScope.token,
                isOnline: true
              })
              //console.info("User.isAdmin ", User.isAdmin());
              //console.log($scope.$parent.isAdmin);
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