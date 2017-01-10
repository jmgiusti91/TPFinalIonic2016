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
			uid = uid;
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
		getFotoPortada:function(){
			return fotoPortada;
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
		}
	};
})


.service('SrvFirebase', ['$http', function($http){

	this.RefUsuarios = RefUsuarios;
	this.RefDesafios = RefDesafios;
	this.RefUsuario = RefUsuario;
	this.RefDesafio = RefDesafio;

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

}])