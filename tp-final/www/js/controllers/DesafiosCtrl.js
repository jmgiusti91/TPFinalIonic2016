angular.module('app.controllers')

.controller('DesafiosCtrl', function($scope, $state, $timeout, $rootScope, User, SrvFirebase, ionicMaterialMotion, ionicMaterialInk) {

	/*COMIENZO ANIMACION*/
	  $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');

    /*$timeout(function (){
    	$scope.$on('ngLastRepeat.mylist',function(e) {
            $timeout(function() {
		        ionicMaterialMotion.fadeSlideInRight({
		            startVelocity: 3000
		        });
		    }, 700);

		    // Activate ink for controller
		    ionicMaterialInk.displayEffect();
    	});
    })*/
    

	/*FIN ANIMACION*/

  $scope.$on('$ionicView.enter', function(e) {


  	$scope.$on('ngLastRepeat.mylist',function(e) {
            $timeout(function() {
		        ionicMaterialMotion.fadeSlideInRight({
		            startVelocity: 3000
		        });
		    }, 700);

		    // Activate ink for controller
		    ionicMaterialInk.displayEffect();
    });

    var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    var years = days * 365;
    var d = new Date();
    var t = d.getTime();
    $scope.desafios = {};
    $scope.listadoDesafios = [];
    $scope.desafioDeListado = {};

    var y = Math.round(t / days);

    $scope.desafio = $rootScope.desafio;
    $scope.usuario = {};

    console.log($scope.desafio);

    if ($scope.desafio.queHago == "alta") {

      $rootScope.desafio.queHago = "nada";

      $scope.desafio.fechaCreacion = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
      $scope.desafio.fechaExpiracion = (d.getDate() + 2) + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

      var y = Math.round(t / days);

      $scope.desafio.fechaInicio = y;
      $scope.desafio.fechaFinal = y + 2;
      $scope.desafio.instancia = "Generado";

      SrvFirebase.RefDesafios().push({
        descripcion: $scope.desafio.descripcion,
        creditos: $scope.desafio.creditos,
        fechaCreacion : $scope.desafio.fechaCreacion,
        fechaExpiracion: $scope.desafio.fechaExpiracion,
        fechaInicio: $scope.desafio.fechaInicio,
        fechaFinal: $scope.desafio.fechaFinal,
        instancia: $scope.desafio.instancia,
        uid: User.getUid(),
        nombreUsuario: User.getNombre(),
        emailUsuario: User.getEmail()
      });

      SrvFirebase.RefDesafios().on('child_added', function (data){
        $scope.desafio.did = data.key;
      });

      var updates = {};
      updates['/did/'] = $scope.desafio.did;

      SrvFirebase.RefDesafio($scope.desafio.did).update(updates);

      $scope.desafio.queHago = "nada";

    };


    SrvFirebase.RefDesafios().on('child_added', function (snapshot) {

      $scope.desafios = snapshot.val(); //Para obtener referencia aca, fijarse si se puede poner esto a la escucha del child_added, asi cuando agrego un desafio en el ctrl de 'NuevoDesafio', tomo lo agregado alli desde este controller tambien.

      //console.log(snapshot.key);

      //console.log($scope.desafios);

      if (y >= $scope.desafios.fechaFinal){

        if ($scope.desafios.instancia == "Generado") {
          $scope.desafios.instancia = "Expirado";
        };

        /*if ($scope.desafios.instancia == "Aceptado") {
          $scope.desafios.instancia = "Finalizado";
        };*/

        var updates = {};
        updates['/instancia/'] = $scope.desafios.instancia;

         SrvFirebase.RefDesafio($scope.desafios.did).update(updates);
      } else {

        //console.log($scope.desafios.did);
        SrvFirebase.RefDesafio($scope.desafios.did)
        .once('value', function (snapshot){
          //console.log(snapshot.val());
          if (snapshot.val() != null) {
            if (!User.isAdmin()) {
              if (snapshot.val().instancia == "Generado" || snapshot.val().instancia == "Aceptado") {
                SrvFirebase.RefUsuario(snapshot.val().uid).child("foto").once('value', function (snap){
                  $scope.desafioDeListado = snapshot.val();
                  $scope.desafioDeListado.imgUser = snap.val();
                  $scope.listadoDesafios.push($scope.desafioDeListado);
                  console.log("Generado y Aceptado"); 
                })
              };
            } else {
              if (snapshot.val().instancia == "Aceptado") {
                SrvFirebase.RefUsuario(snapshot.val().uid).child("foto").once('value', function (snap){
                  $scope.desafioDeListado = snapshot.val();
                  $scope.desafioDeListado.imgUser = snap.val();
                  $scope.listadoDesafios.push($scope.desafioDeListado);
                  console.log("Solo Aceptado"); 
                })
              };
            }  
          };
        })

      }

    })

  })

  /*$scope.NuevoDesafio = function(){
    $state.go('app.nvo-desafio');
  }*/

})