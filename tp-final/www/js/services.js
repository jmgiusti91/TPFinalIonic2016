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
	this.RefBatallas = RefBatallas;
	this.RefUsuario = RefUsuario;
	this.RefDesafio = RefDesafio;
	this.RefBatalla = RefBatalla;
	this.RefStorage = firebase.storage().ref();
	this.GastarCreditos = GastarCreditos;
	this.GanarCreditos = GanarCreditos;
	this.EnviarNotificacion = EnviarNotificacion;
	this.EnviarNotificacionBatalla = EnviarNotificacionBatalla;
	this.NotificacionRechazada = NotificacionRechazada;

	function ObtenerReferencia(coleccion){
		return firebase.database().ref(coleccion);
	}

	function RefUsuarios(){
		return ObtenerReferencia('usuarios/');
	}

	function RefDesafios(){
		return ObtenerReferencia('desafios/');
	}

	function RefBatallas(){
		return ObtenerReferencia('batallas/');
	}

	function RefUsuario(uid){
		return ObtenerReferencia('usuarios/' + uid);
	}

	function RefDesafio(did){
		return ObtenerReferencia('desafios/' + did);
	}

	function RefBatalla(bid){
		return ObtenerReferencia('batallas/' + bid);
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

	function EnviarNotificacion(token){ //en ionic push param token.
		//var jwt = 'AIzaSyBFmmOVoNG7jeMdaxG0_8UGz1UEvhpAOBg';
		var req = {
		  method: 'POST',
		  url: 'https://api.ionic.io/push/notifications',
		  headers: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZGQzYTNiZi1hODI2LTRjMDMtOWFlMC03NGJjMmNjYzNjMmMifQ._jbLGKWgwvHBFcfgNUfCAu-qMw_2CnjQ5HhSKs9ozxw'
		  },
		  data: {
		  	"tokens": token,
		  	"profile": "desafios",
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
		});
	}

	function EnviarNotificacionBatalla(token, nomDesafiante, cred, bid, time){ //en ionic push param token.
		//var jwt = 'AIzaSyBFmmOVoNG7jeMdaxG0_8UGz1UEvhpAOBg';
		console.log("bid en EnviarNotificacionBatalla: ", bid);
		console.log(time);
		var req = {
		  method: 'POST',
		  url: 'https://api.ionic.io/push/notifications',
		  headers: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYzNlOWFhMC0xYTZmLTQ0YjUtOTZmYS0wOWNlNDkzOTU3OTAifQ.aQStnngDHAAzupti0bWwDRaeS9EEUVDIchEgAPgb0bE'
		  },
		  data: {
		  	"tokens": token,
		  	"profile": "batallanaval",
		    "notification": {
		      "title": "Batalla",
		      "message": "" + nomDesafiante + " te ha desafiado a una batalla naval por " + cred + " creditos. Aceptas?",
		      "android": {
		        "title": "Batalla",
		        "message": "" + nomDesafiante + " te ha desafiado a una batalla naval por " + cred + " creditos. Aceptas?",
		        "payload":{
		        	"bid": bid
		        },
		        "data":{
		        	"notId": "" + time
		        }
		      },
		      "ios": {
		        "title": "Batalla",
		        "message": "" + nomDesafiante + " te ha desafiado a una batalla naval por " + cred + " creditos. Aceptas?",
		       	"payload":{
		       		"bid": bid
		       	}	
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
		});
	}

	function NotificacionRechazada(token){
		var req = {
		  method: 'POST',
		  url: 'https://api.ionic.io/push/notifications',
		  headers: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYzNlOWFhMC0xYTZmLTQ0YjUtOTZmYS0wOWNlNDkzOTU3OTAifQ.aQStnngDHAAzupti0bWwDRaeS9EEUVDIchEgAPgb0bE'
		  },
		  data: {
		  	"tokens": token,
		  	"profile": "batallanaval",
		    "notification": {
		      "title": "Rechazada",
		      "message": "Tu solicitud de batalla fue rechazada.",
		      "android": {
		        "title": "Rechazada",
		        "message": "Tu solicitud de batalla fue rechazada."
		      },
		      "ios": {
		        "title": "Rechazada",
		        "message": "Tu solicitud de batalla fue rechazada."	
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
		});
	}

}])