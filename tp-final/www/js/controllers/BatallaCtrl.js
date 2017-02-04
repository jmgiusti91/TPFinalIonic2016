angular.module('app.controllers')

.controller('BatallaCtrl', function($scope, $ionicHistory, $timeout, $ionicPopup, $ionicNavBarDelegate, $stateParams, $state, $rootScope, User, SrvFirebase) {
 

    $ionicNavBarDelegate.showBackButton(false);

    var datosBatalla = JSON.parse($stateParams.datosBatalla);

    datosBatalla.posUno = "";
    datosBatalla.posDos = "";

    var time;

    console.log(JSON.stringify(datosBatalla));

    $scope.comenzo = false;

    $scope.turno = false;

    SrvFirebase.RefBatalla(datosBatalla.bid).on('value', function (snapshot){

            console.log("Escucho la batalla");

            console.log(snapshot.val());

            if (snapshot.val().estado == "Finalizado") {
                var alertPopup;
                if (snapshot.val().ganador == "Originante") {
                    if (User.getUid() == datosBatalla.uidOriginante) {
                        alertPopup = $ionicPopup.alert({
                            title: "Felicitaciones",
                            template: "Has hundido el barco de tu enemigo"
                        });
                    } else {
                        alertPopup = $ionicPopup.alert({
                            title: "Maldicion!",
                            template: "Han hundido tu barco."
                        })
                    }
                };

                if (snapshot.val().ganador == "Desafiado") {
                    if (User.getUid() == datosBatalla.uidDesafiado) {
                        alertPopup = $ionicPopup.alert({
                            title: "Felicitaciones",
                            template: "Has hundido el barco de tu enemigo"
                        });
                    } else {
                        alertPopup = $ionicPopup.alert({
                            title: "Maldicion!",
                            template: "Han hundido tu barco."
                        })
                    }
                };

                alertPopup.then(function (res){
                    $ionicNavBarDelegate.showBackButton(true);
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go("app.home");
                });

            };

            if (snapshot.val().estado == "Aceptado") {
                window.clearTimeout(time);
            };

            if (snapshot.val().estado == "Abandonado") {

                SrvFirebase.GanarCreditos(parseInt(datosBatalla.creditos), snapshot.val().uidDesafiado);
                SrvFirebase.GanarCreditos(parseInt(datosBatalla.creditos), snapshot.val().uidOriginante);

                var alertPopup = $ionicPopup.alert({
                   title: "Tiempo agotado",
                   template: "Tu oponente no confirmo la batalla. Tiempo de espera agotado"
                });

                alertPopup.then(function (res){
                    $ionicNavBarDelegate.showBackButton(true);
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go("app.home");
                });
            };

            if (snapshot.val().posUno != "" && snapshot.val().posDos != "") {
                $timeout(function (){
                    datosBatalla.posUno = snapshot.val().posUno;
                    datosBatalla.posDos = snapshot.val().posDos;
                    $scope.comenzo = true;
                });

            };

            if (snapshot.val().turno == "jugDos") {
                if (User.getUid() == datosBatalla.uidDesafiado) {
                    $timeout(function (){
                        $scope.turno = true;
                    });
                };

                if (User.getUid() == datosBatalla.uidOriginante) {
                    $timeout(function (){
                        $scope.turno = false;
                    });
                };
            };

            if (snapshot.val().turno == "jugUno") {
                if (User.getUid() == datosBatalla.uidOriginante) {
                    $timeout(function (){
                        $scope.turno = true;
                    });
                };

                if (User.getUid() == datosBatalla.uidDesafiado) {
                    $timeout(function (){
                        $scope.turno = false;
                    })
                };
            };

        })

    $scope.$on('$ionicView.enter', function(e) {   
    	
    	time = window.setTimeout(function(){

    		SrvFirebase.RefBatalla(datosBatalla.bid).once('value').then(function (snapshot){
    			if (snapshot.val().estado == "Generado") {
    				snapshot.ref.update({
    					estado: "Abandonado"
    				});
    			};
    		});

    	}, 120000);

    });

    $scope.ElegirPosicion = function (posicion){

        if (User.getUid() == datosBatalla.uidOriginante) {

            var updates = {
                posUno: posicion
            };

            SrvFirebase.RefBatalla(datosBatalla.bid).update(updates);

            var alertPopup = $ionicPopup.alert({
                title: "Exito",
                template: "La posicion que eligio fue " + posicion
            });

        };

        if (User.getUid() == datosBatalla.uidDesafiado) {

            var updates = {
                posDos: posicion,
                turno: "jugDos"
            };

            SrvFirebase.RefBatalla(datosBatalla.bid).update(updates);

            var alertPopup = $ionicPopup.alert({
                title: "Exito",
                template: "La posicion que eligio fue " + posicion
            });

        };

    }

    $scope.ElegirAtaque = function (ataque){
        
        if (User.getUid() == datosBatalla.uidOriginante) {

            console.log(ataque);
            console.log(datosBatalla.posDos);

            if (ataque == datosBatalla.posDos) {

                SrvFirebase.GanarCreditos((parseInt(datosBatalla.creditos) * 2), datosBatalla.uidOriginante);

                var alertPopup = $ionicPopup.alert({
                    title: "Exito",
                    template: "Has ganado la partida."
                });
                
                alertPopup.then(function (res){
                    var updates = {
                        estado: "Finalizado",
                        ganador: "Originante"
                    }
                    SrvFirebase.RefBatalla(datosBatalla.bid).update(updates);
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: "Sigue intentando",
                    template: "No has logrado acertar."
                });

                alertPopup.then(function (res){
                    var updates = {
                        turno: "jugDos"
                    };
                    SrvFirebase.RefBatalla(datosBatalla.bid).update(updates);
                });
            }

        };

        if (User.getUid() == datosBatalla.uidDesafiado) {

            console.log(ataque);
            console.log(datosBatalla.posUno);

            if (ataque == datosBatalla.posUno) {

                SrvFirebase.GanarCreditos((parseInt(datosBatalla.creditos) * 2), datosBatalla.uidDesafiado);

                var alertPopup = $ionicPopup.alert({
                    title: "Exito",
                    template: "Has ganado la partida."
                });
                
                alertPopup.then(function (res){
                    var updates = {
                        estado: "Finalizado",
                        ganador: "Desafiado"
                    }
                    SrvFirebase.RefBatalla(datosBatalla.bid).update(updates);
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: "Sigue intentando",
                    template: "No has logrado acertar."
                });

                alertPopup.then(function (res){
                    var updates = {
                        turno: "jugUno"
                    };
                    SrvFirebase.RefBatalla(datosBatalla.bid).update(updates);
                });
            }

        };

    };
});