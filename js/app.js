// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

        arregloNacionales=[
            {'id':1,'title':'Código Nacional de Procedimientos Penales','archivo':"CNPP"}
            ];
        arregloEstatales=[
            {'id':1,'title':'Ley de Mecanismos Alternativos de Solución de Controversias en Materia Penal para el Estado','archivo':"Decreto562"},
            {'id':2,'title':'Se Declara la entrada en vigor del Código Nacional de Procedimientos Penales en el Estado de San Luis Potosí','archivo':"Decreto752"},
            {'id':3,'title':'Ley de la Defensoría Pública del Estado de San Luis Potosí','archivo':"Decreto767"},
            {'id':4,'title':'Ley para la Protección de Personas que Intervienen en el Proceso Penal en el Estado de San Luis Potosí','archivo':"Decreto768"},
            {'id':5,'title':'Ley de Vícimas para el Estado de San Luis Potosí','archivo':"Decreto776"},
            {'id':6,'title':'Reformas, Adiciones y Derogaciones de y a la Ley de Justicia para Menores del Estado de San Luis Potosí','archivo':"Decreto777"},
            {'id':7,'title':'Se Reforma la Ley de Extinción de Dominio del Estado de San Luis Potosí','archivo':"Decreto787"},
            {'id':8,'title':'Se Reforma y Adiciona la Ley del Sistema de Seguridad Pública del Estado de San Luis Potosí','archivo':"Decreto788"},
            {'id':9,'title':'Ley para la Administración de Bienes Asegurados, Decomisados, Embargados, o Abandonados para el Estado de San Luis Potosí','archivo':"Decreto791"},
            {'id':10,'title':'Código Penal del Estado','archivo':"Decreto793"},
            {'id':11,'title':'Ley de Ejecución de Medidas Cautelares; Penas, y Medidas de Seguridad para el Estado de San Luis Potosí','archivo':"Decreto794"},
            {'id':12,'title':'Ley de Justicia Indígena y Comunitaria para el Estado de San Luis Potosí','archivo':"Decreto795"},
            {'id':13,'title':'Se Reforma el artículo 190; y Adiciona párrafo último al artículo 52 de y a la Ley Orgánica del Poder Judicial del Estado de San Luis Potosí','archivo':"Decreto796"},
        ];        

  });
})



.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.estatales', {
      url: "/estatales",
      views: {
        'menuContent' :{
          templateUrl: "templates/estatales.html",
          controller: 'EstatalesCtrl'
        }
      }
    })

    .state('app.nacionales', {
      url: "/nacionales",
      views: {
        'menuContent' :{
          templateUrl: "templates/nacionales.html",
          controller: 'NacionalesCtrl'
        }
      }
    })   
    
    .state('app.notas', {
      url: "/notas",
      views: {
        'menuContent' :{
          templateUrl: "templates/notas.html",
          controller: 'NotasCtrl'
        }
      }
    })      
     
    .state('app.intro', {
      url: "/intro",
      views: {
        'menuContent' :{
          templateUrl: "templates/intro.html"
        }
      }
    }) 
    
    .state('app.nota', {
      url: "/nota/:notaId",
      views: {
        'menuContent' :{
          controller: 'NotaCtrl'
        }
      }
    }) 
    
    ;//
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/intro');
});