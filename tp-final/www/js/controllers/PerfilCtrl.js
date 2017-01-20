angular.module('app.controllers')

.controller('PerfilCtrl', function($scope, $timeout, User, SrvFirebase, ionicMaterialMotion, ionicMaterialInk, $ionicPlatform, $cordovaImagePicker, $rootScope, $cordovaFile, $cordovaCamera, $ionicLoading){

	$scope.usuario = {};

    $scope.usuario.fotoPortada = User.getFotoPortada();
    $scope.usuario.fotoPerfil = User.getFoto();
    $scope.usuario.nombre = User.getNombre();
    $scope.usuario.email = User.getEmail();

	$scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();

    var optionsImgPerfil = {
	   maximumImagesCount: 1,
	   width: 200,
	   height: 200,
	   quality: 80
	 };

	 var optionsImgPortada = {
	   maximumImagesCount: 1,
	   width: 550,
	   height: 400,
	   quality: 80
	 };

	 try{

	 var optionsImgPerfilCamara = {
      quality: 80,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
	  correctOrientation:true
    };

    var optionsImgPortadaCamara = {
      quality: 80,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 550,
      targetHeight: 400,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
	  correctOrientation:true
    };

	 } catch(error){
	 	console.log(error);
	 }

	 

    $scope.ElegirFotoPerfil = function(){
    	try{
    		var nombreArchivo = User.getNombre() + "_" + User.getEmail() + "_perfil";

    		fotoElegida("perfil", function (imageBlob){
    			if (imageBlob) {
    				guardarEnFirebase(imageBlob, nombreArchivo, function (respuesta){
						if (respuesta) {
							User.setFoto(respuesta.downloadURL);
							$rootScope.imgUser = User.getFoto();
							var updates = {
								foto: User.getFoto()
							};
							SrvFirebase.RefUsuario(User.getUid()).update(updates);
							$scope.usuario.fotoPerfil = User.getFoto();
						};
					});
    			};
    		})		

    	} catch(error){

    	}   	
    }

    $scope.TomarFotoPerfil = function(){
    	try{
    		var nombreArchivo = User.getNombre() + "_" + User.getEmail() + "_perfil";

    		fotoTomada("perfil", function (imageBlob){
    			if (imageBlob) {
    				guardarEnFirebase(imageBlob, nombreArchivo, function (respuesta){
						if (respuesta) {
							User.setFoto(respuesta.downloadURL);
							$rootScope.imgUser = User.getFoto();
							var updates = {
								foto: User.getFoto()
							};
							SrvFirebase.RefUsuario(User.getUid()).update(updates);
							$scope.usuario.fotoPerfil = User.getFoto();
						};
					});
    			};
    		})		

    	} catch(error){

    	} 	
    }

    $scope.ElegirFotoPortada = function(){
    	var nombreArchivo = User.getNombre() + "_" + User.getEmail() + "_portada";

    		fotoElegida("portada", function (imageBlob){
    			if (imageBlob) {
    				guardarEnFirebase(imageBlob, nombreArchivo, function (respuesta){
						if (respuesta) {
							User.setFotoPortada(respuesta.downloadURL);
							var updates = {
								fotoPortada: User.getFotoPortada()
							};
							SrvFirebase.RefUsuario(User.getUid()).update(updates);
							$scope.usuario.fotoPortada = User.getFotoPortada();
						};
					});
    			};
    		})
    }

    $scope.TomarFotoPortada = function(){
    	var nombreArchivo = User.getNombre() + "_" + User.getEmail() + "_portada";
    		fotoTomada("portada", function (imageBlob){
    			if (imageBlob) {
    				guardarEnFirebase(imageBlob, nombreArchivo, function (respuesta){
						if (respuesta) {
							User.setFotoPortada(respuesta.downloadURL);
							var updates = {
								fotoPortada: User.getFotoPortada()
							};
							SrvFirebase.RefUsuario(User.getUid()).update(updates);
							$scope.usuario.fotoPortada = User.getFotoPortada();
						};
					});
    			};
    		})
    }


    function fotoTomada(tipo, callback){

    	$ionicPlatform.ready(function(){

    		var options = {};

    		if (tipo == "perfil") {
    			options = optionsImgPerfilCamara;
    		} else {
    			options = optionsImgPortadaCamara;
    		}

    		$cordovaCamera.getPicture(options).then(function (imageURI) {

    			var fileName = imageURI.replace(/^.*[\\\/]/, '');
				var path = "";
				

				if ($ionicPlatform.is("android")) {
				  	path = cordova.file.externalCacheDirectory;
				} else {
				    path = cordova.file.tempDirectory;
				}

				$cordovaFile.readAsArrayBuffer(path, fileName)
					.then(function (success) {

					    var imageBlob = new Blob([success], {type: "image/jpeg"});
					    callback(imageBlob);

					}, function (error) {
						alert("Error leer archivo externalCacheDirectory: " + error.message);
					    callback(null);
					});


			}, function(err) {
				alert("error getpicture: " + err.message);
			    //callback(null);
			});

    	})

    }

    function fotoElegida(tipo, callback){

    	$ionicPlatform.ready(function() {
    		var options = {};

    		if (tipo == "perfil") {
    			options = optionsImgPerfil;
    		} else {
    			options = optionsImgPortada;
    		}
		  
	    		$cordovaImagePicker.getPictures(options)
				    .then(function (results) {
				        //alert('Image URI: ' + results[0]);
				         
				        var fileName = results[0].replace(/^.*[\\\/]/, '');
				        var path = "";

				        if ($ionicPlatform.is("android")) {
				        	path = cordova.file.cacheDirectory;
				        } else {
				        	path = cordova.file.tempDirectory;
				        }

				        $cordovaFile.readAsArrayBuffer(path, fileName)
					      .then(function (success) {

					        var imageBlob = new Blob([success], {type: "image/jpeg"});
					        callback(imageBlob);

					      }, function (error) {
					      	alert("Error leer archivo: " + error);
					        callback(null);
					      });

				    }, function(error) {
				      alert("error imagepicker: " + error);
				      callback(null);
				    });

			});

    }


    function guardarEnFirebase(imageBlob, nombreArchivo, callback){

    	var uploadTask = SrvFirebase.RefStorage.child('images/' + nombreArchivo).put(imageBlob);
			//console.log('Uploaded', snapshot.totalBytes, 'bytes.');
		$ionicLoading.show({
			template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2"/></svg></div>'
		});
		uploadTask.on('state_changed', function (snapshot){

		}, function (error){

			$ionicLoading.hide();
			alert("error firebase: " + error);
			callback(null);
		}, function (){

			$ionicLoading.hide();
			var url = uploadTask.snapshot.downloadURL;
			callback(uploadTask.snapshot);
		})		
    }
})