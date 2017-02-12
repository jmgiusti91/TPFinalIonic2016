angular.module('app.controllers')

.controller('DetalleDesafioCtrl', function($scope, $stateParams, $timeout, $state, SrvFirebase, User, ionicMaterialMotion, ionicMaterialInk){

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

  $scope.ver = true; //Deshabilita boton 'Aceptar Desafio'

  $scope.desafio = {};

  $scope.usuarioDesafiante = {};

  $scope.usuarioOriginante = {};

  $scope.desafio = $stateParams.Detalle;

  if (User.getUid() == $scope.desafio.uid || $scope.desafio.instancia == "Aceptado") {
        $scope.ver = false;
    };

    if (User.isAdmin()) {
        $scope.admin = true;
        $scope.ver = false;
        TraerUsuarios();
    };

    function TraerUsuarios() {
        SrvFirebase.RefUsuario($scope.desafio.uidDesafiante).once('value').then(function (snapshot){
            $scope.usuarioDesafiante = snapshot.val();
        })
    }

  $scope.AceptarDesafio = function(){

    if(parseInt($scope.desafio.creditos) <= parseInt(User.getCreditos())) {
        console.log($scope.desafio.did);

        $scope.desafio.instancia = "Aceptado";

        var updates = {};
        updates['/instancia/'] = $scope.desafio.instancia;
        updates['/uidDesafiante'] = User.getUid();

        SrvFirebase.RefDesafio($scope.desafio.did).update(updates);

        User.setCreditos(parseInt(User.getCreditos()) - $scope.desafio.creditos);
        SrvFirebase.GastarCreditos($scope.desafio.creditos, User.getUid());


        $state.go('app.desafios');
    } else {
        alert("No tienes creditos suficientes para aceptar el desafio");
    }

  }


  $scope.GanaOriginante = function(){

    $scope.desafio.instancia = "Finalizado";
    $scope.desafio.ganador = $scope.desafio.uid;
    $scope.desafio.perdedor = $scope.desafio.uidDesafiante;
    $scope.desafio.mensaje = "Has Ganado";

    var updates = {
        instancia: $scope.desafio.instancia,
        ganador:   $scope.desafio.ganador,
        perdedor:  $scope.desafio.perdedor
    };

    SrvFirebase.RefDesafio($scope.desafio.did).update(updates);

    var actualizGanador = {
        historial: $scope.desafio
    };

    SrvFirebase.RefUsuario($scope.desafio.uid).update(actualizGanador);

    $scope.desafio.mensaje = "Has perdido";

    var actualizPerdedor = {
        historial: $scope.desafio
    };
    
    SrvFirebase.RefUsuario($scope.desafio.uidDesafiante).update(actualizPerdedor);

    SrvFirebase.GanarCreditos(parseInt(parseInt($scope.desafio.creditos) * 2), $scope.desafio.uid);

    $state.go('app.desafios');

  }

  $scope.GanaDesafiante = function(){
    $scope.desafio.instancia = "Finalizado";
    $scope.desafio.ganador = $scope.desafio.uidDesafiante;
    $scope.desafio.perdedor = $scope.desafio.uid;
    $scope.desafio.mensaje = "Has Ganado";

    var updates = {
        instancia: $scope.desafio.instancia,
        ganador: $scope.desafio.ganador,
        perdedor: $scope.desafio.perdedor
    };

    SrvFirebase.RefDesafio($scope.desafio.did).update(updates);

    var actualizGanador = {
        historial: $scope.desafio
    };

    SrvFirebase.RefUsuario($scope.desafio.uidDesafiante).update(actualizGanador);

    $scope.desafio.mensaje = "Has Perdido";

    var actualizPerdedor = {
        historial: $scope.desafio
    };

    SrvFirebase.RefUsuario($scope.desafio.uid).update(actualizPerdedor);

    SrvFirebase.GanarCreditos(parseInt(parseInt($scope.desafio.creditos) * 2), $scope.desafio.uidDesafiante);
  
    $state.go('app.desafios');
    
  }



})