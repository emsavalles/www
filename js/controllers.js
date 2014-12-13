angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('EstatalesCtrl', function($scope) {
  $scope.estatales = arregloEstatales;
})

.controller('NacionalesCtrl', function($scope) {
  $scope.nacionales = arregloNacionales;
})

.controller('NacionalCtrl', function($scope, $stateParams,$http) {
 //   $scope.id=$stateParams.nacionalId;
/* 
 $http.get('json/CNPP.json').
    success(function(data, status, headers, config) {
      $scope.posts = [];
      
        angular.forEach(data, function(value, key) {
        $scope.posts.push(value);
        });
        
        $scope.contenido=$scope.posts[2].split(/\n/g);

    }).
    error(function(data, status, headers, config) {
      // log error
    });
*/    
})//NacionalCtrl

.controller('NotasCtrl', function($scope) {
  $scope.notas = arregloNotas;
})

.controller('NotaCtrl', function($scope,$stateParams) {
    /*
var db = window.openDatabase("Database", "1.0", "ReformaP", 200000);
        db.transaction(function(tx){
//            tx.executeSql('delete from where id=?',[$stateParams.notaId]);
            removeFunction(arregloNotas,"id",$stateParams.notaId);
             $state.go('app.notas');
        },
        function(e){
            alert(e);
            }
        );
        */
  
})

;
function removeFunction (myObjects,prop,valu)
        {
             return myObjects.filter(function (val) {
              return val[prop] !== valu;
          });

        }