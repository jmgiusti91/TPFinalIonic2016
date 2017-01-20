angular.module('app.services', [])

.factory('User', function(){

	var foto = "";
	var fotoPortada = "";
	var email = "";
	var uid = "";
	var creditos = "";
	var nombre = "";
	var soyAdmin = false;

	return {
		login:function(id, mail, cred, photo, photop, nom, admin){
			uid = id;
			email = mail;
			creditos = cred;
			foto = photo;
			nombre = nom;
			fotoPortada = photop;
			soyAdmin = admin;
		},
		getUid:function(){
			return uid;
		},
		getEmail:function(){
			return email;
		},
		getCreditos:function(){
			return creditos;
		},
		getNombre:function(){
			return nombre;
		},
		setCreditos:function(cred){
			creditos = cred;
		},
		getFoto:function(){
			return foto;
		},
		setFoto:function(photo){
			foto = photo;
		},
		getFotoPortada:function(){
			return fotoPortada;
		},
		setFotoPortada:function(photop){
			fotoPortada =photop;
		},
		isAdmin: function(){
			return soyAdmin
		},
		getFullData:function(){
			var jsonUser = {};
			jsonUser.uid = uid;
			jsonUser.email = email;
			jsonUser.creditos = creditos;
			jsonUser.foto = foto;
			jsonUser.fotoPortada = fotoPortada;
			jsonUser.nombre = nombre;
			jsonUser.soyAdmin = soyAdmin;
			return JSON.stringify(jsonUser);
		},
		clean:function(){
			uid = "";
			email = "";
			creditos = "";
			foto = "";
			nombre = "";
			fotoPortada = "";
			soyAdmin = false;
		}
	};
})


.service('SrvFirebase', ['$http', function($http){

	this.RefUsuarios = RefUsuarios;
	this.RefDesafios = RefDesafios;
	this.RefUsuario = RefUsuario;
	this.RefDesafio = RefDesafio;
	this.RefStorage = firebase.storage().ref();
	this.GastarCreditos = GastarCreditos;
	this.GanarCreditos = GanarCreditos;
	this.EnviarNotificacion = EnviarNotificacion;

	function ObtenerReferencia(coleccion){
		return firebase.database().ref(coleccion);
	}

	function RefUsuarios(){
		return ObtenerReferencia('usuarios/');
	}

	function RefDesafios(){
		return ObtenerReferencia('desafios/');
	}

	function RefUsuario(uid){
		return ObtenerReferencia('usuarios/' + uid);
	}

	function RefDesafio(did){
		return ObtenerReferencia('desafios/' + did);
	}

	function GastarCreditos(cred, uid){
		var usuario = {};
		this.RefUsuario(uid).once('value').then(function (snapshot){
			usuario = snapshot.val();
			usuario.creditos = parseInt(usuario.creditos) - parseInt(cred);
			snapshot.ref.update({
				creditos: usuario.creditos
			});
		})
	}

	function GanarCreditos(cred, uid){
		var usuario = {};
		this.RefUsuario(uid).once('value').then(function (snapshot){
			usuario = snapshot.val();
			console.log(usuario);
			usuario.creditos = parseInt(usuario.creditos) + parseInt(cred);
			snapshot.ref.update({
				creditos: usuario.creditos
			});
		})
	}

	function EnviarNotificacion(){ //en ionic push param token.
		//var jwt = 'AIzaSyBFmmOVoNG7jeMdaxG0_8UGz1UEvhpAOBg';
		/*var req = {
		  method: 'POST',
		  url: 'https://api.ionic.io/push/notifications',
		  headers: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYjQ1ZjdlYy01NjgxLTRjY2UtOWU2MC0xNjFmMDJiN2NhZjUifQ.NR6A6lhpv6poyn4pgeAJveU7GogtoLUGTUn6FFdTmeQ'
		  },
		  data: {
		  	"tokens": token,
		  	"profile": "srvnotificacion",
		    "notification": {
		      "title": "Desafios",
		      "message": "Los desafios han sido actualizados. Ven a ver cuanto has ganado.",
		      "android": {
		        "title": "Desafios",
		        "message": "Los desafios han sido actualizados. Ven a ver cuanto has ganado."
		      },
		      "ios": {
		        "title": "Desafios",
		        "message": "Los desafios han sido actualizados. Ven a ver cuanto has ganado."
		      }
		    }
		  }
		};

		$http(req).success(function(resp){
		  // Handle success
		  console.log("Ionic Push: Push success: ", resp);
		}).error(function(error){
		  // Handle error 
		  console.log("Ionic Push: Push error: ", error);
		});*/


		/*var http = new XMLHttpRequest();
    	var url =  'https://fcm.googleapis.com/fcm/send';
		
		var params = JSON.stringify({
				    "to":"/topics/all", //Topic or single device
				"notification":{
				    "title":"Desafios",  //Any value
				    "body":"Los desafios han sido actualizados. Ven a ver cuanto has ganado.",  //Any value
				    "sound":"default", //If you want notification sound
				    "click_action":"FCM_PLUGIN_ACTIVITY",  //Must be present for Android
				    "icon":"fcm_push_icon"  //White icon Android resource
				  },
				    "priority":"high" //If not set, notification won't be delivered on completely closed iOS app
			});

		http.open("POST", url, true);
	    http.setRequestHeader("Content-type", "application/json");
	    http.setRequestHeader('Authorization', 'key=AIzaSyBFmmOVoNG7jeMdaxG0_8UGz1UEvhpAOBg');

	    http.onreadystatechange = function() {
	        if(http.readyState == 4 && http.status == 200) {
	            console.log(http.responseText);
	        }
	    }
	    http.send(params);*/
	}

}])