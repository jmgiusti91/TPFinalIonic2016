/*
	ACA GUARDO UN OPONENTE EN EL JSON BATALLA.OPONENTE, SOLO PARA INICIALIZAR
	EL SELECT CON UN VALOR...
	LUEGO ACTUALIZO SOLO EL UID EN BASE A LO SELECCIONADO POR EL USUARIO,
	POR LO QUE ME QUEDA EL OBJETO JSON DE LA INICIALIZACION CON UN UID DISTINTO
	(EL SELECCIONADO POR EL USUARIO).
	ATENCION: EN LA FUNCION GENERARBATALLA() UTILIZAR SOLO EL ATRIBUTO UID
	DEL OBJETO BATALLA.OPONENTE
*/

angular.module('app.controllers')

.controller('NuevaBatallaCtrl', function($scope, $state, $rootScope, User, SrvFirebase) {

	$scope.batalla = {};
	$scope.listadoOponentes = [];
	$scope.oponente = {};
    var fechaTime;

	$scope.$on('$ionicView.enter', function(e) {
    	SrvFirebase.RefUsuarios().orderByChild('nombre').on('child_added', function (snapshot){

    		if (snapshot.val().isOnline && snapshot.val().uid != User.getUid()) {
    			$scope.batalla.oponente = snapshot.val();
	    		//console.log("var batalla.oponente: ", JSON.stringify($scope.batalla.oponente));
	    		$scope.listadoOponentes.push(snapshot.val());
	    	};
    	})

    	/*$scope.$on('ngLastRepeat.mylist',function(e) {
            $scope.batalla.oponente = $scope.oponente;
            console.log("var batalla.oponente: ", JSON.stringify($scope.batalla.oponente));
    	});*/
  	});

	$scope.GenerarBatalla = function(){
        var d = new Date();
        fechaTime = d.getTime();
		console.log("Oponente elegido: " + JSON.stringify($scope.batalla.oponente.uid));
		console.log("Dinero a apostar: " + $scope.batalla.creditos);
		for(var i = 0; i < $scope.listadoOponentes.length; i++){
			if ($scope.listadoOponentes[i].uid == $scope.batalla.oponente.uid) {
				if ($scope.listadoOponentes[i].creditos < $scope.batalla.creditos) {
					alert("El oponente elegido no tiene creditos suficientes para apostar.");
					return;
				};
			};
		};
		if (User.getCreditos() < $scope.batalla.creditos) {
			alert("No tienes creditos suficientes para esta apuesta");
			return;
		};
		//$scope.$parent.setUidOriginante(User.getUid());
    	//$scope.$parent.setUidDesafiado($scope.batalla.oponente.uid);
    	//$scope.$parent.setBatallaCreditos($scope.batalla.creditos);
    	SrvFirebase.RefBatallas().push({
    		uidOriginante: User.getUid(),
    		uidDesafiado: $scope.batalla.oponente.uid,
    		creditos: $scope.batalla.creditos,
    		estado: "Generado",
            posUno: "",
            posDos: "",
            turno: "",
            ganador: "",
            time: "" + fechaTime
    	});

    	SrvFirebase.RefBatallas().limitToLast(1).on('child_added', function (data){
    		data.ref.update({
    			bid: data.key
    		})
    		var JSONbatalla = {};
    		JSONbatalla.bid = data.key;
            JSONbatalla.uidOriginante = User.getUid();
            JSONbatalla.uidDesafiado = $scope.batalla.oponente.uid;
            JSONbatalla.creditos = $scope.batalla.creditos;
    		var bid = JSON.stringify(JSONbatalla);
            console.log(fechaTime);
    		SrvFirebase.RefUsuario($scope.batalla.oponente.uid).once('value').then(function (snapshot){
    			SrvFirebase.EnviarNotificacionBatalla(snapshot.val().pushToken, User.getNombre(), $scope.batalla.creditos, data.key, fechaTime);
    			$state.go("app.batalla", {datosBatalla: bid});
    		});
    	});
    	
	}


})