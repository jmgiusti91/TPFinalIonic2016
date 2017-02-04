angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, SrvFirebase, $ionicPopover, $ionicPopup, $ionicPush, $timeout, $state, $ionicHistory, $rootScope, User) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  /*Comienzo animacion*/

    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    $rootScope.imgUser = 'img/unknown.jpg';
    $rootScope.nombreUser = "";
    $scope.isLogin = false;
    $scope.isAdmin = false;
    $scope.batallaUidOriginante = "";
    $scope.batallaUidDesafiado = "";
    $scope.batallaCreditos = 0;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.setLogin = function(bool){
      $scope.isLogin = bool;
    }

    $scope.setAdmin = function(bool){
      $scope.isAdmin = bool;
    }

    $scope.setUidOriginante = function(uid){
      $scope.batallaUidOriginante = uid;
      console.log("uid originante: ", $scope.batallaUidOriginante);
    }

    $scope.setUidDesafiado = function(uid){
      $scope.batallaUidDesafiado = uid;
      console.log("uid desafiado: ", $scope.batallaUidDesafiado);
    }

    $scope.setBatallaCreditos = function(cred){
      $scope.batallaCreditos = parseInt(cred);
      console.log("creditos: ", $scope.batallaCreditos);
    }

    /*Fin animacion*/

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.varLog = false;
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
    } else {
      $scope.varLog = true;
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.login');
    }
  });

  $scope.Desloguear = function(){
    SrvFirebase.RefUsuario(User.getUid()).once('value').then(function (snapshot){
      snapshot.ref.update({
        isOnline: false
      });
      $rootScope.imgUser = 'img/unknown.jpg';
      $rootScope.nombreUser = "";
      User.clean();
      $scope.setLogin(false);
      firebase.auth().signOut();
      $timeout(function(){
      $scope.habilitado = true;
      $rootScope.token = "";
    })
      /*$ionicHistory.nextViewOptions({
          disableBack: true
      });
      $state.go('app.inicio');*/
    })

  }


  $scope.$on('cloud:push:notification', function(event, data) {
      var msg = data.message;
      //console.log(JSON.stringify(data));
      console.log("data.message: ", JSON.stringify(data.message));
      if (msg.title == "Desafios") {
        var alertPopup = $ionicPopup.alert({
           title: msg.title,
           template: msg.text
        });
      };

      if (msg.title == "Batalla") {

        console.log(data.message.raw.additionalData.notId);

        var time = data.message.raw.additionalData.notId;

        console.log(time); 

        var JSONbid = {};
        JSONbid = JSON.parse(JSON.stringify(data.message.raw.additionalData.payload)); //Obtengo el bid pasado por paremetro.
        //console.log("bid: ", bid);

        var timeBatalla = "";

        SrvFirebase.RefBatalla(JSONbid.bid).child('time').once('value').then(function (snap){
          timeBatalla = snap.val();
          console.log(timeBatalla);

          if (time == timeBatalla) {

            var confirmPopup = $ionicPopup.confirm({
              title: msg.title,
              template: msg.text
            });
            var JSONbatalla = {};
             confirmPopup.then(function(res) {
               if(res) {
                 console.log("JSONbid: ", JSONbid);
                 SrvFirebase.RefBatalla(JSONbid.bid).once('value').then(function (snapshot){
                    SrvFirebase.GastarCreditos(parseInt(snapshot.val().creditos), snapshot.val().uidOriginante);
                    SrvFirebase.GastarCreditos(parseInt(snapshot.val().creditos), snapshot.val().uidDesafiado);
                    snapshot.ref.update({
                      estado: "Aceptado"
                    });
                    JSONbatalla.bid = JSONbid.bid;
                    JSONbatalla.uidOriginante = snapshot.val().uidOriginante;
                    JSONbatalla.uidDesafiado = snapshot.val().uidDesafiado;
                    JSONbatalla.creditos = snapshot.val().creditos;
                    var bid = JSON.stringify(JSONbatalla);
                    $state.go("app.batalla", {datosBatalla: bid});
                 });
               } else {
                 console.log('You are not sure');
               }
             });

             SrvFirebase.RefBatalla(JSONbid.bid).on('value', function (snapshot){
                if (snapshot.val().estado == "Abandonado") {
                  confirmPopup.close();
                  var alertPopup = $ionicPopup.alert({
                    title: "Tiempo Agotado",
                    template: "La batalla fue cancelada por superar el tiempo de espera para su confirmacion"
                  });
                };
             });


          };

        });

        
      };
      
  });


})